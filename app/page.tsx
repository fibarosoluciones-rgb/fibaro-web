"use client";

import { useMemo, useState } from "react";
import { crmData, LeadStatus, Trabajador } from "@/data/crmData";
import {
  computeGlobalMetrics,
  formatCurrency,
  formatPercent,
  groupLeadsByEstado,
} from "@/lib/metrics";
import {
  FolderTreeIcon,
  PlusIcon,
  SparklesIcon,
  TrashIcon,
  UsersIcon,
  ZapIcon,
} from "@/components/icons";

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

export default function CRMInteligente() {
  const [data, setData] = useState(() => JSON.parse(JSON.stringify(crmData)) as typeof crmData);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>(data.trabajadores[0]?.id ?? "");
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
    planInteresado: "Fibra 300Mbps",
    valorMensualPotencial: "",
    prioridad: "media" as "alta" | "media" | "baja",
  });

  const selectedWorker = useMemo(() => {
    return data.trabajadores.find((t) => t.id === selectedWorkerId) ?? data.trabajadores[0];
  }, [data.trabajadores, selectedWorkerId]);

  const globalMetrics = useMemo(
    () => computeGlobalMetrics(data.trabajadores),
    [data.trabajadores],
  );

  const handleAddWorker = () => {
    if (!newWorker.nombre || !newWorker.email) return;

    const trabajador: Trabajador = {
      id: `t-${Date.now()}`,
      nombre: newWorker.nombre,
      email: newWorker.email,
      rol: newWorker.rol,
      equipo: newWorker.equipo,
      especialidades: ["Automatización IA", "Ventas consultivas"],
      leads: [],
      tareas: [],
      objetivos: [],
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

    setLeadDraft({ nombre: "", empresa: "", planInteresado: "Fibra 300Mbps", valorMensualPotencial: "", prioridad: "media" });
  };

  const leadsGrouped = useMemo(() =>
    selectedWorker ? groupLeadsByEstado(selectedWorker.leads) : {},
  [selectedWorker]);

  return (
    <main className="px-6 py-8 sm:px-10 lg:px-12">
      <header className="flex flex-col gap-6 rounded-3xl border border-white/5 bg-white/5 p-8 backdrop-blur">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-sky-300/80">FibraNet</p>
            <h1 className="mt-2 text-3xl font-semibold md:text-4xl">
              CRM Inteligente para Ventas de Internet
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Controla toda la operación comercial con analítica en tiempo real, automatizaciones con IA y gestión avanzada
              de equipos. Diseñado para administradores que necesitan visibilidad total y para ejecutivos que requieren foco
              en los clientes correctos.
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
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[{
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
              label: "Churn total",
              value: formatPercent(data.indicadores.churnRate),
              trend: "-1.2%",
              description: "Reducción tras campañas de fidelización",
            }].map((card) => (
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
      </header>

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
          </div>

          <div className="rounded-3xl border border-white/5 bg-white/5 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recomendaciones IA</h2>
              <SparklesIcon className="h-5 w-5 text-sky-300" />
            </div>
            <div className="mt-6 space-y-4">
              {data.recomendaciones.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-white/5 bg-slate-900/60 p-4"
                >
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
                  Vista consolidada de leads, tareas y métricas por cada ejecutivo.
                </p>
              </div>
              <FolderTreeIcon className="h-5 w-5 text-sky-300" />
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {data.trabajadores.map((trabajador) => (
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
                    <div>
                      Conversión: {formatPercent(trabajador.rendimiento.conversion)}
                    </div>
                    <div>
                      Clientes activos: {trabajador.rendimiento.clientesActivos}
                    </div>
                    <div>
                      Ticket promedio: {formatCurrency(trabajador.rendimiento.ticketsPromedio)}
                    </div>
                    <div>
                      SLA respuesta: {trabajador.rendimiento.tiempoRespuestaPromedio} min
                    </div>
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
              ))}
            </div>
          </div>

          {selectedWorker && (
            <div className="rounded-3xl border border-white/5 bg-white/5 p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Carpeta de {selectedWorker.nombre}</h2>
                  <p className="text-sm text-slate-300">
                    Leads priorizados, tareas críticas y objetivos en curso.
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

                  <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4">
                    <h3 className="text-sm font-semibold text-white">Objetivos mensuales</h3>
                    <div className="mt-4 space-y-3">
                      {selectedWorker.objetivos.length ? (
                        selectedWorker.objetivos.map((objetivo) => {
                          const progreso =
                            objetivo.objetivoIngresos > 0
                              ? Math.min(
                                  Math.round(
                                    (objetivo.ingresosAlcanzados / objetivo.objetivoIngresos) * 100,
                                  ),
                                  100,
                                )
                              : 0;
                          return (
                            <div key={objetivo.mes} className="space-y-2">
                              <div className="flex items-center justify-between text-xs text-slate-300">
                                <span>{objetivo.mes}</span>
                                <span>{progreso}%</span>
                              </div>
                              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-sky-400 via-emerald-400 to-emerald-500"
                                  style={{ width: `${progreso}%` }}
                                />
                              </div>
                              <p className="text-xs text-slate-400">
                                {formatCurrency(objetivo.ingresosAlcanzados)} de {formatCurrency(objetivo.objetivoIngresos)} · {objetivo.clientesNuevos} / {objetivo.clientesNuevosObjetivo} clientes nuevos
                              </p>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-xs text-slate-400">Define objetivos para activar la supervisión automática.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <h3 className="text-sm font-semibold text-white">Registrar nuevo lead prioritario</h3>
                      <span className="text-xs text-slate-400">
                        Las automatizaciones generarán la primera secuencia de contacto.
                      </span>
                    </div>
                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                        handleAddLead();
                      }}
                      className="mt-4 grid gap-4"
                    >
                      <div className="grid gap-4 md:grid-cols-2">
                        <input
                          value={leadDraft.nombre}
                          onChange={(event) => setLeadDraft((prev) => ({ ...prev, nombre: event.target.value }))}
                          className="rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white placeholder:text-slate-500"
                          placeholder="Contacto"
                        />
                        <input
                          value={leadDraft.empresa}
                          onChange={(event) => setLeadDraft((prev) => ({ ...prev, empresa: event.target.value }))}
                          className="rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white placeholder:text-slate-500"
                          placeholder="Empresa o residencial"
                        />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <input
                          value={leadDraft.planInteresado}
                          onChange={(event) => setLeadDraft((prev) => ({ ...prev, planInteresado: event.target.value }))}
                          className="rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white placeholder:text-slate-500"
                          placeholder="Plan sugerido"
                        />
                        <input
                          value={leadDraft.valorMensualPotencial}
                          onChange={(event) => setLeadDraft((prev) => ({ ...prev, valorMensualPotencial: event.target.value }))}
                          className="rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white placeholder:text-slate-500"
                          placeholder="Ingresos mensuales"
                        />
                      </div>
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
    </main>
  );
}
