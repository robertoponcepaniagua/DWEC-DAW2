// Ejercicio 11 — El peligro de sort(): encuéntralo y arréglalo

// const precios = [100, 25, 9, 400, 3];
// const precioMasBarato = precios.sort()[0];
// console.log(precioMasBarato);
// console.log(precios); // ¿sigue siendo el array original?

//     Ejecuta el código y anota qué sale realmente en las dos líneas.
//     Corrígelo para que precioMasBarato sea de verdad el precio más bajo, sin mutar el array precios original.

const precios = [100, 25, 9, 400, 3];
const precioMasBarato = precios.sort((precio1, precio2) => precio1 - precio2)[0];
console.log(precioMasBarato);
console.log(precios); // ¿sigue siendo el array original?

// No sigue siendo el array original ahora es un array ordenado

// El [0] lo que hace es coger la primera posición del array en este caso lo más barato