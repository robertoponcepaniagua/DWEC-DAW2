// services/catalogService.js
// Operaciones sobre el catálogo: buscar, vender y reponer stock.
// Estas funciones reciben el catálogo actual y devuelven uno nuevo
// (nunca mutan el array original).

import { catalog } from "../utils/helpers";


// ---FUNCIONES DEL CATALOGO INICIAL---
export function allCatalog() {
    // VER TODO EL CÁTALOGO
    catalog.forEach(game => {
        console.log(`[#${game.id}] ${game.title} (${game.platform}) - ${game.basePrice}€ | Stock: ${game.stock}`);
    });
}

export function filterCategory() {
    // FILTRAR POR CATEGORÍA
}

export function lowStock() {
    // MOSTRAR SOLO "⚠ Stock bajo"
}

// FUNCIONES DEL CATALOGO ESPECIALES (BUSQUEDA, FILTRADO ETC)

