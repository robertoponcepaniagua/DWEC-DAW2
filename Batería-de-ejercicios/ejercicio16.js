// Ejercicio 16 — some y every

//     Usa some() para comprobar si hay algún pedido con total > 100.
//     Usa every() para comprobar si todos los pedidos tienen total > 10.
//     Usa every() de nuevo para comprobar si todos los pedidos están "entregado" (debería dar false).

const pedidosTienda = [
  { id: 1, cliente: "Marta", estado: "enviado", total: 45 },
  { id: 2, cliente: "Luis", estado: "pendiente", total: 120 },
  { id: 3, cliente: "Nora", estado: "entregado", total: 30 },
  { id: 4, cliente: "Iván", estado: "pendiente", total: 75 }
];

const pedido_some = pedidosTienda.some(pedido => pedido.total > 100); //true

const pedido_every = pedidosTienda.every(pedido => pedido.total >10); //true

const pedido_every2 = pedidosTienda.every(pedido => pedido.estado === "entregado"); //false