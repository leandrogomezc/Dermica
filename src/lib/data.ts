export type Category = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  icon: string;
};

export type Product = {
  slug: string;
  name: string;
  sku: string;
  category: string; // category slug
  brand: string;
  shortDescription: string;
  description: string;
  features: string[];
  priceLps: number;
  priceUsd: number;
  badge?: string;
  // tono para el placeholder visual
  tone: "plum" | "blush" | "gold" | "ink";
};

export type Brand = {
  name: string;
  origin: string;
};

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  city: string;
};

export const categories: Category[] = [
  {
    slug: "medicina-estetica",
    name: "Medicina estética inyectable",
    shortName: "Medicina estética",
    description:
      "Toxina botulínica, bioestimuladores y rellenos de ácido hialurónico de Merz Aesthetics: Xeomin, Radiesse y Belotero.",
    icon: "drop",
  },
  {
    slug: "aparatologia",
    name: "Aparatología estética",
    shortName: "Aparatología",
    description:
      "Equipos profesionales para tratamientos faciales y corporales: radiofrecuencia, cavitación, HIFU y más.",
    icon: "device",
  },
  {
    slug: "cuidado-piel",
    name: "Cuidado de la piel",
    shortName: "Cuidado de la piel",
    description:
      "Sérums, peelings, mascarillas y activos profesionales para protocolos faciales de alto rendimiento.",
    icon: "drop",
  },
  {
    slug: "pestanas-unas",
    name: "Insumos para pestañas y uñas",
    shortName: "Pestañas y uñas",
    description:
      "Todo para lash & nails: extensiones, adhesivos, geles, acrílicos y herramientas de precisión.",
    icon: "sparkle",
  },
  {
    slug: "insumos-spa",
    name: "Consumibles e insumos de spa",
    shortName: "Insumos de spa",
    description:
      "Desechables, mobiliario y consumibles para mantener tu cabina impecable y lista para atender.",
    icon: "leaf",
  },
];

export const brands: Brand[] = [
  { name: "Merz Aesthetics", origin: "Alemania" },
  { name: "Dermalux", origin: "España" },
  { name: "AestheticPro", origin: "Estados Unidos" },
  { name: "SkinLab", origin: "Corea" },
  { name: "LashCouture", origin: "Estados Unidos" },
  { name: "NailSystem", origin: "Italia" },
  { name: "PureGlow", origin: "Francia" },
  { name: "BioDerm", origin: "Alemania" },
  { name: "SpaEssentials", origin: "México" },
];

export const products: Product[] = [
  {
    slug: "xeomin",
    name: "Xeomin (Toxina Botulínica Tipo A)",
    sku: "MZ-XEO-100",
    category: "medicina-estetica",
    brand: "Merz Aesthetics",
    shortDescription:
      "Toxina botulínica purificada (incobotulinumtoxinA) para suavizar líneas de expresión.",
    description:
      "Xeomin es una toxina botulínica tipo A de Merz Aesthetics, purificada y libre de proteínas complejantes (incobotulinumtoxinA). Relaja de forma controlada la musculatura responsable de las líneas dinámicas de la frente, el entrecejo y las patas de gallo, logrando un resultado natural y predecible. Presentación de 100 U para uso médico profesional.",
    features: [
      "Fórmula libre de proteínas complejantes",
      "Resultados naturales en líneas de expresión",
      "Presentación de 100 unidades",
      "Producto original Merz Aesthetics",
    ],
    priceLps: 7900,
    priceUsd: 318,
    badge: "Más vendido",
    tone: "plum",
  },
  {
    slug: "radiesse",
    name: "Radiesse (Bioestimulador de Colágeno)",
    sku: "MZ-RAD-15",
    category: "medicina-estetica",
    brand: "Merz Aesthetics",
    shortDescription:
      "Hidroxiapatita cálcica que restaura volumen y estimula colágeno propio.",
    description:
      "Radiesse es un inyectable de hidroxiapatita cálcica (CaHA) que actúa en dos fases: aporta volumen inmediato y estimula la producción natural de colágeno y elastina para resultados progresivos y duraderos. Ideal para contorno mandibular, pómulos, manos y mejora de la calidad de la piel. Jeringa de 1.5 ml.",
    features: [
      "Doble acción: volumen inmediato + colágeno",
      "Resultados de larga duración",
      "Ideal para contorno y pómulos",
      "Jeringa de 1.5 ml",
    ],
    priceLps: 9500,
    priceUsd: 382,
    badge: "Destacado",
    tone: "gold",
  },
  {
    slug: "belotero",
    name: "Belotero (Relleno de Ácido Hialurónico)",
    sku: "MZ-BEL-1",
    category: "medicina-estetica",
    brand: "Merz Aesthetics",
    shortDescription:
      "Ácido hialurónico de integración natural para labios, surcos e hidratación.",
    description:
      "Belotero es una gama de rellenos de ácido hialurónico con tecnología de integración uniforme que se adapta de forma natural a los tejidos. Perfecto para definir y dar volumen a labios, corregir surcos nasogenianos y líneas finas, e hidratar en profundidad con un acabado suave y sin irregularidades. Jeringa de 1 ml.",
    features: [
      "Integración natural en el tejido",
      "Para labios, surcos y líneas finas",
      "Acabado suave y uniforme",
      "Jeringa de 1 ml",
    ],
    priceLps: 6800,
    priceUsd: 274,
    badge: "Nuevo",
    tone: "blush",
  },
  {
    slug: "equipo-radiofrecuencia-multipolar",
    name: "Equipo de Radiofrecuencia Multipolar Pro",
    sku: "AP-RF-100",
    category: "aparatologia",
    brand: "AestheticPro",
    shortDescription:
      "Radiofrecuencia facial y corporal para reafirmar, tensar y estimular colágeno.",
    description:
      "Equipo de radiofrecuencia multipolar de grado profesional, ideal para tratamientos faciales y corporales. Tecnología de calentamiento profundo que estimula la producción de colágeno, reafirma y mejora la textura de la piel desde la primera sesión.",
    features: [
      "Cabezales facial y corporal incluidos",
      "Pantalla táctil con protocolos preconfigurados",
      "Garantía de 1 año y soporte técnico local",
      "Capacitación de uso incluida",
    ],
    priceLps: 48500,
    priceUsd: 1950,
    badge: "Más vendido",
    tone: "plum",
  },
  {
    slug: "cavitacion-vacuum-6en1",
    name: "Cavitación + Vacuum 6 en 1",
    sku: "AP-CAV-600",
    category: "aparatologia",
    brand: "AestheticPro",
    shortDescription:
      "Plataforma multifunción para tratamientos corporales reductivos y moldeadores.",
    description:
      "Plataforma 6 en 1 que combina cavitación, vacuum, radiofrecuencia y vacumterapia para protocolos corporales completos. Pensada para spas y clínicas que buscan ofrecer resultados visibles en moldeado y reducción.",
    features: [
      "6 tecnologías en un solo equipo",
      "Carro rodante y bases para cabezales",
      "Manual de protocolos en español",
      "Garantía de 1 año",
    ],
    priceLps: 62000,
    priceUsd: 2490,
    tone: "ink",
  },
  {
    slug: "serum-vitamina-c-profesional",
    name: "Sérum de Vitamina C Profesional 20%",
    sku: "CP-VC-020",
    category: "cuidado-piel",
    brand: "SkinLab",
    shortDescription:
      "Antioxidante de alta concentración para luminosidad y unificación del tono.",
    description:
      "Sérum profesional con 20% de vitamina C estabilizada, ácido ferúlico y vitamina E. Aporta luminosidad, unifica el tono y protege frente a la oxidación. Presentación profesional rendidora para cabina.",
    features: [
      "Presentación profesional de 50 ml",
      "Fórmula estabilizada de alta absorción",
      "Apto para protocolos de luminosidad",
      "Distribuidor autorizado",
    ],
    priceLps: 1290,
    priceUsd: 52,
    badge: "Nuevo",
    tone: "gold",
  },
  {
    slug: "peeling-acido-mandelico",
    name: "Peeling de Ácido Mandélico 40%",
    sku: "CP-PM-040",
    category: "cuidado-piel",
    brand: "Dermalux",
    shortDescription:
      "Exfoliación profesional suave, ideal para pieles sensibles y con manchas.",
    description:
      "Peeling profesional de ácido mandélico al 40% para renovación celular controlada. Ideal para tratar manchas, textura irregular y acné en pieles sensibles, con bajo riesgo de irritación.",
    features: [
      "Uso exclusivo profesional",
      "Incluye ficha técnica y protocolo",
      "Presentación de 30 ml",
      "Neutralizante recomendado disponible",
    ],
    priceLps: 1650,
    priceUsd: 66,
    tone: "blush",
  },
  {
    slug: "mascarilla-hidrogel-colageno",
    name: "Mascarilla de Hidrogel con Colágeno (caja x10)",
    sku: "CP-MH-010",
    category: "cuidado-piel",
    brand: "PureGlow",
    shortDescription:
      "Hidratación intensa y efecto tensor inmediato para protocolos premium.",
    description:
      "Caja de 10 mascarillas de hidrogel enriquecidas con colágeno y ácido hialurónico. Brindan hidratación profunda, efecto tensor y sensación de frescura, perfectas para cerrar cualquier tratamiento facial.",
    features: [
      "Caja con 10 unidades individuales",
      "Efecto tensor y descongestionante",
      "Listas para usar en cabina",
      "Aroma neutro",
    ],
    priceLps: 980,
    priceUsd: 39,
    tone: "blush",
  },
  {
    slug: "kit-extensiones-pestanas-volumen",
    name: "Kit de Extensiones de Pestañas Volumen",
    sku: "PU-EP-VOL",
    category: "pestanas-unas",
    brand: "LashCouture",
    shortDescription:
      "Set completo para volumen ruso: bandejas, adhesivo y herramientas.",
    description:
      "Kit profesional para técnica de volumen con bandejas de pestañas en múltiples curvaturas y grosores, adhesivo de secado rápido, pinzas de precisión y accesorios. Todo lo que necesitas para iniciar o reabastecer tu servicio de lashes.",
    features: [
      "Bandejas en curvaturas C, D y CC",
      "Adhesivo profesional de secado rápido",
      "Pinzas de precisión incluidas",
      "Rinde para múltiples servicios",
    ],
    priceLps: 2150,
    priceUsd: 86,
    badge: "Más vendido",
    tone: "plum",
  },
  {
    slug: "gel-constructor-unas",
    name: "Gel Constructor para Uñas (paquete x6)",
    sku: "PU-GC-006",
    category: "pestanas-unas",
    brand: "NailSystem",
    shortDescription:
      "Gel de construcción de alta resistencia en tonos nude y transparentes.",
    description:
      "Paquete de 6 geles constructores de alta resistencia y autonivelación, en tonos nude y transparentes. Ideales para extensiones y refuerzo de uña natural con acabado profesional duradero.",
    features: [
      "6 tonos profesionales",
      "Alta resistencia y autonivelación",
      "Curado en lámpara LED/UV",
      "Bajo olor",
    ],
    priceLps: 1480,
    priceUsd: 59,
    tone: "gold",
  },
  {
    slug: "camilla-facial-electrica",
    name: "Camilla Facial Eléctrica Reclinable",
    sku: "IS-CF-300",
    category: "insumos-spa",
    brand: "SpaEssentials",
    shortDescription:
      "Camilla ergonómica con ajuste eléctrico para máxima comodidad.",
    description:
      "Camilla facial eléctrica con respaldo y altura ajustables mediante control. Tapizado de alta densidad, fácil de limpiar y diseñada para brindar comodidad al cliente durante tratamientos prolongados.",
    features: [
      "Ajuste eléctrico de altura e inclinación",
      "Tapizado resistente y lavable",
      "Capacidad de hasta 150 kg",
      "Garantía de 1 año",
    ],
    priceLps: 18900,
    priceUsd: 760,
    tone: "ink",
  },
  {
    slug: "kit-desechables-cabina",
    name: "Kit de Desechables para Cabina (mensual)",
    sku: "IS-DC-MEN",
    category: "insumos-spa",
    brand: "SpaEssentials",
    shortDescription:
      "Abastecimiento mensual: guantes, gorros, sábanas y más.",
    description:
      "Kit de consumibles desechables para mantener tu cabina higiénica y operativa durante todo el mes: guantes de nitrilo, gorros, sábanas desechables, diademas y aplicadores. Ahorra tiempo abasteciéndote en un solo pedido.",
    features: [
      "Surtido pensado para 1 mes de operación",
      "Productos de uso profesional",
      "Pedido recurrente disponible",
      "Precio mayorista",
    ],
    priceLps: 1750,
    priceUsd: 70,
    tone: "blush",
  },
];

export type Injectable = {
  slug: string;
  product: string;
  zone: string;
  label: string;
  // Posición de la caja sobre el retrato, en porcentaje
  x: number;
  y: number;
};

// Zonas de tratamiento que se resaltan sobre el rostro del hero.
export const injectables: Injectable[] = [
  {
    slug: "xeomin",
    product: "Xeomin",
    zone: "Frente y entrecejo",
    label: "Líneas de expresión",
    x: 60,
    y: 22,
  },
  {
    slug: "radiesse",
    product: "Radiesse",
    zone: "Pómulos y contorno",
    label: "Volumen y colágeno",
    x: 47,
    y: 45,
  },
  {
    slug: "belotero",
    product: "Belotero",
    zone: "Labios y surcos",
    label: "Hidratación y relleno",
    x: 57,
    y: 62,
  },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "Desde que trabajo con Dérmica mi clínica nunca se queda sin insumos. La asesoría y los tiempos de envío son excelentes.",
    author: "Dra. Karen Mejía",
    role: "Dermatóloga, Clínica Piel Sana",
    city: "Tegucigalpa",
  },
  {
    quote:
      "Los equipos llegaron con capacitación incluida y el respaldo técnico me dio mucha confianza para invertir.",
    author: "Andrea Fonseca",
    role: "Propietaria, Spa Lirio",
    city: "San Pedro Sula",
  },
  {
    quote:
      "Cotizo por WhatsApp y en minutos tengo todo listo. Los precios en lempiras y la entrega a domicilio me facilitan la vida.",
    author: "Gabriela Núñez",
    role: "Lash & Nail Artist",
    city: "La Ceiba",
  },
];

export function getProductsByCategory(slug: string): Product[] {
  return products.filter((p) => p.category === slug);
}

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function formatLps(value: number): string {
  return "L. " + value.toLocaleString("es-HN");
}

export function formatUsd(value: number): string {
  return "$" + value.toLocaleString("en-US");
}
