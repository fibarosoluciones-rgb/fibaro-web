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

export type Trabajador = {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  equipo: "Empresas" | "Residencial" | "Partners";
  especialidades: string[];
  leads: Lead[];
  tareas: Tarea[];
  objetivos: ObjetivoMensual[];
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
};

export const crmData: CRMData = {
  indicadores: {
    ingresosMensuales: 48250,
    conversionGeneral: 0.32,
    churnRate: 0.04,
    clientesActivos: 186,
    pipelineValor: 126300,
    forecast90dias: 158400,
  },
  clientesClave: [
    {
      id: "c1",
      nombre: "Residencial Premium Norte",
      industria: "Residencial",
      ingresosMensuales: 3500,
      nivelSatisfaccion: 4.7,
      ultimoContacto: "2024-03-18",
      responsable: "Laura Gómez",
    },
    {
      id: "c2",
      nombre: "Coworking Nexus",
      industria: "Empresas",
      ingresosMensuales: 4800,
      nivelSatisfaccion: 4.2,
      ultimoContacto: "2024-03-21",
      responsable: "Carlos Ruiz",
    },
    {
      id: "c3",
      nombre: "Residencial Urbania",
      industria: "Residencial",
      ingresosMensuales: 2750,
      nivelSatisfaccion: 4.9,
      ultimoContacto: "2024-03-16",
      responsable: "Andrea Vela",
    },
  ],
  trabajadores: [
    {
      id: "t1",
      nombre: "Laura Gómez",
      email: "laura.gomez@fibranet.io",
      rol: "Ejecutiva Senior",
      equipo: "Empresas",
      especialidades: ["Empresas de alto valor", "Integraciones SD-WAN", "Fidelización"],
      leads: [
        {
          id: "l1",
          nombre: "Datacore Solutions",
          empresa: "Datacore",
          planInteresado: "Fibra Dedicada 1Gbps",
          estado: "en_negociacion",
          valorMensualPotencial: 2200,
          ultimaInteraccion: "2024-03-20",
          proximaAccion: "Enviar propuesta final con descuento por volumen",
          prioridad: "alta",
        },
        {
          id: "l2",
          nombre: "Grupo Atlas",
          empresa: "Atlas",
          planInteresado: "Fibra Empresarial 600Mbps",
          estado: "contactado",
          valorMensualPotencial: 1350,
          ultimaInteraccion: "2024-03-19",
          proximaAccion: "Agendar demo de portal de monitoreo",
          prioridad: "media",
        },
      ],
      tareas: [
        {
          id: "ta1",
          titulo: "Reunión con TI de Datacore",
          vencimiento: "2024-03-22",
          tipo: "reunion",
          estado: "pendiente",
        },
        {
          id: "ta2",
          titulo: "Follow-up propuesta Grupo Atlas",
          vencimiento: "2024-03-23",
          tipo: "email",
          estado: "pendiente",
        },
      ],
      objetivos: [
        {
          mes: "Marzo",
          objetivoIngresos: 28000,
          ingresosAlcanzados: 24800,
          clientesNuevosObjetivo: 12,
          clientesNuevos: 9,
        },
        {
          mes: "Abril",
          objetivoIngresos: 30000,
          ingresosAlcanzados: 11200,
          clientesNuevosObjetivo: 13,
          clientesNuevos: 4,
        },
      ],
      rendimiento: {
        conversion: 0.41,
        clientesActivos: 58,
        ticketsPromedio: 420,
        tiempoRespuestaPromedio: 45,
      },
      automatizaciones: [
        "Secuencia de emails con IA para propuestas personalizadas",
        "Asignación automática de tickets prioritarios",
      ],
    },
    {
      id: "t2",
      nombre: "Carlos Ruiz",
      email: "carlos.ruiz@fibranet.io",
      rol: "Ejecutivo Mid-market",
      equipo: "Empresas",
      especialidades: ["Negociación", "Retención B2B", "Onboarding corporativo"],
      leads: [
        {
          id: "l3",
          nombre: "Retail Nova",
          empresa: "Nova",
          planInteresado: "Fibra 300Mbps + Backup LTE",
          estado: "contactado",
          valorMensualPotencial: 680,
          ultimaInteraccion: "2024-03-18",
          proximaAccion: "Configurar prueba de backup",
          prioridad: "media",
        },
        {
          id: "l4",
          nombre: "Coworking Nexus",
          empresa: "Nexus",
          planInteresado: "Fibra 600Mbps + WiFi gestionado",
          estado: "en_negociacion",
          valorMensualPotencial: 890,
          ultimaInteraccion: "2024-03-21",
          proximaAccion: "Generar comparativa de planes",
          prioridad: "alta",
        },
      ],
      tareas: [
        {
          id: "ta3",
          titulo: "Configurar prueba con Retail Nova",
          vencimiento: "2024-03-22",
          tipo: "demo",
          estado: "pendiente",
        },
        {
          id: "ta4",
          titulo: "Revisión contrato Coworking Nexus",
          vencimiento: "2024-03-25",
          tipo: "reunion",
          estado: "pendiente",
        },
      ],
      objetivos: [
        {
          mes: "Marzo",
          objetivoIngresos: 21000,
          ingresosAlcanzados: 19800,
          clientesNuevosObjetivo: 10,
          clientesNuevos: 8,
        },
        {
          mes: "Abril",
          objetivoIngresos: 23000,
          ingresosAlcanzados: 9800,
          clientesNuevosObjetivo: 11,
          clientesNuevos: 5,
        },
      ],
      rendimiento: {
        conversion: 0.35,
        clientesActivos: 47,
        ticketsPromedio: 310,
        tiempoRespuestaPromedio: 62,
      },
      automatizaciones: [
        "Recordatorios automáticos de follow-up en WhatsApp",
        "Asignación inteligente de leads por vertical",
      ],
    },
    {
      id: "t3",
      nombre: "Andrea Vela",
      email: "andrea.vela@fibranet.io",
      rol: "Consultora Residencial",
      equipo: "Residencial",
      especialidades: ["Upselling", "Programas de referidos", "Experiencia del cliente"],
      leads: [
        {
          id: "l5",
          nombre: "Condominio Parque Sur",
          empresa: "Parque Sur",
          planInteresado: "Fibra 200Mbps",
          estado: "nuevo",
          valorMensualPotencial: 540,
          ultimaInteraccion: "2024-03-15",
          proximaAccion: "Enviar kit de bienvenida digital",
          prioridad: "alta",
        },
        {
          id: "l6",
          nombre: "Residencial El Lago",
          empresa: "El Lago",
          planInteresado: "Fibra 1Gbps",
          estado: "contactado",
          valorMensualPotencial: 1120,
          ultimaInteraccion: "2024-03-17",
          proximaAccion: "Agendar visita técnica",
          prioridad: "alta",
        },
      ],
      tareas: [
        {
          id: "ta5",
          titulo: "Coordinar visita Residencial El Lago",
          vencimiento: "2024-03-23",
          tipo: "reunion",
          estado: "pendiente",
        },
        {
          id: "ta6",
          titulo: "Enviar programa de referidos",
          vencimiento: "2024-03-21",
          tipo: "email",
          estado: "completada",
        },
      ],
      objetivos: [
        {
          mes: "Marzo",
          objetivoIngresos: 12000,
          ingresosAlcanzados: 9800,
          clientesNuevosObjetivo: 18,
          clientesNuevos: 15,
        },
        {
          mes: "Abril",
          objetivoIngresos: 13000,
          ingresosAlcanzados: 4200,
          clientesNuevosObjetivo: 19,
          clientesNuevos: 6,
        },
      ],
      rendimiento: {
        conversion: 0.29,
        clientesActivos: 81,
        ticketsPromedio: 180,
        tiempoRespuestaPromedio: 28,
      },
      automatizaciones: [
        "Campañas de retención con IA según uso de ancho de banda",
        "Alertas de upgrade automático para clientes saturados",
      ],
    },
  ],
  recomendaciones: [
    {
      id: "r1",
      titulo: "Activar secuencia automática para leads fríos",
      descripcion:
        "La IA detectó 12 leads sin contacto en 7 días. Recomienda lanzar secuencia multicanal personalizada para recuperar interés.",
      impacto: "alto",
      responsable: "Sistema",
      categoria: "automatizacion",
    },
    {
      id: "r2",
      titulo: "Campaña de fidelización para clientes con churn riesgo",
      descripcion:
        "6 clientes empresariales presentan caída de satisfacción y aumento de tickets. Sugiere ofrecer upgrade gratuito de router WiFi 6.",
      impacto: "alto",
      responsable: "Marketing",
      categoria: "retencion",
    },
    {
      id: "r3",
      titulo: "Cross-selling de backup LTE a cartera residencial",
      descripcion:
        "27 clientes residenciales de alto consumo podrían necesitar redundancia. Enviar propuesta de bundle fibra + LTE.",
      impacto: "medio",
      responsable: "Andrea Vela",
      categoria: "cross-selling",
    },
  ],
};
