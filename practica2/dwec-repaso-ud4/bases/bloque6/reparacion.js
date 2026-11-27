// Base del bloque 6 (npm run empezar 6): lo de los bloques 2 a 5 ya está hecho; lo demás, sin hacer.
// reparacion.js — Una reparación del taller y la reparación urgente.
// Se construye poco a poco: bloques 2 (constructor, horas, static), 3 (#privados, piezas, total), 4 (herencia)
// y 5 (estado). Cada parte dice en qué bloque va. Comprueba con:  docker compose run --rm web npm run comprobar N
import { ErrorEstado } from "./errores.js";

export const PRECIO_HORA = 25;

const redondear = (n) => Math.round(n * 100) / 100;

export class Reparacion {
  static #ultimoId = 0;
  #horas;
  #piezas = [];
  #estado = "pendiente";

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
    if (typeof cliente !== "string" || cliente.trim() === "") throw new TypeError("El cliente es un texto obligatorio");
    if (typeof bici !== "string" || bici.trim() === "") throw new TypeError("La bici es un texto obligatorio");
    this.horas = horas;
    this.id = id ?? Reparacion.#ultimoId + 1;
    Reparacion.#ultimoId = Math.max(Reparacion.#ultimoId, this.id);
    this.cliente = cliente.trim();
    this.bici = bici.trim();
    this.entrada = entrada === undefined ? new Date() : new Date(entrada);
  }

  static desdeLinea(linea) {
    const [cliente, bici, horas] = linea.split(";").map((trozo) => trozo.trim());
    return new Reparacion(cliente, bici, Number(horas));
  }

  get horas() {
    return this.#horas;
  }

  set horas(valor) {
    if (typeof valor !== "number" || Number.isNaN(valor)) throw new TypeError("Las horas son un número");
    if (valor <= 0) throw new RangeError("Las horas tienen que ser más de 0");
    this.#horas = valor;
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
    return this.#estado;
  }

  anadirPieza(nombre, precio) {
    this.#validarPieza(nombre, precio);
    this.#piezas.push({ nombre: nombre.trim(), precio });
  }

  #validarPieza(nombre, precio) {
    if (typeof nombre !== "string" || nombre.trim() === "") throw new TypeError("La pieza necesita un nombre");
    if (typeof precio !== "number" || Number.isNaN(precio)) throw new TypeError("El precio es un número");
    if (precio < 0) throw new RangeError("El precio no puede ser negativo");
  }

  get piezas() {
    return this.#piezas.map((p) => ({ ...p }));
  }

  get total() {
    const piezas = this.#piezas.reduce((suma, p) => suma + p.precio, 0);
    return redondear(this.#horas * PRECIO_HORA + piezas);
  }

  // ✍️ BLOQUE 4 · Herencia ────────────────────────────────────────────────────────
  // 🪜 get tipo() → "normal" (y en ReparacionUrgente, "urgente": abajo).
  get tipo() {
    return "normal";
  }

  // ✍️ BLOQUE 5 · Estados ─────────────────────────────────────────────────────────
  // ✍️ 2 · empezar(): de "pendiente" a "en-taller". terminar(): de "en-taller" a "lista".
  //      En cualquier otro caso → ErrorEstado(this.id, estado actual), y el estado no cambia.
  empezar() {
    if (this.#estado !== "pendiente") throw new ErrorEstado(this.id, this.#estado);
    this.#estado = "en-taller";
  }

  terminar() {
    if (this.#estado !== "en-taller") throw new ErrorEstado(this.id, this.#estado);
    this.#estado = "lista";
  }
}

// ✍️ BLOQUE 4 · Herencia ──────────────────────────────────────────────────────────
// 🪜 Su tipo es "urgente".
// ✍️ 1 · get total(): el total del padre más un 30 %, redondeado a 2 decimales. Reutiliza el del padre: desde aquí
//      no puedes leer #piezas (es privado de Reparacion), ni te hace falta.
export class ReparacionUrgente extends Reparacion {
  get tipo() {
    return "urgente";
  }

  get total() {
    return redondear(super.total * 1.3);
  }
}
