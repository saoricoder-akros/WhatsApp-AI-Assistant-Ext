import json

json_path = r"c:\Proyectos\WhatsApp AI Assistant Ext\precalculated_analytics.json"
analytics_js_path = r"c:\Proyectos\WhatsApp AI Assistant Ext\analytics.js"

with open(json_path, 'r', encoding='utf-8') as f:
    analytics_data = json.load(f)

recent_assignments = analytics_data.get('recent_assignments', [])

tech_provider_map = {
  "Alex Macas": "No está en lista",
  "Andrés Cedeño": "No está en lista",
  "Andrés Rodriguez": "ANDRES RAUL RODRIGUEZ GOMEZ",
  "Angel Villa": "No está en lista",
  "Angelo Fuentes": "MEGACROMÁTICO",
  "Antonio Jurado": "No está en lista",
  "Axel Tamayo": "No está en lista",
  "Byron Castro": "No está en lista",
  "Carlos Calderon": "CARLOS RODOLFO CALDERON RUIZ",
  "Christian Garcia": "No está en lista",
  "Cristian Artos": "RUPERTO LENIN VILLAREAL ESCOLA",
  "Cristian Quillupangui": "MEGACROMÁTICO",
  "Cristian Tene": "No está en lista",
  "Cristofer Tene": "MEGACROMÁTICO",
  "Dennis Almeida": "DENNIS ALEXIS ALMEIDA ALVAREZ",
  "Diego Lopez": "AKROS SOLUCIONES TECNOLÓGICAS",
  "Donal Campaña": "No está en lista",
  "Dorian Herrera": "No está en lista",
  "Eddy Borrero": "MEGACROMÁTICO",
  "Erick Zuleta": "No está en lista",
  "Erika Rendón": "No está en lista",
  "Fabian Cabrera": "No está en lista",
  "Fabian Fajardo": "JOSE FABIAN FAJARDO MAXI",
  "Fabian Gonzalez": "No está en lista",
  "Fernando Caicedo": "No está en lista",
  "Fernando Rodriguez": "No está en lista",
  "Francis Romero": "VICTOR FRANCIS ROMERO CAMPOVERDE",
  "Franklin Tamayo": "No está en lista",
  "Gonzalo Llugcha": "No está en lista",
  "Guido Molina": "GUIDO WALDEMIRO MOLINA TORRES",
  "Jairo Lomas": "No está en lista",
  "Jaleni Ocampo": "No está en lista",
  "Jaqueline Jacome": "JAQUELINE CONSUELO JACOME ARMAS",
  "Jefferson Minalla": "No está en lista",
  "Jeremy Navia": "No está en lista",
  "Jhon Valencia": "MEGACROMÁTICO",
  "Jhonny Carpio": "No está en lista",
  "Jonathan Lema": "MEGACROMÁTICO",
  "Jordy Rea": "No está en lista",
  "Jorge Chilan": "JORGE WELINTONE CHILAN QUIJIJE",
  "Jorge Menendez": "No está en lista",
  "Jose Padilla": "MEGACROMÁTICO",
  "José Alejandro Osorio": "No está en lista",
  "Juan Chabla": "No está en lista",
  "Juan Cordova": "AKROS SOLUCIONES TECNOLÓGICAS",
  "Juan Fernando Cordova": "AKROS SOLUCIONES TECNOLÓGICAS",
  "Juan Pablo Quichimbo": "MEGACROMÁTICO",
  "Katherine Caza": "No está en lista",
  "Kevin Arias": "No está en lista",
  "Lenin Villarreal": "RUPERTO LENIN VILLAREAL ESCOLA",
  "Lucia Paladines": "No está en lista",
  "Luis Cuenca": "No está en lista",
  "Luis Garcia": "JAQUELINE CONSUELO JACOME ARMAS",
  "Marco Vargas": "MEGACROMÁTICO",
  "Marlene Morocho": "No está en lista",
  "Marlon Caiza": "No está en lista",
  "Michael Valencia": "MEGACROMÁTICO",
  "Naomi Piguave": "No está en lista",
  "Ramiro Astudillo": "RAMIRO ANDRES ASTUDILLO BASTIDAS",
  "Roberto Sevilla": "ROBERTO FERNANDO SEVILLA ABARCA"
}

formatted_historical = []
for item in recent_assignments:
    tech_name = item['technician']
    provider = tech_provider_map.get(tech_name, "No está en lista")
    formatted_historical.append({
        "id": f"HIST-{item['id']}",
        "ticketCode": item.get('ticket') or "S/N",
        "agency": item['agency'],
        "chatMention": item['agency'],
        "region": item.get('region') or "REGION NORTE",
        "provincia": item.get('provincia') or "",
        "technician": tech_name,
        "technicianProvider": provider,
        "isOutgoing": True,
        "isConfirmedByOutgoing": True,
        "weight": 10,
        "sender": item.get('sender') or "Akros 593993007577",
        "fullText": item.get('message_snippet') or f"Confirmación oficial: {tech_name} ({provider}) en {item['agency']}",
        "timestamp": f"{item['date']}T{item['time']}" if item.get('date') and item.get('time') else "2026-06-01T00:00:00"
    })

historical_json_str = json.dumps(formatted_historical, ensure_ascii=False, indent=6)

tech_catalog_list = []
for name, prov in tech_provider_map.items():
    tech_catalog_list.append({"name": name, "proveedor": prov})

tech_catalog_js = json.dumps(tech_catalog_list, ensure_ascii=False, indent=6)

js_content = f"""/**
 * Visor Analítico Interno - WhatsApp AI Assistant Extension (Manifest V3)
 * Enfoque Obligatorio en "Soporte en Sitio Akros", Extracción de Confirmaciones Verdes,
 * Integración de Analítica Histórica Precalculada (Junio-Septiembre 2026)
 * y Poblamiento Dinámico del Filtro de Proveedores desde tecnico_lista_24sep.xlsx.
 */

class WhatsAppAnalyticsEngine {{
  constructor(options = {{}}) {{
    // 1. Catálogo Completo de 235 Agencias (agencias1_estructurado.csv)
    this.agenciesCatalog = (options.agenciesCatalog || [
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "24 DE MAYO", "tipo": "SOPORTE COMERCIAL", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "6 DE DICIEMBRE", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "9 DE OCTUBRE", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "GUAYAS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "AEROPUERTO GUAYAQUIL", "tipo": "CENTRO DE NEGOCIOS", "region": "REGION COSTA", "provincia": "GUAYAS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "ALAMEDA", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "ALAUSI", "tipo": "AGENCIA", "region": "REGION CENTRO", "provincia": "CHIMBORAZO" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "ALBÁN BORJA", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "GUAYAS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "AMAZONAS", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "AMBATO", "tipo": "AGENCIA", "region": "REGION CENTRO", "provincia": "TUNGURAHUA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "AMERICA", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "ATACAMES", "tipo": "AGENCIA", "region": "REGION CENTRO", "provincia": "ESMERALDAS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "ATAHUALPA", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "ATAHUALPA-IBARRA", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "IMBABURA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "ATARAZANA", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "GUAYAS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "ATUNTAQUI", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "IMBABURA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "AYACUCHO", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "GUAYAS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "AZOGUES", "tipo": "AGENCIA", "region": "REGION SUR", "provincia": "CAÑAR" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "BABAHOYO", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "LOS RIOS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "BAHÍA DE CARAQUEZ", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "MANABI" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "BAHÍA MACHALA", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "EL ORO" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "BALZAR", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "GUAYAS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "BANCA PRIVADA CUENCA", "tipo": "PUNTO INTERNO", "region": "REGION SUR", "provincia": "AZUAY" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "BANCA PRIVADA GUAYAQUIL", "tipo": "PUNTO INTERNO", "region": "REGION COSTA", "provincia": "GUAYAS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "BANCA PRIVADA QUITO", "tipo": "BANCA PRIVADA", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "BANOS", "tipo": "AGENCIA", "region": "REGION CENTRO", "provincia": "TUNGURAHUA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "BRASIL", "tipo": "CENTRO DE NEGOCIOS", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "BUCAY", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "GUAYAS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "BUENA FE", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "LOS RIOS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "CALCETA", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "MANABI" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "CALDERON", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "CALLE 13", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "MANABI" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "CALUMA", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "BOLÍVAR" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "CAÑAR", "tipo": "AGENCIA", "region": "REGION SUR", "provincia": "CAÑAR" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "CARAPUNGO", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "CAYAMBE", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "CENTENARIO SUR", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "GUAYAS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "CENTRO COMERCIAL INAQUITO", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "CENTRO CUENCA", "tipo": "AGENCIA", "region": "REGION SUR", "provincia": "AZUAY" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "CENTRO FINANCIERO ORELLANA", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "GUAYAS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "CENTRO GUAYAQUIL", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "GUAYAS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "CENTRUM EL BOSQUE", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "CHILE SUR", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "GUAYAS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "CHONE", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "MANABI" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "COCA", "tipo": "AGENCIA", "region": "REGION CENTRO", "provincia": "ORELLANA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "CONOCOTO", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "COTACACHI", "tipo": "SOPORTE COMERCIAL", "region": "REGION NORTE", "provincia": "IMBABURA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "CUENCA", "tipo": "AGENCIA", "region": "REGION SUR", "provincia": "AZUAY" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "CUERO Y CAICEDO", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "CUMANDA", "tipo": "AGENCIA", "region": "REGION CENTRO", "provincia": "TUNGURAHUA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "CUMBAYA", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "CUXIBAMBA", "tipo": "AGENCIA", "region": "REGION SUR", "provincia": "LOJA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "DAULE", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "GUAYAS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "DURÁN", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "GUAYAS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "EL ANGEL", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "CARCHI" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "EL ARENAL", "tipo": "AGENCIA", "region": "REGION SUR", "provincia": "AZUAY" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "EL CARMEN", "tipo": "AGENCIA", "region": "REGION CENTRO", "provincia": "MANABI" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "EL COLORADO", "tipo": "AGENCIA", "region": "REGION CENTRO", "provincia": "SANTO DOMINGO DE LOS TSACHILAS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "EL CONDADO", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "EL DORADO", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "GUAYAS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "EL EMPALME", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "GUAYAS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "EL GUABO", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "EL ORO" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "EL INCA", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "EL RECREO", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "EL TRIUNFO", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "GUAYAS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "EL VALLE", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "ESMERALDAS", "tipo": "AGENCIA", "region": "REGION CENTRO", "provincia": "ESMERALDAS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "ESPEJO", "tipo": "CENTRO DE NEGOCIOS", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "FLORIDA", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "GUAYAS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "GALÁPAGOS", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "GALAPAGOS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "GARCIA MORENO", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "GIRÓN", "tipo": "AGENCIA", "region": "REGION SUR", "provincia": "AZUAY" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "GLORIETA", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "GUALACEO", "tipo": "AGENCIA", "region": "REGION SUR", "provincia": "AZUAY" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "GUALAQUIZA", "tipo": "AGENCIA", "region": "REGION SUR", "provincia": "MORONA SANTIAGO" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "GUARANDA", "tipo": "AGENCIA", "region": "REGION CENTRO", "provincia": "BOLÍVAR" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "GUAYAQUIL", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "GUAYAS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "GUAYLLABAMBA", "tipo": "SOPORTE COMERCIAL", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "HUAQUILLAS", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "EL ORO" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "IBARRA", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "IMBABURA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "JIPIJAPA", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "MANABI" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "LA CONCORDIA", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "SANTO DOMINGO DE LOS TSACHILAS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "LA DOLOROSA", "tipo": "AGENCIA", "region": "REGION SUR", "provincia": "LOJA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "LA KENNEDY", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "GUAYAS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "LA MANÁ", "tipo": "AGENCIA", "region": "REGION CENTRO", "provincia": "COTOPAXI" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "LA MARISCAL", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "LA PRENSA", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "LA TRONCAL", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "CAÑAR" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "LA TOLA", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "LATACUNGA", "tipo": "AGENCIA", "region": "REGION CENTRO", "provincia": "COTOPAXI" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "LOJA", "tipo": "AGENCIA", "region": "REGION SUR", "provincia": "LOJA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "LOMAS DE SARGENTILLO", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "GUAYAS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "MACHACHI", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "MACHALA", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "EL ORO" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "MACAS", "tipo": "AGENCIA", "region": "REGION CENTRO", "provincia": "MORONA SANTIAGO" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "MANTA", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "MANABI" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "MAPASINGUE", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "GUAYAS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "MILAGRO", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "GUAYAS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "MINAS DE ZARUMA", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "EL ORO" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "MIRA", "tipo": "SOPORTE COMERCIAL", "region": "REGION NORTE", "provincia": "CARCHI" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "MONTALVO", "tipo": "SOPORTE COMERCIAL", "region": "REGION COSTA", "provincia": "LOS RIOS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "MONTÚFAR", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "CARCHI" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "NARANJAL", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "GUAYAS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "NORTE", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "ORDÓÑEZ LASSO", "tipo": "AGENCIA", "region": "REGION SUR", "provincia": "AZUAY" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "ORQUÍDEAS", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "GUAYAS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "OTAVALO", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "IMBABURA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "PANAMERICANA NORTE", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "PANAMERICANA SUR", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "PARQUE CALIFORNIA", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "GUAYAS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "PASAJE", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "EL ORO" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "PASEO LA PENÍNSULA", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "SANTA ELENA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "PASEO SHOPPING DAULE", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "GUAYAS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "PASEO SHOPPING MACHALA", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "EL ORO" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "PASEO SHOPPING MILAGRO", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "GUAYAS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "PATRICIA PILAR", "tipo": "SOPORTE COMERCIAL", "region": "REGION COSTA", "provincia": "LOS RIOS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "PEDERNALES", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "MANABI" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "PEDRO VICENTE MALDONADO", "tipo": "AGENCIA", "region": "REGION CENTRO", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "PELILEO", "tipo": "AGENCIA", "region": "REGION CENTRO", "provincia": "TUNGURAHUA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "PIFO", "tipo": "SOPORTE COMERCIAL", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "PILLARO", "tipo": "AGENCIA", "region": "REGION CENTRO", "provincia": "TUNGURAHUA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "PIÑAS", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "EL ORO" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "PLAYAS", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "GUAYAS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "PLAZA CENTENARIO", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "GUAYAS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "PLAZA DEL TEATRO", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "PLAZA EQUINOCCIAL", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "PORTOVIEJO", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "MANABI" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "PUERTO AYORA", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "GALAPAGOS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "PUERTO LÓPEZ", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "MANABI" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "PUERTO QUITO", "tipo": "AGENCIA", "region": "REGION CENTRO", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "PUJILÍ", "tipo": "AGENCIA", "region": "REGION CENTRO", "provincia": "COTOPAXI" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "PUMAPUNGO", "tipo": "AGENCIA", "region": "REGION SUR", "provincia": "AZUAY" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "QUEVEDO", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "LOS RIOS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "QUININDÉ", "tipo": "AGENCIA", "region": "REGION CENTRO", "provincia": "ESMERALDAS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "QUITO", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "RIOBAMBA", "tipo": "AGENCIA", "region": "REGION CENTRO", "provincia": "CHIMBORAZO" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "ROCAFUERTE", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "MANABI" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "RUMIÑAHUI", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "SALCEDO", "tipo": "AGENCIA", "region": "REGION CENTRO", "provincia": "COTOPAXI" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "SALINAS", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "SANTA ELENA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "SAMBORONDÓN", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "GUAYAS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "SAN GABRIEL", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "CARCHI" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "SAN GOLQUÍ", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "SAN LORENZO", "tipo": "AGENCIA", "region": "REGION CENTRO", "provincia": "ESMERALDAS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "SAN MIGUEL DE BOLÍVAR", "tipo": "AGENCIA", "region": "REGION CENTRO", "provincia": "BOLÍVAR" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "SAN MIGUEL DE LOS BANCOS", "tipo": "AGENCIA", "region": "REGION CENTRO", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "SAN MIGUELITO DE PÍLLARO", "tipo": "AGENCIA", "region": "REGION CENTRO", "provincia": "TUNGURAHUA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "SAN RAFAEL", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "SAN VICENTE", "tipo": "SOPORTE COMERCIAL", "region": "REGION COSTA", "provincia": "MANABI" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "SANTA ELENA", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "SANTA ELENA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "SANTA ISABEL", "tipo": "AGENCIA", "region": "REGION SUR", "provincia": "AZUAY" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "SANTA PRISCA", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "SANTA ROSA", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "EL ORO" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "SANTO DOMINGO", "tipo": "AGENCIA", "region": "REGION CENTRO", "provincia": "SANTO DOMINGO DE LOS TSACHILAS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "SHUSHUFINDI", "tipo": "AGENCIA", "region": "REGION CENTRO", "provincia": "SUCUMBIOS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "SUCRE", "tipo": "AGENCIA", "region": "REGION CENTRO", "provincia": "MANABI" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "SUR GUAYAQUIL", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "GUAYAS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "TENA", "tipo": "AGENCIA", "region": "REGION CENTRO", "provincia": "NAPO" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "TUMBACO", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "TULCÁN", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "CARCHI" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "VALENCIA", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "LOS RIOS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "VALLE DE LOS CHILLOS", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "VENTANAS", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "LOS RIOS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "VINCES", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "LOS RIOS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "YAGUACHI", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "GUAYAS" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "YANTZAZA", "tipo": "AGENCIA", "region": "REGION SUR", "provincia": "ZAMORA CHINCHIPE" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "ZAMORA", "tipo": "AGENCIA", "region": "REGION SUR", "provincia": "ZAMORA CHINCHIPE" }},
      {{ "id": "", "empresa": "Banco Pichincha", "agencia": "ZARUMA", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "EL ORO" }},
      {{ "id": "", "empresa": "Banco General Rumiñahui", "agencia": "CASA MATRIZ - QUITO", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco General Rumiñahui", "agencia": "PRENSA", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco General Rumiñahui", "agencia": "HOSPITAL MILITAR", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco General Rumiñahui", "agencia": "LA RECOLECTA", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco General Rumiñahui", "agencia": "EL CONDADO", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco General Rumiñahui", "agencia": "SUR UIO", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco General Rumiñahui", "agencia": "ATAHUALPA", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco General Rumiñahui", "agencia": "ESPE", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "PICHINCHA" }},
      {{ "id": "", "empresa": "Banco General Rumiñahui", "agencia": "IBARRA", "tipo": "AGENCIA", "region": "REGION NORTE", "provincia": "IMBABURA" }},
      {{ "id": "", "empresa": "Banco General Rumiñahui", "agencia": "SANTO DOMINGO", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "SANTO DOMINGO DE LOS TSACHILAS" }},
      {{ "id": "", "empresa": "Banco General Rumiñahui", "agencia": "LATACUNGA", "tipo": "AGENCIA", "region": "REGION CENTRO", "provincia": "COTOPAXI" }},
      {{ "id": "", "empresa": "Banco General Rumiñahui", "agencia": "RIOBAMBA", "tipo": "AGENCIA", "region": "REGION CENTRO", "provincia": "CHIMBORAZO" }},
      {{ "id": "", "empresa": "Banco General Rumiñahui", "agencia": "ESMERALDAS", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "ESMERALDAS" }},
      {{ "id": "", "empresa": "Banco General Rumiñahui", "agencia": "MANTA", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "MANABI" }},
      {{ "id": "", "empresa": "Banco General Rumiñahui", "agencia": "FUERTE HUANCAVILCA", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "GUAYAS" }},
      {{ "id": "", "empresa": "Banco General Rumiñahui", "agencia": "FAE ATARAZANA", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "GUAYAS" }},
      {{ "id": "", "empresa": "Banco General Rumiñahui", "agencia": "SUCURSAL MAYOR", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "GUAYAS" }},
      {{ "id": "", "empresa": "Banco General Rumiñahui", "agencia": "PRIMERA ZONA NAVAL", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "GUAYAS" }},
      {{ "id": "", "empresa": "Banco General Rumiñahui", "agencia": "BASE NAVAL SUR", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "GUAYAS" }},
      {{ "id": "", "empresa": "Banco General Rumiñahui", "agencia": "CUENCA", "tipo": "AGENCIA", "region": "REGION SUR", "provincia": "AZUAY" }},
      {{ "id": "", "empresa": "Banco General Rumiñahui", "agencia": "SALINAS", "tipo": "AGENCIA", "region": "REGION COSTA", "provincia": "SANTA ELENA" }},
      {{ "id": "", "empresa": "Banco General Rumiñahui", "agencia": "MACHALA", "tipo": "AGENCIA", "region": "REGION SUR", "provincia": "EL ORO" }},
      {{ "id": "", "empresa": "Banco General Rumiñahui", "agencia": "LOJA", "tipo": "AGENCIA", "region": "REGION SUR", "provincia": "LOJA" }}
    ]).filter(item => {{
      const name = typeof item === 'string' ? item : (item.agencia || '');
      return !name.includes('personal/cristian_castro_akroscorp_com/Lists/AGENCIAS');
    }});

    // 2. Catálogo Completo de 60 Técnicos con Nombre Real del Proveedor desde tecnico_lista_24sep.xlsx (Excluyendo a 'Cristian Castro')
    this.techniciansCatalog = (options.techniciansCatalog || {tech_catalog_js}).filter(t => {{
      const name = typeof t === 'string' ? t : (t.name || '');
      return name.toLowerCase() !== 'cristian castro';
    }});

    this.noisePattern = /personal\/cristian_castro_akroscorp_com\/Lists\/AGENCIAS/gi;

    // 3. Dataset Precalculado Histórico (Junio - Septiembre 2026 - 57 asignaciones confirmadas)
    this.precalculatedHistoricalData = {historical_json_str};
  }}

  getTechnicianName(techItem) {{
    if (!techItem) return 'Por Asignar / No Mencionado';
    return typeof techItem === 'string' ? techItem : (techItem.name || 'Por Asignar / No Mencionado');
  }}

  getTechnicianProvider(techName) {{
    if (!techName || techName === 'Por Asignar / No Mencionado' || techName === 'Por Asignar') {{
      return 'No está en lista';
    }}
    const match = this.techniciansCatalog.find(t => {{
      const n = typeof t === 'string' ? t : t.name;
      return n.toLowerCase() === techName.toLowerCase();
    }});
    if (match && typeof match === 'object' && match.proveedor) {{
      return match.proveedor;
    }}
    return 'No está en lista';
  }}

  /**
   * Obtiene la lista única de todos los proveedores registrados en el catálogo de técnicos.
   */
  getUniqueProviders() {{
    const providersSet = new Set();
    this.techniciansCatalog.forEach(t => {{
      if (t && typeof t === 'object' && t.proveedor) {{
        providersSet.add(t.proveedor);
      }}
    }});
    providersSet.add('No está en lista');
    return Array.from(providersSet).sort((a, b) => a.localeCompare(b));
  }}

  getHistoricalExtractedData() {{
    return JSON.parse(JSON.stringify(this.precalculatedHistoricalData));
  }}

  extractDataFromMessages(messagesList = [], lastProcessedTimestamp = null) {{
    const baseData = this.getHistoricalExtractedData();
    const liveData = [];
    let latestTimestampFound = lastProcessedTimestamp;

    const ticketRegex = /(?:AKR-RQ-\\d+|TK-\\d+|TKT-\\d+|SOP-\\d+|ticket\\s*#?\\s*\\d+)/gi;
    const techExplicitRegex = /(?:se confirma asistencia de|se confirma atenci[oó]n de|se coordina atenci[oó]n con|se coordina con|coordinado con|atendido por|asignado a|se env[ií]a a|se remite a|t[eé]cnico|soporte|atiende|resp|revisado por|ingeniero|atenci[oó]n):\\s*([A-ZÁÉÍÓÚÑa-záéíóúñ\\s]{{3,35}})/i;
    const mentionTechRegex = /@([A-ZÁÉÍÓÚÑa-záéíóúñ\\s]{{3,30}})/i;
    const agencyExplicitRegex = /(?:agencia|ubicaci[oó]n|sucursal|zona|ciudad):\\s*([A-ZÁÉÍÓÚÑa-záéíóúñ\\s]{{3,25}})/i;

    messagesList.forEach((rawMsg, index) => {{
      let text = '';
      let sender = 'Usuario WhatsApp';
      let timestamp = new Date().toISOString();
      let isOutgoing = false;

      if (typeof rawMsg === 'string') {{
        text = rawMsg;
        const senderMatch = rawMsg.match(/^([^:]+):\\s*(.+)$/);
        if (senderMatch) {{
          sender = senderMatch[1].trim();
          text = senderMatch[2].trim();
          if (sender.toLowerCase().includes('yo') || sender.toLowerCase().includes('saliente') || sender.toLowerCase().includes('akros')) {{
            isOutgoing = true;
          }}
        }}
      }} else if (typeof rawMsg === 'object' && rawMsg !== null) {{
        text = rawMsg.text || rawMsg.description || rawMsg.replyText || '';
        sender = rawMsg.senderName || rawMsg.sender || 'Usuario WhatsApp';
        timestamp = rawMsg.timestamp || new Date().toISOString();
        isOutgoing = !!(rawMsg.isOutgoing || sender.toLowerCase().includes('yo') || sender.toLowerCase().includes('saliente') || sender.toLowerCase().includes('akros'));
      }}

      if (!text) return;

      if (lastProcessedTimestamp && timestamp <= lastProcessedTimestamp) {{
        return;
      }}

      if (!latestTimestampFound || timestamp > latestTimestampFound) {{
        latestTimestampFound = timestamp;
      }}

      if (text.includes('personal/cristian_castro_akroscorp_com/Lists/AGENCIAS')) return;
      if (text.toLowerCase().includes('cristian castro')) return;

      if (this.noisePattern.test(text)) {{
        text = text.replace(this.noisePattern, '').trim();
      }}
      if (!text) return;

      const ticketMatches = text.match(ticketRegex);
      const ticketCode = ticketMatches ? ticketMatches[0].toUpperCase() : null;

      let officialAgencyFound = null;
      let chatMentionedName = null;
      let regionFound = 'N/A';
      let provinciaFound = '';
      
      const explicitAgencyMatch = text.match(agencyExplicitRegex);
      if (explicitAgencyMatch && explicitAgencyMatch[1]) {{
        chatMentionedName = explicitAgencyMatch[1].trim();
        if (!chatMentionedName.includes('personal/cristian_castro_akroscorp_com/Lists/AGENCIAS')) {{
          officialAgencyFound = chatMentionedName;
          const matchObj = this.agenciesCatalog.find(item => 
            item.agencia.toLowerCase() === chatMentionedName.toLowerCase() ||
            item.agencia.toLowerCase().includes(chatMentionedName.toLowerCase())
          );
          if (matchObj) {{
            officialAgencyFound = matchObj.agencia;
            regionFound = matchObj.region || 'N/A';
            provinciaFound = matchObj.provincia || '';
          }}
        }}
      }} else {{
        for (const item of this.agenciesCatalog) {{
          const agName = item.agencia;
          if (agName.includes('personal/cristian_castro_akroscorp_com/Lists/AGENCIAS')) continue;
          
          const regex = new RegExp(`\\\\b${{this.escapeRegExp(agName)}}\\\\b`, 'i');
          if (regex.test(text)) {{
            officialAgencyFound = agName;
            chatMentionedName = agName;
            regionFound = item.region || 'N/A';
            provinciaFound = item.provincia || '';
            break;
          }}
        }}
      }}

      let techFound = null;
      
      for (const tObj of this.techniciansCatalog) {{
        const techName = this.getTechnicianName(tObj);
        if (techName.toLowerCase() === 'cristian castro') continue;
        
        const regex = new RegExp(`\\\\b${{this.escapeRegExp(techName)}}\\\\b`, 'i');
        if (regex.test(text)) {{
          techFound = techName;
          break;
        }}
      }}

      if (!techFound) {{
        const explicitTechMatch = text.match(techExplicitRegex) || text.match(mentionTechRegex);
        if (explicitTechMatch && explicitTechMatch[1]) {{
          const candidateTech = explicitTechMatch[1].trim();
          if (candidateTech.toLowerCase() !== 'cristian castro') {{
            const catalogMatch = this.techniciansCatalog.find(t => {{
              const name = this.getTechnicianName(t);
              return name.toLowerCase().includes(candidateTech.toLowerCase()) || 
                     candidateTech.toLowerCase().includes(name.toLowerCase());
            }});
            techFound = catalogMatch ? this.getTechnicianName(catalogMatch) : candidateTech;
          }}
        }}
      }}

      if (techFound && techFound.toLowerCase() === 'cristian castro') {{
        techFound = null;
      }}

      if (ticketCode || officialAgencyFound || techFound) {{
        const techNameFinal = techFound || 'Por Asignar / No Mencionado';
        liveData.push({{
          id: `LIVE-${{index}}-${{Date.now()}}`,
          ticketCode: ticketCode || 'Soporte Sin Código',
          agency: officialAgencyFound || 'Sin Ubicación Especificada',
          chatMention: chatMentionedName || officialAgencyFound || 'Sin mención explícita',
          region: regionFound,
          provincia: provinciaFound,
          technician: techNameFinal,
          technicianProvider: this.getTechnicianProvider(techNameFinal),
          isOutgoing: isOutgoing,
          isConfirmedByOutgoing: isOutgoing && !!techFound,
          weight: isOutgoing ? 10 : 1,
          sender: sender,
          fullText: text,
          timestamp: timestamp
        }});
      }}
    }});

    const combined = [...baseData];
    const existingKeys = new Set(baseData.map(item => 
      `${{(item.technician || '').toLowerCase()}}|${{(item.agency || '').toLowerCase()}}|${{(item.ticketCode || '').toLowerCase()}}`
    ));

    liveData.forEach(item => {{
      const key = `${{(item.technician || '').toLowerCase()}}|${{(item.agency || '').toLowerCase()}}|${{(item.ticketCode || '').toLowerCase()}}`;
      if (!existingKeys.has(key)) {{
        existingKeys.add(key);
        combined.push(item);
      }}
    }});

    return {{
      extractedData: combined,
      latestTimestamp: latestTimestampFound
    }};
  }}

  escapeRegExp(string) {{
    return string.replace(/[.*+?^${{}}()|[\\]\\\\]/g, '\\\\$&');
  }}

  generateStrategicReport(extractedData = [], selectedRegion = 'TODAS', selectedProvider = 'TODOS') {{
    const agencyGroups = {{}};
    const techPerformance = {{}};

    extractedData.forEach(item => {{
      let agencyKey = item.agency;
      let techKey = item.technician;
      let providerKey = item.technicianProvider || this.getTechnicianProvider(techKey);
      let regionKey = item.region !== 'N/A' ? item.region : 'OTRAS REGIONES';

      if (selectedRegion && selectedRegion !== 'TODAS' && regionKey.toUpperCase() !== selectedRegion.toUpperCase()) {{
        return;
      }}

      if (selectedProvider && selectedProvider !== 'TODOS' && providerKey.toUpperCase() !== selectedProvider.toUpperCase()) {{
        return;
      }}

      if (agencyKey.includes('personal/cristian_castro_akroscorp_com/Lists/AGENCIAS')) {{
        return;
      }}

      if (techKey && techKey.toLowerCase() === 'cristian castro') {{
        techKey = 'Por Asignar / No Mencionado';
      }}

      if (!agencyGroups[agencyKey]) {{
        agencyGroups[agencyKey] = {{
          agencyName: agencyKey,
          chatMentionName: item.chatMention,
          regionName: regionKey,
          provinciaName: item.provincia || '',
          totalSupports: 0,
          techniciansMap: {{}},
          confirmedByOutgoingCount: 0,
          ticketsList: [],
          frequentTech: 'Por Asignar',
          frequentTechProvider: 'No está en lista'
        }};
      }}

      agencyGroups[agencyKey].totalSupports++;
      agencyGroups[agencyKey].ticketsList.push(item);

      if (item.isConfirmedByOutgoing) {{
        agencyGroups[agencyKey].confirmedByOutgoingCount++;
      }}

      if (techKey !== 'Por Asignar / No Mencionado' && techKey.toLowerCase() !== 'cristian castro') {{
        const addWeight = item.weight || 1;
        agencyGroups[agencyKey].techniciansMap[techKey] = (agencyGroups[agencyKey].techniciansMap[techKey] || 0) + addWeight;
        techPerformance[techKey] = (techPerformance[techKey] || 0) + addWeight;
      }}
    }});

    const consolidatedReport = Object.values(agencyGroups).map(group => {{
      let maxCount = 0;
      let frequentTech = 'Por Asignar';

      for (const [tech, count] of Object.entries(group.techniciansMap)) {{
        if (tech.toLowerCase() === 'cristian castro') continue;
        if (count > maxCount) {{
          maxCount = count;
          frequentTech = tech;
        }}
      }}
      group.frequentTech = frequentTech;
      group.frequentTechProvider = this.getTechnicianProvider(frequentTech);

      return group;
    }});

    let topNationalTech = 'N/A';
    let maxNationalSupports = 0;
    for (const [tech, count] of Object.entries(techPerformance)) {{
      if (tech.toLowerCase() === 'cristian castro') continue;
      if (count > maxNationalSupports) {{
        maxNationalSupports = count;
        topNationalTech = tech;
      }}
    }}

    consolidatedReport.sort((a, b) => b.totalSupports - a.totalSupports);

    return {{
      summaryMetrics: {{
        totalExtractedCount: extractedData.length,
        affectedAgenciesCount: consolidatedReport.length,
        topNationalTech: topNationalTech,
        topNationalTechProvider: this.getTechnicianProvider(topNationalTech),
        topNationalSupports: maxNationalSupports
      }},
      reportRows: consolidatedReport
    }};
  }}

  getMockData() {{
    return this.getHistoricalExtractedData();
  }}
}}

if (typeof window !== 'undefined') {{
  window.WhatsAppAnalyticsEngine = WhatsAppAnalyticsEngine;
}}
"""

with open(analytics_js_path, 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"Rebuilt {analytics_js_path} with getUniqueProviders() successfully!")
