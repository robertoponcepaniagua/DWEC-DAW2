// prueba.js — Conecta TUS funciones de leer.js con la página de este bloque (index.html) y
// ejecuta los ejemplos que ves en ella. No hace falta tocarlo, pero es JavaScript normal: léelo y pon puntos de
// parada aquí (F12 → Sources → src/bloque1/prueba.js) para ver con qué datos se llama a tu función.
import { clientes, contarUrgentes, idDe, horasPendientes, marcarEstado, siguienteIgual } from "./leer.js";
import { predicciones } from "./predicciones.js";
import textoPredicciones from "./predicciones.js?raw";
import { arrancar, anota } from "../../pagina/banco.js";

const escenario = document.querySelector("#escenario");
const $ = (selector) => escenario.querySelector(selector);

arrancar({
  n: 1,
  ficheros: "src/bloque1/leer.js",
  funciones: { clientes, contarUrgentes, idDe, horasPendientes, marcarEstado, siguienteIgual },
  montar: [
    {
      nombre: "clic en una tarjeta → idDe(lo pulsado) y siguienteIgual(tarjeta)",
      codigo: () => {
        escenario.addEventListener("click", (e) => {
          const tarjeta = e.target.closest(".reparacion");
          if (tarjeta) anota("idDe(", e.target, ") →", idDe(e.target), "· siguienteIgual →", siguienteIgual(tarjeta));
        });
      },
    },
  ],
  ejemplos: [
    {
      codigo: () => clientes(escenario, "pendiente"),
      espera: '["Ana", "Sergio"]',
      tipo: "👀",
    },
    {
      codigo: () => contarUrgentes(escenario),
      espera: "2",
    },
    {
      codigo: () => idDe($("[data-id='4'] button span")),
      espera: "4",
    },
    {
      codigo: () => idDe($("#lateral p")),
      espera: "null",
    },
    {
      codigo: () => horasPendientes(escenario),
      espera: "2.5",
    },
    {
      codigo: () => {
        const t = $("[data-id='2']");
        const antes = marcarEstado(t, "lista");
        const clases = t.className;
        marcarEstado(t, antes);
        return [antes, clases];
      },
      espera: '["en-taller", "reparacion urgente estado-lista"]',
      nota: "el orden de las clases puede cambiar; lo que importa es cuáles están",
    },
    {
      codigo: () => siguienteIgual($("[data-id='1']")),
      espera: "4",
    },
  ],
  predicciones: { texto: textoPredicciones, respuestas: predicciones },
});
