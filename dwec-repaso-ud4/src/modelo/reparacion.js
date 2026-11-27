// reparacion.js — Una reparación del taller y la reparación urgente.
// Se construye poco a poco: bloques 2 (constructor, horas, static), 3 (#privados, piezas, total), 4 (herencia)
// y 5 (estado). Cada parte dice en qué bloque va. Comprueba con:  docker compose run --rm web npm run comprobar N
import { ErrorEstado } from "./errores.js";

export const PRECIO_HORA = 25;

export class Reparacion {
  // ✍️ BLOQUE 2 · Clases ──────────────────────────────────────────────────────────
  // 🪜 constructor(cliente, bici, horas, { id, entrada } = {})
  //      cliente y bici: textos, guardados SIN espacios al principio y al final. Si no son texto o están vacíos
  //      → TypeError (el objeto no se crea).
  // ✍️ 1 · horas en un campo PRIVADO #horas, con get horas() y set horas(valor):
  //      no es un número (o es NaN) → TypeError · es 0 o menos → RangeError · y si no vale, NO cambia nada.
  //      El constructor también pasa por el setter.
  // ✍️ 2 · id automático: 1, 2, 3… con un contador de la CLASE (static y privado). Si te pasan { id }, se usa ese,
  //      y si es mayor que el contador, el contador salta hasta él (para no repetir nunca). Una reparación que no
  //      se crea (datos malos) no gasta id.
  //      entrada: la fecha que te pasen (una COPIA, new Date(…)) o, si no viene, la de ahora.
  // ➕ ✍️ 3 · OPCIONAL, para ir a por nota (no cuenta en el total).
  //      static desdeLinea("Ana; Orbea Alma; 1.5") → new Reparacion("Ana", "Orbea Alma", 1.5).
  //      Los trozos, sin espacios; las horas, convertidas a número. Las líneas malas las rechaza el constructor.
  constructor(cliente, bici, horas, { id, entrada } = {}) {
    throw new Error("Sin hacer");
  }

  static desdeLinea(linea) {
    throw new Error("Sin hacer");
  }

  // ✍️ BLOQUE 3 · Encapsulación ───────────────────────────────────────────────────
  // 🪜 estado: un campo privado #estado que empieza en "pendiente" y solo se puede LEER (get estado(), sin set).
  // ✍️ 1 · anadirPieza(nombre, precio): guarda { nombre (sin espacios de más), precio } en un array privado #piezas.
  //      La validación va en un MÉTODO PRIVADO (#validarPieza): nombre que no es texto o vacío → TypeError;
  //      precio que no es número → TypeError; precio negativo → RangeError (0 sí vale). Si no vale, no se añade.
  // ✍️ 2 · get piezas() → una COPIA: [{ nombre, precio }, …]. Cambiar lo que devuelve (el array o una pieza) no
  //      cambia la reparación.
  // ✍️ 3 · get total() → horas × PRECIO_HORA + la suma de los precios de las piezas, redondeado a 2 decimales
  //      (un número, no un texto).
  get estado() {
    throw new Error("Sin hacer");
  }

  anadirPieza(nombre, precio) {
    throw new Error("Sin hacer");
  }

  get piezas() {
    throw new Error("Sin hacer");
  }

  get total() {
    throw new Error("Sin hacer");
  }

  // ✍️ BLOQUE 4 · Herencia ────────────────────────────────────────────────────────
  // 🪜 get tipo() → "normal" (y en ReparacionUrgente, "urgente": abajo).
  get tipo() {
    throw new Error("Sin hacer");
  }

  // ✍️ BLOQUE 5 · Estados ─────────────────────────────────────────────────────────
  // ✍️ 2 · empezar(): de "pendiente" a "en-taller". terminar(): de "en-taller" a "lista".
  //      En cualquier otro caso → ErrorEstado(this.id, estado actual), y el estado no cambia.
  empezar() {
    throw new Error("Sin hacer");
  }

  terminar() {
    throw new Error("Sin hacer");
  }
}

// ✍️ BLOQUE 4 · Herencia ──────────────────────────────────────────────────────────
// 🪜 Su tipo es "urgente".
// ✍️ 1 · get total(): el total del padre más un 30 %, redondeado a 2 decimales. Reutiliza el del padre: desde aquí
//      no puedes leer #piezas (es privado de Reparacion), ni te hace falta.
export class ReparacionUrgente extends Reparacion {
  get tipo() {
    throw new Error("Sin hacer");
  }

  get total() {
    throw new Error("Sin hacer");
  }
}

// (Para que ESLint no avise mientras no lo uses)
void ErrorEstado;
