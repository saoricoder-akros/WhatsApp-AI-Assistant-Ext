import zipfile
import xml.etree.ElementTree as ET
import json
import re

excel_path = r"C:\Users\BettyRodriguez\Documents\AUTOMATIZACIONES WHATSAPP\WhatsApp_All_Chats.xlsx"

# 1. Load shared strings
with zipfile.ZipFile(excel_path, 'r') as z:
    shared_strings = []
    if 'xl/sharedStrings.xml' in z.namelist():
        with z.open('xl/sharedStrings.xml') as f:
            tree = ET.parse(f)
            root = tree.getroot()
            # NS handling
            ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
            for si in root.findall('ns:si', ns):
                # t can be direct child or inside r/t
                text = ""
                for t in si.findall('.//ns:t', ns):
                    if t.text:
                        text += t.text
                shared_strings.append(text)
    print(f"Total shared strings: {len(shared_strings)}")

    # 2. Load worksheet sheet1.xml
    rows_data = []
    with z.open('xl/worksheets/sheet1.xml') as f:
        tree = ET.parse(f)
        root = tree.getroot()
        ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
        sheetData = root.find('ns:sheetData', ns)
        for row in sheetData.findall('ns:row', ns):
            row_vals = {}
            for c in row.findall('ns:c', ns):
                cell_ref = c.get('r') # e.g. A1, B1
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

print(f"Total rows extracted: {len(rows_data)}")
if rows_data:
    print("Header row (Row 1):", rows_data[0])
    if len(rows_data) > 1:
        print("Sample row 2:", rows_data[1])
