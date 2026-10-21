// Ejercicio 15 — find y findIndex

//     Usa find() para obtener el primer pedido con estado === "pendiente".
//     Usa findIndex() para obtener la posición de ese mismo pedido dentro del array.

const pedidosTienda = [
  { id: 1, cliente: "Marta", estado: "enviado", total: 45 },
  { id: 2, cliente: "Luis", estado: "pendiente", total: 120 },
  { id: 3, cliente: "Nora", estado: "entregado", total: 30 },
  { id: 4, cliente: "Iván", estado: "pendiente", total: 75 }
];

const pendiente = pedidosTienda.find(pedido => pedido.estado === "pendiente");

const indice = pedidosTienda.findIndex(pedido => pedido.estado === "pendiente");