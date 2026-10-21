// Ejercicio 4 — Cortocircuitos && / || y la trampa del 0

// Dado este objeto:

// const producto = {
//   nombre: "Auriculares",
//   stock: 0,
//   descuento: false
// };

//     Usa || para crear stockMostrado que muestre producto.stock, o "Sin datos" si no hubiera stock definido. Ejecútalo y observa qué sale.
//     Ahora repite el mismo cálculo pero con ?? en vez de ||, llámalo stockCorrecto.
//     Explica en un comentario por qué los dos resultados son distintos.
//     Usa && para que solo se ejecute console.log("¡Aplica el descuento!") cuando producto.descuento sea true.

const producto = {
  nombre: "Auriculares",
  stock: 0,
  descuento: false
};

// Este da "Sin datos" porque || busca el truthy ya que ninguno es truthy da el último
const stockMostrado = producto.stock || "Sin datos";
// este da 0, ya que producto.stock no es null ni nullish, y si no es ni null ni nullish da el de la izq
const stockCorrecto = producto.stock ?? "Sin datos"; 