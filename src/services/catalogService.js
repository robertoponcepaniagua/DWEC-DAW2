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
export function allCatalog(currentCatalog) {
    // VER TODO EL CÁTALOGO
    currentCatalog.forEach(game => {
        console.log(`[#${game.id}] ${game.title} (${game.platform}) - ${game.basePrice}€ | Stock: ${game.stock}`);
    });
}

export function filterCategory(currentCatalog) {
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
            array = currentCatalog.filter(game => {
                return game.category.toLowerCase() === search.toLowerCase();
            });
            break;

        case 2:
            // FILTRAR POR PLATAFORMA
            array = currentCatalog.filter(game => {
                return game.platform.toLowerCase() === search.toLowerCase();
            });
            break;

        case 3:
            // FILTRAR POR ESTADO
            array = currentCatalog.filter(game => {
                return game.state.toLowerCase() === search.toLowerCase();
            });
            break;

        default:
            console.log("No valido");
            return;

    }
    console.log(array);
}

export function lowStock(currentCatalog) {
    // MOSTRAR SOLO "⚠ Stock bajo"

    const array = currentCatalog.filter(game => game.stock < 3);

    console.log(array);
}

// FUNCIONES DEL CATALOGO ESPECIALES (BUSQUEDA, FILTRADO ETC)

// BUSQUEDA DE PRODUCTO
export function findProduct(currentCatalog, title) {
    // BUSCAR UN PRODUCTO POR SU TITULO

    if (!title) {
        console.log("Debes indicar un título para buscar.");
        return;
    }

    let wanted = "";

    wanted = currentCatalog.find(game => game.title.toLowerCase() === title.toLowerCase());

    // SI NO ENCUENTRA TERMINA LA FUNCIÓN
    if (!wanted) {
        console.log("Producto no encontrado");
        return;
    }

    console.log(wanted);
}

// REGISTRAR PRODUCTO
export function registerSale(currentCatalog,id, quantity) {
    // 1. Validar la cantidad ANTES de recorrer el catálogo
    if (quantity <= 0) {
        console.log(`Cantidad no válida: ${quantity}`);
        return currentCatalog; // Devolvemos el catálogo sin modificar
    }

    // 2. Recorremos el catálogo
    return currentCatalog.map(game => {
        // Si no es el producto buscado, continuamos
        if (game.id !== id) {
            return game;
        }

        // Si es el juego pero no hay stock suficiente
        if (game.stock < quantity) {
            console.log(`No queda stock suficiente. Stock actual: ${game.stock}`);
            return game;
        }

        // CALCULAMOS EL PRECIO (TABLA A)
        const price = business.applyStateAdjustment(game.basePrice, game.state);

        // CALCULAMOS EL DESCUENTO (TABLA B)
        const discount = business.getQuantityDiscount(quantity);
        
        // PRECIO UNITARIO FINAL REDONDEADO A 2 DECIMALES
        const finalPrice = Math.round(price * (1 - discount) * 100) / 100;

        // TOTAL DE LA OPERACIÓN
        const total = Math.round(finalPrice * quantity * 100) / 100;

        // REGISTRO EN LA SESIÓN DE CAJA
        session.logSale(id, quantity, total);

        const newStock = game.stock - quantity;
        console.log(`Venta realizada con éxito: [${game.id}] ${game.title}, ${game.state}, Stock restante: ${newStock} uds | Total: ${total}€`);

        // Retornamos la copia inmutable con el nuevo stock
        return { 
            ...game, 
            stock: newStock 
        };
    });
}

export function addStock(currentCatalog,id, quantity) {
    // Hay que hacerlo

    return currentCatalog.map(game => {
        // SI NO ES EL QUE QUEREMOS SIGUIENTE
        if (game.id !== id) {
            return game;
        }

        // BLOQUEO DE AÑADIR NEGATIVOS
        if (quantity < 0) {
            console.log("No se puede añadir < 0");
            return;
        }

        if (game.id === id) {
            game.stock = game.stock + quantity;
            console.log(`El stock se ha añadido:  [${game.id}]: ${game.title} ${game.stock}`)
        }
    })
}

export function cashReport(saleList = []) {
    // Hay que hacerlo y cambiar el nombre de la función no lo veo muy claro

    // IDEA: CADA VEZ QUE SE HACE ALGO COMO REGISTRAR UNA VENTA O ALGO QUE IMPLIQUE ALGUNA MODIFICACIÓN ETC, CON EL .reduce() (RECUERDA QUE ES UN CONTADOR, NO ES NADA DE REDUCIR) CONTAMOS LAS VENTAS, LOS PRODUCTOS ENCONTRADOS...



}