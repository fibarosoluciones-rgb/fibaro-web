import { commissionProductsById } from "@/data/commissionCatalog";
import { CRMData, Lead, Trabajador, Venta } from "@/data/crmData";

export const formatCurrency = (value: number) =>
  value.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  });

export const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;

export const groupLeadsByEstado = (leads: Lead[]) =>
  leads.reduce<Record<string, Lead[]>>((acc, lead) => {
    const key = lead.estado;
    acc[key] = acc[key] ? [...acc[key], lead] : [lead];
    return acc;
  }, {});

const calcularImportesVenta = (venta: Venta) => {
  const producto = commissionProductsById[venta.productoId];

  if (!producto) {
    const operaciones = venta.altas + venta.portas;
    return {
      ingresos: 0,
      comision: 0,
      operaciones,
    };
  }

  const operaciones = venta.altas + venta.portas;
  const ingresos = producto.pvp * operaciones;
  const comision = producto.comisionAlta * venta.altas + producto.comisionPorta * venta.portas;

  return { ingresos, comision, operaciones };
};

export const computeWorkerFinancials = (trabajador: Trabajador) => {
  return trabajador.ventas.reduce(
    (acc, venta) => {
      const totales = calcularImportesVenta(venta);
      return {
        ingresos: acc.ingresos + totales.ingresos,
        comision: acc.comision + totales.comision,
        operaciones: acc.operaciones + totales.operaciones,
      };
    },
    { ingresos: 0, comision: 0, operaciones: 0 },
  );
};

export const computeGlobalMetrics = (trabajadores: Trabajador[]) => {
  const totals = trabajadores.reduce(
    (acc, trabajador) => {
      const leadsTotales = trabajador.leads.length;
      const leadsNegociacion = trabajador.leads.filter((lead) => lead.estado === "en_negociacion").length;
      const leadsCerrados = trabajador.leads.filter((lead) => lead.estado === "cerrado").length;
      const leadsPrioritarios = trabajador.leads.filter((lead) => lead.prioridad === "alta").length;
      const valorPipeline = trabajador.leads.reduce((sub, lead) => sub + lead.valorMensualPotencial, 0);
      const ventas = computeWorkerFinancials(trabajador);

      acc.totalLeads += leadsTotales;
      acc.leadsEnNegociacion += leadsNegociacion;
      acc.leadsCerrados += leadsCerrados;
      acc.leadsPrioritarios += leadsPrioritarios;
      acc.valorPipeline += valorPipeline;
      acc.totalVentas += ventas.ingresos;
      acc.totalComisiones += ventas.comision;
      acc.totalOperaciones += ventas.operaciones;
      return acc;
    },
    {
      totalLeads: 0,
      leadsEnNegociacion: 0,
      leadsCerrados: 0,
      leadsPrioritarios: 0,
      valorPipeline: 0,
      totalVentas: 0,
      totalComisiones: 0,
      totalOperaciones: 0,
    },
  );

  const comisionPromedio = totals.totalOperaciones ? totals.totalComisiones / totals.totalOperaciones : 0;
  const ingresoPromedio = totals.totalOperaciones ? totals.totalVentas / totals.totalOperaciones : 0;

  return {
    ...totals,
    comisionPromedio,
    ingresoPromedio,
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
