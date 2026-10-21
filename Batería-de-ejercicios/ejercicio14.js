// Ejercicio 14 — reduce: acumular

// Dado:

// const compras = [
//   { producto: "Libro", precio: 15, cantidad: 2 },
//   { producto: "Cuaderno", precio: 3, cantidad: 5 },
//   { producto: "Bolígrafo", precio: 1, cantidad: 10 }
// ];

//     Usa reduce() para calcular totalGastado, la suma de precio * cantidad de todas las líneas.
//     Extra: usa reduce() para crear resumen, un objeto { producto: cantidad } con la cantidad comprada de cada producto (pista: mira el ejemplo de "agrupar por departamento" en tus apuntes).


const compras = [
  { producto: "Libro", precio: 15, cantidad: 2 },
  { producto: "Cuaderno", precio: 3, cantidad: 5 },
  { producto: "Bolígrafo", precio: 1, cantidad: 10 }
];

const totalGastado = compras.reduce((acc, producto) => producto.precio * producto.cantidad + acc ,0)