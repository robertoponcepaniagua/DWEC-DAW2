// prueba.js — Conecta TUS funciones de delegacion.js con la página de este bloque (index.html) y
// ejecuta los ejemplos que ves en ella. No hace falta tocarlo, pero es JavaScript normal: léelo y pon puntos de
// parada aquí (F12 → Sources → src/bloque4/prueba.js) para ver con qué datos se llama a tu función.
import { crearBoton, crearDato, crearTarjeta, pintarLista } from "../bloque2/pintar.js";
import { elegirAlPulsar, enlacesInternos, conectarAcciones, montarLista } from "./delegacion.js";
import { predicciones } from "./predicciones.js";
import textoPredicciones from "./predicciones.js?raw";
import { arrancar, anota, nuevoTaller } from "../../pagina/banco.js";

const escenario = document.querySelector("#escenario");
const $ = (selector) => escenario.querySelector(selector);
let pintar;

arrancar({
  n: 4,
  ficheros: "src/bloque2/pintar.js y src/bloque4/delegacion.js",
  funciones: { crearBoton, crearDato, crearTarjeta, pintarLista, elegirAlPulsar, enlacesInternos, conectarAcciones, montarLista },
  montar: [
    {
      nombre: 'montarLista(escenario, nuevoTaller(), "Lucía")',
      codigo: () => {
        pintar = montarLista(escenario, nuevoTaller(), "Lucía");
        window.pintar = pintar; // para la consola y la caja «Prueba tu código»
      },
    },
    {
      nombre: 'elegirAlPulsar($("#reparaciones"))',
      codigo: () => {
        elegirAlPulsar($("#reparaciones"));
      },
    },
    {
      nombre: "enlacesInternos(escenario)",
      codigo: () => {
        enlacesInternos(escenario);
      },
    },
    {
      nombre: "document escucha todos los clics (para ver si llegan arriba)",
      codigo: () => {
        // composedPath: el camino del clic tal como salió (aunque al repintar la tarjeta ya no esté en la página)
        document.addEventListener("click", (e) => { if (e.composedPath().includes(escenario)) anota("el clic ha llegado a document · target:", e.target, "· defaultPrevented:", e.defaultPrevented); });
      },
    },
  ],
  ejemplos: [
    {
      codigo: () => {
        const ul = document.createElement("ul");
        ul.innerHTML = '<li class="reparacion"><h3>Ana</h3></li>';
        elegirAlPulsar(ul);
        ul.querySelector("h3").click();
        return ul.firstElementChild.className;
      },
      espera: '"reparacion elegida"',
      tipo: "👀",
    },
    {
      codigo: () => {
        const t = nuevoTaller();
        const ul = document.createElement("ul");
        ul.innerHTML = `<li data-id="${t.reparaciones()[0].id}"><button data-accion="empezar"><span>🔧</span></button></li>`;
        const cambios = [];
        conectarAcciones(ul, t, { mecanico: "Lucía", alCambiar: () => cambios.push("ok"), alError: (e) => cambios.push(e.name) });
        ul.querySelector("span").click();
        return [t.reparaciones()[0].estado, ...cambios];
      },
      espera: '["en-taller", "ok"]',
    },
    {
      codigo: () => typeof pintar,
      espera: '"function"',
      nota: "montarLista tiene que devolver la función pintar",
      trasMontar: true,
    },
  ],
  predicciones: { texto: textoPredicciones, respuestas: predicciones },
});
