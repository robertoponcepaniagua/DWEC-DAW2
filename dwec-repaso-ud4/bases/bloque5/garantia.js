// Base del bloque 5 (npm run empezar 5): lo de los bloques 2 a 4 ya está hecho; lo demás, sin hacer.
// garantia.js — 🎯 Bloque 6 · SIMULACRO: la reparación en garantía.
// Hazlo como si fuera un examen: lee TODO el enunciado antes de escribir, y sin mirar las pistas de la web hasta el final.
// Comprueba con:  docker compose run --rm web npm run comprobar 6   (te da «X/5 puntos»; el 6 es opcional)
//
// Si una bici se estropea en los meses de garantía de una reparación anterior, el taller la arregla gratis, pero
// antes de devolverla el mecánico tiene que revisar al menos tres puntos (frenos, cadena, luces…) y todos bien.
//
// Ficheros: este (src/modelo/garantia.js), src/modelo/errores.js y src/modelo/taller.js.
//
// ── Lo que tiene que existir ──────────────────────────────────────────────────
//   export class ReparacionGarantia extends Reparacion {
//     constructor(cliente, bici, horas, meses, opciones = {})   // meses: número entero de 1 a 24
//     get meses()          // → número (solo lectura)
//     get tipo()           // → "garantia"
//     get total()          // → 0 (lo paga la garantía, aunque lleve piezas)
//     get revisiones()     // → [{ punto: "Frenos", ok: true }, …] en el orden en que se hicieron
//     revisar(punto, ok)   // punto: texto · ok: true o false → no devuelve nada
//     get porcentajeOk()   // → número entero (0–100)
//   }
//   export class ErrorRevision extends ErrorTaller   // en errores.js
//   taller.nuevaReparacion({ cliente, bici, horas, meses })   // → ReparacionGarantia
//
// ── Ejemplo ───────────────────────────────────────────────────────────────────
//   const taller = new Taller();
//   taller.contratar("Rosa", 1);
//   const r = taller.nuevaReparacion({ cliente: "Ana", bici: "Orbea", horas: 1, meses: 6 });
//   taller.asignar(r.id, "Rosa");
//   r.revisar("Frenos", true);
//   r.revisar("Cadena", true);
//   taller.terminar(r.id);   // ✗ ErrorRevision: La reparación 1 no pasa la revisión (2 revisadas, 0 con fallo)
//   r.estado;                // → "en-taller"   (y Rosa sigue con ella)
//
// ── Cuándo está terminado (un punto por línea) ────────────────────────────────
//   1 · new ReparacionGarantia(…) tiene todo lo del padre (cliente, bici, horas, id, estado…). meses que no es un
//       número → TypeError; que no es entero o está fuera de 1–24 → RangeError. tipo "garantia" y total 0.
//       Todo el estado nuevo es PRIVADO y meses se puede leer, pero no cambiar.
//   2 · revisiones empieza vacío y devuelve una copia PROFUNDA: cambiar lo que devuelve no cambia la reparación.
//   3 · revisar(punto, ok) añade { punto, ok }. punto que no es texto o vacío → TypeError; ok que no es booleano →
//       TypeError; un punto ya revisado → RangeError. Si no vale, no cambia nada.
//       porcentajeOk: el % de revisiones con ok, redondeado a entero (2 de 3 → 67); sin revisiones, 0.
//   4 · taller.nuevaReparacion crea una ReparacionGarantia siempre que VENGA meses (nunca vendrán meses y urgente
//       juntos). Sin meses, todo sigue igual. Y facturacion la cuenta como 0, sin tocar facturacion.
//   5 · La regla: para terminar una reparación en garantía hacen falta 3 revisiones o más y ninguna con ok false.
//       Si no se cumple, terminar() lanza ErrorRevision (hijo de ErrorTaller), con name "ErrorRevision" y datos
//       { id, revisadas, fallos }, y la reparación sigue "en-taller".
//   ➕ 6 · OPCIONAL, para ir a por nota (no cuenta en los 5 puntos).
//       La regla vale por TODOS los caminos: r.terminar() y taller.terminar(id). Si no se puede terminar, el
//       mecánico sigue con ella. Si además la reparación no está "en-taller", manda el estado: ErrorEstado.
//
// ── No vale ───────────────────────────────────────────────────────────────────
//   instanceof, .constructor o un if por tipo en taller.js (la regla va en la propia clase) · propiedades
//   públicas (ni con _) para el estado nuevo.
import { ErrorRevision } from "./errores.js";
import { Reparacion } from "./reparacion.js";

export class ReparacionGarantia extends Reparacion {
  constructor(cliente, bici, horas, meses, opciones = {}) {
    throw new Error("Sin hacer");
  }
}

// (Para que ESLint no avise mientras no lo uses)
void ErrorRevision;
