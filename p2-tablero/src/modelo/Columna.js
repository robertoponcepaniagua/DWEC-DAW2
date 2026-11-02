// Columna.js — Bloque A · ✍️ A2: una columna del tablero («Por hacer», «En curso», «Hecho»).
// En kanban, una columna puede tener un límite WIP (Work In Progress): «En curso» no admite más
// de 3 tareas a la vez, para no empezar mil cosas y no acabar ninguna.
import { Tarea } from "./Tarea.js";

export class Columna {
  // Privado: #tareas, un array
  #tareas = [];

  constructor(nombre, limiteWip = null) {
    // 1 · nombre: texto no vacío (sin espacios a los lados) → si no, TypeError
    //     limiteWip: null (sin límite) o un entero ≥ 1 → si no, RangeError

    // EXPLICACION: si nombre no es string o si nombre sin espacios es "" vacio o si nombre no es igual a nombre sin espacios
    if (typeof nombre !== "string" || nombre.trim() === "") throw new TypeError("Nombre no válido");
    // EXPLICACIÓN: si limiteWip no es null y (si limiteWip no es un número entero o si limiteWip es menor a 1)
    if (limiteWip !== null && (!Number.isInteger(limiteWip)||limiteWip < 1)) throw new RangeError("Rango no valido");
    this.nombre = nombre.trim();
    this.limiteWip = limiteWip;
  }

  // 2 · get llena: true si hay límite y ya hay tantas tareas como el límite

  get llena() {
    // EXPLICACIÓN: si no tiene limite y el número de tareas es igual al limiteWip (return true por qué está llena)
    if (this.limiteWip !== null && this.#tareas.length >= this.limiteWip) {
      return true
    } else {
      return false
    }
  }

  // 3 · get tareas: una COPIA del array (que nadie pueda tocar el tuyo desde fuera)

  get tareas() {
    const copiaArray = [...this.#tareas]
    return copiaArray
  }

  // 4 · añadir(tarea): TypeError si no es instanceof Tarea · Error («… está llena …») si está
  //     llena · si no, la guarda y la devuelve

  añadir(tarea) {
    if (tarea instanceof Tarea === false) throw new TypeError("No es instancia de Tarea");
    const aux = this.llena;
    if (aux === true) {
      throw new Error("Error («… está llena …»)");
    } else {
      this.#tareas.push(tarea);
      return tarea;
    }
  }

  // 5 · quitar(id): la saca del array y la devuelve · Error («… no está …») si no la encuentra
  //     Pista: findIndex + splice
  quitar(id) {
    const indice = this.#tareas.findIndex(tarea => tarea.id === id) // Devuleve -1 si no encuentra nada
    if (indice === -1) {
      // Si no encuentra nada:
      throw new Error("Error («… no está …»)")
    } else {
      // indice: posición desde donde empieza a eliminar.
      // 1: cantidad de elementos que elimina.
      // Sin [0]: devuelve un array con los elementos eliminados.
      // Con [0]: devuelve directamente el primer objeto eliminado.

      // Elimina 1 tarea desde el índice indicado y devuelve la tarea eliminada (posición 0 del array que devuelve splice).      
      return this.#tareas.splice(indice, 1)[0]
    }
  }
  // 6 · tiene(id): true / false. Pista: some

  tiene(id) {
    return this.#tareas.some(tarea => tarea.id === id)
  }

  // 7 · ordenadas(): un array NUEVO ordenado: primero prioridad alta (usa t.peso), y a igual
  //     prioridad, el límite más cercano; las que no tienen límite, al final.
  //     Pista: [...this.#tareas].sort((a, b) => …) — ¿por qué la copia?


    // sort() compara dos elementos (a y b) y utiliza el número devuelto
    // para decidir su orden: -1 coloca a antes que b, 0 mantiene su orden
    // relativo y 1 coloca a después que b. sort() se encarga de reorganizar el array.


  ordenadas() {
    return [...this.#tareas]
      .sort((a, b) => {
        if (a.peso !== b.peso) {
          return b.peso - a.peso // ordnenamos de mayor a menor peso
        }
        if (a.peso === b.peso) { //si son iguales de peso comprobamos las fechas

          if (a.limite === null && b.limite === null) {
            return 0; // 0 significa que no devuelve ninguna de las 2
          }else if (a.limite === null) { //si a.limiteWip es null, coloca [b] antes que [a] porque a si tiene fecha límite
            return 1 // 1 significa que b debe colocarse antes que a
          } else if (b.limite === null) { //si b.limiteWip es null, coloca [a] antes que [b] porque a si tiene fecha límite
            return -1 // -1 significa que a debe colocarse antes que b
          }
        }
        return a.limite - b.limite //si son iguales en todo lo demás lo ordenamos por la fehca
      });
    }
}

// Comprueba con:  docker compose run --rm web npm test 3-columna
void Tarea; // (borra esta línea cuando uses Tarea)
