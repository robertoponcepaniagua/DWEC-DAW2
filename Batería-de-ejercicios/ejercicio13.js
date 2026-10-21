// Ejercicio 13 — filter: seleccionar

// Usando el mismo array alumnos del ejercicio 12, crea aprobados, un array que contenga solo los alumnos con notaSobre10 >= 5.


const alumnos = [
  { nombre: "Marta", notaSobre10: 7 },
  { nombre: "Iván", notaSobre10: 5.5 },
  { nombre: "Nora", notaSobre10: 9 }
];

const aprobados = [...alumnos].filter(alumnos => alumnos.notaSobre10 >= 5)