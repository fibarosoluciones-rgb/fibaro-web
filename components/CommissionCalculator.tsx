"use client";

import { useMemo, useState } from "react";

import { commissionCatalog, commissionProductsById } from "@/data/commissionCatalog";
import { Trabajador } from "@/data/crmData";
import { formatCurrency } from "@/lib/metrics";
import { SparklesIcon, ZapIcon } from "@/components/icons";

type CommissionCalculatorProps = {
  trabajadores: Trabajador[];
  onRegistrarVenta: (venta: { trabajadorId: string; productoId: string; altas: number; portas: number }) => void;
};

export const CommissionCalculator = ({ trabajadores, onRegistrarVenta }: CommissionCalculatorProps) => {
  const [sectionId, setSectionId] = useState<string>(commissionCatalog[0]?.id ?? "");
  const productosSeccion = useMemo(
    () => commissionCatalog.find((section) => section.id === sectionId)?.productos ?? [],
    [sectionId],
  );
  const [productoId, setProductoId] = useState<string>(productosSeccion[0]?.id ?? "");
  const [altas, setAltas] = useState<number>(0);
  const [portas, setPortas] = useState<number>(0);
  const [trabajadorId, setTrabajadorId] = useState<string>(trabajadores[0]?.id ?? "");
  const [mensaje, setMensaje] = useState<string>("");

  const productoSeleccionado = commissionProductsById[productoId];

  const totales = useMemo(() => {
    if (!productoSeleccionado) {
      return {
        ingreso: 0,
        comision: 0,
        operaciones: 0,
      };
    }

    const operaciones = altas + portas;
    const ingreso = productoSeleccionado.pvp * operaciones;
    const comision =
      productoSeleccionado.comisionAlta * altas + productoSeleccionado.comisionPorta * portas;

    return {
      ingreso,
      comision,
      operaciones,
    };
  }, [productoSeleccionado, altas, portas]);

  const resetForm = () => {
    setAltas(0);
    setPortas(0);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!productoSeleccionado || !trabajadorId) return;

    onRegistrarVenta({ trabajadorId, productoId: productoSeleccionado.id, altas, portas });
    setMensaje("Venta registrada correctamente en la carpeta del comercial seleccionado.");
    resetForm();
  };

  return (
    <section className="rounded-3xl border border-white/5 bg-white/5 p-6">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-sky-300/80">Calculadora de comisiones</p>
          <h2 className="mt-2 text-lg font-semibold">Gestiona activaciones en tiempo real</h2>
          <p className="text-sm text-slate-300">
            Selecciona la marca, tarifa y tipo de operación para estimar comisiones y registrar ventas en el CRM.
          </p>
        </div>
        <SparklesIcon className="h-6 w-6 text-sky-300" />
      </header>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-6 lg:grid-cols-[3fr,2fr]">
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm text-slate-200">
              <span className="text-xs uppercase tracking-widest text-slate-400">Operador y segmento</span>
              <select
                value={sectionId}
                onChange={(event) => {
                  const nuevoId = event.target.value;
                  setSectionId(nuevoId);
                  const nuevosProductos = commissionCatalog.find((section) => section.id === nuevoId)?.productos ?? [];
                  setProductoId(nuevosProductos[0]?.id ?? "");
                }}
                className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white"
              >
                {commissionCatalog.map((section) => (
                  <option key={section.id} value={section.id} className="bg-slate-900">
                    {section.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm text-slate-200">
              <span className="text-xs uppercase tracking-widest text-slate-400">Tarifa</span>
              <select
                value={productoId}
                onChange={(event) => setProductoId(event.target.value)}
                className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white"
              >
                {productosSeccion.map((producto) => (
                  <option key={producto.id} value={producto.id} className="bg-slate-900">
                    {producto.tarifa}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {productoSeleccionado ? (
            <div className="grid gap-4 rounded-2xl border border-sky-500/40 bg-sky-500/10 p-4 text-xs text-slate-200 sm:grid-cols-3">
              <div>
                <p className="text-slate-300">PVP</p>
                <p className="mt-1 text-sm font-semibold text-white">{formatCurrency(productoSeleccionado.pvp)}</p>
              </div>
              <div>
                <p className="text-slate-300">Comisión por alta</p>
                <p className="mt-1 text-sm font-semibold text-white">
                  {formatCurrency(productoSeleccionado.comisionAlta)}
                </p>
              </div>
              <div>
                <p className="text-slate-300">Comisión por porta</p>
                <p className="mt-1 text-sm font-semibold text-white">
                  {formatCurrency(productoSeleccionado.comisionPorta)}
                </p>
              </div>
            </div>
          ) : (
            <p className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-xs text-slate-400">
              Selecciona una tarifa para ver el detalle económico.
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm text-slate-200">
              <span className="text-xs uppercase tracking-widest text-slate-400">Altas</span>
              <input
                type="number"
                min={0}
                value={altas}
                onChange={(event) => setAltas(Number(event.target.value))}
                className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-slate-200">
              <span className="text-xs uppercase tracking-widest text-slate-400">Portas</span>
              <input
                type="number"
                min={0}
                value={portas}
                onChange={(event) => setPortas(Number(event.target.value))}
                className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white"
              />
            </label>
          </div>

          <label className="flex flex-col gap-2 text-sm text-slate-200">
            <span className="text-xs uppercase tracking-widest text-slate-400">Asignar a comercial</span>
            <select
              value={trabajadorId}
              onChange={(event) => setTrabajadorId(event.target.value)}
              className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white"
            >
              {trabajadores.map((trabajador) => (
                <option key={trabajador.id} value={trabajador.id} className="bg-slate-900">
                  {trabajador.nombre}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/60 p-5">
          <div className="space-y-4 text-sm text-slate-200">
            <div className="flex items-center justify-between">
              <span>Operaciones</span>
              <span className="text-lg font-semibold text-white">{totales.operaciones}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Ingreso estimado</span>
              <span className="text-lg font-semibold text-white">{formatCurrency(totales.ingreso)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Comisión estimada</span>
              <span className="text-lg font-semibold text-emerald-300">{formatCurrency(totales.comision)}</span>
            </div>
            <p className="text-xs text-slate-400">
              El cálculo considera los importes unitarios definidos para altas y portabilidades de cada tarifa.
            </p>
          </div>

          <button
            type="submit"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:bg-emerald-400"
          >
            <ZapIcon className="h-4 w-4" /> Registrar venta en CRM
          </button>

          {mensaje && (
            <p className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-200">
              {mensaje}
            </p>
          )}
        </div>
      </form>
    </section>
  );
};
