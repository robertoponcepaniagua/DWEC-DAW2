// app.js — Bloque B · ✍️ B4, B5 y B6. Conecta el modelo (el tablero) con la página: pinta, escucha y avisa.
// Usa tus piezas: crearTarjeta/pintarLista, leerFormulario/mostrarErrores y delegar.
// La estructura de la página (ids, data-*) está en index.html y NO se cambia: la usan los tests.
import { ErrorTablero } from "../modelo/errores.js";
import { delegar } from "./delegacion.js";
import { leerFormulario, mostrarErrores } from "./formulario.js";
import { pintarLista } from "./tarjeta.js";

/** Botones de cada tarjeta según su columna: [texto, data-accion] */
const ACCIONES = {
  "Por hacer": [["Empezar →", "empezar"]],
  "En curso": [
    ["← Volver", "volver"],
    ["✓ Completar", "completar"],
  ],
  Hecho: [],
};

// ✍️ B6 · validar(datos) → { campo: "mensaje" } con los errores (objeto vacío si todo está bien)
//   - titulo: obligatorio y como mucho 80 caracteres
//   - cadaDias (si viene): entero mayor que 0. Si es correcto pero no hay limite, el error va
//     en «limite»: una tarea que se repite necesita fecha límite
export function validar(datos) {
  throw new Error("Sin hacer");
}

/**
 * Arranca la interfaz dentro de raiz (el <main id="app">). Los listeners se ponen UNA vez aquí;
 * pintar() solo cambia nodos, así que repintar no los duplica.
 * opciones.hoy: fecha fija para los tests · opciones.alCambiar(tablero): tras cada cambio (UD6)
 */
export function iniciarApp(raiz, tablero, { hoy = null, alCambiar = () => {} } = {}) {
  const form = raiz.querySelector("#form-alta");
  const aviso = raiz.querySelector("#aviso");
  const columnas = raiz.querySelector("#columnas");
  const resumen = raiz.querySelector("#resumen");

  // ✍️ B4 · pintar(): deja la página igual que el modelo cada vez que se llama, y NO pone listeners
  //   - cada columna ([data-columna="…"]): sus tareas en el orden de ordenadas(), con pintarLista en su
  //     .lista, y en cada .tarjeta sus botones según ACCIONES: <button type="button" data-accion="…">
  //   - el .contador de cada columna: (n), o (n/límite) en la que tiene límite WIP
  //   - [data-dato="progreso"]: hechas ÷ total en %, redondeado (con el tablero vacío, 0 %)
  //   - [data-dato="vencidas"]: las vencidas de tablero.resumen(ahora)
  //   La fecha de hoy: const ahora = hoy ?? new Date();  (los tests pasan una fija)
  function pintar() {
    // actualiza la página con las tareas del tablero
    // usa la fecha recibida o la fecha actual si no hay ninguna
    const ahora = hoy ?? new Date();

    // saca las columnas del html
    const elementosColumna = columnas.querySelectorAll("[data-columna]")

    for (const columna of elementosColumna) {
      // saca el nombre de la columna desde data-columna
      const nombreColumna = columna.dataset.columna;
      // busca la lista donde van las tarjetas
      const lista = columna.querySelector(".lista");
      // saca la columna del tablero con ese nombre
      const columnaTablero = tablero.columna(nombreColumna);
      // saca las tareas ordenadas de la columna
      const tareasOrdenadas = columnaTablero.ordenadas();
      // vacía la lista y pinta las tarjetas o el mensaje de sin tareas
      pintarLista(lista, tareasOrdenadas, ahora);

      // saca las tarjetas creadas para ponerles los botones
      const tarjetas = lista.querySelectorAll(".tarjeta")

      for (const tarjeta of tarjetas) {
        // saca las acciones de la columna y en hecho no hay ninguna
        const acciones = ACCIONES[nombreColumna];
        for (const accion of acciones) {
          const boton = document.createElement("button")
          // evita que el botón envíe un formulario
          boton.setAttribute("type", "button")
          // guarda la acción del botón en data-accion
          boton.setAttribute("data-accion", accion[1])
          // pone el texto de la acción en el botón
          boton.textContent = accion[0]
          // añade el botón a la tarjeta
          tarjeta.append(boton)
        }
      }
      // busca el contador y saca el límite de tareas de la columna
      const contador = columna.querySelector(".contador")
      const limite = columnaTablero.limiteWip

      // si el límite es null la columna no tiene límite de tareas
      if (limite !== null) {
        // muestra el número de tareas y el límite
        contador.textContent = `(${tareasOrdenadas.length}/${limite})`
      } else {
        // muestra solo el número de tareas
        contador.textContent = `(${tareasOrdenadas.length})`
      }
    }
    // actualiza el resumen una vez al terminar con las columnas
    // saca la cantidad de tareas por columna y las vencidas
    const datos = tablero.resumen(ahora)
    const total = datos.porHacer + datos.enCurso + datos.hecho
    // si no hay tareas pone el progreso a cero para no dividir entre cero
    // si hay tareas calcula el porcentaje de hechas y lo redondea
    const progreso = total === 0 ? 0 : Math.round((datos.hecho / total) * 100);

    // pone el progreso y las vencidas en el html
    resumen.querySelector('[data-dato="progreso"]').textContent = `${progreso} %`;
    resumen.querySelector('[data-dato="vencidas"]').textContent = datos.vencidas;
  }

  // 👀 Resuelto: avisar("texto") enseña el aviso; avisar("") lo esconde
  function avisar(mensaje) {
    aviso.textContent = mensaje;
    aviso.hidden = mensaje === "";
  }

  // ✍️ B5 · UN listener, puesto UNA vez aquí (nunca dentro de pintar): clic en los botones de las
  //   tarjetas, con delegar sobre `columnas`. empezar → «En curso», volver → «Por hacer», completar.
  //   Tras cada cambio que sale bien: avisar(""), pintar() y alCambiar(tablero).
  //   Si el tablero lanza un ErrorTablero → avisar(error.message) y no se repinta.
  //   Cualquier otro error → se relanza (es un fallo del programa).
  //   Pista: una función cambiar(accion) con el try/catch te sirve también para el B6.
  
  // lo que hay que hacer es cuando pulse un botón se vaya a su respectivo sitio
delegar(columnas, "click", "button[data-accion]", (boton, evento) => {
    const accion = boton.dataset.accion;
    const tarjeta = boton.closest(".tarjeta");
    const id_tarjeta = Number(tarjeta.dataset.id);
    console.log(`Acción: ${accion} | Id: ${id_tarjeta}`);
    try {
        if (accion === "empezar") {
            tablero.mover(id_tarjeta, "En curso");
        } else if (accion === "volver") {
            tablero.mover(id_tarjeta, "Por hacer");
        } else if (accion === "completar") {
            tablero.completar(id_tarjeta);
        }
        // Si el cambio ha funcionado
        avisar("");
        pintar();
        alCambiar(tablero);
    } catch (error) {
        if (error instanceof ErrorTablero) {
            avisar(error.message);
        } else {
            throw error;
        }
    }
});
  // ✍️ B6 · submit de `form`: preventDefault, leerFormulario, validar y mostrarErrores. Si hay errores,
  //   no se crea nada. Si no, tablero.crearTarea(datos) (como un cambio más) y form.reset().

  pintar();
  return { pintar };
}

(void ACCIONES, ErrorTablero, delegar, leerFormulario, mostrarErrores, pintarLista); // (borra esta línea cuando los uses)
