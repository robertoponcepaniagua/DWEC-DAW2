// persistencia.js — Bloque C · ✍️ C5 y C6. Guardar el tablero tras cada cambio y recuperarlo al abrir la página.
// Usa guardar, cargar y borrar (almacen.js, resuelto), tu obtenerJSON (red.js) y Tablero.desdeJSON.
import { Tablero } from "../modelo/Tablero.js";
import { borrar, cargar, guardar } from "./almacen.js";
import { obtenerJSON } from "./red.js";

export const CLAVE = "dwec-p2-tablero";

// ✍️ C5 · guardarTablero(tablero, storage = localStorage): guarda el tablero en CLAVE
export function guardarTablero(tablero, storage = localStorage) {
  guardar(CLAVE, tablero, storage);
}

// ✍️ C6 · async arrancar({ storage = localStorage, fetchFn = fetch, url = "/tareas-iniciales.json",
//                  limiteEnCurso = 3 } = {}) → { tablero, origen, error? }
//   Los tres casos («guardado», «inicial» y «vacio») están en el enunciado (bloque C).
export async function arrancar({
  storage = localStorage,
  fetchFn = fetch,
  url = "/tareas-iniciales.json",
  limiteEnCurso = 3,
} = {}) {
  // decide con que tablero comienza la app cuando abro la página

  // hay un tablero?
  // - si hay tablero lo recuperamos
  const guardado = cargar(CLAVE, null, storage);

  if (guardado !== null) {
    try {
      // si hay datos guardados
      // cargamos los datos en el tablero
      const tablero = Tablero.desdeJSON(guardado);

      return {
        tablero: tablero,
        origen: "guardado", // viene de guardado
      };
    } catch {
      borrar(CLAVE, storage);
    }
  }

  try {
    // si no hay datos guardados validos
    // descargamois las tareas iniciales y creamos un tablero con esas tareas
    const datos_json = await obtenerJSON(url, fetchFn);
    const tablero = Tablero.desde(datos_json, limiteEnCurso);

    return {
      tablero: tablero,
      origen: "inicial",
    };
  } catch (Error) {
    const tablero = new Tablero(limiteEnCurso);

    return {
      tablero: tablero,
      origen: "vacio",
      error: Error.message,
    };
  }
}

(void Tablero, borrar, cargar, guardar, obtenerJSON); // (borra esta línea cuando los uses)
