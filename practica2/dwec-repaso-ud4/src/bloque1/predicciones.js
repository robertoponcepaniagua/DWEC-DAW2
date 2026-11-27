// 🔮 PREDICCIONES · Cambia cada undefined por lo que crees que da. Luego: docker compose run --rm web npm run comprobar 1
// Cada línea se puede probar sola (todo lo que necesita va en ella): npm run probar "…" o el botón «Probar» de la página.
export const predicciones = {
  p1: undefined, // const r = { id: 1 }; const lista = [r]; lista.includes({ id: 1 })
  p2: undefined, // const a = { bici: { marca: "Orbea" } }; const b = { ...a }; b.bici.marca = "BH"; a.bici.marca
  p3: undefined, // const a = { bici: { marca: "Orbea" } }; const b = structuredClone(a); b.bici.marca = "BH"; a.bici.marca
  p4: undefined, // const t = { extra: 1, sumar(lista) { return lista.map((x) => x + this.extra); } }; t.sumar([1, 2])
  p5: undefined, // const t = { extra: 1, sumar(lista) { return lista.map(function (x) { return x + this?.extra; }); } }; t.sumar([1, 2])
};
