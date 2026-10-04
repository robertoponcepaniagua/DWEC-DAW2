// services/catalogService.js
// Operaciones sobre el catálogo: buscar, vender y reponer stock.
// Estas funciones reciben el catálogo actual y devuelven uno nuevo
// (nunca mutan el array original).

// IMPORTS
import { catalog } from "../data/catalog";
import * as business from "./business";
import { session } from "./sessionState";
// ----

// ---FUNCIONES DEL CATALOGO INICIAL---
export function allCatalog() {
    // VER TODO EL CÁTALOGO
    catalog.forEach(game => {
        console.log(`[#${game.id}] ${game.title} (${game.platform}) - ${game.basePrice}€ | Stock: ${game.stock}`);
    });
}

export function filterCategory() {
    // FILTRAR POR CATEGORÍA
    console.log("-----------------");
    console.log("1.Categoria");
    console.log("2.Plataforma");
    console.log("3.Estado");
    console.log("-----------------");

    const option = parseInt(prompt("Elige una opción del 1 al 3: "));
    

    if(option === 3) {
        console.log("---ESTADOS---")
        console.log("nuevo-precintado - usado-como-nuevo - usado-caja-danada - solo-cartucho");
    }


    const search = prompt("Escribe que estás buscando (Ej: PS1)");

    let array = [];

    switch(option) {
        case 1:
            // FILTRAR POR CATEGORÍA
            array = catalog.filter(game => {
                return game.category.toLowerCase() === search.toLowerCase();
            });
            break;

        case 2:
            // FILTRAR POR PLATAFORMA
            array = catalog.filter(game => {
                return game.platform.toLowerCase() === search.toLowerCase();
            });
            break;

        case 3:
            // FILTRAR POR ESTADO
            array = catalog.filter(game => {
                return game.state.toLowerCase() === search.toLowerCase();
            });
            break;

        default:
            console.log("No valido");
            return;

    }
    console.log(array);
}

export function lowStock() {
    // MOSTRAR SOLO "⚠ Stock bajo"

    const array = catalog.filter(game => game.stock < 3);

    console.log(array);
}

// FUNCIONES DEL CATALOGO ESPECIALES (BUSQUEDA, FILTRADO ETC)

// BUSQUEDA DE PRODUCTO
export function findProduct(title) {
    // BUSCAR UN PRODUCTO POR SU TITULO

    if (!title) {
        console.log("Debes indicar un título para buscar.");
        return;
    }

    let wanted = "";

    wanted = catalog.find(game => game.title.toLowerCase() === title.toLowerCase());

    // SI NO ENCUENTRA TERMINA LA FUNCIÓN
    if (!wanted) {
        console.log("Producto no encontrado");
        return;
    }

    console.log(wanted);
}

// REGISTRAR PRODUCTO
export function registerSale(currentCatalog, id, quantity) {


    // currentCatalog es por la inmutabilidad, id para buscar y el quantity la cantidad

    // .map recorre el array elemento por elemento y crea un nuevo array

    return currentCatalog.map(game => {

        // Si no es el que buscamos siguiente
        if (game.id !== id) {
            return game;
        }

        // Si es el juego pero no hay stock suficiente
        if (game.stock < quantity) {
            console.log(`No queda stock suficiente. Stock actual: ${game.stock}`);
            return game;
        }

        // Por quantity es menor que 0
        if (quantity <= 0) {
            console.log(`Cantidad no valida: ${quantity}`)
        }

        // SE LE PONE EL PRECIO DE LA TABLA A Y B
        // "El precio final aplica Tabla A y Tabla B combinadas"

        // CALCULAMOS EL PRECIO: "TABLA A aplica un recargo o descuento sobre basePrice según el estado de conservación del producto."
        const price = business.applyStateAdjustment(game.basePrice, game.state);

        // CALCULAMOS EL DESCUENTO: TABLA B aplica un descuento adicional según las unidades vendidas en la misma operación.
        const discount = business.getQuantityDiscount(quantity);
        // PRECIO FINAL REDONDEADO A 2 DECIMALES
        const finalPrice = Math.round(price * (1 - discount) * 100) / 100;

        console.log(`Venta realizada con exito: ${game.id} ${game.title} ${game.state} ${quantity} ${finalPrice}`)

        // -----------------LO METEMOS EN LA SESIÓN----------------
        const total = Math.round(finalPrice * quantity * 100) / 100;
        session.logSale(id,quantity, total);
        // ---------------------------------------------------------

        return { ...game, stock: game.stock - quantity };
    })
}

export function addStock() {
    // Hay que hacerlo
}

export function cashReport(currentCatalog, saleList = []) {
    // Hay que hacerlo y cambiar el nombre de la función no lo veo muy claro

    // IDEA: CADA VEZ QUE SE HACE ALGO COMO REGISTRAR UNA VENTA O ALGO QUE IMPLIQUE ALGUNA MODIFICACIÓN ETC, CON EL .reduce() (RECUERDA QUE ES UN CONTADOR, NO ES NADA DE REDUCIR) CONTAMOS LAS VENTAS, LOS PRODUCTOS ENCONTRADOS...



}