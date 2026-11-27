// mecanico.js — Un mecánico del taller y los trabajos que tiene entre manos.
// 👀 resuelto en los bloques 2 (constructor) y 3 (#trabajos); ✍️ asignar y liberar en el bloque 5.
import { ErrorMecanicoLleno } from "./errores.js";

export class Mecanico {
  // 👀 EJEMPLO RESUELTO (bloque 3) ──────────────────────────────────────────────
  // Los ids de sus trabajos, en un Set privado: desde fuera solo se ve una COPIA.
  #trabajos = new Set();

  // 👀 EJEMPLO RESUELTO (bloque 2) ──────────────────────────────────────────────
  // El constructor deja el objeto válido… o no lo crea. TypeError si el TIPO no vale; RangeError si es del tipo
  // bueno pero está fuera de rango.
  constructor(nombre, max = 2) {
    if (typeof nombre !== "string" || nombre.trim() === "") throw new TypeError("El mecánico necesita un nombre");
    if (typeof max !== "number") throw new TypeError("El máximo es un número");
    if (!Number.isInteger(max) || max < 1) throw new RangeError("El máximo es un entero de 1 o más");
    this.nombre = nombre.trim();
    this.max = max;
  }

  get trabajos() {
    return [...this.#trabajos];
  }

  get libres() {
    return this.max - this.#trabajos.size;
  }

  // ✍️ BLOQUE 5 ──────────────────────────────────────────────────────────────────
  // asignar(reparacion): guarda reparacion.id en #trabajos. Si ya tiene max trabajos, lanza
  //   ErrorMecanicoLleno(nombre, max) SIN añadir nada.
  // liberar(id): quita ese id (si no lo tiene, no pasa nada).
  asignar(reparacion) {
    throw new Error("Sin hacer");
  }

  liberar(id) {
    throw new Error("Sin hacer");
  }
}

// (Para que ESLint no avise mientras no lo uses)
void ErrorMecanicoLleno;
