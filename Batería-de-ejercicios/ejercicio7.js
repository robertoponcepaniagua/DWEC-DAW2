// Bloque 2 · Bucles clásicos
// Ejercicio 7 — while / do...while

//     Escribe un while que simule intentos de login: parte de intentos = 0 y, mientras intentos < 3, imprime `Intento ${intentos + 1} de 3` e incrementa intentos.
//     Ahora escribe un do...while que pida (simuladamente, sin prompt, solo con una variable ya fijada como contraseñaCorrecta = true) al menos una vez, y explica en un comentario por qué un do...while garantiza esa primera ejecución y un while no.


function parte1 () {
    let intentos = 0;
    while (intentos < 3) {
        console.log(`Intento ${intentos + 1} de 3`);
        intentos++;
    }
}

function parte2 () {
    let contraseñaCorrecta = false;
    do {
        contraseñaCorrecta = true;
    } while (!contraseñaCorrecta);
}

// el do while se ejecuta una vez al menos ya que primero hace do y luego comprueba, el while comprueba y luego hace