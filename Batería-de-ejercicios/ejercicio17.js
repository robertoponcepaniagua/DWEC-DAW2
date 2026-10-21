// Ejercicio 17 — includes

//     Crea un array clientesVip = ["Marta", "Nora"].
//     Usa includes() para comprobar, para cada pedido de pedidosTienda, si su cliente es VIP, e imprime `${cliente} es VIP` o `${cliente} no es VIP` según el caso (puedes combinarlo con forEach() o map() de la UD3).

const pedidosTienda = [
  { id: 1, cliente: "Marta", estado: "enviado", total: 45 },
  { id: 2, cliente: "Luis", estado: "pendiente", total: 120 },
  { id: 3, cliente: "Nora", estado: "entregado", total: 30 },
  { id: 4, cliente: "Iván", estado: "pendiente", total: 75 }
];

const clientesVip = ["Marta", "Nora"];

pedidosTienda.forEach (pedido => {
    const esVip = clientesVip.includes(pedido.cliente);
    console.log(`${pedido.cliente} ${esVip ? "es VIP" : "no es VIP"}`);
})
