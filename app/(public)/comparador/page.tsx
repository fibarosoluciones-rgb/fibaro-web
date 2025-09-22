
"use client"
import { useMemo, useState } from "react"
import tarifas from "../../../data/tarifas.sample.json"
import { recommend, type Need, type Tarifa } from "../../../lib/recommender"

export default function Comparador() {
  const [type, setType] = useState<Need['type']>('fibra')
  const [down, setDown] = useState(300)
  const [up, setUp] = useState(300)
  const [datos, setDatos] = useState(20)
  const [minutos, setMinutos] = useState(1000)
  const [maxPrice, setMaxPrice] = useState<number|undefined>(30)

  const need: Need = { type, down, up, datos, minutos, maxPrice }
  const opciones = useMemo(()=>recommend(need, tarifas as unknown as Tarifa[]), [type,down,up,datos,minutos,maxPrice])

  return (
    <section className="grid gap-4">
      <div className="card">
        <h1 className="text-2xl font-bold mb-2">Comparador</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">Tipo
            <select className="mt-1 border rounded-lg w-full p-2" value={type} onChange={e=>setType(e.target.value as any)}>
              <option value="fibra">Fibra</option>
              <option value="movil">Móvil</option>
              <option value="pack">Pack</option>
            </select>
          </label>
          <label className="block">Precio máximo (€ / mes)
            <input className="mt-1 border rounded-lg w-full p-2" type="number" value={maxPrice??''} onChange={e=>setMaxPrice(e.target.value? Number(e.target.value): undefined)} />
          </label>
          {type!=="movil" && <label className="block">Bajada (Mb)
            <input className="mt-1 border rounded-lg w-full p-2" type="number" value={down} onChange={e=>setDown(Number(e.target.value))} />
          </label>}
          {type!=="movil" && <label className="block">Subida (Mb)
            <input className="mt-1 border rounded-lg w-full p-2" type="number" value={up} onChange={e=>setUp(Number(e.target.value))} />
          </label>}
          {type!=="fibra" && <label className="block">Datos (GB)
            <input className="mt-1 border rounded-lg w-full p-2" type="number" value={datos} onChange={e=>setDatos(Number(e.target.value))} />
          </label>}
          {type!=="fibra" && <label className="block">Minutos
            <input className="mt-1 border rounded-lg w-full p-2" type="number" value={minutos} onChange={e=>setMinutos(Number(e.target.value))} />
          </label>}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {opciones.map(opt => (
          <div key={opt.tipo} className="card">
            <div className="text-xs uppercase text-gray-500">Opción {opt.tipo}</div>
            <div className="font-bold">{opt.tarifa.plan}</div>
            <div className="capitalize text-gray-600">{opt.tarifa.operador}</div>
            <div className="text-3xl font-extrabold mt-2">{opt.tarifa.precio.toFixed(2)}€<span className="text-base font-medium text-gray-500">/mes</span></div>
          </div>
        ))}
      </div>
    </section>
  )
}
