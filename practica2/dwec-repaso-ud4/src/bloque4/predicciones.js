// 🔮 PREDICCIONES · Cambia cada undefined por lo que crees que da. Luego: docker compose run --rm web npm run comprobar 4
// Cada línea se puede probar sola (todo lo que necesita va en ella): npm run probar "…" o el botón «Probar» de la página.
export const predicciones = {
  p1: undefined, // class A { get t() { return 10; } } class B extends A { get t() { return super.t * 2; } }; new B().t
  p2: undefined, // class A { constructor(n) { this.n = n; } } class B extends A {}; new B(5).n
  p3: undefined, // class A { quien() { return "A"; } hola() { return "Soy " + this.quien(); } } class B extends A { quien() { return "B"; } }; new B().hola()
  p4: undefined, // class A { #x = 1; leer() { return this.#x; } } class B extends A {}; new B().leer()
  p5: undefined, // class A {} class B extends A {}; new A() instanceof B
};
