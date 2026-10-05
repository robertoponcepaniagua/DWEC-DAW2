// Funciones pequeñas de apoyo que se usan en varios sitios:
// formatear precios para mostrarlos en pantalla, y funciones
// auxiliares...

// IMPORTS
import { catalog } from "../data/catalog";
import * as catalogService from "../services/catalogService";
import { printSessionState } from "../services/sessionState";


let currentCatalog = [...catalog];

export function Menu() {
    let option = 0;

    do {
        console.log("-----------Menú--------------------");
        console.log("1. VER CATALOGO");
        console.log("2. BUSCAR PRODUCTO");
        console.log("3. REGISTRAR UNA VENTA");
        console.log("4. REPONER STOCK");
        console.log("5. INFORME DE CAJA");
        console.log("6. SALIR");
        console.log("-----------------------------------");

        option = parseInt(prompt("[Menú] Escribe un número del 1 al 6: ")); 

        switch(option) {
            case 1:
                subcatalog();
                break;

            case 2: {
                let wanted = prompt("Escribe el título del producto que quieras: ");
                catalogService.findProduct(currentCatalog, wanted);
                break;
            }
            
            case 3: {
                let id_sale = parseInt(prompt("Dime el ID del producto que has vendido: "));
                let quantity_sale = parseInt(prompt("Dime la cantidad que has vendido: "));
                
                currentCatalog = catalogService.registerSale(currentCatalog, id_sale, quantity_sale);
                break;
            }

            case 4: {
                let id = parseInt(prompt("Dime el ID del producto que quieres añadir stock: "));
                let quantity = parseInt(prompt("Dime la cantidad que quieres añadir: "));
                
                currentCatalog = catalogService.addStock(currentCatalog, id, quantity);
                break;
            }
            
            case 5:
                printSessionState();
                break;

            case 6:
                console.log("Saliendo...");
                break;

            default:
                console.log("Opción no válida (1 al 6)");
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
                catalogService.allCatalog(currentCatalog);
                break;

            case 2:
                catalogService.filterCategory(currentCatalog);
                break;
            
            case 3:
                catalogService.lowStock(currentCatalog);
                break;

            case 4:
                console.log("Volviendo al menú principal...");
                return; // Volver al menú de forma limpia

            case 5:
                console.log("Saliendo...");
                break;

            default:
                console.log("Opción no válida (1 al 5)");
                break;
        }
    } while(option !== 5 && option !== 4);
}