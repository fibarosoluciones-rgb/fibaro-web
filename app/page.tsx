"use client";

import { useMemo, useState } from "react";

import { CommissionCalculator } from "@/components/CommissionCalculator";
import { crmData, LeadStatus, Trabajador } from "@/data/crmData";
import { commissionProductsById } from "@/data/commissionCatalog";
import {
  computeGlobalMetrics,
  computeWorkerFinancials,
  formatCurrency,
  formatPercent,
  groupLeadsByEstado,
} from "@/lib/metrics";
import { FolderTreeIcon, PlusIcon, SparklesIcon, TrashIcon, UsersIcon, ZapIcon } from "@/components/icons";

const estadoLabels: Record<LeadStatus, string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  en_negociacion: "En negociación",
  cerrado: "Cerrado",
  perdido: "Perdido",
};

const estadoColors: Record<LeadStatus, string> = {
  nuevo: "bg-sky-500/10 text-sky-300",
  contactado: "bg-indigo-500/10 text-indigo-300",
  en_negociacion: "bg-amber-500/10 text-amber-300",
  cerrado: "bg-emerald-500/10 text-emerald-300",
  perdido: "bg-rose-500/10 text-rose-300",
};

const equipos = ["Empresas", "Residencial", "Partners"] as const;

type ModoTrabajo = "administrador" | "comercial";

const generarUsuario = (nombre: string, existentes: Trabajador[]) => {
  const base = nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 16);

  const candidato = base || `comercial${existentes.length + 1}`;
  const yaExiste = existentes.some((trabajador) => trabajador.usuario === candidato);
  return yaExiste ? `${candidato}${existentes.length + 1}` : candidato;
};

export default function CRMInteligente() {
  const [data, setData] = useState(() => JSON.parse(JSON.stringify(crmData)) as typeof crmData);
  const [modo, setModo] = useState<ModoTrabajo>("administrador");
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>(data.trabajadores[0]?.id ?? "");
  const [comercialAutenticadoId, setComercialAutenticadoId] = useState<string | null>(null);
  const [credenciales, setCredenciales] = useState({ usuario: "", clave: "" });
  const [loginError, setLoginError] = useState("");
  const [newWorker, setNewWorker] = useState<{
    nombre: string;
    email: string;
    rol: string;
    equipo: (typeof equipos)[number];
  }>({
    nombre: "",
    email: "",
    rol: "Ejecutivo/a Comercial",
    equipo: equipos[0],
  });
  const [leadDraft, setLeadDraft] = useState({
    nombre: "",
    empresa: "",
    planInteresado: "Fibra 300MB",
    valorMensualPotencial: "",
    prioridad: "media" as "alta" | "media" | "baja",
  });

  const globalMetrics = useMemo(
    () => computeGlobalMetrics(data.trabajadores),
    [data.trabajadores],
  );

  const selectedWorker = useMemo(() => {
    if (modo === "comercial") {
      return data.trabajadores.find((t) => t.id === comercialAutenticadoId) ?? null;
    }
    return data.trabajadores.find((t) => t.id === selectedWorkerId) ?? data.trabajadores[0] ?? null;
  }, [modo, data.trabajadores, selectedWorkerId, comercialAutenticadoId]);

  const leadsGrouped = useMemo(
    () => (selectedWorker ? groupLeadsByEstado(selectedWorker.leads) : {}),
    [selectedWorker],
  );

  const workerFinancials = useMemo(
    () => (selectedWorker ? computeWorkerFinancials(selectedWorker) : { ingresos: 0, comision: 0, operaciones: 0 }),
    [selectedWorker],
  );

  const resumenComerciales = useMemo(
    () =>
      data.trabajadores.map((trabajador) => ({
        id: trabajador.id,
        nombre: trabajador.nombre,
        equipo: trabajador.equipo,
        usuario: trabajador.usuario,
        ventas: computeWorkerFinancials(trabajador),
      })),
    [data.trabajadores],
  );

  const handleModoChange = (nuevoModo: ModoTrabajo) => {
    setModo(nuevoModo);
    if (nuevoModo === "administrador") {
      setComercialAutenticadoId(null);
      setCredenciales({ usuario: "", clave: "" });
      setLoginError("");
    }
  };

  const handleComercialLogin = () => {
    const usuario = credenciales.usuario.trim().toLowerCase();
    const clave = credenciales.clave.trim().toLowerCase();
    const trabajador = data.trabajadores.find((t) => t.usuario.toLowerCase() === usuario);

    if (trabajador && trabajador.clave.toLowerCase() === clave) {
      setComercialAutenticadoId(trabajador.id);
      setSelectedWorkerId(trabajador.id);
      setLoginError("");
    } else {
      setLoginError("Credenciales incorrectas. Revisa usuario y clave.");
    }
  };

  const handleCerrarSesion = () => {
    setComercialAutenticadoId(null);
    setCredenciales({ usuario: "", clave: "" });
    setLoginError("");
  };

  const handleAddWorker = () => {
    if (!newWorker.nombre || !newWorker.email) return;

    const username = generarUsuario(newWorker.nombre, data.trabajadores);

    const trabajador: Trabajador = {
      id: `t-${Date.now()}`,
      usuario: username,
      clave: username,
      nombre: newWorker.nombre,
      email: newWorker.email,
      rol: newWorker.rol,
      equipo: newWorker.equipo,
      especialidades: ["Automatización IA", "Ventas consultivas"],
      leads: [],
      tareas: [],
      objetivos: [],
      ventas: [],
      rendimiento: {
        conversion: 0,
        clientesActivos: 0,
        ticketsPromedio: 0,
        tiempoRespuestaPromedio: 0,
      },
      automatizaciones: ["Secuencia inteligente de bienvenida", "Clasificación automática de leads"],
    };

    setData((prev) => ({
      ...prev,
      trabajadores: [...prev.trabajadores, trabajador],
    }));
    setSelectedWorkerId(trabajador.id);
    setNewWorker({ nombre: "", email: "", rol: "Ejecutivo/a Comercial", equipo: equipos[0] });
  };

  const handleDeleteWorker = (id: string) => {
    setData((prev) => {
      const filtered = prev.trabajadores.filter((worker) => worker.id !== id);
      if (selectedWorkerId === id) {
        setSelectedWorkerId(filtered[0]?.id ?? "");
      }
      return {
        ...prev,
        trabajadores: filtered,
      };
    });
  };

  const handleAddLead = () => {
    if (!selectedWorker) return;
    if (!leadDraft.nombre || !leadDraft.empresa || !leadDraft.valorMensualPotencial) return;

    const valor = parseInt(leadDraft.valorMensualPotencial, 10);
    if (Number.isNaN(valor)) return;

    setData((prev) => ({
      ...prev,
      trabajadores: prev.trabajadores.map((worker) => {
        if (worker.id !== selectedWorker.id) return worker;
        return {
          ...worker,
          leads: [
            ...worker.leads,
            {
              id: `lead-${Date.now()}`,
              nombre: leadDraft.nombre,
              empresa: leadDraft.empresa,
              planInteresado: leadDraft.planInteresado,
              estado: "nuevo",
              valorMensualPotencial: valor,
              ultimaInteraccion: new Date().toISOString().split("T")[0],
              proximaAccion: "Programar primer contacto automatizado",
              prioridad: leadDraft.prioridad,
            },
          ],
        };
      }),
    }));

    setLeadDraft({ nombre: "", empresa: "", planInteresado: "Fibra 300MB", valorMensualPotencial: "", prioridad: "media" });
  };

  const handleRegistrarVenta = ({
    trabajadorId,
    productoId,
    altas,
    portas,
  }: {
    trabajadorId: string;
    productoId: string;
    altas: number;
    portas: number;
  }) => {
    const producto = commissionProductsById[productoId];
    if (!producto) return;
    if (altas === 0 && portas === 0) return;

    const operaciones = altas + portas;
    const ingreso = producto.pvp * operaciones;
    const comision = producto.comisionAlta * altas + producto.comisionPorta * portas;

    setData((prev) => ({
      ...prev,
      trabajadores: prev.trabajadores.map((worker) => {
        if (worker.id !== trabajadorId) return worker;
        return {
          ...worker,
          ventas: [
            ...worker.ventas,
            {
              id: `venta-${Date.now()}`,
              fecha: new Date().toISOString().split("T")[0],
              productoId,
              altas,
              portas,
            },
          ],
        };
      }),
      indicadores: {
        ...prev.indicadores,
        ingresosMensuales: Number((prev.indicadores.ingresosMensuales + ingreso).toFixed(2)),
        forecast90dias: Number((prev.indicadores.forecast90dias + ingreso * 3).toFixed(2)),
        totalComisiones: Number((prev.indicadores.totalComisiones + comision).toFixed(2)),
        totalOperaciones: prev.indicadores.totalOperaciones + operaciones,
      },
    }));

    if (modo === "administrador") {
      setSelectedWorkerId(trabajadorId);
    } else if (modo === "comercial") {
      setComercialAutenticadoId(trabajadorId);
    }
  };

  const resumenObjetivos = selectedWorker
    ? selectedWorker.objetivos.map((objetivo) => {
        const progreso = objetivo.objetivoIngresos
          ? Math.min(Math.round((objetivo.ingresosAlcanzados / objetivo.objetivoIngresos) * 100), 100)
          : 0;
        const avanceClientes = objetivo.clientesNuevosObjetivo
          ? Math.min(Math.round((objetivo.clientesNuevos / objetivo.clientesNuevosObjetivo) * 100), 100)
          : 0;
        return { ...objetivo, progreso, avanceClientes };
      })
    : [];

  const progresoPromedio = resumenObjetivos.length
    ? Math.round(resumenObjetivos.reduce((acc, objetivo) => acc + objetivo.progreso, 0) / resumenObjetivos.length)
    : 0;

  const clientesNuevosAcumulados = selectedWorker
    ? selectedWorker.objetivos.reduce((acc, objetivo) => acc + objetivo.clientesNuevos, 0)
    : 0;

  const tarjetasResumen =
    modo === "administrador"
      ? [
          {
            label: "Ingresos proyectados 90 días",
            value: formatCurrency(data.indicadores.forecast90dias),
            trend: "+18%",
            description: "Forecast IA considerando churn y upselling",
          },
          {
            label: "Clientes activos",
            value: data.indicadores.clientesActivos,
            trend: "+12",
            description: "Segmentados por vertical y nivel de riesgo",
          },
          {
            label: "Valor del pipeline",
            value: formatCurrency(globalMetrics.valorPipeline),
            trend: "+9.8%",
            description: "Incluye leads en negociación y priorizados",
          },
          {
            label: "Comisiones acumuladas",
            value: formatCurrency(globalMetrics.totalComisiones),
            trend: "+5.4%",
            description: "Total actualizado con las últimas ventas",
          },
          {
            label: "Operaciones totales",
            value: globalMetrics.totalOperaciones,
            trend: "+34",
            description: "Altas y portabilidades registradas en el mes",
          },
          {
            label: "Ingreso medio por operación",
            value: formatCurrency(globalMetrics.ingresoPromedio),
            trend: "+2.1%",
            description: "Promedio generado por comercial",
          },
        ]
      : comercialAutenticadoId && selectedWorker
        ? [
            {
              label: "Progreso medio de objetivos",
              value: `${progresoPromedio}%`,
              trend: "Meta mensual",
              description: "Porcentaje agregado de cumplimiento",
            },
            {
              label: "Objetivos activos",
              value: selectedWorker.objetivos.length,
              trend: "Asignados",
              description: "Metas comerciales planificadas",
            },
            {
              label: "Clientes nuevos logrados",
              value: clientesNuevosAcumulados,
              trend: "Acumulado",
              description: "Altas confirmadas en el período",
            },
            {
              label: "Leads en seguimiento",
              value: selectedWorker.leads.length,
              trend: "Activos",
              description: "Oportunidades que requieren atención",
            },
          ]
        : [];

  const renderModoAdministrador = () => (
    <>
      <div className="mt-10 grid gap-6 lg:grid-cols-[3fr,2fr]">
        <CommissionCalculator trabajadores={data.trabajadores} onRegistrarVenta={handleRegistrarVenta} />
        <section className="rounded-3xl border border-white/5 bg-white/5 p-6">
          <header className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-[0.4em] text-sky-300/80">Control financiero</p>
            <h2 className="text-lg font-semibold">Resumen de comisiones y rappel</h2>
          </header>
          <div className="mt-6 grid gap-4 rounded-2xl border border-white/5 bg-slate-950/60 p-4 text-sm text-slate-300">
            <div className="flex items-center justify-between">
              <span>Comisiones acumuladas</span>
              <span className="text-white">{formatCurrency(globalMetrics.totalComisiones)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Operaciones registradas</span>
              <span className="text-white">{globalMetrics.totalOperaciones}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Comisión promedio</span>
              <span className="text-emerald-300">{formatCurrency(globalMetrics.comisionPromedio)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Ingreso promedio por operación</span>
              <span className="text-emerald-300">{formatCurrency(globalMetrics.ingresoPromedio)}</span>
            </div>
          </div>
          <div className="mt-6 rounded-2xl border border-white/5 bg-slate-950/40 p-4 text-xs text-slate-300">
            <p className="font-semibold text-slate-200">Parámetros vigentes</p>
            <ul className="mt-3 space-y-2">
              <li>Activaciones rappel: {data.rappel.activacionesRappel}</li>
              <li>Segmento PDV: {data.rappel.segmentoPdv}</li>
              <li>Tipo de impuesto: {data.rappel.tipoImpuesto}</li>
            </ul>
          </div>
          <div className="mt-6 overflow-hidden rounded-2xl border border-white/5">
            <table className="min-w-full divide-y divide-white/10 text-xs text-slate-300">
              <thead className="bg-slate-950/70 text-[0.65rem] uppercase tracking-[0.3em] text-slate-400">
                <tr>
                  <th className="px-3 py-2 text-left">Comercial</th>
                  <th className="px-3 py-2 text-left">Usuario</th>
                  <th className="px-3 py-2 text-left">Equipo</th>
                  <th className="px-3 py-2 text-right">Operaciones</th>
                  <th className="px-3 py-2 text-right">Ventas</th>
                  <th className="px-3 py-2 text-right">Comisión</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-slate-950/40">
                {resumenComerciales.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5">
                    <td className="px-3 py-2 text-white">{item.nombre}</td>
                    <td className="px-3 py-2 font-mono text-xs">{item.usuario}</td>
                    <td className="px-3 py-2">{item.equipo}</td>
                    <td className="px-3 py-2 text-right text-slate-200">{item.ventas.operaciones}</td>
                    <td className="px-3 py-2 text-right text-slate-200">{formatCurrency(item.ventas.ingresos)}</td>
                    <td className="px-3 py-2 text-right text-emerald-300">{formatCurrency(item.ventas.comision)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[2fr,3fr] xl:grid-cols-[2fr,4fr]">
        <section className="flex flex-col gap-6">
          <div className="rounded-3xl border border-white/5 bg-white/5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Administración de equipo</h2>
                <p className="text-sm text-slate-300">
                  Crea perfiles, organiza carpetas por responsable y automatiza procesos críticos de onboarding.
                </p>
              </div>
              <UsersIcon className="h-5 w-5 text-sky-300" />
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleAddWorker();
              }}
              className="mt-6 flex flex-col gap-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs uppercase tracking-widest text-slate-400">Nombre</label>
                  <input
                    value={newWorker.nombre}
                    onChange={(event) => setNewWorker((prev) => ({ ...prev, nombre: event.target.value }))}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white placeholder:text-slate-500"
                    placeholder="Ej. Sofía Méndez"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-slate-400">Correo</label>
                  <input
                    type="email"
                    value={newWorker.email}
                    onChange={(event) => setNewWorker((prev) => ({ ...prev, email: event.target.value }))}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white placeholder:text-slate-500"
                    placeholder="nombre@fibranet.io"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs uppercase tracking-widest text-slate-400">Rol</label>
                  <input
                    value={newWorker.rol}
                    onChange={(event) => setNewWorker((prev) => ({ ...prev, rol: event.target.value }))}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white placeholder:text-slate-500"
                    placeholder="Ej. Hunter B2B"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-slate-400">Equipo</label>
                  <select
                    value={newWorker.equipo}
                    onChange={(event) =>
                      setNewWorker((prev) => ({ ...prev, equipo: event.target.value as (typeof equipos)[number] }))
                    }
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white"
                  >
                    {equipos.map((equipo) => (
                      <option className="bg-slate-900" key={equipo} value={equipo}>
                        {equipo}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/30 transition hover:-translate-y-0.5 hover:bg-sky-400"
              >
                <PlusIcon className="h-4 w-4" /> Registrar perfil en CRM
              </button>
            </form>
            <p className="mt-4 text-xs text-slate-400">
              El sistema generará automáticamente usuario y clave iguales para nuevos comerciales.
            </p>
          </div>

          <div className="rounded-3xl border border-white/5 bg-white/5 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recomendaciones IA</h2>
              <SparklesIcon className="h-5 w-5 text-sky-300" />
            </div>
            <div className="mt-6 space-y-4">
              {data.recomendaciones.map((item) => (
                <article key={item.id} className="rounded-2xl border border-white/5 bg-slate-900/60 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-white">{item.titulo}</p>
                      <p className="mt-2 text-xs text-slate-300">{item.descripcion}</p>
                    </div>
                    <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs uppercase tracking-widest text-sky-300">
                      {item.impacto}
                    </span>
                  </div>
                  <div className="mt-4 flex justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-2 text-slate-300">
                      <ZapIcon className="h-3 w-3 text-emerald-300" /> {item.categoria}
                    </span>
                    <span>Responsable: {item.responsable}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <div className="rounded-3xl border border-white/5 bg-white/5 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold">Carpeta general del administrador</h2>
                <p className="text-sm text-slate-300">
                  Vista consolidada de leads, tareas, métricas y comisiones por cada ejecutivo.
                </p>
              </div>
              <FolderTreeIcon className="h-5 w-5 text-sky-300" />
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {data.trabajadores.map((trabajador) => {
                const resumen = computeWorkerFinancials(trabajador);
                return (
                  <button
                    key={trabajador.id}
                    onClick={() => setSelectedWorkerId(trabajador.id)}
                    className={`rounded-2xl border p-4 text-left transition ${selectedWorker?.id === trabajador.id ? "border-sky-500/60 bg-sky-500/10" : "border-white/5 bg-slate-900/60 hover:border-white/10"}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white">{trabajador.nombre}</p>
                        <p className="text-xs text-slate-400">{trabajador.rol} · {trabajador.equipo}</p>
                      </div>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">
                        {trabajador.leads.length} leads
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-300">
                      <div>Conversión: {formatPercent(trabajador.rendimiento.conversion)}</div>
                      <div>Clientes activos: {trabajador.rendimiento.clientesActivos}</div>
                      <div>Ingresos generados: {formatCurrency(resumen.ingresos)}</div>
                      <div>Comisiones: {formatCurrency(resumen.comision)}</div>
                      <div>Ticket promedio: {formatCurrency(trabajador.rendimiento.ticketsPromedio)}</div>
                      <div>SLA respuesta: {trabajador.rendimiento.tiempoRespuestaPromedio} min</div>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                      <span>{trabajador.tareas.filter((t) => t.estado === "pendiente").length} tareas activas</span>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDeleteWorker(trabajador.id);
                        }}
                        className="inline-flex items-center gap-1 rounded-full border border-rose-500/40 bg-rose-500/10 px-3 py-1 text-rose-200 transition hover:bg-rose-500/20"
                      >
                        <TrashIcon className="h-3 w-3" /> Borrar
                      </button>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedWorker && (
            <div className="rounded-3xl border border-white/5 bg-white/5 p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Carpeta de {selectedWorker.nombre}</h2>
                  <p className="text-sm text-slate-300">
                    Leads priorizados, objetivos, agenda y detalle de ventas con impacto en comisiones.
                  </p>
                </div>
                <div className="flex gap-2 text-xs text-slate-300">
                  {selectedWorker.especialidades.map((skill) => (
                    <span key={skill} className="rounded-full bg-slate-900/60 px-3 py-1">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-[2fr,3fr]">
                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4">
                    <h3 className="text-sm font-semibold text-white">Resumen financiero</h3>
                    <div className="mt-4 grid gap-4 text-xs text-slate-300 sm:grid-cols-2">
                      <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3">
                        <p className="text-slate-400">Ventas generadas</p>
                        <p className="mt-2 text-lg font-semibold text-white">{formatCurrency(workerFinancials.ingresos)}</p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3">
                        <p className="text-slate-400">Comisión acumulada</p>
                        <p className="mt-2 text-lg font-semibold text-emerald-300">{formatCurrency(workerFinancials.comision)}</p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3">
                        <p className="text-slate-400">Operaciones registradas</p>
                        <p className="mt-2 text-lg font-semibold text-white">{workerFinancials.operaciones}</p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3">
                        <p className="text-slate-400">Objetivos activos</p>
                        <p className="mt-2 text-lg font-semibold text-white">{selectedWorker.objetivos.length}</p>
                      </div>
                    </div>
                    <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
                      <table className="min-w-full divide-y divide-white/10 text-xs text-slate-300">
                        <thead className="bg-slate-950/70 text-[0.65rem] uppercase tracking-[0.3em] text-slate-400">
                          <tr>
                            <th className="px-3 py-2 text-left">Fecha</th>
                            <th className="px-3 py-2 text-left">Tarifa</th>
                            <th className="px-3 py-2 text-right">Altas</th>
                            <th className="px-3 py-2 text-right">Portas</th>
                            <th className="px-3 py-2 text-right">Ventas</th>
                            <th className="px-3 py-2 text-right">Comisión</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 bg-slate-950/40">
                          {selectedWorker.ventas.length ? (
                            selectedWorker.ventas.map((venta) => {
                              const producto = commissionProductsById[venta.productoId];
                              const operaciones = venta.altas + venta.portas;
                              const ingreso = producto ? producto.pvp * operaciones : 0;
                              const comision = producto
                                ? producto.comisionAlta * venta.altas + producto.comisionPorta * venta.portas
                                : 0;
                              return (
                                <tr key={venta.id}>
                                  <td className="px-3 py-2 text-white">{venta.fecha}</td>
                                  <td className="px-3 py-2">{producto ? producto.tarifa : venta.productoId}</td>
                                  <td className="px-3 py-2 text-right">{venta.altas}</td>
                                  <td className="px-3 py-2 text-right">{venta.portas}</td>
                                  <td className="px-3 py-2 text-right">{formatCurrency(ingreso)}</td>
                                  <td className="px-3 py-2 text-right text-emerald-300">{formatCurrency(comision)}</td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td className="px-3 py-4 text-center text-slate-400" colSpan={6}>
                                Todavía no hay ventas registradas para este comercial.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4">
                    <h3 className="text-sm font-semibold text-white">Pipeline por estado</h3>
                    <div className="mt-4 space-y-3">
                      {Object.entries(leadsGrouped).map(([estado, leads]) => (
                        <div key={estado} className="rounded-xl border border-white/5 bg-slate-900/60 p-3">
                          <div className="flex items-center justify-between text-sm text-slate-200">
                            <span className={`rounded-full px-2 py-1 text-xs ${estadoColors[estado as LeadStatus]}`}>
                              {estadoLabels[estado as LeadStatus]}
                            </span>
                            <span>{leads.length} leads</span>
                          </div>
                          <p className="mt-2 text-xs text-slate-400">
                            Valor potencial: {formatCurrency(leads.reduce((acc, lead) => acc + lead.valorMensualPotencial, 0))}
                          </p>
                        </div>
                      ))}
                      {!Object.keys(leadsGrouped).length && (
                        <p className="text-xs text-slate-400">Aún no hay leads registrados.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4">
                    <h3 className="text-sm font-semibold text-white">Objetivos mensuales</h3>
                    <div className="mt-4 space-y-3">
                      {selectedWorker.objetivos.length ? (
                        selectedWorker.objetivos.map((objetivo) => {
                          const progreso =
                            objetivo.objetivoIngresos > 0
                              ? Math.min(
                                  Math.round((objetivo.ingresosAlcanzados / objetivo.objetivoIngresos) * 100),
                                  100,
                                )
                              : 0;
                          return (
                            <div key={objetivo.mes} className="space-y-2">
                              <div className="flex items-center justify-between text-xs text-slate-300">
                                <span>{objetivo.mes}</span>
                                <span>{progreso}%</span>
                              </div>
                              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-sky-500"
                                  style={{ width: `${progreso}%` }}
                                />
                              </div>
                              <div className="flex justify-between text-[0.7rem] uppercase tracking-widest text-slate-400">
                                <span>
                                  {objetivo.clientesNuevos} / {objetivo.clientesNuevosObjetivo} clientes
                                </span>
                                <span>
                                  {formatCurrency(objetivo.ingresosAlcanzados)} / {formatCurrency(objetivo.objetivoIngresos)}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-xs text-slate-400">Sin objetivos definidos. Añade metas para activar las automatizaciones.</p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4">
                    <h3 className="text-sm font-semibold text-white">Registrar nuevo lead</h3>
                    <form
                      className="mt-4 space-y-3"
                      onSubmit={(event) => {
                        event.preventDefault();
                        handleAddLead();
                      }}
                    >
                      <input
                        value={leadDraft.nombre}
                        onChange={(event) => setLeadDraft((prev) => ({ ...prev, nombre: event.target.value }))}
                        className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white placeholder:text-slate-500"
                        placeholder="Nombre del contacto"
                      />
                      <input
                        value={leadDraft.empresa}
                        onChange={(event) => setLeadDraft((prev) => ({ ...prev, empresa: event.target.value }))}
                        className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white placeholder:text-slate-500"
                        placeholder="Empresa"
                      />
                      <input
                        value={leadDraft.planInteresado}
                        onChange={(event) => setLeadDraft((prev) => ({ ...prev, planInteresado: event.target.value }))}
                        className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white placeholder:text-slate-500"
                        placeholder="Plan de interés"
                      />
                      <input
                        value={leadDraft.valorMensualPotencial}
                        onChange={(event) => setLeadDraft((prev) => ({ ...prev, valorMensualPotencial: event.target.value }))}
                        className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white placeholder:text-slate-500"
                        placeholder="Ingresos mensuales"
                      />
                      <div className="flex items-center justify-between gap-3">
                        <label className="text-xs text-slate-300">Prioridad</label>
                        <div className="flex gap-2">
                          {["alta", "media", "baja"].map((prioridad) => (
                            <button
                              key={prioridad}
                              type="button"
                              onClick={() => setLeadDraft((prev) => ({ ...prev, prioridad: prioridad as "alta" | "media" | "baja" }))}
                              className={`rounded-full px-3 py-1 text-xs uppercase transition ${leadDraft.prioridad === prioridad ? "bg-emerald-500 text-slate-950" : "bg-slate-900/60 text-slate-300 hover:bg-slate-800"}`}
                            >
                              {prioridad}
                            </button>
                          ))}
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:bg-emerald-400"
                      >
                        <PlusIcon className="h-4 w-4" /> Guardar lead y activar automatizaciones
                      </button>
                    </form>
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4">
                    <h3 className="text-sm font-semibold text-white">Agenda inteligente</h3>
                    <div className="mt-4 space-y-3">
                      {selectedWorker.tareas.length ? (
                        selectedWorker.tareas.map((tarea) => (
                          <div
                            key={tarea.id}
                            className="flex items-center justify-between rounded-xl border border-white/5 bg-slate-900/60 px-3 py-2 text-xs text-slate-300"
                          >
                            <div>
                              <p className="font-medium text-white">{tarea.titulo}</p>
                              <p className="text-[0.7rem] uppercase tracking-widest text-slate-400">
                                {tarea.tipo} · vence {tarea.vencimiento}
                              </p>
                            </div>
                            <span
                              className={`rounded-full px-3 py-1 text-[0.65rem] uppercase tracking-widest ${tarea.estado === "completada" ? "bg-emerald-500/20 text-emerald-200" : "bg-amber-500/20 text-amber-200"}`}
                            >
                              {tarea.estado}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400">
                          No hay tareas asignadas. La IA sugerirá recordatorios cuando registres nuevos leads.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      <section className="mt-10 rounded-3xl border border-white/5 bg-white/5 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Clientes clave y seguimiento</h2>
            <p className="text-sm text-slate-300">
              Control absoluto de la cartera estratégica, con información lista para comités o reportes ejecutivos.
            </p>
          </div>
          <div className="flex gap-3 text-xs text-slate-300">
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-200">Renovaciones</span>
            <span className="rounded-full bg-sky-500/10 px-3 py-1 text-sky-200">Expansiones</span>
            <span className="rounded-full bg-amber-500/10 px-3 py-1 text-amber-200">Alertas</span>
          </div>
        </div>
        <div className="mt-6 overflow-hidden rounded-2xl border border-white/5">
          <table className="min-w-full divide-y divide-white/10 text-sm text-slate-200">
            <thead className="bg-slate-950/70 text-xs uppercase tracking-[0.3em] text-slate-400">
              <tr>
                <th className="px-4 py-3 text-left">Cliente</th>
                <th className="px-4 py-3 text-left">Industria</th>
                <th className="px-4 py-3 text-left">Ingresos mensuales</th>
                <th className="px-4 py-3 text-left">Satisfacción</th>
                <th className="px-4 py-3 text-left">Último contacto</th>
                <th className="px-4 py-3 text-left">Responsable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-slate-950/40">
              {data.clientesClave.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-white/5">
                  <td className="px-4 py-3 text-white">{cliente.nombre}</td>
                  <td className="px-4 py-3">{cliente.industria}</td>
                  <td className="px-4 py-3">{formatCurrency(cliente.ingresosMensuales)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-400 via-sky-400 to-sky-500"
                          style={{ width: `${cliente.nivelSatisfaccion * 20}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-300">{cliente.nivelSatisfaccion.toFixed(1)}/5</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{cliente.ultimoContacto}</td>
                  <td className="px-4 py-3">{cliente.responsable}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );

  const renderModoComercial = () => {
    if (!selectedWorker || !comercialAutenticadoId) {
      return (
        <section className="mt-10 rounded-3xl border border-white/5 bg-white/5 p-6">
          <h2 className="text-lg font-semibold">Acceso para comerciales</h2>
          <p className="mt-2 text-sm text-slate-300">
            Introduce tu usuario y clave (iguales) para consultar tus objetivos activos. Contacta con el administrador
            para detalles económicos y comisiones.
          </p>
          <form
            className="mt-6 grid gap-4 sm:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              handleComercialLogin();
            }}
          >
            <label className="flex flex-col gap-2 text-sm text-slate-200">
              <span className="text-xs uppercase tracking-widest text-slate-400">Usuario</span>
              <input
                value={credenciales.usuario}
                onChange={(event) => setCredenciales((prev) => ({ ...prev, usuario: event.target.value }))}
                className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white"
                placeholder="comercial01"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-slate-200">
              <span className="text-xs uppercase tracking-widest text-slate-400">Clave</span>
              <input
                type="password"
                value={credenciales.clave}
                onChange={(event) => setCredenciales((prev) => ({ ...prev, clave: event.target.value }))}
                className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white"
                placeholder="comercial01"
              />
            </label>
            <button
              type="submit"
              className="sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:bg-emerald-400"
            >
              <ZapIcon className="h-4 w-4" /> Acceder a mis objetivos
            </button>
            {loginError && (
              <p className="sm:col-span-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-xs text-rose-200">
                {loginError}
              </p>
            )}
          </form>
        </section>
      );
    }

    return (
      <section className="mt-10 flex flex-col gap-6">
        <div className="rounded-3xl border border-white/5 bg-white/5 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-sky-300/80">Panel personal</p>
              <h2 className="text-lg font-semibold">Hola, {selectedWorker.nombre}</h2>
              <p className="text-sm text-slate-300">
                Aquí verás únicamente tus metas de desempeño. La información económica se gestiona desde el modo
                administrador.
              </p>
            </div>
            <button
              onClick={handleCerrarSesion}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-900"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-white/5 bg-white/5 p-6">
          <h3 className="text-sm font-semibold text-white">Objetivos activos</h3>
          <div className="mt-4 space-y-4">
            {resumenObjetivos.length ? (
              resumenObjetivos.map((objetivo) => (
                <article key={objetivo.mes} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <div className="flex items-center justify-between text-sm text-slate-200">
                    <span>{objetivo.mes}</span>
                    <span>{objetivo.progreso}% meta económica</span>
                  </div>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-sky-500"
                      style={{ width: `${objetivo.progreso}%` }}
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-300">
                    <span>Clientes: {objetivo.clientesNuevos} / {objetivo.clientesNuevosObjetivo}</span>
                    <span>Progreso clientes: {objetivo.avanceClientes}%</span>
                  </div>
                </article>
              ))
            ) : (
              <p className="text-xs text-slate-400">Aún no hay objetivos asignados. Solicita a tu responsable nuevas metas.</p>
            )}
          </div>
          <p className="mt-4 text-xs text-slate-400">
            Recuerda registrar avances en el CRM para que tu responsable pueda validar resultados y comisiones.
          </p>
        </div>
      </section>
    );
  };

  return (
    <main className="px-6 py-8 sm:px-10 lg:px-12">
      <header className="flex flex-col gap-6 rounded-3xl border border-white/5 bg-white/5 p-8 backdrop-blur">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-sky-300/80">FibraNet</p>
            <h1 className="mt-2 text-3xl font-semibold md:text-4xl">
              CRM operativo con control de ventas y comisiones en tiempo real
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Centraliza la gestión del equipo comercial con métricas de ingresos, automatizaciones y cálculo de
              comisiones por operador. El modo administrador ofrece visibilidad total y el modo comercial se enfoca en las
              metas individuales.
            </p>
          </div>
          <div className="flex gap-3 text-sm text-slate-300">
            <div className="flex items-center gap-2 rounded-2xl border border-sky-500/40 bg-sky-500/10 px-4 py-3">
              <SparklesIcon className="h-4 w-4 text-sky-300" />
              <span>IA Predictiva Activa</span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3">
              <ZapIcon className="h-4 w-4 text-emerald-300" />
              <span>Automatizaciones 24/7</span>
            </div>
          </div>
        </div>
      </header>

      <section className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 p-2 text-xs text-slate-200">
          <button
            onClick={() => handleModoChange("administrador")}
            className={`rounded-2xl px-4 py-2 font-semibold transition ${modo === "administrador" ? "bg-sky-500 text-slate-950" : "bg-transparent text-slate-200"}`}
          >
            Modo administrador
          </button>
          <button
            onClick={() => handleModoChange("comercial")}
            className={`rounded-2xl px-4 py-2 font-semibold transition ${modo === "comercial" ? "bg-sky-500 text-slate-950" : "bg-transparent text-slate-200"}`}
          >
            Modo comercial
          </button>
        </div>
        {modo === "comercial" && comercialAutenticadoId && selectedWorker && (
          <p className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-200">
            Sesión iniciada como <span className="font-semibold">{selectedWorker.usuario}</span>.
          </p>
        )}
      </section>

      {tarjetasResumen.length > 0 && (
        <section className={`mt-6 grid gap-4 ${modo === "administrador" ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4"}`}>
          {tarjetasResumen.map((card) => (
            <article
              key={card.label}
              className="rounded-2xl border border-white/5 bg-slate-900/60 p-5 shadow-lg shadow-slate-950/30"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{card.label}</p>
              <p className="mt-4 text-2xl font-semibold text-white">{card.value}</p>
              <p className="mt-2 text-xs text-emerald-300">{card.trend}</p>
              <p className="mt-3 text-xs text-slate-400">{card.description}</p>
            </article>
          ))}
        </section>
      )}

      {modo === "administrador" ? renderModoAdministrador() : renderModoComercial()}
    </main>
  );
}
