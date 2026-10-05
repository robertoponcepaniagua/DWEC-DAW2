// Guarda el estado de la sesión actual (total facturado, nº de ventas...)
// usando un closure: estos datos son privados y solo se pueden cambiar
// a través de las funciones que este fichero expone, no desde fuera.


// CREAR LA SESIÓN
// ESTO SIRVE PARA QUE SEA UN CLOSURE COMO LO PIDE EN EL PDF, ASÍ TAMBIÉN ES MÁS MANEJABLE Y MÁS FÁCIL PARA HACER MODIFICACIONES DE DATOS
// ESTA FUNCIÓN DEVUELVE UN OBJETO CON 
function makeSessionState() {
    // total facturado
    let salesHistory = [];
    // ID PRODUCTO / UNIDADES VENDIDAS (ASÍ PODEMOS VER DE TODOS LOS PRODUCTO LO QUE SE HA VENDIDO)
    let salesByProduct = {};

    // ID DEL PRODUCTO PARA REGISTRAR SU VENTA, CANTIDAD, Y CUANTO VA A VENDER
    function logSale(id, quantity, amount) {
        salesByProduct[id] = (salesByProduct[id] ?? 0) + quantity;
        // Guardamos la transacción en el historial
        salesHistory.push({ id, quantity, amount });
    }
    
    // LA CANTIDAD QUE HA VENDIDO EN LA SESIÓN
    function getTotalSales() {
        // Usando reduce sobre el historial o lista de importes
        return salesHistory.reduce((accumulator, currentSale) => {
            return accumulator + currentSale.amount;
        }, 0);
    }

    function getSalesByProduct() {
        return salesByProduct;
    }

    return { logSale, getTotalSales, getSalesByProduct };
}

// LO EJECUTAMOS AQUÍ UNA VEZ Y YA TENEMOS LA SESSION HECHA ASÍ LA FUNCIÓN MAKESESSIONSTATE ES COMPLETAMENTE PRIVADA Y CUMPLE ESE CLOSURE PERFECTAMENTE

export const session = makeSessionState();

export function printSessionState() {
    console.log("-----------------------------------");
    console.log("--------ESTADO DE LA SESIÓN--------");
    console.log("-----------------------------------");

    const money = session.getTotalSales();
    let sales = false;

    console.log(`Total facturado: ${money}`);
    console.log("Productos vendidos: ")

    const products = session.getSalesByProduct();

    for (const id in products) {
        sales = true;
        console.log(`Producto ID ${id}: ${products[id]} unidades`);
    }

    if(!sales) {
        console.log("No hay ventas")
    }
}