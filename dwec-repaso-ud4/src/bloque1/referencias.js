// Bloque 1 · Objetos, this y referencias (apartados 3 y 4 de la UD4, y el 7.7: el this perdido)
// Explicación: web → Practicar → UD 4.2 Repaso para el Parcial 2 → Bloque 1.
// Comprueba con:  docker compose run --rm web npm run comprobar 1

// 👀 EJEMPLO RESUELTO ─────────────────────────────────────────────────────────
// Un avisador del taller. Los métodos usan this (el objeto que va antes del punto al llamarlos).
// Dentro de avisarTodos, el callback de forEach es una FLECHA: no tiene this propio y usa el de avisarTodos.
// Con function (texto) { this.avisar(texto); } fallaría: esa función tendría su propio this (undefined).
export function crearAvisador(nombre) {
  return {
    nombre,
    avisos: [],
    avisar(texto) {
      this.avisos.push(`${this.nombre}: ${texto}`);
    },
    avisarTodos(textos) {
      textos.forEach((texto) => this.avisar(texto));
      return this.avisos.length;
    },
  };
}

// 🪜 ESCALERA ──────────────────────────────────────────────────────────────────
// 🪜 1 · ¿Está ESA reparación en la lista? Es la misma si tiene el mismo id, aunque sea otro objeto (una copia).
//        estaEnLista([{ id: 1 }, { id: 2 }], { id: 2 }) → true
export function estaEnLista(lista, reparacion) {
  for (const objeto of lista) {
    if (objeto.id === reparacion.id) {
      return true
    }
  }
  return false
}

// ✍️ TU TURNO ─────────────────────────────────────────────────────────────────
// ✍️ 1 · rebajar(presupuesto, porcentaje) → un presupuesto NUEVO con el precio de cada pieza rebajado ese
//        porcentaje y redondeado a 2 decimales. El presupuesto que te pasan NO cambia (ni sus piezas).
//        rebajar({ cliente: "Ana", piezas: [{ nombre: "Cadena", precio: 19.99 }] }, 10)
//          → { cliente: "Ana", piezas: [{ nombre: "Cadena", precio: 17.99 }] }
export function rebajar(presupuesto, porcentaje) {
  // presupuesto contiene un {cliente: "", piezas: [{nombre: "", precio: ""}]}
  // porcentaje contiene un int

  // let precio_total;
  // const dicc = {}

  // for (const pieza in presupuesto.piezas) {
  //   precio_total += pieza.precio
  // }

  // return precio_total.toFixed(2)
}

// ➕ ✍️ 2 · OPCIONAL, para ir a por nota (no cuenta en el total).
//        copiarFicha(ficha) → una copia PROFUNDA de la ficha de una bici:
//        { cliente: "Ana", bici: { marca: "Orbea", talla: "M" }, entrada: Date, notas: ["frenos"] }
//        Cambiar CUALQUIER cosa de la copia (la marca, la fecha con setDate, las notas) no cambia el original,
//        y entrada sigue siendo un Date.
export function copiarFicha(ficha) {
  // ficha contiene {cliente: "" , bici: { marca: "" , talla: "" ,}, entrada: Date, notas: [""]}
  return structuredClone(ficha)
}

// ➕ ✍️ 3 · OPCIONAL, para ir a por nota (no cuenta en el total).
//        revisarTodas(reparaciones, revisor) → un array con lo que devuelve revisor.revisar(r) para cada
//        reparación, en orden. revisar usa this (cuenta las que lleva en this.hechas), así que no se puede perder.
//        Con map, en una línea. (apartado 7.7 de la UD4)
export function revisarTodas(reparaciones, revisor) {
  // Debo de devolver un [], el array es reparación pero en orden
  //  array = []
  // cuidado con this.hechas

  const array = []

  for (const r of reparaciones) {
    array.push(revisor.revisar(r))
  }

  return array
}
