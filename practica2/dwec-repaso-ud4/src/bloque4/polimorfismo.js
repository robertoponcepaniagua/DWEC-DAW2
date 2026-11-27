// Bloque 4 · Polimorfismo: código que trabaja con CUALQUIER reparación sin preguntar de qué tipo es.
// 🪜 y ✍️ 1 (la herencia, ReparacionUrgente) van en src/modelo/reparacion.js; ✍️ 2 y 3, aquí.
// Apartados 8.1 a 8.3 de la UD4. Comprueba con:  docker compose run --rm web npm run comprobar 4
import { PRECIO_HORA, Reparacion } from "../modelo/reparacion.js";

// 👀 EJEMPLO RESUELTO ─────────────────────────────────────────────────────────
// No pregunta el tipo: le pide a la reparación su tipo y su total, y cada clase responde a su manera.
// Si mañana hay otra clase de reparación, describir() funciona sin tocarla.
export function describir(r) {
  return `#${r.id} ${r.cliente} · ${r.bici} · ${r.tipo} · ${r.total} €`;
}

// ✍️ TU TURNO ─────────────────────────────────────────────────────────────────
// ✍️ 2 · facturaPorTipo(reparaciones) → un objeto con lo facturado por cada tipo, redondeado a 2 decimales:
//        { normal: 50, urgente: 78 }. Sin instanceof, sin if de tipos y sin mirar el constructor:
//        cada reparación ya sabe su tipo y su total.
export function facturaPorTipo(reparaciones) {
  throw new Error("Sin hacer");
}

// ➕ ✍️ 3 · OPCIONAL, para ir a por nota (no cuenta en el total).
//        ReparacionSocio: los socios del club ciclista tienen un 20 % de descuento en la MANO DE OBRA
//        (horas × PRECIO_HORA), no en las piezas. Su tipo es "socio". Redondeado a 2 decimales.
//        Una de 2 h con una pieza de 10 € → 2 × 25 = 50, menos el 20 % (10) → 40, más la pieza → 50.
//        Y facturaPorTipo tiene que funcionar con ella sin tocarla.
export class ReparacionSocio extends Reparacion {
  get total() {
    throw new Error("Sin hacer");
  }
}

// (Para que ESLint no avise mientras no lo uses)
void PRECIO_HORA;
