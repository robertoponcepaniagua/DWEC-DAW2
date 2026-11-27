// 🔮 PREDICCIONES · Cambia cada undefined por lo que crees que da. Luego: docker compose run --rm web npm run comprobar 3
// Cada línea se puede probar sola (todo lo que necesita va en ella): npm run probar "…" o el botón «Probar» de la página.
export const predicciones = {
  p1: undefined, // class C { #l = [1]; get l() { return this.#l; } }; const c = new C(); c.l.push(2); c.l.length
  p2: undefined, // class C { #l = [1]; get l() { return [...this.#l]; } }; const c = new C(); c.l.push(2); c.l.length
  p3: undefined, // class C { #l = [{ n: 1 }]; get l() { return [...this.#l]; } }; const c = new C(); c.l[0].n = 9; c.l[0].n
  p4: undefined, // class C { #doble(n) { return n * 2; } calcular(n) { return this.#doble(n) + 1; } }; [new C().calcular(3), typeof new C().doble]
  p5: undefined, // JSON.stringify(new (class { #secreto = 1; visible = 2; })())
};
