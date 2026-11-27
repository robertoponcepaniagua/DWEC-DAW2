// Base del bloque 6 (npm run empezar 6): lo de los bloques 2 a 5 ya está hecho; lo demás, sin hacer.
// taller.js — El taller: TIENE reparaciones y mecánicos (composición) y los coordina.
// ✍️ Bloque 5 (y el 6 añade la garantía en nuevaReparacion). Comprueba con:  docker compose run --rm web npm run comprobar 5
import { ErrorEstado, ErrorTaller } from "./errores.js";
import { ReparacionGarantia } from "./garantia.js";
import { Mecanico } from "./mecanico.js";
import { Reparacion, ReparacionUrgente } from "./reparacion.js";

// ✍️ BLOQUE 5 · todo en campos PRIVADOS (pista: dos o tres Map).
//
// ✍️ 3 ·
//   nuevaReparacion({ cliente, bici, horas, urgente = false }) → crea una Reparacion (o una ReparacionUrgente si
//                                  urgente es true), la guarda y la devuelve. Si los datos no valen, el constructor
//                                  lanza y no se guarda nada.
//   contratar(nombre, max)       → crea el Mecanico, lo guarda y lo devuelve. Si ya hay uno con ese nombre → ErrorTaller.
//   buscar(id)                   → la reparación (la misma, no una copia) o null si no existe.
//   reparaciones()               → un array NUEVO con todas, en el orden en que se crearon.
//   pendientes()                 → las que están "pendiente".
//
// ✍️ 4 ·
//   asignar(id, nombreMecanico)  → empieza la reparación y se la da al mecánico. Comprueba, EN ESTE ORDEN:
//                                    1) que existe la reparación → ErrorTaller
//                                    2) que existe el mecánico → ErrorTaller
//                                    3) que la reparación está "pendiente" → ErrorEstado
//                                    4) que el mecánico tiene sitio → ErrorMecanicoLleno
//                                  Si falla cualquier cosa, NADA cambia (ni la reparación ni el mecánico).
//   terminar(id)                 → termina la reparación y libera a su mecánico. Si la reparación no existe →
//                                  ErrorTaller; si no puede terminar → el error que lance ella, y nada cambia.
//   get facturacion              → la suma del total de las reparaciones "lista", redondeada a 2 decimales.
//                                  Sin preguntar de qué tipo es cada una.
//
// 🎯 BLOQUE 6 (simulacro) · lo que pide src/modelo/garantia.js para nuevaReparacion.
export class Taller {
  #reparaciones = new Map(); // id → Reparacion
  #mecanicos = new Map(); // nombre → Mecanico
  #asignadas = new Map(); // id de la reparación → nombre del mecánico

  nuevaReparacion({ cliente, bici, horas, urgente = false }) {
    const reparacion = urgente ? new ReparacionUrgente(cliente, bici, horas) : new Reparacion(cliente, bici, horas);
    this.#reparaciones.set(reparacion.id, reparacion);
    return reparacion;
  }

  contratar(nombre, max) {
    if (this.#mecanicos.has(nombre)) throw new ErrorTaller(`Ya existe el mecánico ${nombre}`, { mecanico: nombre });
    const mecanico = new Mecanico(nombre, max);
    this.#mecanicos.set(mecanico.nombre, mecanico);
    return mecanico;
  }

  buscar(id) {
    return this.#reparaciones.get(id) ?? null;
  }

  reparaciones() {
    return [...this.#reparaciones.values()];
  }

  pendientes() {
    return this.reparaciones().filter((r) => r.estado === "pendiente");
  }

  asignar(id, nombreMecanico) {
    const reparacion = this.#reparacion(id);
    const mecanico = this.#mecanicos.get(nombreMecanico);
    if (!mecanico) throw new ErrorTaller(`No existe el mecánico ${nombreMecanico}`, { mecanico: nombreMecanico });
    if (reparacion.estado !== "pendiente") throw new ErrorEstado(id, reparacion.estado);
    mecanico.asignar(reparacion); // puede lanzar ErrorMecanicoLleno: todavía no hemos cambiado nada
    reparacion.empezar();
    this.#asignadas.set(id, mecanico.nombre);
  }

  terminar(id) {
    const reparacion = this.#reparacion(id);
    reparacion.terminar(); // si no puede, lanza y el mecánico sigue con ella
    this.#mecanicos.get(this.#asignadas.get(id)).liberar(id);
    this.#asignadas.delete(id);
  }

  get facturacion() {
    const suma = this.reparaciones()
      .filter((r) => r.estado === "lista")
      .reduce((total, r) => total + r.total, 0);
    return Math.round(suma * 100) / 100;
  }

  #reparacion(id) {
    const reparacion = this.#reparaciones.get(id);
    if (!reparacion) throw new ErrorTaller(`No existe la reparación ${id}`, { id });
    return reparacion;
  }
}

// (Para que ESLint no avise mientras no lo uses)
void ReparacionGarantia;
