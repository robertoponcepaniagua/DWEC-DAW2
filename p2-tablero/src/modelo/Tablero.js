// Tablero.js — Bloque A · ✍️ A3 (el tablero) y A5 (reglas).
// En el bloque C volverás aquí para ✍️ C4 (toJSON y desdeJSON).
// El tablero TIENE tres columnas: es composición, no hereda de nadie.
import { Columna } from "./Columna.js";
import { ColumnaLlenaError, MovimientoNoPermitidoError } from "./errores.js";
import { Tarea } from "./Tarea.js";
import { TareaRecurrente } from "./TareaRecurrente.js";
import { aDatos, desdeDatos } from "./serializar.js";

export class Tablero {
  static COLUMNAS = Object.freeze(["Por hacer", "En curso", "Hecho"]);
  static VERSION_DATOS = 1; // (bloque C) si algún día cambia el formato guardado, se sube
  // Privado: #columnas, un Map nombre → Columnaç
  #columnas;
  // ✍️ A3 ──────────────────────────────────────────────────────────────────────
  constructor(limiteEnCurso = 3) {
    // Crea las tres columnas; solo «En curso» lleva límite WIP (limiteEnCurso)
    this.#columnas = new Map();
    for (const columna of Tablero.COLUMNAS) {
      if (columna === "En curso") {
        this.#columnas.set("En curso",new Columna("En curso",limiteEnCurso));
      } else {
        this.#columnas.set(columna, new Columna(columna))
      }
    }
  }

  // static desde(datos, limiteEnCurso): un Tablero con una tarea por cada objeto de datos
  //   (usa crearTarea)
  static desde(datos, limiteEnCurso) {
    //crearTarea() // no puedo hacerlo sin crear tarea terminado, o eso creo
  }
  // columna(nombre): la Columna, o un Error si no existe (que el mensaje lleve el nombre)
  // get columnas: array con las tres columnas, en orden

  columna(nombre) {
    if (this.#columnas.has(nombre)) {
      return this.#columnas.get(nombre)
    } else {
      const nombres_columnas = this.columnas // para aceder a los metodos de las clases se hace con this y el nombre
      throw new Error(`No existe ninguna columna llamada ${nombre} en ${nombres_columnas}`)
    }
  }

  get columnas() {
    return [...this.#columnas.keys()]; //[] para convertilo en array, .keys() porque es un map y necesito los nombres
  }

  // crearTarea(datos): TareaRecurrente si datos trae cadaDias, Tarea si no → a «Por hacer»
  //   y la devuelve. datos es un objeto { titulo, prioridad, limite, cadaDias }: saca cada campo
  //   y pásaselo al constructor, en su orden (new Tarea(datos) NO vale: espera el título)

  crearTarea(datos) {
    if (Object.hasOwn(datos, "cadaDias")) {
      const TareaRecurrenteCreada = new TareaRecurrente(datos.titulo, datos.prioridad, datos.limite, datos.cadaDias);
      return TareaRecurrenteCreada;
    } else {
      const TareaCreada = new Tarea(datos.titulo, "Por hacer", datos.limite);
      return TareaCreada;
    }
  }

  // buscar(id): la tarea, esté en la columna que esté, o null
  // dondeEsta(id): la Columna donde está, o null

  buscar(id) {
    const TareaBuscada = [...this.#columnas].filter(tarea => tarea.id === id) ? TareaBuscada : null
  }

  // mover(id, destino): Error si no existe la tarea · Error si la columna destino está llena
  //   (¡comprueba ANTES de quitarla de su columna, o se perdería!) · la mueve y la devuelve

  mover(id, destino) {
    // COMENATRIOS PARA NO LIARME:
    //  - ID ES NUMBER
    //  - DESTINO STRING
    //  - UN TABLERO TIENE 3 COLUMNAS, ENTONCES EL DESTINO ES UNA DE ESAS COLUMNAS, Y EN LAS COLUMNAS SE GUARDAN TAREAS QUE EL ID ES UNA DE ESAS TAREAS.
    //  - ENTONCES ESTE MÉTODO LO QUE HACE ES MOVER LA TAREA DE COLUMNA EN EL TABLERO

    const existe = this.#columnas.has(destino);
    if (existe) {
      // SI EXISTE
      const columnaBuscada = this.#columnas.get(destino); 
      const columnaAnterior = () => {
        for (const columna of this.#columnas.values()) {
          // AQUÍ OBTENGO TODAS LAS COLUMNAS DEL MAP
          let tareas = this.columna.tareas(); 
          for (const tarea of tareas) {
            if (tarea.id === id) {
              columna.quitar(id);
            }
          }
        }
      }

      if (!columnaBuscada.llena()) {
        // AHORA SI NO ESTÁ LLENA:
        const arrayTareas = this.#columnas.tareas(); // ARRAY DE TODAS LAS TAREAS
        const tareaBuscada = [...arrayTareas].find(tarea => tarea.id === id) //CON ESTO SE SUPONE QUE YA TENGO LA TAREA

        if (typeof tareaBuscada === 'object' && tareaBuscada !== null) {
          // SI ES UN OBJETO Y NO ES NULL:
          columnaBuscada.añadir(tareaBuscada);
        } else {
          throw new TypeError("Tarea Buscada no valida");
        }

      } else {
        // SI ESTÁ LLENA:
        throw new Error("La columna está llena");
      }

    } else {
      // SI NO EXISTE
      throw new Error("El destino no existe")
    }
  }

  // completar(id): la mueve a «Hecho» y añade a «Por hacer» lo que devuelva tarea.alCompletar()
  //   ⚠️ Sin preguntar si es recurrente: eso es el polimorfismo

  // resumen(hoy = new Date()): { porHacer, enCurso, hecho, vencidas }
  //   vencidas = las que estaVencida(hoy) y NO están en «Hecho»

  // ✍️ A5 · Reglas (vuelves a mover y completar) ─────────────────────────────────
  //   - Columna llena → ColumnaLlenaError (en vez de un Error cualquiera)
  //   - Sacar una tarea de «Hecho», o «moverla» a la columna en la que ya está →
  //     MovimientoNoPermitidoError. Todo se comprueba ANTES de tocar nada.
  //   Pista: mover y completar hacen casi lo mismo. Un método privado #trasladar(id, destino)
  //   con las comprobaciones evita escribirlas dos veces.

  // ✍️ C4 (bloque C) ────────────────────────────────────────────────────────────
  // toJSON(): { version, limiteEnCurso, columnas: { "Por hacer": [datos…], … } }
  //   JSON.stringify(tablero) lo llama solo. Sin él sale "{}": los # no se ven. Usa aDatos.

  /** Lo contrario de toJSON: el MISMO tablero (columnas, ids y límite WIP). Lanza si no encaja. */
  static desdeJSON(datos) {
    throw new Error("Sin hacer");
  }
}

// Comprueba con:  docker compose run --rm web npm test bloque-a
(void Columna,
  ColumnaLlenaError,
  MovimientoNoPermitidoError,
  Tarea,
  TareaRecurrente,
  aDatos,
  desdeDatos); // (borra esta línea cuando los uses)
