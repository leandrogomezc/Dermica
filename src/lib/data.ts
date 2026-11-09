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
      "Estamos preparando esta categoría para tu consulta si ya realizás rellenos con ácido hialurónico. La indicación y la aplicación las decidís vos.",
    points: [
      "Uso profesional en consulta médica.",
      "Si ya realizás este procedimiento.",
      "La indicación y la técnica las decidís vos.",
    ],
    icon: "drop",
    tone: "plum",
  },
  {
    slug: "revitalizacion-inyectable",
    name: "Revitalización inyectable",
    shortName: "Polirrevitalización",
    description:
      "Soluciones inyectables para protocolos de calidad de la piel que definís vos.",
    detail:
      "También llamada polirrevitalización, esta categoría se orienta a la calidad de la piel. La fórmula, la zona y el paciente los decidís vos; nosotros preparamos la categoría para tu consulta.",
    points: [
      "Soluciones inyectables de polirrevitalización.",
      "Orientadas a la calidad de la piel.",
      "El protocolo lo definís vos.",
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
      "Estamos preparando dermocosmética de uso profesional para acompañar tu consulta. Complementa tus protocolos, y la recomendación queda a tu criterio.",
    points: [
      "Línea de uso profesional.",
      "Para complementar los protocolos de consulta.",
      "La recomendación queda a tu criterio.",
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
