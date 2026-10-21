// Bloque 4 · Métodos funcionales
// Ejercicio 12 — map: transformar

// Dado:

// const alumnos = [
//   { nombre: "Marta", notaSobre10: 7 },
//   { nombre: "Iván", notaSobre10: 5.5 },
//   { nombre: "Nora", notaSobre10: 9 }
// ];

// Usa map() para crear un nuevo array alumnosConLetra de objetos { nombre, letra }, donde letra sea "A" si la nota es ≥ 9, "B" si es ≥ 7, o "C" en cualquier otro caso. Comprueba al final que alumnos no ha cambiado.


const alumnos = [
  { nombre: "Marta", notaSobre10: 7 },
  { nombre: "Iván", notaSobre10: 5.5 },
  { nombre: "Nora", notaSobre10: 9 }
];

const alumnosConLetra = () => {
    return alumnos
        .map(alumno => ({
            nombre: alumno.nombre,
            letra: alumno.notaSobre10 >= 9 ? "A" : alumno.notaSobre10 >= 7 ? "B" : "C",
        }))
}