export type Category = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  detail: string;
  points: string[];
  icon: "drop" | "sparkle" | "leaf";
  tone: "plum" | "blush" | "gold" | "ink";
};

export const categories: Category[] = [
  {
    slug: "rellenos-acido-hialuronico",
    name: "Rellenos dérmicos de ácido hialurónico",
    shortName: "Ácido hialurónico",
    description:
      "Geles de ácido hialurónico que prevemos poner a disposición de profesionales médicos. No es un tratamiento aplicado por Dérmica.",
    detail:
      "Esta categoría reúne rellenos dérmicos de ácido hialurónico de uso profesional. La pensamos para médicos que ya realizan este tipo de procedimientos en su consulta. Dérmica no aplica el producto, no agenda pacientes y no publica una marca, una presentación ni un precio.",
    points: [
      "Categoría prevista: rellenos dérmicos de ácido hialurónico.",
      "Destinada a profesionales médicos, no a la venta al público.",
      "Sin nombre comercial, sin precio y sin existencias en esta página.",
      "La disponibilidad quedará sujeta a la apertura y a la normativa que corresponda. No afirmamos un registro sanitario.",
    ],
    icon: "drop",
    tone: "plum",
  },
  {
    slug: "revitalizacion-inyectable",
    name: "Revitalización inyectable",
    shortName: "Polirrevitalización",
    description:
      "Soluciones inyectables de polirrevitalización que prevemos ofrecer para protocolos de calidad de la piel, siempre a cargo del médico.",
    detail:
      "Prevemos una categoría de revitalización inyectable, también descrita como polirrevitalización, orientada a la calidad de la piel. No detallamos una fórmula, una zona ni un resultado: eso corresponde al criterio del profesional que trate a su paciente. Dérmica no ofrece la aplicación ni una cita.",
    points: [
      "Categoría prevista: soluciones inyectables de polirrevitalización.",
      "Pensada para el consultorio médico, no como un servicio de Dérmica.",
      "No describimos ingredientes, dosis ni indicaciones para pacientes.",
      "Hoy no se puede encargar ni reservar.",
    ],
    icon: "sparkle",
    tone: "blush",
  },
  {
    slug: "dermocosmetica-profesional",
    name: "Dermocosmética profesional",
    shortName: "Cuidado de la piel",
    description:
      "Cuidado profesional de la piel que prevemos ofrecer para la consulta, como apoyo antes y después de un procedimiento.",
    detail:
      "La dermocosmética profesional es cuidado de la piel de uso en consulta. La prevemos como complemento del trabajo del médico, no como una línea de mostrador, un spa ni un tratamiento que Dérmica realice. No prometemos tolerancia, eficacia ni un protocolo cerrado.",
    points: [
      "Categoría prevista: dermocosmética y cuidado profesional de la piel.",
      "Orientada al uso en consulta, no a la venta directa a pacientes desde este sitio.",
      "Sin catálogo de referencias, sin precios y sin promesa de resultado.",
      "No sustituye la valoración del profesional que atiende a su paciente.",
    ],
    icon: "leaf",
    tone: "gold",
  },
];

export type FocusPoint = {
  slug: string;
  label: string;
  note: string;
  x: number;
  y: number;
};

export const focusPoints: FocusPoint[] = [
  {
    slug: "rellenos-acido-hialuronico",
    label: "Ácido hialurónico",
    note: "Relleno dérmico",
    x: 34,
    y: 32,
  },
  {
    slug: "revitalizacion-inyectable",
    label: "Polirrevitalización",
    note: "Uso médico",
    x: 28,
    y: 50,
  },
  {
    slug: "dermocosmetica-profesional",
    label: "Dermocosmética",
    note: "Cuidado profesional",
    x: 36,
    y: 68,
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}
