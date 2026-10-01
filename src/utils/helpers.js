// Funciones pequeñas de apoyo que se usan en varios sitios:
// formatear precios para mostrarlos en pantalla, y funciones
// auxiliares...

// IMPORTS
import * as catalogService from "../services/catalogService";

export function catalog() {


    console.log("-----------Menú--------------------")
    console.log("1. TODO EL CATALOGO")
    console.log("2. FILTRAR POR CATEGORIA")
    console.log("3. SOLO PRODUCTOS CON STOCK BAJO")
    console.log("-----------------------------------")

    let option = parseInt(prompt("Escribre un número del 1 al 3: ")); 

    switch(option) {
        case 1:
            catalogService.allCatalog();
            break;

        case 2:
            catalogService.filterCategory();
            break;
        
        case 3:
            catalogService.lowStock();
            break;
    }
}