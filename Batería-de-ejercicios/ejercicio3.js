// Ejercicio 3 — Ternario (simple y anidado)

//     Usando el operador ternario, crea mensaje que valga "Mayor de edad" si edad >= 18, o "Menor de edad" en caso contrario, para edad = 16.
//     Ahora, con un ternario anidado, crea categoria que valga "Bebé" si edad < 2, "Niño" si edad < 12, "Adolescente" si edad < 18, o "Adulto" en cualquier otro caso. Pruébalo con edad = 8.


const mensaje = edad >= 18 ? "Mayor de edad" : "Menor de edad";
const categoria = edad < 2 ? "Bebé" : edad < 12 ? "Niño" : edad < 18 ? "Adolescente" : "Adulto";