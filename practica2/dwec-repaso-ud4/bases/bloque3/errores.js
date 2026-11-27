// Base del bloque 3 (npm run empezar 3): lo del bloque 2 ya está hecho; lo demás, sin hacer.
// errores.js — Los errores propios del taller (apartado 10.4 de la UD4: Error es una clase y se hereda).
// Bloque 5 (y el 6 añade ErrorRevision). Comprueba con:  docker compose run --rm web npm run comprobar 5

// 👀 EJEMPLO RESUELTO (bloque 5) ──────────────────────────────────────────────
// La base de todos los errores del taller: un mensaje y un objeto con los datos del problema.
// Quien la use puede preguntar «¿es un error del taller?» con instanceof ErrorTaller.
export class ErrorTaller extends Error {
  constructor(mensaje, datos = {}) {
    super(mensaje);
    this.name = "ErrorTaller";
    this.datos = datos;
  }
}

// 🪜 BLOQUE 5 ─────────────────────────────────────────────────────────────────
// Dos hijos de ErrorTaller, cada uno con SU name y sus datos (y un mensaje que explique qué pasa):
//   new ErrorMecanicoLleno("Rosa", 2) → name "ErrorMecanicoLleno", datos { mecanico: "Rosa", max: 2 }
//   new ErrorEstado(7, "lista")       → name "ErrorEstado",        datos { id: 7, estado: "lista" }
export class ErrorMecanicoLleno extends ErrorTaller {
  constructor(mecanico, max) {
    throw new Error("Sin hacer");
  }
}

export class ErrorEstado extends ErrorTaller {
  constructor(id, estado) {
    throw new Error("Sin hacer");
  }
}

// 🎯 BLOQUE 6 (simulacro) · lo pide src/modelo/garantia.js
//   new ErrorRevision(id, revisadas, fallos) → name "ErrorRevision", datos { id, revisadas, fallos }
export class ErrorRevision extends ErrorTaller {
  constructor(id, revisadas, fallos) {
    throw new Error("Sin hacer");
  }
}
