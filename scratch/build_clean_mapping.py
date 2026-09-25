import zipfile
import xml.etree.ElementTree as ET
import json
import re
import unicodedata

def normalize_str(s):
    if not s:
        return ""
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
        prov_clean = proveedor.replace('MEGACROMTICO', 'MEGACROMÁTICO').replace('TECNOLGICAS', 'TECNOLÓGICAS')
        excel_records.append({
            "raw_nombre": nombre,
            "norm_nombre": normalize_str(nombre),
            "proveedor": prov_clean
        })

tech_catalog = [
  "Alex Macas", "Andrés Cedeño", "Andrés Rodriguez", "Angel Villa", "Angelo Fuentes",
  "Antonio Jurado", "Axel Tamayo", "Byron Castro", "Carlos Calderon", "Christian Garcia",
  "Cristian Artos", "Cristian Quillupangui", "Cristian Tene", "Cristofer Tene", "Dennis Almeida",
  "Diego Lopez", "Donal Campaña", "Dorian Herrera", "Eddy Borrero", "Erick Zuleta",
  "Erika Rendón", "Fabian Cabrera", "Fabian Fajardo", "Fabian Gonzalez", "Fernando Caicedo",
  "Fernando Rodriguez", "Francis Romero", "Franklin Tamayo", "Gonzalo Llugcha", "Guido Molina",
  "Jairo Lomas", "Jaleni Ocampo", "Jaqueline Jacome", "Jefferson Minalla", "Jeremy Navia",
  "Jhon Valencia", "Jhonny Carpio", "Jonathan Lema", "Jordy Rea", "Jorge Chilan",
  "Jorge Menendez", "Jose Padilla", "José Alejandro Osorio", "Juan Chabla", "Juan Cordova",
  "Juan Fernando Cordova", "Juan Pablo Quichimbo", "Katherine Caza", "Kevin Arias", "Lenin Villarreal",
  "Lucia Paladines", "Luis Cuenca", "Luis Garcia", "Marco Vargas", "Marlene Morocho",
  "Marlon Caiza", "Michael Valencia", "Naomi Piguave", "Ramiro Astudillo", "Roberto Sevilla"
]

clean_mapping = {}

for tech in tech_catalog:
    norm_tech = normalize_str(tech)
    tech_tokens = set(norm_tech.split())
    
    best_match = None
    best_score = 0
    
    for rec in excel_records:
        rec_tokens = set(rec['norm_nombre'].split())
        common = tech_tokens.intersection(rec_tokens)
        score = len(common)
        if score > best_score and score >= 2: # At least 2 token matches
            best_score = score
            best_match = rec['proveedor']
        elif score == 1 and best_score < 1:
            # Check if token is unique surname/name like VILLAREAL, FAJARDO, SEVILLA, CHILAN, ASTUDILLO, JACOME, MOLINA, ALMEIDA, CALDERON
            single_token = list(common)[0]
            if len(single_token) >= 5:
                best_score = 1
                best_match = rec['proveedor']
                
    if not best_match:
        # Check special case spellings (e.g. VILLARREAL vs VILLAREAL)
        if "VILLARREAL" in norm_tech or "VILLAREAL" in norm_tech:
            best_match = "RUPERTO LENIN VILLAREAL ESCOLA"
        elif "RODRIGUEZ" in norm_tech:
            best_match = "ANDRES RAUL RODRIGUEZ GOMEZ"
        elif "CORDOVA" in norm_tech:
            best_match = "AKROS SOLUCIONES TECNOLÓGICAS"
        elif "GARCIA" in norm_tech or "GARCÍA" in norm_tech:
            best_match = "JAQUELINE CONSUELO JACOME ARMAS"

    clean_mapping[tech] = best_match or "No está en lista"

print(json.dumps(clean_mapping, indent=2, ensure_ascii=False))
