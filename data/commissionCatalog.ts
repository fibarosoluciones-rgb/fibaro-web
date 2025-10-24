export type CommissionProduct = {
  id: string;
  operador: "Simyo" | "Jazztel";
  segmento: string;
  tipo: string;
  tarifa: string;
  pvp: number;
  comisionAlta: number;
  comisionPorta: number;
};

type SectionConfig = {
  id: string;
  label: string;
  operador: CommissionProduct["operador"];
  descripcion: string;
  segmento: string;
  altaFactor: number;
  portaFactor: number;
  productos: Array<{
    id: string;
    tipo: string;
    tarifa: string;
    pvp: number;
  }>;
};

const sectionsConfig: SectionConfig[] = [
  {
    id: "simyo-pospago",
    label: "Simyo Pospago",
    operador: "Simyo",
    descripcion: "Tarifas móviles con comisiones diferenciadas por altas y portabilidades.",
    segmento: "Pospago",
    altaFactor: 0.45,
    portaFactor: 0.65,
    productos: [
      { id: "simyo-pos-100-0", tipo: "Línea móvil", tarifa: "100 MB - 0 min", pvp: 4 },
      { id: "simyo-pos-100-120", tipo: "Línea móvil", tarifa: "100 MB - 120 min", pvp: 4 },
      { id: "simyo-pos-4gb-0", tipo: "Línea móvil", tarifa: "4 GB - 0 min", pvp: 4 },
      { id: "simyo-pos-4gb-120", tipo: "Línea móvil", tarifa: "4 GB - 120 min", pvp: 4 },
      { id: "simyo-pos-4gb-ilim", tipo: "Línea móvil", tarifa: "4 GB - Ilimitados", pvp: 12 },
      { id: "simyo-pos-18gb-0", tipo: "Línea móvil", tarifa: "18 GB - 0 min", pvp: 12 },
      { id: "simyo-pos-18gb-120", tipo: "Línea móvil", tarifa: "18 GB - 120 min", pvp: 12 },
      { id: "simyo-pos-18gb-ilim", tipo: "Línea móvil", tarifa: "18 GB - Ilimitados", pvp: 12 },
      { id: "simyo-pos-40gb-0", tipo: "Línea móvil", tarifa: "40 GB - 0 min", pvp: 12 },
      { id: "simyo-pos-40gb-120", tipo: "Línea móvil", tarifa: "40 GB - 120 min", pvp: 12 },
      { id: "simyo-pos-40gb-ilim", tipo: "Línea móvil", tarifa: "40 GB - Ilimitados", pvp: 20 },
      { id: "simyo-pos-80gb-0", tipo: "Línea móvil", tarifa: "80 GB - 0 min", pvp: 20 },
      { id: "simyo-pos-80gb-120", tipo: "Línea móvil", tarifa: "80 GB - 120 min", pvp: 20 },
      { id: "simyo-pos-80gb-ilim", tipo: "Línea móvil", tarifa: "80 GB - Ilimitados", pvp: 28 },
      { id: "simyo-pos-200gb-0", tipo: "Línea móvil", tarifa: "200 GB - 0 min", pvp: 28 },
      { id: "simyo-pos-200gb-120", tipo: "Línea móvil", tarifa: "200 GB - 120 min", pvp: 28 },
      { id: "simyo-pos-200gb-ilim", tipo: "Línea móvil", tarifa: "200 GB - Ilimitados", pvp: 35 },
    ],
  },
  {
    id: "simyo-adicionales",
    label: "Simyo Líneas adicionales",
    operador: "Simyo",
    descripcion: "Bonos adicionales asociados a líneas principales.",
    segmento: "Líneas adicionales",
    altaFactor: 0.5,
    portaFactor: 0.7,
    productos: [
      { id: "simyo-add-4gb", tipo: "Línea adicional", tarifa: "Adicional 4 GB ilimitados", pvp: 4 },
      { id: "simyo-add-18gb", tipo: "Línea adicional", tarifa: "Adicional 18 GB ilimitados", pvp: 12 },
      { id: "simyo-add-40gb", tipo: "Línea adicional", tarifa: "Adicional 40 GB ilimitados", pvp: 12 },
      { id: "simyo-add-80gb", tipo: "Línea adicional", tarifa: "Adicional 80 GB ilimitados", pvp: 20 },
      { id: "simyo-add-200gb", tipo: "Línea adicional", tarifa: "Adicional 200 GB ilimitados", pvp: 20 },
    ],
  },
  {
    id: "simyo-fibra",
    label: "Simyo Fibra",
    operador: "Simyo",
    descripcion: "Conectividad fija de alta velocidad.",
    segmento: "Fibra",
    altaFactor: 0.6,
    portaFactor: 0.9,
    productos: [
      { id: "simyo-fibra-1g", tipo: "Fibra", tarifa: "Fibra 1GB", pvp: 24 },
      { id: "simyo-fibra-600", tipo: "Fibra", tarifa: "Fibra 600MB", pvp: 22 },
      { id: "simyo-fibra-300", tipo: "Fibra", tarifa: "Fibra 300MB", pvp: 19 },
    ],
  },
  {
    id: "jazztel-movil",
    label: "Jazztel Móvil",
    operador: "Jazztel",
    descripcion: "Planes móviles Jazztel con foco en portabilidades.",
    segmento: "Móvil",
    altaFactor: 0.5,
    portaFactor: 0.75,
    productos: [
      { id: "jazztel-mov-20", tipo: "Línea móvil", tarifa: "Sin Límites 20 GB", pvp: 12 },
      { id: "jazztel-mov-50eco", tipo: "Línea móvil", tarifa: "Sin Límites 50 GB Económica", pvp: 12 },
      { id: "jazztel-mov-15mini", tipo: "Línea móvil", tarifa: "Sin Límites 15 GB Pack Mini", pvp: 28 },
      { id: "jazztel-mov-24", tipo: "Línea móvil", tarifa: "Sin Límites 24 GB", pvp: 18 },
      { id: "jazztel-mov-25", tipo: "Línea móvil", tarifa: "Sin Límites 25 GB", pvp: 18 },
      { id: "jazztel-mov-40", tipo: "Línea móvil", tarifa: "Sin Límites 40 GB", pvp: 18 },
      { id: "jazztel-mov-50", tipo: "Línea móvil", tarifa: "Sin Límites 50 GB", pvp: 35 },
      { id: "jazztel-mov-60", tipo: "Línea móvil", tarifa: "Sin Límites 60 GB", pvp: 35 },
      { id: "jazztel-mov-100", tipo: "Línea móvil", tarifa: "Sin Límites 100 GB", pvp: 35 },
      { id: "jazztel-mov-ilim", tipo: "Línea móvil", tarifa: "Sin Límites GB Ilimitados", pvp: 42 },
      { id: "jazztel-mov-12ad", tipo: "Línea adicional", tarifa: "Sin Límites 12 GB (adicional)", pvp: 12 },
      { id: "jazztel-mov-30ad", tipo: "Línea adicional", tarifa: "Sin Límites 30 GB (adicional)", pvp: 20 },
      { id: "jazztel-mov-sl20", tipo: "Línea móvil", tarifa: "Solo Móvil SL 5G 20GB (2022)", pvp: 20 },
      { id: "jazztel-mov-sl30", tipo: "Línea móvil", tarifa: "Solo Móvil SL 5G 30GB (2022)", pvp: 28 },
    ],
  },
  {
    id: "jazztel-fijo",
    label: "Jazztel Fijo y BAM",
    operador: "Jazztel",
    descripcion: "Altas de fibra, fijo y banda ancha móvil.",
    segmento: "Fijo",
    altaFactor: 0.55,
    portaFactor: 0.85,
    productos: [
      { id: "jazztel-fijo-1g", tipo: "Fibra", tarifa: "Fibra 1GB", pvp: 24 },
      { id: "jazztel-fijo-1gred", tipo: "Fibra", tarifa: "Fibra 1GB (precio reducido)", pvp: 19 },
      { id: "jazztel-fijo-600", tipo: "Fibra", tarifa: "Fibra 600MB", pvp: 22 },
      { id: "jazztel-fijo-300", tipo: "Fibra", tarifa: "Fibra 300MB", pvp: 19 },
      { id: "jazztel-fijo-bam", tipo: "Banda ancha móvil", tarifa: "BAM", pvp: 19 },
    ],
  },
];

export type CommissionSection = {
  id: string;
  label: string;
  operador: CommissionProduct["operador"];
  descripcion: string;
  segmento: string;
  productos: CommissionProduct[];
};

export const commissionCatalog: CommissionSection[] = sectionsConfig.map((section) => ({
  id: section.id,
  label: section.label,
  operador: section.operador,
  descripcion: section.descripcion,
  segmento: section.segmento,
  productos: section.productos.map((producto) => ({
    ...producto,
    operador: section.operador,
    segmento: section.segmento,
    comisionAlta: Number((producto.pvp * section.altaFactor).toFixed(2)),
    comisionPorta: Number((producto.pvp * section.portaFactor).toFixed(2)),
  })),
}));

export const commissionProductsById = commissionCatalog
  .flatMap((section) => section.productos)
  .reduce<Record<string, CommissionProduct>>((acc, producto) => {
    acc[producto.id] = producto;
    return acc;
  }, {});

export const rappelConfig = {
  activacionesRappel: 0,
  segmentoPdv: "No aplica",
  tipoImpuesto: "Sin IVA",
};
