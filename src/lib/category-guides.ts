export type CategoryGuideSection = {
  heading: string;
  paragraphs: string[];
};

export const categoryLimits = [
  "No publicamos el monto del precio de apertura, las sedes ni los envíos.",
  "Anotarte no te garantiza el cupo ni confirma una compra. Te avisamos primero.",
  "La indicación y la técnica las decidís vos. Dérmica no atiende pacientes.",
] as const;

export const categoryGuides: Record<string, CategoryGuideSection[]> = {
  "rellenos-acido-hialuronico": [
    {
      heading: "Uso profesional",
      paragraphs: [
        "Esta ficha describe los rellenos dérmicos de ácido hialurónico que preparamos para tu consulta en Nicaragua. No es una guía de aplicación ni un listado de marcas. Habla de geles de uso profesional para quien ya realiza este procedimiento.",
        "La indicación, la zona y la técnica las definís vos. Acá no publicamos un protocolo, una cantidad ni un resultado. Dérmica no aplica el producto y no abre citas. Si ya realizás rellenos, esta ficha te dice qué categoría estamos preparando y qué no vas a encontrar todavía: ni una marca, ni el monto, ni un modo de uso.",
      ],
    },
    {
      heading: "Para quién es",
      paragraphs: [
        "Es para tu práctica si ya trabajás rellenos. En el sitio pensamos en dermatología, medicina estética y cirugía. Si tu consulta no incluye este procedimiento, la ficha no te pide que lo empieces.",
        "Si buscás un tratamiento para un paciente o para vos, este no es el lugar. No somos una clínica y no podemos decirte si un procedimiento conviene. Esa conversación es con el médico que atiende.",
        "Si querés el aviso de apertura, dejanos tu correo. El nombre, la especialidad, la ciudad y el teléfono podés agregarlos, pero no hacen falta para anotarte.",
      ],
    },
  ],
  "revitalizacion-inyectable": [
    {
      heading: "Uso profesional",
      paragraphs: [
        "La revitalización inyectable, también llamada polirrevitalización en esta página, es una categoría para tu consulta en Nicaragua. Son soluciones inyectables orientadas a la calidad de la piel. No es un protocolo ni trae nombres comerciales.",
        "Vos definís la fórmula que elegís, la zona y el paciente. Dérmica no decide el tratamiento, no lo realiza y no publica una receta ni una secuencia de sesiones. La ficha existe para que reconozcas el tipo de insumo, no para que elijas un procedimiento por esta página.",
      ],
    },
    {
      heading: "Para quién es",
      paragraphs: [
        "Está pensada si ya trabajás protocolos de calidad de la piel. Los perfiles que tenemos en mente son dermatología, medicina estética y cirugía. Si ese no es tu ejercicio, la ficha no te invita a empezar una técnica nueva.",
        "Si buscás un tratamiento para un paciente o para vos, no podemos ayudarte desde aquí. No somos una clínica.",
        "Si querés el aviso de apertura, dejanos tu correo. La casilla del aviso viene desmarcada y es necesaria para anotarte. Las novedades de marketing son otra casilla, opcional y solo por correo.",
      ],
    },
  ],
  "dermocosmetica-profesional": [
    {
      heading: "Uso profesional",
      paragraphs: [
        "La dermocosmética profesional es una línea para acompañar tu consulta, no una tienda de cuidado de la piel para el público general. Complementa los protocolos que ya definís vos. La recomendación de usarla, o de no usarla, queda a tu criterio.",
        "Esta página no arma una rutina para una persona concreta ni publica nombres comerciales. Describe el tipo de insumo que estamos preparando en Nicaragua, para que sepas si encaja con la consulta que ya tenés y no con una venta al público. No reemplaza la recomendación que das en el consultorio.",
      ],
    },
    {
      heading: "Para quién es",
      paragraphs: [
        "Es para profesionales que ya acompañan la consulta con dermocosmética de uso profesional: dermatología, medicina estética y cirugía. No está armada para que armes una rutina por tu cuenta a partir de este texto.",
        "Si buscás un producto para usar en casa o una cita para que te indiquen uno, Dérmica no puede ayudarte. No vendemos al público desde esta página.",
        "Si querés saber cuándo abramos, dejanos tu correo. Pedimos ese correo y la aceptación del aviso. El resto de los datos es opcional.",
      ],
    },
  ],
};
