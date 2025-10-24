import "@/styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FibraNet CRM Inteligente",
  description:
    "Panel CRM inteligente para seguimiento de ventas de tarifas de internet con automatización y analítica en tiempo real.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          {children}
        </div>
      </body>
    </html>
  );
}
