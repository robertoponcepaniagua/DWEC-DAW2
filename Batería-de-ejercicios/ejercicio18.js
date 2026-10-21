// Ejercicio 18 (integrador) — Todo junto

// Usando pedidosTienda:

//     Filtra los pedidos que no estén "entregado".
//     Comprueba con some() si entre esos pedidos filtrados hay alguno de más de 100€.
//     Calcula con reduce() el total acumulado de esos pedidos filtrados.
//     Busca con find() el pedido de mayor total entre todos (pista: puedes combinarlo con reduce() para comparar, o recorrer y comparar el total).

const pedidosTienda = [
  { id: 1, cliente: "Marta", estado: "enviado", total: 45 },
  { id: 2, cliente: "Luis", estado: "pendiente", total: 120 },
  { id: 3, cliente: "Nora", estado: "entregado", total: 30 },
  { id: 4, cliente: "Iván", estado: "pendiente", total: 75 }
];

const pedidos_no_entregados = () => {
    return pedidosTienda
        .filter(pedido => pedido.estado !== "entregado");
};

const pedido_100 = () => {
    return pedidos_no_entregados()
        .some(pedido => pedido.total > 100);
};

const total_acumulado = () => {
    return pedidos_no_entregados()
        .reduce((acc, pedido) => pedido.total + acc ,0);
};

const pedido_mayor = () => {
    return [...pedidosTienda]
        .sort((pedido1 , pedido2) => pedido2.total - pedido1.total)[0];
};
