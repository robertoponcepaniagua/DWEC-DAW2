// Ejercicio 6 — switch con fall-through intencional

// Escribe una función diaDeLaSemana(numero) que, usando switch, devuelva:

//     "Fin de semana" si el número es 6 o 7.
//     "Día laboral" si el número está entre 1 y 5.
//     "Número no válido" en cualquier otro caso.

// Tienes que aprovechar el fall-through (agrupar varios case sin break entre ellos) al menos una vez en tu solución.

function diaDeLaSemana(numero) {
    switch(numero) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
            return "Día Labotal";
        case 6:
        case 7:
            return "Fin de semana";
        default:
            return "Número no valido";
    }
}

// como es un fall trought se combinan los case 1,2,3... hasta el 5 por ejemplo y da igual el número que pongas si es uno del 1 al 5 va a dar lo último que haga el último case
