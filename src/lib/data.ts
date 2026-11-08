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
      "Geles de ácido hialurónico para el profesional médico que ya trabaja este procedimiento en su consulta.",
    detail:
      "Esta categoría reúne rellenos dérmicos de ácido hialurónico de uso profesional. La pensamos para médicos que ya realizan este tipo de procedimientos en su consulta. La aplicación sigue en esa consulta.",
    points: [
      "Geles de ácido hialurónico para uso del profesional médico.",
      "Pensados para quien ya realiza estos procedimientos.",
      "La aplicación queda en la consulta de quien trata a su paciente.",
    ],
    icon: "drop",
    tone: "plum",
  },
  {
    slug: "revitalizacion-inyectable",
    name: "Revitalización inyectable",
    shortName: "Polirrevitalización",
    description:
      "Soluciones inyectables de polirrevitalización para protocolos de calidad de la piel, a cargo del médico.",
    detail:
      "La revitalización inyectable, también descrita como polirrevitalización, está orientada a la calidad de la piel. El criterio de fórmula, zona y paciente corresponde a quien ejerce. Dérmica prepara la categoría para esa consulta.",
    points: [
      "Soluciones inyectables de polirrevitalización.",
      "Orientadas a la calidad de la piel en la consulta médica.",
      "El protocolo lo define el profesional que atiende.",
    ],
    icon: "sparkle",
    tone: "blush",
  },
  {
    slug: "dermocosmetica-profesional",
    name: "Dermocosmética profesional",
    shortName: "Cuidado de la piel",
    description:
      "Cuidado profesional de la piel para la consulta, como apoyo antes y después de un procedimiento.",
    detail:
      "La dermocosmética profesional es cuidado de la piel de uso en consulta. Acompaña el trabajo del médico antes y después de un procedimiento, y la valoración sigue siendo de quien atiende.",
    points: [
      "Cuidado de la piel para usar en la consulta.",
      "Pensado como apoyo antes y después de un procedimiento.",
      "La valoración sigue en manos del profesional que atiende.",
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
