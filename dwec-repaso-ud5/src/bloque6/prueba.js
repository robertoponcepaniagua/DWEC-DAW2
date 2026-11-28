// prueba.js — Conecta TUS funciones de taller-app.js con la página de este bloque (index.html) y
// ejecuta los ejemplos que ves en ella. No hace falta tocarlo, pero es JavaScript normal: léelo y pon puntos de
// parada aquí (F12 → Sources → src/bloque6/prueba.js) para ver con qué datos se llama a tu función.
import { iniciarTaller } from "./taller-app.js";
import { arrancar, anota, nuevoTaller } from "../../pagina/banco.js";

const escenario = document.querySelector("#escenario");
const $ = (selector) => escenario.querySelector(selector);

arrancar({
  n: 6,
  ficheros: "src/bloque6/taller-app.js",
  funciones: { iniciarTaller },
  montar: [
    {
      nombre: 'iniciarTaller(escenario, nuevoTaller(), { mecanico: "Lucía", alCambiar })',
      codigo: () => {
        iniciarTaller(escenario, nuevoTaller(), { mecanico: "Lucía", alCambiar: () => anota("alCambiar()") });
      },
    },
  ],
  ejemplos: [
    {
      codigo: () => $("#reparaciones").children.length,
      espera: "5",
      trasMontar: true,
    },
    {
      codigo: () => escenario.querySelectorAll('[data-accion="pieza"]').length,
      espera: "4",
      nota: "el botón de pieza sale en las 4 que no están «lista»",
      trasMontar: true,
    },
    {
      codigo: () => escenario.querySelector("#reparaciones img"),
      espera: "null",
      nota: "¡XSS!",
      trasMontar: true,
    },
  ],
});
