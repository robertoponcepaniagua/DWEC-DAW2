// Ejercicio 5 — Optional chaining ?.

// Dado:

// const pedidos = [
//   { id: 1, cliente: { nombre: "Marta", direccion: { ciudad: "Cádiz" } } },
//   { id: 2, cliente: { nombre: "Luis" } }, // sin dirección
//   { id: 3, cliente: null }
// ];

// Escribe una función ciudadDelPedido(pedido) que devuelva la ciudad del cliente, o "Ciudad no especificada" si en algún punto de la cadena (cliente, direccion o ciudad) no existiera. Pruébala con los tres pedidos del array.


const pedidos = [
  { id: 1, cliente: { nombre: "Marta", direccion: { ciudad: "Cádiz" } } },
  { id: 2, cliente: { nombre: "Luis" } }, // sin dirección
  { id: 3, cliente: null }
];

function ciudadDelPedido(pedido) {
    return pedido?.cliente?.direccion?.ciudad ?? "Ciudad no especificada";
}

// Si no lo encuentra o en algún momento da null devuelve Ciudad no especificada