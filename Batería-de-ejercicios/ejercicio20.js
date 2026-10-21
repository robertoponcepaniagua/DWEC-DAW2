// Ejercicio 20 — Precio con ??

// Escribe mostrarPrecio(producto) que devuelva "Gratis" si el precio es 0, el precio con " €" si existe, y "Precio no disponible" si la propiedad precio no existe o es null. Pruébala con { precio: 0 }, { precio: 2.5 }, {} y { precio: null }.

const carta = [
  { id: 1, nombre: "Café solo", categoria: "bebida", precio: 1.2, stock: 10 },
  { id: 2, nombre: "Latte", categoria: "bebida", precio: 2.4, stock: 2 },
  { id: 3, nombre: "Tostada", categoria: "comida", precio: 2.0, stock: 0 },
  { id: 4, nombre: "Croissant", categoria: "comida", precio: 1.8, stock: 1 },
  { id: 5, nombre: "Zumo", categoria: "bebida", precio: 3.0, stock: 6 },
];

const mostrarPrecio = (producto) => {
  const precio = producto.precio ?? undefined;
  if (precio === undefined) {
    return "Precio no disponible";
  }
  return precio === 0 ? "Gratis" : `${precio} €`;
};