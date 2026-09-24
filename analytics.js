/**
 * Visor Analítico Interno - WhatsApp AI Assistant Extension (Manifest V3)
 * Enfoque Obligatorio en "Soporte en Sitio Akros", Extracción de Confirmaciones Verdes
 * y Motor de Recurrencia por Técnico por Agencia.
 */

class WhatsAppAnalyticsEngine {
  constructor(options = {}) {
    // 1. Catálogo Completo de 235 Agencias (agencias1_estructurado.csv)
    this.agenciesCatalog = (options.agenciesCatalog || [
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "24 DE MAYO",
            "tipo": "SOPORTE COMERCIAL",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "6 DE DICIEMBRE",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "9 DE OCTUBRE",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "AEROPUERTO GUAYAQUIL",
            "tipo": "CENTRO DE NEGOCIOS",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "ALAMEDA",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "ALAUSI",
            "tipo": "AGENCIA",
            "region": "REGION CENTRO",
            "provincia": "CHIMBORAZO"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "ALBÁN BORJA",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "AMAZONAS",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "AMBATO",
            "tipo": "AGENCIA",
            "region": "REGION CENTRO",
            "provincia": "TUNGURAHUA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "AMERICA",
            "tipo": "VENTANILLA EXTENSIÓN",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "AMERICA",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "ATACAMES",
            "tipo": "AGENCIA",
            "region": "REGION CENTRO",
            "provincia": "ESMERALDAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "ATAHUALPA",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "ATAHUALPA-IBARRA",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "IMBABURA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "ATARAZANA",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "ATUNTAQUI",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "IMBABURA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "AYACUCHO",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "AZOGUES",
            "tipo": "AGENCIA",
            "region": "REGION SUR",
            "provincia": "CAÑAR"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "BABAHOYO",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "LOS RIOS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "BAHÍA DE CARAQUEZ",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "MANABI"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "BAHÍA MACHALA",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "EL ORO"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "BALZAR",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "BANCA PRIVADA CUENCA",
            "tipo": "PUNTO INTERNO",
            "region": "REGION SUR",
            "provincia": "AZUAY"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "BANCA PRIVADA GUAYAQUIL",
            "tipo": "PUNTO INTERNO",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "BANCA PRIVADA QUITO",
            "tipo": "BANCA PRIVADA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "BANOS",
            "tipo": "AGENCIA",
            "region": "REGION CENTRO",
            "provincia": "TUNGURAHUA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "BRASIL",
            "tipo": "CENTRO DE NEGOCIOS",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "BUCAY",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "BUENA FE",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "LOS RIOS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "CALCETA",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "MANABI"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "CALDERON",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "CALLE 13",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "MANABI"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "CALUMA",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "BOLÍVAR"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "CAÑAR",
            "tipo": "AGENCIA",
            "region": "REGION SUR",
            "provincia": "CAÑAR"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "CARAPUNGO",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "CAYAMBE",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "CENTENARIO SUR",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "CENTENARIO SUR",
            "tipo": "VENTANILLA EXTENSIÓN",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "CENTRO COMERCIAL INAQUITO",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "CENTRO CUENCA",
            "tipo": "AGENCIA",
            "region": "REGION SUR",
            "provincia": "AZUAY"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "CENTRO FINANCIERO ORELLANA",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "CENTRO GUAYAQUIL",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "CENTRUM EL BOSQUE",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "CHILE SUR",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "CHONE",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "MANABI"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "COCA",
            "tipo": "AGENCIA",
            "region": "REGION CENTRO",
            "provincia": "ORELLANA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "CONOCOTO",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "COTACACHI",
            "tipo": "SOPORTE COMERCIAL",
            "region": "REGION NORTE",
            "provincia": "IMBABURA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "CUENCA",
            "tipo": "AGENCIA",
            "region": "REGION SUR",
            "provincia": "AZUAY"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "CUERO Y CAICEDO",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "CUMANDA",
            "tipo": "AGENCIA",
            "region": "REGION CENTRO",
            "provincia": "TUNGURAHUA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "CUMBAYA",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "CUXIBAMBA",
            "tipo": "AGENCIA",
            "region": "REGION SUR",
            "provincia": "LOJA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "DAULE",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "DURÁN",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "EL ANGEL",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "CARCHI"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "EL ARENAL",
            "tipo": "AGENCIA",
            "region": "REGION SUR",
            "provincia": "AZUAY"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "EL CARMEN",
            "tipo": "AGENCIA",
            "region": "REGION CENTRO",
            "provincia": "MANABI"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "EL COLORADO",
            "tipo": "AGENCIA",
            "region": "REGION CENTRO",
            "provincia": "SANTO DOMINGO DE LOS TSaCHILAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "EL CONDADO",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "EL DORADO",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "EL EMPALME",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "EL GIRON",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "EL GIRON",
            "tipo": "PUNTO INTERNO",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "EL GIRON",
            "tipo": "VENTANILLA EXTENSIÓN",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "EL GUABO",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "EL ORO"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "EL INCA",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "EL JARDIN",
            "tipo": "CENTRO DE NEGOCIOS",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "EL PANGUI",
            "tipo": "SOPORTE COMERCIAL",
            "region": "REGION SUR",
            "provincia": "ZAMORA CHINCHIPE"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "EL QUINCHE",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "EL RECREO",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "EL RECREO",
            "tipo": "VENTANILLA EXTENSIÓN",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "EL SALTO",
            "tipo": "AGENCIA",
            "region": "REGION CENTRO",
            "provincia": "COTOPAXI"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "EL TRIUNFO",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "EL VALLE",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "ELOY ALFARO",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "ELOY ALFARO",
            "tipo": "VENTANILLA EXTENSIÓN",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "ESMERALDAS",
            "tipo": "AGENCIA",
            "region": "REGION CENTRO",
            "provincia": "ESMERALDAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "FICOA",
            "tipo": "AGENCIA",
            "region": "REGION CENTRO",
            "provincia": "TUNGURAHUA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "GALÁPAGOS",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "GALÁPAGOS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "GONZALEZ SUAREZ",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "GUALACEO",
            "tipo": "AGENCIA",
            "region": "REGION SUR",
            "provincia": "AZUAY"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "GUARANDA",
            "tipo": "AGENCIA",
            "region": "REGION CENTRO",
            "provincia": "BOLÍVAR"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "GUAYLLABAMBA",
            "tipo": "SOPORTE COMERCIAL",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "HUAQUILLAS",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "EL ORO"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "HUAYNACAPAC",
            "tipo": "AGENCIA",
            "region": "REGION SUR",
            "provincia": "AZUAY"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "IBARRA",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "IMBABURA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "INAQUITO",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "INAQUITO",
            "tipo": "PUNTO INTERNO",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "JIPIJAPA",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "MANABI"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "KENNEDY",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "KM 6,5 VÍA A DAULE",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "LA ALBORADA",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "LA ALBORADA CLINICA KENNEDY",
            "tipo": "VENTANILLA EXTENSIÓN",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "LA CONCORDIA",
            "tipo": "AGENCIA",
            "region": "REGION CENTRO",
            "provincia": "SANTO DOMINGO DE LOS TSaCHILAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "LA ESTACION",
            "tipo": "AGENCIA",
            "region": "REGION CENTRO",
            "provincia": "CHIMBORAZO"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "LA MANÁ",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "COTOPAXI"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "LA PIAZZA",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "LA PLAZA",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "IMBABURA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "LA PRENSA",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "LA SCALA SHOPPING",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "LA TOLITA",
            "tipo": "AGENCIA",
            "region": "REGION CENTRO",
            "provincia": "ESMERALDAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "LA TRONCAL",
            "tipo": "AGENCIA",
            "region": "REGION SUR",
            "provincia": "CAÑAR"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "LAGO AGRIO",
            "tipo": "AGENCIA",
            "region": "REGION CENTRO",
            "provincia": "SUCUMBIOS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "LASSO",
            "tipo": "AGENCIA",
            "region": "REGION CENTRO",
            "provincia": "COTOPAXI"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "LATACUNGA",
            "tipo": "AGENCIA",
            "region": "REGION CENTRO",
            "provincia": "COTOPAXI"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "LIBERTAD",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "SANTA ELENA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "LOJA",
            "tipo": "AGENCIA",
            "region": "REGION SUR",
            "provincia": "LOJA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "LOS SACHAS",
            "tipo": "AGENCIA",
            "region": "REGION CENTRO",
            "provincia": "ORELLANA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "MACAS",
            "tipo": "AGENCIA",
            "region": "REGION CENTRO",
            "provincia": "MORONA SANTIAGO"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "MACHACHI",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "MACHACHI",
            "tipo": "VENTANILLA EXTENSIÓN",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "MACHALA",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "EL ORO"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "MALL DEL PACIFICO",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "MANABI"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "MALL DEL RÍO",
            "tipo": "AGENCIA",
            "region": "REGION SUR",
            "provincia": "AZUAY"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "MALL DEL SOL",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "MALL EL FORTÍN",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "MANTA",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "MANABI"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "MERCADO CENTRAL",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "MERCADO MAYORISTA",
            "tipo": "AGENCIA",
            "region": "REGION CENTRO",
            "provincia": "CHIMBORAZO"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "METROPOLI",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "METROPOLI",
            "tipo": "VENTANILLA EXTENSIÓN",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "MILAGRO",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "MOCACHE",
            "tipo": "SOPORTE COMERCIAL",
            "region": "REGION COSTA",
            "provincia": "LOS RIOS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "NARANJAL",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "NORTE",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "NORTE",
            "tipo": "VENTANILLA EXTENSIÓN",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "ORDÓÑEZ LASSO",
            "tipo": "AGENCIA",
            "region": "REGION SUR",
            "provincia": "AZUAY"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "ORQUÍDEAS",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "OTAVALO",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "IMBABURA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "PANAMERICANA NORTE",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "PANAMERICANA SUR",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "PARQUE CALIFORNIA",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "PASAJE",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "EL ORO"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "PASEO LA PENÍNSULA",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "SANTA ELENA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "PASEO SHOPPING DAULE",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "PASEO SHOPPING MACHALA",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "EL ORO"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "PASEO SHOPPING MILAGRO",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "PATRICIA PILAR",
            "tipo": "SOPORTE COMERCIAL",
            "region": "REGION COSTA",
            "provincia": "LOS RIOS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "PEDERNALES",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "MANABI"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "PEDRO VICENTE MALDONADO",
            "tipo": "AGENCIA",
            "region": "REGION CENTRO",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "PELILEO",
            "tipo": "AGENCIA",
            "region": "REGION CENTRO",
            "provincia": "TUNGURAHUA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "PIFO",
            "tipo": "SOPORTE COMERCIAL",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "PILLARO",
            "tipo": "AGENCIA",
            "region": "REGION CENTRO",
            "provincia": "TUNGURAHUA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "PIÑAS",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "EL ORO"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "PLAYAS",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "PLAZA CENTENARIO",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "PLAZA DEL TEATRO",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "PLAZA EQUINOCCIAL",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "PLAZA GRANDE",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "POLICENTRO",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "PORTOVIEJO",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "MANABI"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "PORTUGAL",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "PORTUGAL",
            "tipo": "PUNTO INTERNO",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "POSORJA",
            "tipo": "SOPORTE COMERCIAL",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "PUERTO LÓPEZ",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "MANABI"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "PUJILI",
            "tipo": "SOPORTE COMERCIAL",
            "region": "REGION CENTRO",
            "provincia": "COTOPAXI"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "PUNTO PAGO SUR",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "PUNTO PAGO SUR",
            "tipo": "VENTANILLA EXTENSIÓN",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "PUYO CIRCUNVALACIÓN",
            "tipo": "AGENCIA",
            "region": "REGION CENTRO",
            "provincia": "PASTAZA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "QUEVEDO",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "LOS RIOS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "QUEVEDO SUR",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "LOS RIOS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "QUICENTRO",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "QUICENTRO SUR",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "QUININDE",
            "tipo": "AGENCIA",
            "region": "REGION CENTRO",
            "provincia": "ESMERALDAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "REALES TAMARINDOS",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "MANABI"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "REMIGIO CRESPO",
            "tipo": "AGENCIA TRANSACCIONAL",
            "region": "REGION SUR",
            "provincia": "AZUAY"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "RICAURTE CUENCA",
            "tipo": "AGENCIA",
            "region": "REGION SUR",
            "provincia": "AZUAY"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "RIOBAMBA",
            "tipo": "AGENCIA",
            "region": "REGION CENTRO",
            "provincia": "CHIMBORAZO"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "RIOCENTRO HIPERMARKET NORTE",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "RIOCENTRO SHOPPING ENTRE RÍOS",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "RIOCENTRO SHOPPING LOS CEIBOS",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "RIOCENTRO SHOPPING SUR",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "RIOCENTRO SHOPPING SUR",
            "tipo": "VENTANILLA EXTENSIÓN",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "SALCEDO",
            "tipo": "AGENCIA",
            "region": "REGION CENTRO",
            "provincia": "COTOPAXI"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "SALINAS",
            "tipo": "SOPORTE COMERCIAL",
            "region": "REGION COSTA",
            "provincia": "SANTA ELENA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "SAMBORONDÓN",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "SAMBORONDÓN PLAZA",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "SAMBORONDÓN PLAZA",
            "tipo": "CENTRO DE NEGOCIOS",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "SAN CAMILO",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "LOS RIOS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "SAN GABRIEL",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "CARCHI"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "SAN JUAN",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "LOS RIOS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "SAN LUIS SHOPPING",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "SAN MIGUEL DE BOLIVAR",
            "tipo": "AGENCIA",
            "region": "REGION CENTRO",
            "provincia": "BOLÍVAR"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "SAN RAFAEL",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "SANTA ISABEL",
            "tipo": "AGENCIA",
            "region": "REGION SUR",
            "provincia": "AZUAY"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "SANTA MARTHA",
            "tipo": "AGENCIA",
            "region": "REGION CENTRO",
            "provincia": "SANTO DOMINGO DE LOS TSaCHILAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "SANTA ROSA",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "EL ORO"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "SANTO DOMINGO",
            "tipo": "AGENCIA",
            "region": "REGION CENTRO",
            "provincia": "SANTO DOMINGO DE LOS TSaCHILAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "SHOPPING DURÁN",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "SHUSHUFINDI",
            "tipo": "AGENCIA",
            "region": "REGION CENTRO",
            "provincia": "SUCUMBIOS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "SUR AMBATO",
            "tipo": "AGENCIA",
            "region": "REGION CENTRO",
            "provincia": "TUNGURAHUA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "TARQUI",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "MANABI"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "TENA",
            "tipo": "AGENCIA",
            "region": "REGION CENTRO",
            "provincia": "NAPO"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "TORRES PICHINCHA",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "TORRES PICHINCHA",
            "tipo": "PUNTO INTERNO",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "TOSAGUA",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "MANABI"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "TOTORACOCHA",
            "tipo": "AGENCIA",
            "region": "REGION SUR",
            "provincia": "AZUAY"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "TSACHILAS",
            "tipo": "AGENCIA",
            "region": "REGION CENTRO",
            "provincia": "SANTO DOMINGO DE LOS TSaCHILAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "TULCAN",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "CARCHI"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "TUMBACO",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "UNIVERSIDAD CATÓLICA GUAYAQUIL",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "URDESA",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "VALENCIA",
            "tipo": "SOPORTE COMERCIAL",
            "region": "REGION COSTA",
            "provincia": "LOS RIOS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "VENTANAS",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "LOS RIOS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "VÍA A LA COSTA",
            "tipo": "CENTRO DE NEGOCIOS",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "VILLAFLORA",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "VINCES",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "MANABI"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "YANTZAZA",
            "tipo": "AGENCIA",
            "region": "REGION SUR",
            "provincia": "ZAMORA CHINCHIPE"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "ZAMORA",
            "tipo": "AGENCIA",
            "region": "REGION SUR",
            "provincia": "ZAMORA CHINCHIPE"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "ZARACAY",
            "tipo": "AGENCIA",
            "region": "REGION CENTRO",
            "provincia": "SANTO DOMINGO DE LOS TSaCHILAS"
      },
      {
            "id": "",
            "empresa": "Banco Pichincha",
            "agencia": "ZARUMA",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "EL ORO"
      },
      {
            "id": "",
            "empresa": "Banco General Rumiñahui",
            "agencia": "CASA MATRIZ - QUITO",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco General Rumiñahui",
            "agencia": "PRENSA",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco General Rumiñahui",
            "agencia": "HOSPITAL MILITAR",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco General Rumiñahui",
            "agencia": "LA RECOLECTA",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco General Rumiñahui",
            "agencia": "EL CONDADO",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco General Rumiñahui",
            "agencia": "SUR UIO",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco General Rumiñahui",
            "agencia": "ATAHUALPA",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco General Rumiñahui",
            "agencia": "ESPE",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "PICHINCHA"
      },
      {
            "id": "",
            "empresa": "Banco General Rumiñahui",
            "agencia": "IBARRA",
            "tipo": "AGENCIA",
            "region": "REGION NORTE",
            "provincia": "IMBABURA"
      },
      {
            "id": "",
            "empresa": "Banco General Rumiñahui",
            "agencia": "SANTO DOMINGO",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "SANTO DOMINGO DE LOS TSaCHILAS"
      },
      {
            "id": "",
            "empresa": "Banco General Rumiñahui",
            "agencia": "LATACUNGA",
            "tipo": "AGENCIA",
            "region": "REGION CENTRO",
            "provincia": "COTOPAXI"
      },
      {
            "id": "",
            "empresa": "Banco General Rumiñahui",
            "agencia": "RIOBAMBA",
            "tipo": "AGENCIA",
            "region": "REGION CENTRO",
            "provincia": "CHIMBORAZO"
      },
      {
            "id": "",
            "empresa": "Banco General Rumiñahui",
            "agencia": "ESMERALDAS",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "ESMERALDAS"
      },
      {
            "id": "",
            "empresa": "Banco General Rumiñahui",
            "agencia": "MANTA",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "MANABI"
      },
      {
            "id": "",
            "empresa": "Banco General Rumiñahui",
            "agencia": "FUERTE HUANCAVILCA",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco General Rumiñahui",
            "agencia": "FAE ATARAZANA",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco General Rumiñahui",
            "agencia": "SUCURSAL MAYOR",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco General Rumiñahui",
            "agencia": "PRIMERA ZONA NAVAL",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco General Rumiñahui",
            "agencia": "BASE NAVAL SUR",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "GUAYAS"
      },
      {
            "id": "",
            "empresa": "Banco General Rumiñahui",
            "agencia": "CUENCA",
            "tipo": "AGENCIA",
            "region": "REGION SUR",
            "provincia": "AZUAY"
      },
      {
            "id": "",
            "empresa": "Banco General Rumiñahui",
            "agencia": "SALINAS",
            "tipo": "AGENCIA",
            "region": "REGION COSTA",
            "provincia": "SANTA ELENA"
      },
      {
            "id": "",
            "empresa": "Banco General Rumiñahui",
            "agencia": "MACHALA",
            "tipo": "AGENCIA",
            "region": "REGION SUR",
            "provincia": "EL ORO"
      },
      {
            "id": "",
            "empresa": "Banco General Rumiñahui",
            "agencia": "LOJA",
            "tipo": "AGENCIA",
            "region": "REGION SUR",
            "provincia": "LOJA"
      }
]).filter(item => {
      const name = typeof item === 'string' ? item : (item.agencia || '');
      return !name.includes('personal/cristian_castro_akroscorp_com/Lists/AGENCIAS');
    });

    // 2. Catálogo Completo de 60 Técnicos (Excluyendo totalmente a 'Cristian Castro')
    this.techniciansCatalog = (options.techniciansCatalog || [
      "Alex Macas",
      "Andrés Cedeño",
      "Andrés Rodriguez",
      "Angel Villa",
      "Angelo Fuentes",
      "Antonio Jurado",
      "Axel Tamayo",
      "Byron Castro",
      "Carlos Calderon",
      "Christian Garcia",
      "Cristian Artos",
      "Cristian Quillupangui",
      "Cristian Tene",
      "Cristofer Tene",
      "Dennis Almeida",
      "Diego Lopez",
      "Donal Campaña",
      "Dorian Herrera",
      "Eddy Borrero",
      "Erick Zuleta",
      "Erika Rendón",
      "Fabian Cabrera",
      "Fabian Fajardo",
      "Fabian Gonzalez",
      "Fernando Caicedo",
      "Fernando Rodriguez",
      "Francis Romero",
      "Franklin Tamayo",
      "Gonzalo Llugcha",
      "Guido Molina",
      "Jairo Lomas",
      "Jaleni Ocampo",
      "Jaqueline Jacome",
      "Jefferson Minalla",
      "Jeremy Navia",
      "Jhon Valencia",
      "Jhonny Carpio",
      "Jonathan Lema",
      "Jordy Rea",
      "Jorge Chilan",
      "Jorge Menendez",
      "Jose Padilla",
      "José Alejandro Osorio",
      "Juan Chabla",
      "Juan Cordova",
      "Juan Fernando Cordova",
      "Juan Pablo Quichimbo",
      "Katherine Caza",
      "Kevin Arias",
      "Lenin Villarreal",
      "Lucia Paladines",
      "Luis Cuenca",
      "Luis Garcia",
      "Marco Vargas",
      "Marlene Morocho",
      "Marlon Caiza",
      "Michael Valencia",
      "Naomi Piguave",
      "Ramiro Astudillo",
      "Roberto Sevilla"
]).filter(
      tech => tech.toLowerCase() !== 'cristian castro'
    );

    this.bottleneckThreshold = options.bottleneckThreshold || 3;
    this.noisePattern = /personal\/cristian_castro_akroscorp_com\/Lists\/AGENCIAS/gi;
  }

  /**
   * 1. Extracción Enfocada en Confirmaciones Verdes (Salientes)
   */
  extractDataFromMessages(messagesList = [], lastProcessedTimestamp = null) {
    const extractedData = [];
    let latestTimestampFound = lastProcessedTimestamp;

    const ticketRegex = /(?:AKR-RQ-\d+|TK-\d+|TKT-\d+|SOP-\d+|ticket\s*#?\s*\d+)/gi;
    
    // Frases explícitas de confirmación y asignación de soporte en WhatsApp Web
    const techExplicitRegex = /(?:se confirma asistencia de|se confirma atenci[oó]n de|se coordina atenci[oó]n con|se coordina con|coordinado con|atendido por|asignado a|se env[ií]a a|se remite a|t[eé]cnico|soporte|atiende|resp|revisado por|ingeniero|atenci[oó]n):\s*([A-ZÁÉÍÓÚÑa-záéíóúñ\s]{3,35})/i;
    const mentionTechRegex = /@([A-ZÁÉÍÓÚÑa-záéíóúñ\s]{3,30})/i;
    const agencyExplicitRegex = /(?:agencia|ubicaci[oó]n|sucursal|zona|ciudad):\s*([A-ZÁÉÍÓÚÑa-záéíóúñ\s]{3,25})/i;

    messagesList.forEach((rawMsg, index) => {
      let text = '';
      let sender = 'Usuario WhatsApp';
      let timestamp = new Date().toISOString();
      let isOutgoing = false;

      if (typeof rawMsg === 'string') {
        text = rawMsg;
        const senderMatch = rawMsg.match(/^([^:]+):\s*(.+)$/);
        if (senderMatch) {
          sender = senderMatch[1].trim();
          text = senderMatch[2].trim();
          if (sender.toLowerCase().includes('yo') || sender.toLowerCase().includes('saliente')) {
            isOutgoing = true;
          }
        }
      } else if (typeof rawMsg === 'object' && rawMsg !== null) {
        text = rawMsg.text || rawMsg.description || rawMsg.replyText || '';
        sender = rawMsg.senderName || rawMsg.sender || 'Usuario WhatsApp';
        timestamp = rawMsg.timestamp || new Date().toISOString();
        isOutgoing = !!(rawMsg.isOutgoing || sender.toLowerCase().includes('yo') || sender.toLowerCase().includes('saliente'));
      }

      if (!text) return;

      // Filtro de Marca de Tiempo (Evitar reprocesar historial previo)
      if (lastProcessedTimestamp && timestamp <= lastProcessedTimestamp) {
        return;
      }

      if (!latestTimestampFound || timestamp > latestTimestampFound) {
        latestTimestampFound = timestamp;
      }

      // Descarte de ruido de SharePoint
      if (text.trim() === 'personal/cristian_castro_akroscorp_com/Lists/AGENCIAS') {
        return;
      }
      if (this.noisePattern.test(text)) {
        text = text.replace(this.noisePattern, '').trim();
      }
      if (!text) return;

      // A) Código de Ticket
      const ticketMatches = text.match(ticketRegex);
      const ticketCode = ticketMatches ? ticketMatches[0].toUpperCase() : null;

      // B) Agencia pareada con las 235 agencias
      let officialAgencyFound = null;
      let chatMentionedName = null;
      let regionFound = 'N/A';
      let provinciaFound = '';
      
      const explicitAgencyMatch = text.match(agencyExplicitRegex);
      if (explicitAgencyMatch && explicitAgencyMatch[1]) {
        chatMentionedName = explicitAgencyMatch[1].trim();
        if (!chatMentionedName.includes('personal/cristian_castro_akroscorp_com/Lists/AGENCIAS')) {
          officialAgencyFound = chatMentionedName;
          const matchObj = this.agenciesCatalog.find(item => 
            item.agencia.toLowerCase() === chatMentionedName.toLowerCase() ||
            item.agencia.toLowerCase().includes(chatMentionedName.toLowerCase())
          );
          if (matchObj) {
            officialAgencyFound = matchObj.agencia;
            regionFound = matchObj.region || 'N/A';
            provinciaFound = matchObj.provincia || '';
          }
        }
      } else {
        for (const item of this.agenciesCatalog) {
          const agName = item.agencia;
          if (agName.includes('personal/cristian_castro_akroscorp_com/Lists/AGENCIAS')) continue;
          
          const regex = new RegExp(`\\b${this.escapeRegExp(agName)}\\b`, 'i');
          if (regex.test(text)) {
            officialAgencyFound = agName;
            chatMentionedName = agName;
            regionFound = item.region || 'N/A';
            provinciaFound = item.provincia || '';
            break;
          }
        }
      }

      // C) Técnico pareado con Certeza Absoluta en Mensajes Salientes Verdes
      let techFound = null;
      
      // C.1) Búsqueda directa en catálogo de 60 técnicos
      for (const tech of this.techniciansCatalog) {
        if (tech.toLowerCase() === 'cristian castro') continue;
        
        const regex = new RegExp(`\\b${this.escapeRegExp(tech)}\\b`, 'i');
        if (regex.test(text)) {
          techFound = tech;
          break;
        }
      }

      // C.2) Frase de confirmación o asignación explícita
      if (!techFound) {
        const explicitTechMatch = text.match(techExplicitRegex) || text.match(mentionTechRegex);
        if (explicitTechMatch && explicitTechMatch[1]) {
          const candidateTech = explicitTechMatch[1].trim();
          if (candidateTech.toLowerCase() !== 'cristian castro') {
            const catalogMatch = this.techniciansCatalog.find(t => 
              t.toLowerCase().includes(candidateTech.toLowerCase()) || 
              candidateTech.toLowerCase().includes(t.toLowerCase())
            );
            techFound = catalogMatch || candidateTech;
          }
        }
      }

      if (techFound && techFound.toLowerCase() === 'cristian castro') {
        techFound = null;
      }

      if (ticketCode || officialAgencyFound || techFound) {
        extractedData.push({
          id: `EXT-${index}-${Date.now()}`,
          ticketCode: ticketCode || 'Soporte Sin Código',
          agency: officialAgencyFound || 'Sin Ubicación Especificada',
          chatMention: chatMentionedName || officialAgencyFound || 'Sin mención explícita',
          region: regionFound,
          provincia: provinciaFound,
          technician: techFound || 'Por Asignar / No Mencionado',
          isOutgoing: isOutgoing,
          isConfirmedByOutgoing: isOutgoing && !!techFound,
          weight: isOutgoing ? 10 : 1, // Ponderación de certeza a globos verdes de confirmación
          sender: sender,
          fullText: text,
          timestamp: timestamp
        });
      }
    });

    return {
      extractedData: extractedData,
      latestTimestamp: latestTimestampFound
    };
  }

  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * 2. Conteo de Recurrencia (Técnico por Agencia) y Niveles de Alerta
   */
  generateStrategicReport(extractedData = [], selectedRegion = 'TODAS') {
    const agencyGroups = {};
    const techPerformance = {};

    extractedData.forEach(item => {
      let agencyKey = item.agency;
      let techKey = item.technician;
      let regionKey = item.region !== 'N/A' ? item.region : 'OTRAS REGIONES';

      if (selectedRegion && selectedRegion !== 'TODAS' && regionKey.toUpperCase() !== selectedRegion.toUpperCase()) {
        return;
      }

      if (agencyKey.includes('personal/cristian_castro_akroscorp_com/Lists/AGENCIAS')) {
        return;
      }

      if (techKey && techKey.toLowerCase() === 'cristian castro') {
        techKey = 'Por Asignar / No Mencionado';
      }

      if (!agencyGroups[agencyKey]) {
        agencyGroups[agencyKey] = {
          agencyName: agencyKey,
          chatMentionName: item.chatMention,
          regionName: regionKey,
          provinciaName: item.provincia || '',
          totalSupports: 0,
          techniciansMap: {},
          confirmedByOutgoingCount: 0,
          ticketsList: [],
          frequentTech: 'Por Asignar',
          bottleneckLevel: 'Normal'
        };
      }

      agencyGroups[agencyKey].totalSupports++;
      agencyGroups[agencyKey].ticketsList.push(item);

      if (item.isConfirmedByOutgoing) {
        agencyGroups[agencyKey].confirmedByOutgoingCount++;
      }

      if (techKey !== 'Por Asignar / No Mencionado' && techKey.toLowerCase() !== 'cristian castro') {
        const addWeight = item.weight || 1;
        agencyGroups[agencyKey].techniciansMap[techKey] = (agencyGroups[agencyKey].techniciansMap[techKey] || 0) + addWeight;
        techPerformance[techKey] = (techPerformance[techKey] || 0) + addWeight;
      }
    });

    // 3. Conteo de Recurrencia y Umbrales
    const consolidatedReport = Object.values(agencyGroups).map(group => {
      let maxCount = 0;
      let frequentTech = 'Por Asignar';

      for (const [tech, count] of Object.entries(group.techniciansMap)) {
        if (tech.toLowerCase() === 'cristian castro') continue;
        if (count > maxCount) {
          maxCount = count;
          frequentTech = tech;
        }
      }
      group.frequentTech = frequentTech;

      // Umbrales de Recurrencia por Agencia
      if (group.totalSupports >= this.bottleneckThreshold * 2) {
        group.bottleneckLevel = 'Critico (Proceso Repetido)';
        group.statusBadgeClass = 'badge-critical';
      } else if (group.totalSupports >= this.bottleneckThreshold) {
        group.bottleneckLevel = 'Alerta Operativa';
        group.statusBadgeClass = 'badge-warning';
      } else {
        group.bottleneckLevel = 'Normal';
        group.statusBadgeClass = 'badge-normal';
      }

      return group;
    });

    let topNationalTech = 'N/A';
    let maxNationalSupports = 0;
    for (const [tech, count] of Object.entries(techPerformance)) {
      if (tech.toLowerCase() === 'cristian castro') continue;
      if (count > maxNationalSupports) {
        maxNationalSupports = count;
        topNationalTech = tech;
      }
    }

    consolidatedReport.sort((a, b) => b.totalSupports - a.totalSupports);

    return {
      summaryMetrics: {
        totalExtractedCount: extractedData.length,
        affectedAgenciesCount: consolidatedReport.length,
        bottlenecksCount: consolidatedReport.filter(r => r.bottleneckLevel !== 'Normal').length,
        topNationalTech: topNationalTech,
        topNationalSupports: maxNationalSupports
      },
      reportRows: consolidatedReport
    };
  }

  getMockData() {
    return [
      { senderName: "Agencia Milagro", text: "Reporte de fallo en punto de venta AKR-RQ-4569 en agencia MILAGRO.", isOutgoing: false },
      { senderName: "Yo (Mensaje Saliente)", text: "Se confirma asistencia de Jose Padilla en agencia MILAGRO para ticket AKR-RQ-4569", isOutgoing: true },
      { senderName: "Agencia Otavalo", text: "Problema con enlace e impresora fiscal AKR-RQ-4598 en OTAVALO.", isOutgoing: false },
      { senderName: "Yo (Mensaje Saliente)", text: "Se confirma atencion de Juan Fernando Cordova en OTAVALO ticket AKR-RQ-4598", isOutgoing: true },
      { senderName: "Yo (Mensaje Saliente)", text: "Se confirma asistencia de Jose Padilla en EL CARMEN ticket AKR-RQ-4711", isOutgoing: true },
      { senderName: "Yo (Mensaje Saliente)", text: "Se coordina atencion con Byron Castro para ZAMORA ticket AKR-RQ-4707", isOutgoing: true },
      { senderName: "Yo (Mensaje Saliente)", text: "Se confirma atencion de Byron Castro en ATUNTAQUI ticket AKR-RQ-4723", isOutgoing: true }
    ];
  }
}

if (typeof window !== 'undefined') {
  window.WhatsAppAnalyticsEngine = WhatsAppAnalyticsEngine;
}
