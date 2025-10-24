import { CRMData, Lead, Trabajador } from "@/data/crmData";

export const formatCurrency = (value: number) =>
  value.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  });

export const formatPercent = (value: number) =>
  `${(value * 100).toFixed(1)}%`;

export const groupLeadsByEstado = (leads: Lead[]) =>
  leads.reduce<Record<string, Lead[]>>((acc, lead) => {
    const key = lead.estado;
    acc[key] = acc[key] ? [...acc[key], lead] : [lead];
    return acc;
  }, {});

export const computeGlobalMetrics = (trabajadores: Trabajador[]) => {
  const totalLeads = trabajadores.reduce((acc, t) => acc + t.leads.length, 0);
  const leadsEnNegociacion = trabajadores.reduce(
    (acc, t) => acc + t.leads.filter((lead) => lead.estado === "en_negociacion").length,
    0,
  );
  const leadsCerrados = trabajadores.reduce(
    (acc, t) => acc + t.leads.filter((lead) => lead.estado === "cerrado").length,
    0,
  );
  const leadsPrioritarios = trabajadores.reduce(
    (acc, t) => acc + t.leads.filter((lead) => lead.prioridad === "alta").length,
    0,
  );
  const valorPipeline = trabajadores.reduce(
    (acc, t) => acc + t.leads.reduce((sub, lead) => sub + lead.valorMensualPotencial, 0),
    0,
  );

  return {
    totalLeads,
    leadsEnNegociacion,
    leadsCerrados,
    leadsPrioritarios,
    valorPipeline,
  };
};

export const generateAdminFolders = (data: CRMData) => {
  return data.trabajadores.map((trabajador) => ({
    id: trabajador.id,
    nombre: trabajador.nombre,
    leads: trabajador.leads,
    tareas: trabajador.tareas,
    objetivos: trabajador.objetivos,
    rendimiento: trabajador.rendimiento,
  }));
};
