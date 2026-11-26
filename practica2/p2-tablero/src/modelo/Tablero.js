// Tablero.js — Bloque A · ✍️ A3 (el tablero) y A5 (reglas).
// En el bloque C volverás aquí para ✍️ C4 (toJSON y desdeJSON).
// El tablero TIENE tres columnas: es composición, no hereda de nadie.
import { Columna } from "./Columna.js";
import { ColumnaLlenaError, MovimientoNoPermitidoError } from "./errores.js";
import { Tarea } from "./Tarea.js";
import { TareaRecurrente } from "./TareaRecurrente.js";
import { aDatos, desdeDatos } from "./serializar.js";
import { TareaConGastos } from "./TareaConGastos.js";
import { comprobarPaso } from "./TareaConGastos.js";

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
        this.#columnas.set("En curso", new Columna("En curso", limiteEnCurso));
      } else {
        this.#columnas.set(columna, new Columna(columna));
      }
    }
  }

  // static desde(datos, limiteEnCurso): un Tablero con una tarea por cada objeto de datos
  //   (usa crearTarea)
  static desde(datos, limiteEnCurso) {
    // SIRVE PARA CREAR UN TABLERO COMPLETO A PARTIR DE UN ARRAY DE OBJETOS
    const tablero = new Tablero(limiteEnCurso);
    for (const tarea of datos) {
      tablero.crearTarea(tarea);
    }
    return tablero;
  }
  // columna(nombre): la Columna, o un Error si no existe (que el mensaje lleve el nombre)
  // get columnas: array con las tres columnas, en orden

  columna(nombre) {
    if (this.#columnas.has(nombre)) {
      return this.#columnas.get(nombre);
    } else {
      const nombres_columnas = this.columnas; // para aceder a los metodos de las clases se hace con this y el nombre
      throw new Error(`No existe ninguna columna llamada ${nombre} en ${nombres_columnas}`);
    }
  }

  get columnas() {
    return [...this.#columnas.values()]; //[] para convertilo en array, .values() porque es un map y necesito las columnas
  }

  // crearTarea(datos): TareaRecurrente si datos trae cadaDias, Tarea si no → a «Por hacer»
  //   y la devuelve. datos es un objeto { titulo, prioridad, limite, cadaDias }: saca cada campo
  //   y pásaselo al constructor, en su orden (new Tarea(datos) NO vale: espera el título)

  // TENGO QUE VOLVER A HACER ESTÁ FUNCIÓN EN LA QUE CREO UNA TAREA TAMBIÉN CON TAREACONGASTOS
  crearTarea(datos) {
    let tarea;
    if (Object.hasOwn(datos, "presupuesto")) {
      tarea = new TareaConGastos(datos.titulo, datos.prioridad, datos.limite, datos.presupuesto);
    } else if (Object.hasOwn(datos, "cadaDias")) {
      tarea = new TareaRecurrente(datos.titulo, datos.prioridad, datos.limite, datos.cadaDias);
    } else {
      tarea = new Tarea(datos.titulo, datos.prioridad, datos.limite);
    }
    return this.columna("Por hacer").añadir(tarea);
  }

  // buscar(id): la tarea, esté en la columna que esté, o null
  // dondeEsta(id): la Columna donde está, o null

  buscar(id) {
    for (const columna of this.#columnas.values()) {
      const tarea = columna.tareas.find((tarea) => tarea.id === id);

      if (tarea) {
        return tarea;
      }
    }
    return null;
  }

  dondeEsta(id) {
    for (const columna of this.#columnas.values()) {
      if (columna.tiene(id)) return columna;
    }
    return null;
  }

  // mover(id, destino): Error si no existe la tarea · Error si la columna destino está llena
  //   (¡comprueba ANTES de quitarla de su columna, o se perdería!) · la mueve y la devuelve

  // falta en vmover poner que si el presupuesto es menor que el gasto tenemos que lanzar el error nuevo creado en errores
  mover(id, destino) {
    // COMENATRIOS PARA NO LIARME:
    //  - ID ES NUMBER
    //  - DESTINO STRING
    //  - UN TABLERO TIENE 3 COLUMNAS, ENTONCES EL DESTINO ES UNA DE ESAS COLUMNAS, Y EN LAS COLUMNAS SE GUARDAN TAREAS QUE EL ID ES UNA DE ESAS TAREAS.
    //  - ENTONCES ESTE MÉTODO LO QUE HACE ES MOVER LA TAREA DE COLUMNA EN EL TABLERO

    const columnaDestino = this.#columnas.get(destino); //coger la columna de destino

    if (!columnaDestino) {
      //VERIFICAR SI EXISTE O NO SI NO EXISTE LANZAMOS ERROR
      throw new Error(`La columna «${destino}» no existe`);
    }

    // PARA CONSEGUIR LA COLUMNA DE ORIGEN DE LA TAREA
    const columnaOrigen = this.dondeEsta(id);

    if (!columnaOrigen) {
      throw new Error(`La tarea ${id} no existe`);
    }

    if (columnaDestino === columnaOrigen) {
      throw new MovimientoNoPermitidoError(id, columnaOrigen.nombre, columnaDestino.nombre);
    }

    if (columnaOrigen.nombre === "Hecho") {
      throw new MovimientoNoPermitidoError(id, columnaOrigen.nombre, columnaDestino.nombre);
    }

    if (columnaDestino.llena) {
      throw new ColumnaLlenaError(columnaDestino);
    }

    const tarea = columnaOrigen.quitar(id);

    columnaDestino.añadir(tarea);

    // comprobamos el paso
    tarea.comprobarPaso(columnaOrigen, columnaDestino);

    return tarea;
  }

  // completar(id): la mueve a «Hecho» y añade a «Por hacer» lo que devuelva tarea.alCompletar()
  //   ⚠️ Sin preguntar si es recurrente: eso es el polimorfismo

  completar(id) {
    // MOVER TAREA A HECHO: MOVER DEVUELVE UNA TAREA (LAS TAREAS SE MUEVEN ENTRE COLUMNAS)
    // ALCOMPLETAR ESTÁ EN TAREA Y TAREARECURRENTE CADA INSTANCIA DEVUELVE ALGO DIFERENTE TAREA = [] TAREARECURRENTE = LA TAREA SIGUIENTE
    // NO HAY QUE PREGUNTAR LA INSTANCIA, OSEA SIN INSTANCEOF

    // Pasa la tarea a hecho y devuelve esa misma tarea
    const tarea = this.mover(id, "Hecho");
    // Conseguir la columna por hacer de el tablero
    const porHacer = this.#columnas.get("Por hacer");
    // for por qué al completar es un array y puede devolver la siguiente tarea en el caso de tareaRecurrente
    for (const tareaNueva of tarea.alCompletar()) {
      porHacer.añadir(tareaNueva); //se añade la tarea a "Por hacer"
    }
    return tarea;
  }
  // resumen(hoy = new Date()): { porHacer, enCurso, hecho, vencidas }
  //   vencidas = las que estaVencida(hoy) y NO están en «Hecho»

  resumen(hoy = new Date()) {
    // IDEA: CONTAR LAS TAREAS QUE ESTÁN POR HACER, EN CURSO, HECHO Y VENCIDAS

    const porHacer = this.#columnas.get("Por hacer").tareas.length;
    const enCurso = this.#columnas.get("En curso").tareas.length;
    const hecho = this.#columnas.get("Hecho").tareas.length;

    // LAS TAREAS VENCIDAS SERÁN LAS TAREAS DE POR HACER Y EN CURSO QUE HAN VENCIDO
    const arrayvencidas = [];

    for (const tareaPorHacer of this.#columnas.get("Por hacer").tareas) {
      if (tareaPorHacer.estaVencida(hoy)) {
        arrayvencidas.push(tareaPorHacer);
      }
    }

    for (const tareaEnCurso of this.#columnas.get("En curso").tareas) {
      if (tareaEnCurso.estaVencida(hoy)) {
        arrayvencidas.push(tareaEnCurso);
      }
    }

    const vencidas = arrayvencidas.length;

    return {
      porHacer: porHacer,
      enCurso: enCurso,
      hecho: hecho,
      vencidas: vencidas,
    };
  }

  // ✍️ A5 · Reglas (vuelves a mover y completar) ─────────────────────────────────
  //   - Columna llena → ColumnaLlenaError (en vez de un Error cualquiera)
  //   - Sacar una tarea de «Hecho», o «moverla» a la columna en la que ya está →
  //     MovimientoNoPermitidoError. Todo se comprueba ANTES de tocar nada.
  //   Pista: mover y completar hacen casi lo mismo. Un método privado #trasladar(id, destino)
  //   con las comprobaciones evita escribirlas dos veces.

  // ✍️ C4 (bloque C) ────────────────────────────────────────────────────────────
  // toJSON(): { version, limiteEnCurso, columnas: { "Por hacer": [datos…], … } }
  //   JSON.stringify(tablero) lo llama solo. Sin él sale "{}": los # no se ven. Usa aDatos.

  toJSON() {
    // creamos un columnaDatos donde guardaremos las tareaDatos
    const columnaDatos = {};
    // toJSON es una función que crea los planos para convertir todas las columnas a texto para escribirlas en un fichero json
    for (const [nombre, columna] of this.#columnas.entries()) {
      // obtenemos el nombre y la columna
      // el nombre de la columna la conseguimos con .entries es cómo el items de python que conseguimos la clave y valor para que séa más fácil
      // creamos un array vacío para guardar los datos de las tareas
      const tareaDatos = [];
      const tareas = columna.tareas;
      // ya hemos conseguido las tareas de la columna especifica, ahora ya que tenemos la columna en la tarea, tenemos que conseguir sus datos con aDatos() para que se vean los # (privados)
      for (const tarea of tareas) {
        // detecta si es tarea normal o tarea recurrente y devuelve un objeto plano (un objeto normal pero todavía sin crear)
        const texto = aDatos(tarea);
        tareaDatos.push(texto);
      }
      columnaDatos[nombre] = tareaDatos;
    }

    // cogemos la columna en curso para sacer el límiteWip
    const columnaEnCurso = this.#columnas.get("En curso");

    // devolvemos un objeto plano para JSON.stringify()
    return {
      version: Tablero.VERSION_DATOS, //obtener el límite
      limiteEnCurso: columnaEnCurso.limiteWip, //obtener el límite de la columna
      columnas: columnaDatos,
    };
  }

  /** Lo contrario de toJSON: el MISMO tablero (columnas, ids y límite WIP). Lanza si no encaja. */
  static desdeJSON(datos) {
    //si los datos son null o la versión no coincide, lanzo un error.
    if (datos === null || datos.version !== this.VERSION_DATOS) {
      throw new Error("Datos nop existe o datos.version no es Tablero.VERSION_DATOS");
    }
    // empiezo con un tablero vacío que tiene el mismo límite en «En curso» que el guardado.
    const tablero = new Tablero(datos.limiteEnCurso);
    // con keys() recorro los nombres de las columnas del Map.
    for (const nombre of tablero.#columnas.keys()) {
      // esta es la columna del tablero nuevo donde voy a meter las tareas.
      const columna = tablero.columna(nombre);
      // si nombre vale «En curso», aquí leo la lista guardada en datos.columnas["En curso"].
      for (const objeto of datos.columnas[nombre]) {
        // con desdeDatos recupero la tarea con su ID y la añado a la columna que le toca.
        const tarea = desdeDatos(objeto);
        columna.añadir(tarea);
      }
    }
    return tablero;
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
