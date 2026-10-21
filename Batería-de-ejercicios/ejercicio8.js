// Ejercicio 8 — for clásico: suma de posiciones pares

// Dado el array:

// const numeros = [5, 12, 8, 3, 20, 7, 14, 1];

// Usa un for clásico (con índice) para sumar solo los valores que están en una posición par del array (índices 0, 2, 4, 6...). Guarda el resultado en sumaPosicionesPares.

const numeros = [5, 12, 8, 3, 20, 7, 14, 1];

let sumaPosicionesPares = 0;

for (let i = 0; i < numeros.length; i++) {
    if(i % 2 === 0) {
        sumaPosicionesPares += numeros[i];
    }
}

