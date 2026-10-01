// Funciones pequeñas de apoyo que se usan en varios sitios:
// formatear precios para mostrarlos en pantalla, y funciones
// auxiliares...

export function catalog() {


    print("-----------Menú--------------------")
    print("1. TODO EL CATALOGO")
    print("2. FILTRAR POR CATEGORIA")
    print("3. SOLO PRODUCTOS CON STOCK BAJO")
    print("-----------------------------------")


    switch(option) {
        case 1:
            allCatalog();
            break;

        case 2:
            filterCategory();
            break;
        
        case 3:
            lowStock();
            break;
    }
}