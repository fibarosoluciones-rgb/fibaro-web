
import Link from "next/link"

export default function Home() {
  return (
    <section className="grid gap-4">
      <div className="card">
        <h1 className="text-3xl font-bold">Fíbaro – MVP</h1>
        <p className="mt-2">Servicio premium a precio competente.</p>
        <div className="mt-4 flex gap-3">
          <Link href="/comparador" className="btn">Comparar tarifas</Link>
          <Link href="/admin" className="btn">Panel admin</Link>
        </div>
      </div>
    </section>
  )
}
