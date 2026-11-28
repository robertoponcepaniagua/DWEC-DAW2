// prueba.js — Conecta TUS funciones de formulario.js con la página de este bloque (index.html) y
// ejecuta los ejemplos que ves en ella. No hace falta tocarlo, pero es JavaScript normal: léelo y pon puntos de
// parada aquí (F12 → Sources → src/bloque5/prueba.js) para ver con qué datos se llama a tu función.
import { leerAlta, errorDeHoras, conectarAlta, editarHoras } from "./formulario.js";
import { Taller } from "../modelo/taller.js";
import { predicciones } from "./predicciones.js";
import textoPredicciones from "./predicciones.js?raw";
import { arrancar, anota } from "../../pagina/banco.js";

const escenario = document.querySelector("#escenario");
const $ = (selector) => escenario.querySelector(selector);
let tallerAlta, horasAna;

arrancar({
  n: 5,
  ficheros: "src/bloque5/formulario.js",
  funciones: { leerAlta, errorDeHoras, conectarAlta, editarHoras },
  montar: [
    {
      nombre: 'conectarAlta($("#alta"), taller, alCambiar)',
      codigo: () => {
        tallerAlta = new Taller();
        window.tallerAlta = tallerAlta; // para la consola
        conectarAlta($("#alta"), tallerAlta, (r) => anota("alCambiar(", r.cliente, "·", r.bici, "·", r.horas, "h ·", r.tipo, ") · el taller tiene", tallerAlta.reparaciones().length));
      },
    },
    {
      nombre: 'botón Editar → editarHoras($(".horas"), horas, alGuardar)',
      codigo: () => {
        horasAna = 2;
        $("#editar").addEventListener("click", () => editarHoras($(".horas"), horasAna, (h) => { horasAna = h; anota("alGuardar(", h, ")"); }));
      },
    },
  ],
  ejemplos: [
    {
      codigo: () => {
        const f = $("#alta");
        f.elements.cliente.value = " Ana ";
        f.elements.bici.value = "Orbea";
        f.elements.horas.value = "2";
        const datos = leerAlta(f);
        f.reset();
        return datos;
      },
      espera: '{ cliente: "Ana", bici: "Orbea", horas: 2, urgente: false }',
      tipo: "👀",
    },
    {
      codigo: () => errorDeHoras(null),
      espera: '"Indica las horas"',
    },
    {
      codigo: () => [errorDeHoras(2.3), errorDeHoras(7.5)],
      espera: '["Entre 0,5 y 40 horas, de media en media", ""]',
    },
    {
      codigo: () => {
        const celda = document.createElement("span");
        const guardadas = [];
        editarHoras(celda, 2, (h) => guardadas.push(h));
        const campo = celda.querySelector("input");
        campo.value = "9";
        campo.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
        return [celda.textContent, guardadas.length];
      },
      espera: '["2 h", 0]',
    },
  ],
  predicciones: { texto: textoPredicciones, respuestas: predicciones },
});
