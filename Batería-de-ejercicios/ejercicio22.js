// Ejercicio 22 — Actualizar y quitar sin mutar

//     Escribe reponer(lista, id, unidades) que devuelva un array nuevo con el stock del producto sumado. Comprueba con === que carta no ha cambiado y que los productos no tocados son los mismos objetos.
//     Escribe quitarProducto(lista, id) que devuelva la lista sin ese producto, sin usar splice.

const carta = [
  { id: 1, nombre: "Café solo", categoria: "bebida", precio: 1.2, stock: 10 },
  { id: 2, nombre: "Latte", categoria: "bebida", precio: 2.4, stock: 2 },
  { id: 3, nombre: "Tostada", categoria: "comida", precio: 2.0, stock: 0 },
  { id: 4, nombre: "Croissant", categoria: "comida", precio: 1.8, stock: 1 },
  { id: 5, nombre: "Zumo", categoria: "bebida", precio: 3.0, stock: 6 },
];

