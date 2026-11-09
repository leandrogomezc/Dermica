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
      "Geles de ácido hialurónico de uso profesional para médicos que ya trabajan este procedimiento.",
    detail:
      "Estamos preparando esta categoría para médicos que realizan rellenos con ácido hialurónico en su consulta. El criterio de indicación y aplicación es siempre del profesional.",
    points: [
      "Uso profesional en consulta médica.",
      "Para quienes ya realizan este procedimiento.",
      "Indicación y técnica a cargo del médico.",
    ],
    icon: "drop",
    tone: "plum",
  },
  {
    slug: "revitalizacion-inyectable",
    name: "Revitalización inyectable",
    shortName: "Polirrevitalización",
    description:
      "Soluciones inyectables para protocolos de calidad de la piel definidos por el médico.",
    detail:
      "También llamada polirrevitalización, esta categoría se orienta a la calidad de la piel. La fórmula, la zona y el paciente los decide quien ejerce; nosotros preparamos la categoría para esa consulta.",
    points: [
      "Soluciones inyectables de polirrevitalización.",
      "Orientadas a la calidad de la piel.",
      "Protocolo definido por el profesional.",
    ],
    icon: "sparkle",
    tone: "blush",
  },
  {
    slug: "dermocosmetica-profesional",
    name: "Dermocosmética profesional",
    shortName: "Cuidado de la piel",
    description:
      "Dermocosmética de uso profesional para acompañar la práctica médica.",
    detail:
      "Estamos preparando dermocosmética de uso profesional para acompañar la consulta. Complementa los protocolos del médico, y la recomendación queda a su criterio.",
    points: [
      "Línea de uso profesional.",
      "Para complementar los protocolos de consulta.",
      "Recomendación a criterio del médico.",
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
