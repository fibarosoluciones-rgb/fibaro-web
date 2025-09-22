
export default function AdminHome(){
  return (
    <div className="grid gap-4">
      <div className="card">
        <h1 className="text-2xl font-bold">Panel de administración</h1>
        <p className="text-gray-600 mt-1">Esqueleto listo para conectar a Supabase.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card"><b>Leads hoy</b><div className="text-3xl font-extrabold">0</div></div>
        <div className="card"><b>Ventas mes</b><div className="text-3xl font-extrabold">0</div></div>
        <div className="card"><b>Comerciales activos</b><div className="text-3xl font-extrabold">0</div></div>
      </div>
    </div>
  )
}
