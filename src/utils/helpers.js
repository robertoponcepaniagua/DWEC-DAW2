// Funciones pequeñas de apoyo que se usan en varios sitios:
// formatear precios para mostrarlos en pantalla, y funciones
// auxiliares...

// IMPORTS
import * as catalogService from "../services/catalogService";
import { printSessionState } from "../services/sessionState";


export function catalog() {

    do {
        console.log("-----------Menú--------------------");
        console.log("1. VER CATALOGO");
        console.log("2. BUSCAR PRODUCTO");
        console.log("3. REGISTRAR UNA VENTA");
        console.log("4. REPONER STOCK");
        console.log("5. INFORME DE CAJA");
        console.log("6. SALIR");
        console.log("-----------------------------------");

        let option = parseInt(prompt("[Menú] Escribre un número del 1 al 6: ")); 

        switch(option) {
            case 1:
                subcatalog();
                break;

            case 2:
                let wanted = prompt("Escribe el titulo del producto que quieras");
                catalogService.findProduct(wanted);
                break;
            
            case 3:
                catalogService.registerSale();
                break;
            case 4:
                
                break;
            
            case 5:
                printSessionState();
                break;
            case 6:
                break;
        }
    } while (option !== 6);
}

export function subcatalog() {

    let option = 0;

    do {
        console.log("-----------SUB-Menú--------------------");
        console.log("1. TODO EL CATALOGO");
        console.log("2. FILTRAR POR CATEGORIA");
        console.log("3. SOLO PRODUCTOS CON STOCK BAJO");
        console.log("4. VOLVER AL MENÚ");
        console.log("5. SALIR");
        console.log("---------------------------------------");

        option = parseInt(prompt("[SUB-MENÚ] Escribe un número del 1 al 5: ")); 

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
            case 4:
                console.log("IR A MENÚ");
                catalog();
            case 5:
                console.log("SALIENDO...")
                break;
            default:
                console.log("Opción no valida (1 al 5)");
                break;
        }
    } while(option !== 5);
}