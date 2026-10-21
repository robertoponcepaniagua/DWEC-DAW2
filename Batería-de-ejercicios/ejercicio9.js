// Ejercicio 9 — for...of vs for...in: encuentra el bug

// Este código tiene un bug. Ejecútalo, observa la salida "rara", y explica en un comentario qué está pasando y cómo lo arreglarías:

// const carrito = ["Camiseta", "Pantalón", "Zapatos"];
// carrito.descuentoAplicado = true; // propiedad añadida al array

// for (const item in carrito) {
//   console.log(item);
// }

const carrito = ["Camiseta", "Pantalón", "Zapatos"];
carrito.descuentoAplicado = true; // propiedad añadida al array

for (const item of carrito) {
  console.log(item);
}

