
"use client"
import { useEffect, useState } from "react"
import tarifas from "../../../../data/tarifas.sample.json"

export default function AdminTarifas(){
  const [rows, setRows] = useState(tarifas)
  useEffect(()=>{ setRows(tarifas as any) },[])
  return (
    <div className="card">
      <h1 className="text-xl font-bold mb-3">Tarifas de operadores</h1>
      <table className="table">
        <thead><tr><th>Operador</th><th>Plan</th><th>Precio</th><th>Permanencia</th></tr></thead>
        <tbody>
          {rows.map((t:any)=>(
            <tr key={t.id}><td className="capitalize">{t.operador}</td><td>{t.plan}</td><td>{t.precio}€</td><td>{t.permanenciaMeses}m</td></tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-gray-500 mt-2">Lee datos de ejemplo. Con Supabase será editable (CRUD).</p>
    </div>
  )
}
