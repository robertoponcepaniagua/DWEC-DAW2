// Ejercicio 2 — if / else if / else: validador de acceso

// Escribe una función validarAcceso(edad, tieneEntrada) que:

//     Si edad es menor de 12 → devuelve "Acceso gratuito".
//     Si edad está entre 12 y 17 (inclusive) y tieneEntrada es true → devuelve "Acceso con descuento".
//     Si edad es 18 o más y tieneEntrada es true → devuelve "Acceso normal".
//     En cualquier otro caso → devuelve "Acceso denegado".

function validarAcceso(edad, tieneEntrada) {
    if (edad < 12) {
        return "Acceso gratuito";
    } else if (edad >= 12 && edad <= 17 && tieneEntrada) {
        return "Acceso con descuento";
    } else if (edad >= 18 && tieneEntrada) {
        return "Acceso normal";
    } else {
        return "Acceso denegado";
    }
}