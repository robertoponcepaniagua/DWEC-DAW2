// services/catalogService.js
// Operaciones sobre el catálogo: buscar, vender y reponer stock.
// Estas funciones reciben el catálogo actual y devuelven uno nuevo
// (nunca mutan el array original).

// IMPORTS
import { catalog } from "../data/catalog";
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
                return game.category.toLowerCase() === search;
            });
            break;

        case 2:
            // FILTRAR POR PLATAFORMA
            array = catalog.filter(game => {
                return game.platform.toLowerCase() === search;
            });
            break;

        case 3:
            // FILTRAR POR ESTADO
            array = catalog.filter(game => {
                return game.state.toLowerCase() === search;
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

