export type CategoryGuideSection = {
  heading: string;
  paragraphs: string[];
};

export const categoryGuides: Record<string, CategoryGuideSection[]> = {
  "rellenos-acido-hialuronico": [
    {
      heading: "Uso profesional",
      paragraphs: [
        "Esta ficha presenta la categoría de rellenos dérmicos de ácido hialurónico que Dérmica prepara para la práctica médica en Nicaragua. No es un listado de marcas, un precio ni una guía de aplicación. Sirve para explicar qué tipo de insumo estamos organizando y qué límites tiene esta página mientras dura el prelanzamiento.",
        "El uso previsto es profesional y ocurre en la consulta. Hablamos de geles de ácido hialurónico para médicos que ya realizan este procedimiento. La página no está hecha para el público general ni para quien busca hacerse un tratamiento en casa. Dérmica no aplica el producto, no abre una cita y no atiende pacientes.",
        "La decisión clínica no es nuestra. La indicación, la zona, la técnica y la persona que recibe el procedimiento las define quien ejerce. Aquí no publicamos un protocolo, una cantidad ni un resultado. La ficha se queda en la categoría y no usa nombres comerciales.",
      ],
    },
    {
      heading: "Para quién es",
      paragraphs: [
        "Está pensada para profesionales médicos que ya trabajan rellenos en su consulta. En el sitio, los perfiles que tenemos en mente son dermatología, medicina estética y cirugía. Si tu práctica no incluye este procedimiento, esta categoría no te pide que lo empieces: solo describe un insumo para quien ya lo realiza.",
        "Si llegaste buscando un tratamiento para vos o para un paciente, Dérmica no es el lugar. No somos una clínica y no podemos orientarte desde aquí sobre si un procedimiento te conviene. Esa conversación es entre la persona y su médico.",
        "Quien sí puede usar esta página es el médico que quiere saber cuándo abramos en Nicaragua y qué categorías estamos preparando. El aviso se pide con el correo. El nombre, la especialidad, la ciudad y el teléfono se pueden agregar, pero no hacen falta para anotarse.",
      ],
    },
    {
      heading: "Qué no promete",
      paragraphs: [
        "No prometemos venta, existencias, envío ni una fecha. Todavía no están definidos los precios, las sedes ni los canales de atención. Dejar el correo en la lista no reserva producto y no confirma una compra. Si hoy no podemos guardar la lista, el formulario lo dice y el correo no queda anotado.",
        "Tampoco prometemos acuerdos, registros, exclusivas ni resultados. No hablamos de un gel en particular ni de una marca. No afirmamos que un procedimiento sea adecuado para alguien: eso lo decide el médico que ya trabaja esta técnica. El sitio está en prelanzamiento y esta ficha puede leerse junto con revitalización inyectable y dermocosmética profesional, que son las otras dos categorías en preparación. El correo de privacidad, acceso y eliminación es gerencia@dermica.lat. El responsable de esos datos es Dérmica, sin una razón social, una dirección o un RUC publicados en el sitio.",
      ],
    },
  ],
  "revitalizacion-inyectable": [
    {
      heading: "Uso profesional",
      paragraphs: [
        "La revitalización inyectable, también llamada polirrevitalización en esta página, es una categoría que Dérmica prepara para médicos en Nicaragua. La ficha explica el alcance del insumo. No es un protocolo, no trae marcas y no dice cómo aplicarlo.",
        "Se trata de soluciones inyectables orientadas a la calidad de la piel, para uso profesional en la consulta. El médico define la fórmula que elige, la zona y el paciente. Dérmica no decide el tratamiento, no lo realiza y no publica una receta ni una secuencia de sesiones.",
        "Como el resto del sitio, esta categoría está en preparación. Sirve para que un profesional reconozca el tipo de producto que estamos acercando a la práctica, no para que un paciente elija un procedimiento por su cuenta.",
      ],
    },
    {
      heading: "Para quién es",
      paragraphs: [
        "Está dirigida a profesionales médicos que ya trabajan protocolos de calidad de la piel en su consulta. Los perfiles que el sitio tiene en mente son dermatología, medicina estética y cirugía. Si ese no es tu ejercicio, la ficha no te invita a empezar una técnica nueva.",
        "No está dirigida a quien busca un tratamiento, una cita o una recomendación personal. Dérmica no es una clínica. Si necesitás que alguien valore tu piel, eso corresponde a tu médico, no a este formulario.",
        "El médico que quiera el aviso de apertura puede dejar su correo. La casilla del aviso viene desmarcada y es necesaria para anotarse. La casilla de novedades es otra cosa: es opcional, solo por correo, y no incluye WhatsApp ni SMS. No marcarla no impide el aviso de apertura.",
      ],
    },
    {
      heading: "Qué no promete",
      paragraphs: [
        "No prometemos un resultado en la piel, una duración ni una comparación con otros procedimientos. No nombramos productos comerciales ni publicamos concentraciones. No hay precios, fecha de apertura, sedes ni cobertura de envíos. Anotarte no aparta mercadería.",
        "Tampoco prometemos que la categoría ya se pueda comprar. El prelanzamiento significa que el sitio presenta lo que estamos preparando y recoge el correo para escribir cuando abramos en Nicaragua. Si el formulario no puede guardar la lista, lo dice antes de dar el alta por hecha. Las otras fichas, de ácido hialurónico y de dermocosmética profesional, tienen el mismo límite: describen la categoría y dejan la indicación en manos del médico. Para privacidad, acceso o eliminación de los datos del formulario, y para retirar las novedades si se pierde el enlace, el correo es gerencia@dermica.lat. Ese pedido no se resuelve volviendo a enviar la lista.",
      ],
    },
  ],
  "dermocosmetica-profesional": [
    {
      heading: "Uso profesional",
      paragraphs: [
        "La dermocosmética profesional es la tercera categoría que Dérmica prepara para médicos en Nicaragua. La pensamos como una línea de uso profesional para acompañar la consulta, no como una tienda de cuidado de la piel para el público general.",
        "Complementa los protocolos que el médico ya define. La recomendación de usarla, o de no usarla, queda a su criterio. Esta página no sustituye esa recomendación ni explica una rutina para una persona concreta. No publicamos nombres comerciales ni una lista de ingredientes con promesas.",
        "Igual que las categorías inyectables, esta ficha está en preparación. Describe el tipo de insumo. No confirma que hoy se pueda pedir, pagar o recibir un envío.",
      ],
    },
    {
      heading: "Para quién es",
      paragraphs: [
        "Está dirigida a profesionales médicos que acompañan la consulta con dermocosmética de uso profesional. En el sitio, los perfiles previstos son dermatología, medicina estética y cirugía. No está armada para que un paciente arme su propia rutina a partir de este texto.",
        "Si buscás un producto para usar en casa por tu cuenta, o una cita para que te indiquen uno, Dérmica no puede ayudarte. No somos una clínica y no vendemos al público desde esta página. El criterio de recomendación es del médico que te atiende.",
        "El profesional que quiera saber cuándo abramos puede dejar el correo en la lista. Pedimos ese correo y la aceptación del aviso. El nombre y el resto de los datos son opcionales. La casilla de novedades de marketing es independiente y viene desmarcada.",
      ],
    },
    {
      heading: "Qué no promete",
      paragraphs: [
        "No prometemos que un cosmético cambie la piel, ni en cuánto tiempo, ni para qué tipo de persona. No comparamos fórmulas ni citamos estudios. No hay precios, existencias, sedes ni fecha. Dejar el correo no reserva un producto y no crea un pedido.",
        "El sitio sigue en prelanzamiento en Nicaragua. Cuando existan fecha, condiciones y acuerdos, se van a comunicar con la misma claridad. Hasta entonces, esta ficha se lee junto con las de rellenos de ácido hialurónico y revitalización inyectable: tres categorías, sin marcas, con la indicación a cargo del médico y sin atención a pacientes. Los datos del formulario los trata Dérmica. No publicamos razón social, dirección ni RUC. El correo para acceso, corrección, eliminación o retiro de novedades es gerencia@dermica.lat, el mismo que aparece en Privacidad y en Contacto.",
      ],
    },
  ],
};
