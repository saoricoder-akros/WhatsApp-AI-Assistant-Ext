import zipfile
import xml.etree.ElementTree as ET
import json
import re
import unicodedata

def normalize_str(s):
    if not s:
        return ""
    # Strip replacement char \ufffd
    s = s.replace('\ufffd', '').replace('', '')
    s_norm = unicodedata.normalize('NFD', s)
    s_clean = ''.join(c for c in s_norm if unicodedata.category(c) != 'Mn')
    return s_clean.upper().strip()

excel_path = r"C:\Users\BettyRodriguez\Documents\AUTOMATIZACIONES WHATSAPP\tecnico_lista_24sep.xlsx"

excel_records = []
with zipfile.ZipFile(excel_path, 'r') as z:
    shared_strings = []
    if 'xl/sharedStrings.xml' in z.namelist():
        with z.open('xl/sharedStrings.xml') as f:
            tree = ET.parse(f)
            root = tree.getroot()
            ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
            for si in root.findall('ns:si', ns):
                text = "".join(t.text for t in si.findall('.//ns:t', ns) if t.text)
                shared_strings.append(text)

    rows_data = []
    sheet_name = [s for s in z.namelist() if s.startswith('xl/worksheets/sheet')][0]
    with z.open(sheet_name) as f:
        tree = ET.parse(f)
        root = tree.getroot()
        ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
        sheetData = root.find('ns:sheetData', ns)
        for row in sheetData.findall('ns:row', ns):
            row_vals = {}
            for c in row.findall('ns:c', ns):
                cell_ref = c.get('r')
                col_letter = re.sub(r'[0-9]', '', cell_ref)
                t_attr = c.get('t')
                v_elem = c.find('ns:v', ns)
                val = ""
                if v_elem is not None and v_elem.text:
                    val = v_elem.text
                    if t_attr == 's' and val.isdigit():
                        idx = int(val)
                        if idx < len(shared_strings):
                            val = shared_strings[idx]
                elif c.find('ns:is/ns:t', ns) is not None:
                    val = c.find('ns:is/ns:t', ns).text or ""
                row_vals[col_letter] = val
            rows_data.append(row_vals)

for r in rows_data[1:]:
    nombre = r.get('A', '').strip()
    proveedor = r.get('E', '').strip()
    if nombre:
        excel_records.append({
            "nombre": nombre,
            "norm_nombre": normalize_str(nombre),
            "proveedor": proveedor,
            "norm_proveedor": normalize_str(proveedor)
        })

# Load technicians list from analytics.js
analytics_js_path = r"c:\Proyectos\WhatsApp AI Assistant Ext\analytics.js"
with open(analytics_js_path, 'r', encoding='utf-8') as f:
    js_content = f.read()

tech_match = re.search(r'this\.techniciansCatalog\s*=\s*\([^\[]*(\[\s*\{.*?\}\s*\])\)', js_content, re.DOTALL)
if tech_match:
    catalog = json.loads(tech_match.group(1))
else:
    raise ValueError("Could not parse techniciansCatalog")

mapping_result = []

for item in catalog:
    tech_name = item['name']
    norm_tech = normalize_str(tech_name)
    
    # Try finding best match in Excel records
    matched_provider = None
    
    # 1. Exact or substring match on normalized names
    for rec in excel_records:
        rec_norm = rec['norm_nombre']
        # Check if words of tech_name are contained in rec_norm
        tech_words = [w for w in norm_tech.split() if len(w) > 2]
        rec_words = [w for w in rec_norm.split() if len(w) > 2]
        
        # If key name words match (e.g. "LENIN" and "VILLARREAL")
        matches_count = sum(1 for w in tech_words if w in rec_words or any(w in rw for rw in rec_words))
        if matches_count >= len(tech_words):
            raw_prov = rec['proveedor']
            # Clean replacement chars in provider name
            raw_prov = raw_prov.replace('MEGACROMTICO', 'MEGACROMÁTICO').replace('SOLUCIONES TECNOLGICAS', 'SOLUCIONES TECNOLÓGICAS')
            matched_provider = raw_prov
            break

    if not matched_provider:
        # Check partial match
        for rec in excel_records:
            rec_norm = rec['norm_nombre']
            first_last = norm_tech.split()
            if len(first_last) >= 2:
                if first_last[0] in rec_norm and first_last[-1] in rec_norm:
                    raw_prov = rec['proveedor'].replace('MEGACROMTICO', 'MEGACROMÁTICO').replace('SOLUCIONES TECNOLGICAS', 'SOLUCIONES TECNOLÓGICAS')
                    matched_provider = raw_prov
                    break

    if not matched_provider:
        matched_provider = "No está en lista"

    mapping_result.append({
        "technician": tech_name,
        "exact_excel_provider": matched_provider
    })

print(f"Mapped {len(mapping_result)} technicians from Excel file.")
print(json.dumps(mapping_result, indent=2, ensure_ascii=False))
