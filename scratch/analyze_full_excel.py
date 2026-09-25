import zipfile
import xml.etree.ElementTree as ET
import json
import re
import unicodedata

def normalize_str(s):
    if not s:
        return ""
    # Normalize unicode to NFD and strip accents
    s_norm = unicodedata.normalize('NFD', s)
    s_clean = ''.join(c for c in s_norm if unicodedata.category(c) != 'Mn')
    return s_clean.upper().strip()

def build_regex_pattern(norm_str):
    # Turn normalized catalog name (e.g., "CEDENO") into a regex that matches "CEDENO", "CEDEO", "CEDE O", etc.
    # Replace vowels and N with character class allowing replacement char \ufffd or ?
    pattern = ""
    for char in norm_str:
        if char in "AEIOUN":
            pattern += f"[{char}\\ufffd\\?]"
        elif char == ' ':
            pattern += r"\s+"
        else:
            pattern += re.escape(char)
    return re.compile(pattern, re.IGNORECASE)

# 1. Load Catalogs from analytics.js
analytics_js_path = r"c:\Proyectos\WhatsApp AI Assistant Ext\analytics.js"
with open(analytics_js_path, 'r', encoding='utf-8') as f:
    js_content = f.read()

agencies_match = re.search(r'this\.agenciesCatalog\s*=\s*\([^\[]*(\[\s*\{.*?\}\s*\])\)', js_content, re.DOTALL)
agencies_catalog = json.loads(agencies_match.group(1))

tech_match = re.search(r'this\.techniciansCatalog\s*=\s*\([^\[]*(\[\s*".*?"\s*\])\)', js_content, re.DOTALL)
tech_catalog = json.loads(tech_match.group(1))

# Strictly filter out Cristian Castro and SharePoint noise
tech_catalog = [t for t in tech_catalog if normalize_str(t) != "CRISTIAN CASTRO"]
agencies_catalog = [
    a for a in agencies_catalog 
    if "personal/cristian_castro_akroscorp_com/Lists/AGENCIAS" not in a.get("agencia", "")
]

# Build precompiled regexes
sorted_agencies = sorted(agencies_catalog, key=lambda a: len(a['agencia']), reverse=True)
agency_items = []
for a in sorted_agencies:
    norm_name = normalize_str(a['agencia'])
    agency_items.append({
        'raw': a,
        'norm_name': norm_name,
        'pattern': build_regex_pattern(norm_name),
        'length': len(norm_name)
    })

sorted_techs = sorted(tech_catalog, key=lambda x: len(x), reverse=True)
tech_items = []
for t in sorted_techs:
    norm_t = normalize_str(t)
    tech_items.append({
        'name': t,
        'norm_name': norm_t,
        'pattern': build_regex_pattern(norm_t)
    })

# 2. Parse Excel
excel_path = r"C:\Users\BettyRodriguez\Documents\AUTOMATIZACIONES WHATSAPP\WhatsApp_All_Chats.xlsx"
rows_data = []

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

    with z.open('xl/worksheets/sheet1.xml') as f:
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
                row_vals[col_letter] = val
            rows_data.append(row_vals)

data_rows = rows_data[1:]

assignments = []
noise_string = "personal/cristian_castro_akroscorp_com/Lists/AGENCIAS"

for idx, r in enumerate(data_rows):
    date_val = r.get('A', '')
    time_val = r.get('C', '')
    user_name = r.get('E', '')
    body = r.get('F', '')

    if not body:
        continue

    # Noise filter rule
    if noise_string in body or "cristian castro" in body.lower():
        continue

    is_akros_sender = "akros" in user_name.lower()

    # Match Technician
    found_tech = None
    for t_item in tech_items:
        if t_item['pattern'].search(body) or t_item['norm_name'] in normalize_str(body):
            found_tech = t_item['name']
            break

    # Match Agency
    found_agency = None
    for a_item in agency_items:
        if a_item['pattern'].search(body) or a_item['norm_name'] in normalize_str(body):
            found_agency = a_item['raw']
            break

    if found_tech and found_agency:
        tickets = re.findall(r'(?:AKR-RQ-\d+|TK-\d+|TKT-\d+|SOP-\d+|\b\d{5,7}\b)', body, re.IGNORECASE)
        ticket_str = tickets[0] if tickets else "S/N"

        assignments.append({
            "id": f"EXCEL-{idx+1}",
            "date": date_val,
            "time": time_val,
            "sender": user_name,
            "is_akros_confirmation": is_akros_sender,
            "technician": found_tech,
            "agency": found_agency['agencia'],
            "empresa": found_agency['empresa'],
            "region": found_agency['region'],
            "provincia": found_agency['provincia'],
            "ticket": ticket_str,
            "message_snippet": body[:120] + ("..." if len(body) > 120 else "")
        })

matrix = {}
tech_counts = {}
agency_counts = {}

for a in assignments:
    tech = a['technician']
    agency = a['agency']
    pair_key = f"{tech} | {agency}"
    
    matrix[pair_key] = matrix.get(pair_key, 0) + 1
    tech_counts[tech] = tech_counts.get(tech, 0) + 1
    agency_counts[agency] = agency_counts.get(agency, 0) + 1

structured_matrix = []
bottleneck_alerts = 0
critical_alerts = 0

for pair_key, count in matrix.items():
    tech, agency = pair_key.split(" | ")
    ag_detail = next((item for item in sorted_agencies if item['agencia'] == agency), {})
    
    if count >= 6:
        status = "Critico (Proceso Repetido)"
        critical_alerts += 1
        bottleneck_alerts += 1
    elif count >= 3:
        status = "Alerta Operativa"
        bottleneck_alerts += 1
    else:
        status = "Normal"

    structured_matrix.append({
        "technician": tech,
        "agency": agency,
        "empresa": ag_detail.get("empresa", "Banco Pichincha"),
        "region": ag_detail.get("region", ""),
        "provincia": ag_detail.get("provincia", ""),
        "count": count,
        "alert_level": status
    })

structured_matrix.sort(key=lambda x: x['count'], reverse=True)

final_output = {
    "summary": {
        "total_messages_analyzed": len(data_rows),
        "total_valid_assignments": len(assignments),
        "total_unique_pairs": len(structured_matrix),
        "total_active_technicians": len(tech_counts),
        "total_impacted_agencies": len(agency_counts),
        "bottleneck_alerts_count": bottleneck_alerts,
        "critical_alerts_count": critical_alerts
    },
    "top_technicians": sorted([{"technician": k, "assignments": v} for k, v in tech_counts.items()], key=lambda x: x['assignments'], reverse=True),
    "top_agencies": sorted([{"agency": k, "interventions": v} for k, v in agency_counts.items()], key=lambda x: x['interventions'], reverse=True),
    "recurrence_matrix": structured_matrix,
    "recent_assignments": assignments
}

out_file = r"c:\Proyectos\WhatsApp AI Assistant Ext\precalculated_analytics.json"
with open(out_file, 'w', encoding='utf-8') as f:
    json.dump(final_output, f, ensure_ascii=False, indent=2)

print(f"Updated extraction! Valid assignments extracted: {len(assignments)}")
print(f"Summary: {json.dumps(final_output['summary'], indent=2)}")
