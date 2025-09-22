
import Link from "next/link"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid md:grid-cols-5 gap-4">
      <aside className="md:col-span-1">
        <div className="card">
          <h2 className="font-bold mb-2">Admin</h2>
          <nav className="grid gap-2 text-sm">
            <Link href="/admin">Dashboard</Link>
            <Link href="/admin/tarifas">Tarifas</Link>
            <Link href="/admin/productos">Productos</Link>
            <Link href="/admin/comerciales">Comerciales</Link>
            <Link href="/admin/clientes">Clientes</Link>
            <Link href="/admin/ajustes">Ajustes</Link>
          </nav>
        </div>
      </aside>
      <section className="md:col-span-4">{children}</section>
    </div>
  )
}
