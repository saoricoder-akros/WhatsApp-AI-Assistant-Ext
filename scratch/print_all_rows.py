import zipfile
import xml.etree.ElementTree as ET

excel_path = r"C:\Users\BettyRodriguez\Documents\AUTOMATIZACIONES WHATSAPP\tecnico_lista_24sep.xlsx"

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
                col_letter = re.sub(r'[0-9]', '', cell_ref) if 're' in locals() else ''.join([ch for ch in cell_ref if not ch.isdigit()])
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

for idx, r in enumerate(rows_data[1:]):
    nombre = r.get('A', '').strip()
    proveedor = r.get('E', '').strip()
    print(f"{idx+1:02d} | Nombre: {nombre}  --->  Proveedor: {proveedor}")
