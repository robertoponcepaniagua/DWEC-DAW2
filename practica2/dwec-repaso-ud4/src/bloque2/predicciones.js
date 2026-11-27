// 🔮 PREDICCIONES · Cambia cada undefined por lo que crees que da. Luego: docker compose run --rm web npm run comprobar 2
// Cada línea se puede probar sola (todo lo que necesita va en ella): npm run probar "…" o el botón «Probar» de la página.
export const predicciones = {
  p1: undefined, // class R { constructor(h) { if (h <= 0) throw new RangeError("Horas"); this.h = h; } }; let r = "sin crear"; try { r = new R(0); } catch {}; r
  p2: undefined, // class C { static total = 0; constructor() { C.total++; } }; new C(); new C(); [new C().total, C.total]
  p3: undefined, // class T { #h = 1; get horas() { return this.#h; } set horas(v) { if (v <= 0) throw new RangeError("no"); this.#h = v; } }; const t = new T(); try { t.horas = -2; } catch {}; t.horas
  p4: undefined, // new TypeError("x") instanceof RangeError
};
