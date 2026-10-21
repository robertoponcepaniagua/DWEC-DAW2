// Ejercicio 21 — Buscar sin que explote: find + ?. + ??

// Escribe stockDe(lista, id) que devuelva el stock del producto o -1 si no existe. Debe devolver 0 (no -1) para un producto agotado: compruébalo con la Tostada.

const carta = [
  { id: 1, nombre: "Café solo", categoria: "bebida", precio: 1.2, stock: 10 },
  { id: 2, nombre: "Latte", categoria: "bebida", precio: 2.4, stock: 2 },
  { id: 3, nombre: "Tostada", categoria: "comida", precio: 2.0, stock: 0 },
  { id: 4, nombre: "Croissant", categoria: "comida", precio: 1.8, stock: 1 },
  { id: 5, nombre: "Zumo", categoria: "bebida", precio: 3.0, stock: 6 },
];

const stockDe = (lista, id) => {
    const producto = [...lista].find(producto => producto.id === id);

    const stock = producto?.stock ?? -1;
}