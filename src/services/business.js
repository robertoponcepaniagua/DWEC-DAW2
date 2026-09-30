// Lógica de negocio: aquí se calculan los precios y el aviso de stock bajo.
// Tabla A: recargo/descuento según el estado del producto.
// Tabla B: descuento por volumen según las unidades vendidas.
// Tabla C: comprobar si el stock queda por debajo del umbral.
// No toca el catálogo ni la consola, solo recibe datos y devuelve resultados.



// TABLA A aplica un recargo o descuento sobre basePrice según el estado de conservación del producto.
export function applyStateAdjustment(basePrice, state) {
  // nuevo-precintado +25%, usado-como-nuevo +0%, usado-caja-danada -15%, solo-cartucho -30%.
  let adjustment = 0;

  switch (state) {
    case "nuevo-precintado":
        adjustment = basePrice * 0.25;
        return basePrice + adjustment;

    case "usado-como-nuevo":
        return basePrice;
    
    case "usado-caja-danada":
        adjustment = basePrice * 0.15;
        return basePrice - adjustment;

    case "solo-cartucho":
        adjustment = basePrice * 0.30;
        return basePrice - adjustment;

    default:
      // Defensa para evirtar bugs (un state que no sea ninguno de esos)
        console.log(`Estado sin reconocer, ${state}`);
        return basePrice;
  }
}

// TABLA B aplica un descuento adicional según las unidades vendidas en la misma operación.
export function getQuantityDiscount(quantity) {
  // 1 unidad 0%, 2-3 unidades 5%, 4 o más unidades 10%

  // Defensa para evitar bugs (quantity <= 0)
  if(quantity <= 0) {
    console.log(`La cantidad no puede ser <= 0: ${quantity}`);
    return 0;
  }

  // Lógica de la Tabla B
  if(quantity === 1) {
    return 0;
  } else if(quantity >= 2 && quantity <= 3) {
    return 0.05;
  } else {
    return 0.10;
  }
}

// TABLA C: umbral de stock bajo. Si, tras una venta, el stock de un producto queda por debajo de 3 unidades, debe marcarse con
// "⚠️ Stock bajo" en cualquier listado posterior.
export function isLowStock(stock) {
    // Si es el stock < 3 return: true, si stock >= 3 return: false
  return stock < 3;
}