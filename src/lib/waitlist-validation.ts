export type WaitlistFields = {
  name: string;
  email: string;
  specialty: string;
  city: string;
  phone: string;
  consent: boolean;
};

export type WaitlistField = keyof WaitlistFields;

export type NormalizedWaitlist = {
  name: string;
  email: string;
  specialty: string | null;
  city: string | null;
  phone: string | null;
  consent: true;
};

const NAME_PATTERN = /^[\p{L}][\p{L}\s.'’-]*$/u;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateWaitlist(input: WaitlistFields):
  | { ok: true; value: NormalizedWaitlist }
  | { ok: false; fieldErrors: Partial<Record<WaitlistField, string>> } {
  const fieldErrors: Partial<Record<WaitlistField, string>> = {};

  const name = collapseSpaces(input.name);
  if (name.length < 2 || name.length > 80 || !NAME_PATTERN.test(name)) {
    fieldErrors.name = "Escribe tu nombre, entre 2 y 80 letras.";
  }

  const email = input.email.trim().toLowerCase();
  if (
    email.length < 5 ||
    email.length > 120 ||
    !EMAIL_PATTERN.test(email) ||
    email.includes("..")
  ) {
    fieldErrors.email = "Escribe un correo válido.";
  }

  const specialty = optionalText(input.specialty);
  if (specialty === "invalid") {
    fieldErrors.specialty = "La especialidad admite hasta 80 caracteres.";
  }

  const city = optionalText(input.city);
  if (city === "invalid") {
    fieldErrors.city = "La ciudad admite hasta 80 caracteres.";
  }

  const phone = normalizePhone(input.phone);
  if (phone === "invalid") {
    fieldErrors.phone = "Si dejas un teléfono, usa entre 8 y 15 dígitos.";
  }

  if (input.consent !== true) {
    fieldErrors.consent =
      "Marca la casilla si quieres recibir el aviso de apertura. Sin esa aceptación no guardamos el registro.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  return {
    ok: true,
    value: {
      name,
      email,
      specialty: specialty === "empty" ? null : specialty,
      city: city === "empty" ? null : city,
      phone: phone === "empty" ? null : phone,
      consent: true,
    },
  };
}

function collapseSpaces(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function optionalText(value: string): string | "empty" | "invalid" {
  const text = collapseSpaces(value);
  if (!text) return "empty";
  if (text.length > 80 || /[\u0000-\u001F]/.test(text)) return "invalid";
  return text;
}

function normalizePhone(value: string): string | "empty" | "invalid" {
  const text = collapseSpaces(value);
  if (!text) return "empty";
  if (text.length > 20 || !/^[+0-9][0-9\s().-]*$/.test(text)) return "invalid";
  const digits = text.replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15) return "invalid";
  return text;
}
