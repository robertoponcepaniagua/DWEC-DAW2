// Base del bloque 5 (npm run empezar 5): lo de los bloques 2 a 4 ya está hecho; lo demás, sin hacer.
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
  nuevaReparacion({ cliente, bici, horas, urgente = false }) {
    throw new Error("Sin hacer");
  }

  contratar(nombre, max) {
    throw new Error("Sin hacer");
  }

  buscar(id) {
    throw new Error("Sin hacer");
  }

  reparaciones() {
    throw new Error("Sin hacer");
  }

  pendientes() {
    throw new Error("Sin hacer");
  }

  asignar(id, nombreMecanico) {
    throw new Error("Sin hacer");
  }

  terminar(id) {
    throw new Error("Sin hacer");
  }

  get facturacion() {
    throw new Error("Sin hacer");
  }
}

// (Para que ESLint no avise mientras no los uses)
void [ErrorEstado, ErrorTaller, ReparacionGarantia, Mecanico, Reparacion, ReparacionUrgente];
