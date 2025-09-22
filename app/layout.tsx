
import "../styles/globals.css"
import Link from "next/link"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <header className="bg-white border-b">
          <div className="container p-4 flex items-center justify-between">
            <Link href="/" className="font-bold">Fíbaro</Link>
            <nav className="nav">
              <Link href="/comparador">Comparador</Link>
              <Link href="/productos">Tienda</Link>
              <Link href="/cuenta">Mi cuenta</Link>
              <Link href="/admin">Admin</Link>
            </nav>
          </div>
        </header>
        <main className="container p-4">{children}</main>
      </body>
    </html>
  )
}
