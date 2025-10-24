import { rappelConfig } from "@/data/commissionCatalog";

export type LeadStatus = "nuevo" | "contactado" | "en_negociacion" | "cerrado" | "perdido";

export type Lead = {
  id: string;
  nombre: string;
  empresa: string;
  planInteresado: string;
  estado: LeadStatus;
  valorMensualPotencial: number;
  ultimaInteraccion: string;
  proximaAccion: string;
  prioridad: "alta" | "media" | "baja";
};

export type Tarea = {
  id: string;
  titulo: string;
  vencimiento: string;
  tipo: "llamada" | "email" | "demo" | "reunion";
  estado: "pendiente" | "completada";
};

export type ObjetivoMensual = {
  mes: string;
  objetivoIngresos: number;
  ingresosAlcanzados: number;
  clientesNuevosObjetivo: number;
  clientesNuevos: number;
};

export type Venta = {
  id: string;
  fecha: string;
  productoId: string;
  altas: number;
  portas: number;
};

export type Trabajador = {
  id: string;
  usuario: string;
  clave: string;
  nombre: string;
  email: string;
  rol: string;
  equipo: "Empresas" | "Residencial" | "Partners";
  especialidades: string[];
  leads: Lead[];
  tareas: Tarea[];
  objetivos: ObjetivoMensual[];
  ventas: Venta[];
  rendimiento: {
    conversion: number;
    clientesActivos: number;
    ticketsPromedio: number;
    tiempoRespuestaPromedio: number;
  };
  automatizaciones: string[];
};

export type ClienteClave = {
  id: string;
  nombre: string;
  industria: string;
  ingresosMensuales: number;
  nivelSatisfaccion: number;
  ultimoContacto: string;
  responsable: string;
};

export type IndicadoresGlobales = {
  ingresosMensuales: number;
  conversionGeneral: number;
  churnRate: number;
  clientesActivos: number;
  pipelineValor: number;
  forecast90dias: number;
  totalComisiones: number;
  totalOperaciones: number;
};

export type RecomendacionIA = {
  id: string;
  titulo: string;
  descripcion: string;
  impacto: "alto" | "medio" | "bajo";
  responsable: string;
  categoria: "automatizacion" | "retencion" | "cross-selling" | "productividad";
};

export type CRMData = {
  indicadores: IndicadoresGlobales;
  clientesClave: ClienteClave[];
  trabajadores: Trabajador[];
  recomendaciones: RecomendacionIA[];
  rappel: typeof rappelConfig;
};

export const crmData: CRMData = {
  indicadores: {
    ingresosMensuales: 96850,
    conversionGeneral: 0.38,
    churnRate: 0.035,
    clientesActivos: 482,
    pipelineValor: 283900,
    forecast90dias: 356400,
    totalComisiones: 21480,
    totalOperaciones: 326,
  },
  rappel: rappelConfig,
  clientesClave: [
    {
      id: "c1",
      nombre: "Residencial Premium Norte",
      industria: "Residencial",
      ingresosMensuales: 5600,
      nivelSatisfaccion: 4.7,
      ultimoContacto: "2025-01-18",
      responsable: "Comercial 01",
    },
    {
      id: "c2",
      nombre: "Coworking Nexus",
      industria: "Empresas",
      ingresosMensuales: 7200,
      nivelSatisfaccion: 4.4,
      ultimoContacto: "2025-01-22",
      responsable: "Comercial 02",
    },
    {
      id: "c3",
      nombre: "Residencial Urbania",
      industria: "Residencial",
      ingresosMensuales: 4350,
      nivelSatisfaccion: 4.9,
      ultimoContacto: "2025-01-19",
      responsable: "Comercial 03",
    },
  ],
  trabajadores: [
    {
      id: "comercial-01",
      usuario: "comercial01",
      clave: "comercial01",
      nombre: "Comercial 01",
      email: "comercial01@fibranet.io",
      rol: "Ejecutivo Comercial Senior",
      equipo: "Empresas",
      especialidades: ["Portabilidades móviles", "Ventas consultivas B2B", "Fidelización"],
      leads: [
        {
          id: "l-c01-01",
          nombre: "Servicios GlobalNet",
          empresa: "GlobalNet",
          planInteresado: "Fibra 1GB + Móvil ilimitado",
          estado: "en_negociacion",
          valorMensualPotencial: 420,
          ultimaInteraccion: "2025-01-15",
          proximaAccion: "Revisión de contrato con legal",
          prioridad: "alta",
        },
        {
          id: "l-c01-02",
          nombre: "Consultora DataWise",
          empresa: "DataWise",
          planInteresado: "Solo Móvil SL 5G 30GB",
          estado: "contactado",
          valorMensualPotencial: 180,
          ultimaInteraccion: "2025-01-20",
          proximaAccion: "Agendar demo de portal",
          prioridad: "media",
        },
      ],
      tareas: [
        {
          id: "t-c01-01",
          titulo: "Negociar cláusula de permanencia GlobalNet",
          vencimiento: "2025-01-25",
          tipo: "reunion",
          estado: "pendiente",
        },
        {
          id: "t-c01-02",
          titulo: "Llamada de seguimiento DataWise",
          vencimiento: "2025-01-23",
          tipo: "llamada",
          estado: "pendiente",
        },
      ],
      objetivos: [
        {
          mes: "Enero",
          objetivoIngresos: 32000,
          ingresosAlcanzados: 24800,
          clientesNuevosObjetivo: 18,
          clientesNuevos: 12,
        },
        {
          mes: "Febrero",
          objetivoIngresos: 34000,
          ingresosAlcanzados: 9100,
          clientesNuevosObjetivo: 19,
          clientesNuevos: 5,
        },
      ],
      ventas: [
        { id: "v-c01-01", fecha: "2025-01-05", productoId: "simyo-pos-80gb-ilim", altas: 2, portas: 1 },
        { id: "v-c01-02", fecha: "2025-01-12", productoId: "jazztel-fijo-1g", altas: 1, portas: 1 },
        { id: "v-c01-03", fecha: "2025-01-19", productoId: "jazztel-mov-ilim", altas: 0, portas: 2 },
      ],
      rendimiento: {
        conversion: 0.46,
        clientesActivos: 64,
        ticketsPromedio: 510,
        tiempoRespuestaPromedio: 38,
      },
      automatizaciones: [
        "Secuencia de emails con IA para propuestas personalizadas",
        "Prioridad automática basada en intención de compra",
      ],
    },
    {
      id: "comercial-02",
      usuario: "comercial02",
      clave: "comercial02",
      nombre: "Comercial 02",
      email: "comercial02@fibranet.io",
      rol: "Ejecutivo Comercial",
      equipo: "Residencial",
      especialidades: ["Bundles fibra + móvil", "Experiencia cliente", "Upselling"],
      leads: [
        {
          id: "l-c02-01",
          nombre: "Comunidad Jardines",
          empresa: "Residencial Jardines",
          planInteresado: "Fibra 600MB",
          estado: "nuevo",
          valorMensualPotencial: 210,
          ultimaInteraccion: "2025-01-18",
          proximaAccion: "Programar visita técnica",
          prioridad: "alta",
        },
        {
          id: "l-c02-02",
          nombre: "Asociación Río Verde",
          empresa: "Río Verde",
          planInteresado: "Fibra 1GB",
          estado: "contactado",
          valorMensualPotencial: 260,
          ultimaInteraccion: "2025-01-17",
          proximaAccion: "Enviar propuesta económica",
          prioridad: "alta",
        },
      ],
      tareas: [
        {
          id: "t-c02-01",
          titulo: "Enviar simulación de ahorro Río Verde",
          vencimiento: "2025-01-24",
          tipo: "email",
          estado: "pendiente",
        },
        {
          id: "t-c02-02",
          titulo: "Agendar instalación piloto Jardines",
          vencimiento: "2025-01-27",
          tipo: "reunion",
          estado: "pendiente",
        },
      ],
      objetivos: [
        {
          mes: "Enero",
          objetivoIngresos: 24500,
          ingresosAlcanzados: 19850,
          clientesNuevosObjetivo: 22,
          clientesNuevos: 15,
        },
        {
          mes: "Febrero",
          objetivoIngresos: 26000,
          ingresosAlcanzados: 6800,
          clientesNuevosObjetivo: 24,
          clientesNuevos: 6,
        },
      ],
      ventas: [
        { id: "v-c02-01", fecha: "2025-01-04", productoId: "simyo-fibra-600", altas: 3, portas: 0 },
        { id: "v-c02-02", fecha: "2025-01-11", productoId: "simyo-add-18gb", altas: 4, portas: 1 },
        { id: "v-c02-03", fecha: "2025-01-16", productoId: "jazztel-mov-40", altas: 1, portas: 2 },
      ],
      rendimiento: {
        conversion: 0.39,
        clientesActivos: 58,
        ticketsPromedio: 310,
        tiempoRespuestaPromedio: 42,
      },
      automatizaciones: [
        "Alertas de consumo con IA",
        "Campañas de retención para clientes en riesgo",
      ],
    },
    {
      id: "comercial-03",
      usuario: "comercial03",
      clave: "comercial03",
      nombre: "Comercial 03",
      email: "comercial03@fibranet.io",
      rol: "Ejecutivo Comercial",
      equipo: "Partners",
      especialidades: ["Canal indirecto", "Onboarding express", "Integraciones"],
      leads: [
        {
          id: "l-c03-01",
          nombre: "Distribuidor NetPlus",
          empresa: "NetPlus",
          planInteresado: "Sin Límites 60 GB",
          estado: "en_negociacion",
          valorMensualPotencial: 350,
          ultimaInteraccion: "2025-01-19",
          proximaAccion: "Cierre de condiciones comerciales",
          prioridad: "alta",
        },
        {
          id: "l-c03-02",
          nombre: "Proveedor LocalWave",
          empresa: "LocalWave",
          planInteresado: "Fibra 1GB",
          estado: "contactado",
          valorMensualPotencial: 270,
          ultimaInteraccion: "2025-01-21",
          proximaAccion: "Enviar kit de bienvenida",
          prioridad: "media",
        },
      ],
      tareas: [
        {
          id: "t-c03-01",
          titulo: "Actualizar portal de partners NetPlus",
          vencimiento: "2025-01-26",
          tipo: "demo",
          estado: "pendiente",
        },
        {
          id: "t-c03-02",
          titulo: "Revisión de acuerdos LocalWave",
          vencimiento: "2025-01-29",
          tipo: "reunion",
          estado: "pendiente",
        },
      ],
      objetivos: [
        {
          mes: "Enero",
          objetivoIngresos: 22800,
          ingresosAlcanzados: 17650,
          clientesNuevosObjetivo: 16,
          clientesNuevos: 11,
        },
        {
          mes: "Febrero",
          objetivoIngresos: 24000,
          ingresosAlcanzados: 7200,
          clientesNuevosObjetivo: 17,
          clientesNuevos: 5,
        },
      ],
      ventas: [
        { id: "v-c03-01", fecha: "2025-01-03", productoId: "jazztel-mov-60", altas: 2, portas: 3 },
        { id: "v-c03-02", fecha: "2025-01-09", productoId: "simyo-pos-40gb-ilim", altas: 1, portas: 1 },
        { id: "v-c03-03", fecha: "2025-01-18", productoId: "simyo-add-80gb", altas: 2, portas: 0 },
      ],
      rendimiento: {
        conversion: 0.33,
        clientesActivos: 44,
        ticketsPromedio: 280,
        tiempoRespuestaPromedio: 55,
      },
      automatizaciones: [
        "Asignación automática de leads por potencial",
        "Recordatorios inteligentes de portabilidades",
      ],
    },
    {
      id: "comercial-04",
      usuario: "comercial04",
      clave: "comercial04",
      nombre: "Comercial 04",
      email: "comercial04@fibranet.io",
      rol: "Ejecutivo Comercial Senior",
      equipo: "Empresas",
      especialidades: ["Grandes cuentas", "Redes privadas", "Sinergias TI"],
      leads: [
        {
          id: "l-c04-01",
          nombre: "Industria TecnoWave",
          empresa: "TecnoWave",
          planInteresado: "Fibra 1GB + Líneas ilimitadas",
          estado: "en_negociacion",
          valorMensualPotencial: 610,
          ultimaInteraccion: "2025-01-20",
          proximaAccion: "Presentación comité compras",
          prioridad: "alta",
        },
        {
          id: "l-c04-02",
          nombre: "Logística Veloce",
          empresa: "Veloce",
          planInteresado: "Sin Límites 100 GB",
          estado: "contactado",
          valorMensualPotencial: 320,
          ultimaInteraccion: "2025-01-18",
          proximaAccion: "Demo de control de consumo",
          prioridad: "media",
        },
      ],
      tareas: [
        {
          id: "t-c04-01",
          titulo: "Preparar propuesta económica TecnoWave",
          vencimiento: "2025-01-26",
          tipo: "email",
          estado: "pendiente",
        },
        {
          id: "t-c04-02",
          titulo: "Coordinar demo logística Veloce",
          vencimiento: "2025-01-28",
          tipo: "demo",
          estado: "pendiente",
        },
      ],
      objetivos: [
        {
          mes: "Enero",
          objetivoIngresos: 36000,
          ingresosAlcanzados: 28900,
          clientesNuevosObjetivo: 20,
          clientesNuevos: 13,
        },
        {
          mes: "Febrero",
          objetivoIngresos: 38000,
          ingresosAlcanzados: 10200,
          clientesNuevosObjetivo: 21,
          clientesNuevos: 6,
        },
      ],
      ventas: [
        { id: "v-c04-01", fecha: "2025-01-06", productoId: "jazztel-mov-100", altas: 1, portas: 4 },
        { id: "v-c04-02", fecha: "2025-01-14", productoId: "jazztel-fijo-600", altas: 2, portas: 1 },
        { id: "v-c04-03", fecha: "2025-01-21", productoId: "simyo-pos-200gb-ilim", altas: 1, portas: 1 },
      ],
      rendimiento: {
        conversion: 0.41,
        clientesActivos: 71,
        ticketsPromedio: 540,
        tiempoRespuestaPromedio: 36,
      },
      automatizaciones: [
        "Análisis predictivo de bajas",
        "Recomendaciones automáticas de terminales",
      ],
    },
    {
      id: "comercial-05",
      usuario: "comercial05",
      clave: "comercial05",
      nombre: "Comercial 05",
      email: "comercial05@fibranet.io",
      rol: "Ejecutivo Comercial",
      equipo: "Residencial",
      especialidades: ["Ventas cruzadas", "Seguimiento multicanal", "Experiencia premium"],
      leads: [
        {
          id: "l-c05-01",
          nombre: "Urbanización Costa Azul",
          empresa: "Costa Azul",
          planInteresado: "Fibra 1GB",
          estado: "en_negociacion",
          valorMensualPotencial: 390,
          ultimaInteraccion: "2025-01-17",
          proximaAccion: "Visita comercial y propuesta",
          prioridad: "alta",
        },
        {
          id: "l-c05-02",
          nombre: "Residencial Cima",
          empresa: "Cima",
          planInteresado: "Fibra 600MB",
          estado: "nuevo",
          valorMensualPotencial: 240,
          ultimaInteraccion: "2025-01-16",
          proximaAccion: "Contactar administrador",
          prioridad: "media",
        },
      ],
      tareas: [
        {
          id: "t-c05-01",
          titulo: "Enviar simulación de ahorro Costa Azul",
          vencimiento: "2025-01-24",
          tipo: "email",
          estado: "pendiente",
        },
        {
          id: "t-c05-02",
          titulo: "Confirmar agenda Residencial Cima",
          vencimiento: "2025-01-27",
          tipo: "llamada",
          estado: "pendiente",
        },
      ],
      objetivos: [
        {
          mes: "Enero",
          objetivoIngresos: 25200,
          ingresosAlcanzados: 19820,
          clientesNuevosObjetivo: 18,
          clientesNuevos: 12,
        },
        {
          mes: "Febrero",
          objetivoIngresos: 26800,
          ingresosAlcanzados: 7400,
          clientesNuevosObjetivo: 19,
          clientesNuevos: 5,
        },
      ],
      ventas: [
        { id: "v-c05-01", fecha: "2025-01-08", productoId: "simyo-fibra-1g", altas: 2, portas: 1 },
        { id: "v-c05-02", fecha: "2025-01-15", productoId: "simyo-add-40gb", altas: 3, portas: 0 },
        { id: "v-c05-03", fecha: "2025-01-22", productoId: "jazztel-mov-24", altas: 1, portas: 1 },
      ],
      rendimiento: {
        conversion: 0.37,
        clientesActivos: 52,
        ticketsPromedio: 320,
        tiempoRespuestaPromedio: 47,
      },
      automatizaciones: [
        "Secuencia de bienvenida personalizada",
        "Recomendaciones de upgrade automáticas",
      ],
    },
    {
      id: "comercial-06",
      usuario: "comercial06",
      clave: "comercial06",
      nombre: "Comercial 06",
      email: "comercial06@fibranet.io",
      rol: "Ejecutivo Comercial",
      equipo: "Partners",
      especialidades: ["Captación canal", "Formación partners", "Soporte técnico"],
      leads: [
        {
          id: "l-c06-01",
          nombre: "Distribuidor FastLink",
          empresa: "FastLink",
          planInteresado: "Sin Límites 50 GB",
          estado: "en_negociacion",
          valorMensualPotencial: 310,
          ultimaInteraccion: "2025-01-18",
          proximaAccion: "Revisión de bonos de activación",
          prioridad: "alta",
        },
        {
          id: "l-c06-02",
          nombre: "Partner NorteRed",
          empresa: "NorteRed",
          planInteresado: "BAM",
          estado: "contactado",
          valorMensualPotencial: 180,
          ultimaInteraccion: "2025-01-20",
          proximaAccion: "Enviar documentación de onboarding",
          prioridad: "media",
        },
      ],
      tareas: [
        {
          id: "t-c06-01",
          titulo: "Formación comercial FastLink",
          vencimiento: "2025-01-25",
          tipo: "demo",
          estado: "pendiente",
        },
        {
          id: "t-c06-02",
          titulo: "Actualizar catálogo NorteRed",
          vencimiento: "2025-01-29",
          tipo: "email",
          estado: "pendiente",
        },
      ],
      objetivos: [
        {
          mes: "Enero",
          objetivoIngresos: 21800,
          ingresosAlcanzados: 16400,
          clientesNuevosObjetivo: 15,
          clientesNuevos: 10,
        },
        {
          mes: "Febrero",
          objetivoIngresos: 23200,
          ingresosAlcanzados: 6600,
          clientesNuevosObjetivo: 16,
          clientesNuevos: 4,
        },
      ],
      ventas: [
        { id: "v-c06-01", fecha: "2025-01-02", productoId: "jazztel-mov-50", altas: 1, portas: 3 },
        { id: "v-c06-02", fecha: "2025-01-10", productoId: "jazztel-fijo-bam", altas: 2, portas: 0 },
        { id: "v-c06-03", fecha: "2025-01-19", productoId: "simyo-add-200gb", altas: 1, portas: 1 },
      ],
      rendimiento: {
        conversion: 0.31,
        clientesActivos: 40,
        ticketsPromedio: 260,
        tiempoRespuestaPromedio: 58,
      },
      automatizaciones: [
        "Asignación automática de kits de marketing",
        "Alertas de stock de SIM",
      ],
    },
    {
      id: "comercial-07",
      usuario: "comercial07",
      clave: "comercial07",
      nombre: "Comercial 07",
      email: "comercial07@fibranet.io",
      rol: "Ejecutivo Comercial",
      equipo: "Empresas",
      especialidades: ["Integraciones cloud", "Monitorización", "Renovaciones"],
      leads: [
        {
          id: "l-c07-01",
          nombre: "Consultoría VisionTech",
          empresa: "VisionTech",
          planInteresado: "Sin Límites GB Ilimitados",
          estado: "en_negociacion",
          valorMensualPotencial: 480,
          ultimaInteraccion: "2025-01-19",
          proximaAccion: "Revisión de SLA",
          prioridad: "alta",
        },
        {
          id: "l-c07-02",
          nombre: "Startup NovaCloud",
          empresa: "NovaCloud",
          planInteresado: "Fibra 1GB",
          estado: "contactado",
          valorMensualPotencial: 260,
          ultimaInteraccion: "2025-01-18",
          proximaAccion: "Enviar caso de éxito",
          prioridad: "media",
        },
      ],
      tareas: [
        {
          id: "t-c07-01",
          titulo: "Actualizar propuesta VisionTech",
          vencimiento: "2025-01-24",
          tipo: "email",
          estado: "pendiente",
        },
        {
          id: "t-c07-02",
          titulo: "Coordinar demo técnica NovaCloud",
          vencimiento: "2025-01-28",
          tipo: "demo",
          estado: "pendiente",
        },
      ],
      objetivos: [
        {
          mes: "Enero",
          objetivoIngresos: 31000,
          ingresosAlcanzados: 24400,
          clientesNuevosObjetivo: 19,
          clientesNuevos: 13,
        },
        {
          mes: "Febrero",
          objetivoIngresos: 32500,
          ingresosAlcanzados: 8400,
          clientesNuevosObjetivo: 20,
          clientesNuevos: 5,
        },
      ],
      ventas: [
        { id: "v-c07-01", fecha: "2025-01-07", productoId: "jazztel-mov-ilim", altas: 1, portas: 2 },
        { id: "v-c07-02", fecha: "2025-01-13", productoId: "jazztel-fijo-1gred", altas: 2, portas: 0 },
        { id: "v-c07-03", fecha: "2025-01-20", productoId: "simyo-pos-200gb-120", altas: 1, portas: 1 },
      ],
      rendimiento: {
        conversion: 0.36,
        clientesActivos: 62,
        ticketsPromedio: 480,
        tiempoRespuestaPromedio: 41,
      },
      automatizaciones: [
        "Asignación inteligente de propuestas",
        "Alertas de renovación temprana",
      ],
    },
    {
      id: "comercial-08",
      usuario: "comercial08",
      clave: "comercial08",
      nombre: "Comercial 08",
      email: "comercial08@fibranet.io",
      rol: "Ejecutivo Comercial",
      equipo: "Residencial",
      especialidades: ["Retención", "Venta remota", "Segmentación inteligente"],
      leads: [
        {
          id: "l-c08-01",
          nombre: "Residencial Horizonte",
          empresa: "Horizonte",
          planInteresado: "Fibra 600MB",
          estado: "en_negociacion",
          valorMensualPotencial: 260,
          ultimaInteraccion: "2025-01-16",
          proximaAccion: "Enviar comparativa",
          prioridad: "alta",
        },
        {
          id: "l-c08-02",
          nombre: "Comunidad Valle Verde",
          empresa: "Valle Verde",
          planInteresado: "Sin Límites 20 GB",
          estado: "contactado",
          valorMensualPotencial: 180,
          ultimaInteraccion: "2025-01-17",
          proximaAccion: "Coordinar llamada informativa",
          prioridad: "media",
        },
      ],
      tareas: [
        {
          id: "t-c08-01",
          titulo: "Preparar mailing segmentado Valle Verde",
          vencimiento: "2025-01-23",
          tipo: "email",
          estado: "pendiente",
        },
        {
          id: "t-c08-02",
          titulo: "Programar visita Horizonte",
          vencimiento: "2025-01-27",
          tipo: "reunion",
          estado: "pendiente",
        },
      ],
      objetivos: [
        {
          mes: "Enero",
          objetivoIngresos: 23800,
          ingresosAlcanzados: 19200,
          clientesNuevosObjetivo: 17,
          clientesNuevos: 12,
        },
        {
          mes: "Febrero",
          objetivoIngresos: 25000,
          ingresosAlcanzados: 6100,
          clientesNuevosObjetivo: 18,
          clientesNuevos: 4,
        },
      ],
      ventas: [
        { id: "v-c08-01", fecha: "2025-01-05", productoId: "simyo-pos-40gb-0", altas: 2, portas: 1 },
        { id: "v-c08-02", fecha: "2025-01-12", productoId: "jazztel-mov-20", altas: 3, portas: 1 },
        { id: "v-c08-03", fecha: "2025-01-18", productoId: "simyo-add-4gb", altas: 5, portas: 0 },
      ],
      rendimiento: {
        conversion: 0.34,
        clientesActivos: 48,
        ticketsPromedio: 290,
        tiempoRespuestaPromedio: 50,
      },
      automatizaciones: [
        "Chatbots con IA para derivación de leads",
        "Campañas automáticas de retención",
      ],
    },
    {
      id: "comercial-09",
      usuario: "comercial09",
      clave: "comercial09",
      nombre: "Comercial 09",
      email: "comercial09@fibranet.io",
      rol: "Ejecutivo Comercial",
      equipo: "Partners",
      especialidades: ["Venta mayorista", "Gestión de cartera", "Onboarding express"],
      leads: [
        {
          id: "l-c09-01",
          nombre: "Mayorista CityCom",
          empresa: "CityCom",
          planInteresado: "Sin Límites 50 GB",
          estado: "en_negociacion",
          valorMensualPotencial: 340,
          ultimaInteraccion: "2025-01-18",
          proximaAccion: "Firmar contrato marco",
          prioridad: "alta",
        },
        {
          id: "l-c09-02",
          nombre: "Distribuidor NorteLink",
          empresa: "NorteLink",
          planInteresado: "Fibra 600MB",
          estado: "contactado",
          valorMensualPotencial: 230,
          ultimaInteraccion: "2025-01-20",
          proximaAccion: "Enviar material de lanzamiento",
          prioridad: "media",
        },
      ],
      tareas: [
        {
          id: "t-c09-01",
          titulo: "Preparar material comercial CityCom",
          vencimiento: "2025-01-25",
          tipo: "email",
          estado: "pendiente",
        },
        {
          id: "t-c09-02",
          titulo: "Reunión de seguimiento NorteLink",
          vencimiento: "2025-01-30",
          tipo: "reunion",
          estado: "pendiente",
        },
      ],
      objetivos: [
        {
          mes: "Enero",
          objetivoIngresos: 22400,
          ingresosAlcanzados: 17280,
          clientesNuevosObjetivo: 16,
          clientesNuevos: 10,
        },
        {
          mes: "Febrero",
          objetivoIngresos: 23600,
          ingresosAlcanzados: 6900,
          clientesNuevosObjetivo: 17,
          clientesNuevos: 4,
        },
      ],
      ventas: [
        { id: "v-c09-01", fecha: "2025-01-04", productoId: "jazztel-mov-50eco", altas: 1, portas: 2 },
        { id: "v-c09-02", fecha: "2025-01-11", productoId: "simyo-pos-18gb-120", altas: 3, portas: 1 },
        { id: "v-c09-03", fecha: "2025-01-19", productoId: "simyo-fibra-300", altas: 2, portas: 0 },
      ],
      rendimiento: {
        conversion: 0.32,
        clientesActivos: 46,
        ticketsPromedio: 275,
        tiempoRespuestaPromedio: 53,
      },
      automatizaciones: [
        "Asignación automática de leads según vertical",
        "Alertas de vencimiento de contratos",
      ],
    },
    {
      id: "comercial-10",
      usuario: "comercial10",
      clave: "comercial10",
      nombre: "Comercial 10",
      email: "comercial10@fibranet.io",
      rol: "Ejecutivo Comercial",
      equipo: "Empresas",
      especialidades: ["Cuentas estratégicas", "Bundles convergentes", "Gestión financiera"],
      leads: [
        {
          id: "l-c10-01",
          nombre: "Holding InnoCorp",
          empresa: "InnoCorp",
          planInteresado: "Fibra 1GB + GB Ilimitados",
          estado: "en_negociacion",
          valorMensualPotencial: 720,
          ultimaInteraccion: "2025-01-21",
          proximaAccion: "Revisión con comité financiero",
          prioridad: "alta",
        },
        {
          id: "l-c10-02",
          nombre: "Servicios Médicos Vital",
          empresa: "Vital",
          planInteresado: "Sin Límites 30 GB (adicional)",
          estado: "contactado",
          valorMensualPotencial: 280,
          ultimaInteraccion: "2025-01-19",
          proximaAccion: "Coordinar visita técnica",
          prioridad: "media",
        },
      ],
      tareas: [
        {
          id: "t-c10-01",
          titulo: "Preparar ROI para InnoCorp",
          vencimiento: "2025-01-27",
          tipo: "email",
          estado: "pendiente",
        },
        {
          id: "t-c10-02",
          titulo: "Enviar propuesta servicios Vital",
          vencimiento: "2025-01-30",
          tipo: "llamada",
          estado: "pendiente",
        },
      ],
      objetivos: [
        {
          mes: "Enero",
          objetivoIngresos: 37200,
          ingresosAlcanzados: 29800,
          clientesNuevosObjetivo: 21,
          clientesNuevos: 14,
        },
        {
          mes: "Febrero",
          objetivoIngresos: 39000,
          ingresosAlcanzados: 9400,
          clientesNuevosObjetivo: 22,
          clientesNuevos: 5,
        },
      ],
      ventas: [
        { id: "v-c10-01", fecha: "2025-01-06", productoId: "jazztel-mov-30ad", altas: 1, portas: 2 },
        { id: "v-c10-02", fecha: "2025-01-15", productoId: "simyo-pos-200gb-0", altas: 2, portas: 1 },
        { id: "v-c10-03", fecha: "2025-01-22", productoId: "jazztel-fijo-1g", altas: 1, portas: 1 },
      ],
      rendimiento: {
        conversion: 0.44,
        clientesActivos: 69,
        ticketsPromedio: 560,
        tiempoRespuestaPromedio: 34,
      },
      automatizaciones: [
        "Modelos predictivos de cierre",
        "Renovaciones programadas con IA",
      ],
    },
  ],
  recomendaciones: [
    {
      id: "r1",
      titulo: "Activar campaña de fidelización para clientes de alto valor",
      descripcion:
        "Segmenta automáticamente la cartera empresarial con riesgo de churn alto y dispara secuencias multicanal.",
      impacto: "alto",
      responsable: "Dirección Comercial",
      categoria: "retencion",
    },
    {
      id: "r2",
      titulo: "Optimizar portabilidades con asesor inteligente",
      descripcion:
        "El motor IA detectó oportunidades de portabilidad cruzada para los comerciales 03, 06 y 09 en el segmento Partners.",
      impacto: "medio",
      responsable: "Operaciones",
      categoria: "automatizacion",
    },
    {
      id: "r3",
      titulo: "Automatizar propuestas bundle fibra + móvil",
      descripcion:
        "Ajusta el generador de propuestas para que cada comercial entregue un paquete personalizado en menos de 5 minutos.",
      impacto: "alto",
      responsable: "Growth",
      categoria: "productividad",
    },
  ],
};
