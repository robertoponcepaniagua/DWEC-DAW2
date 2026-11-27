// 🔮 PREDICCIONES · Cambia cada undefined por lo que crees que da. Luego: docker compose run --rm web npm run comprobar 5
// Cada línea se puede probar sola (todo lo que necesita va en ella): npm run probar "…" o el botón «Probar» de la página.
export const predicciones = {
  p1: undefined, // class E extends Error { constructor(m) { super(m); this.name = "E"; } } class F extends E {}; new F("x").name
  p2: undefined, // class E extends Error { constructor(m, datos = {}) { super(m); this.datos = datos; } }; new E("x").datos.id ?? "sin id"
  p3: undefined, // const m = new Map(); m.set(1, "a"); m.set("1", "b"); m.size
  p4: undefined, // const caja = { dentro: [], fuera: ["R1"] }; try { caja.dentro.push(caja.fuera[0]); throw new Error("lleno"); } catch {}; [caja.dentro.length, caja.fuera.length]
};
