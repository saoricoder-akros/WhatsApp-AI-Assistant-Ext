import json
import re

json_path = r"c:\Proyectos\WhatsApp AI Assistant Ext\precalculated_analytics.json"
analytics_js_path = r"c:\Proyectos\WhatsApp AI Assistant Ext\analytics.js"

with open(json_path, 'r', encoding='utf-8') as f:
    analytics_data = json.load(f)

recent_assignments = analytics_data.get('recent_assignments', [])

# Map to JS object structure
formatted_historical = []
for item in recent_assignments:
    formatted_historical.append({
        "id": f"HIST-{item['id']}",
        "ticketCode": item.get('ticket') or "S/N",
        "agency": item['agency'],
        "chatMention": item['agency'],
        "region": item.get('region') or "REGION NORTE",
        "provincia": item.get('provincia') or "",
        "technician": item['technician'],
        "isOutgoing": True,
        "isConfirmedByOutgoing": True,
        "weight": 10,
        "sender": item.get('sender') or "Akros",
        "fullText": item.get('message_snippet') or f"Confirmación oficial de soporte para {item['technician']} en {item['agency']}",
        "timestamp": f"{item['date']}T{item['time']}" if item.get('date') and item.get('time') else "2026-06-01T00:00:00"
    })

historical_js_code = json.dumps(formatted_historical, ensure_ascii=False, indent=6)

print(f"Generated JS array for {len(formatted_historical)} historical items.")
