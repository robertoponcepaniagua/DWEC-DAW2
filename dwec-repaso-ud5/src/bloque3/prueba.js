// prueba.js — Conecta TUS funciones de listeners.js con la página de este bloque (index.html) y
// ejecuta los ejemplos que ves en ella. No hace falta tocarlo, pero es JavaScript normal: léelo y pon puntos de
// parada aquí (F12 → Sources → src/bloque3/prueba.js) para ver con qué datos se llama a tu función.
import { vigilar, soloUnaVez, flechasHoras, MarcadorHoras, atajos } from "./listeners.js";
import { predicciones } from "./predicciones.js";
import textoPredicciones from "./predicciones.js?raw";
import { arrancar, anota } from "../../pagina/banco.js";

const escenario = document.querySelector("#escenario");
const $ = (selector) => escenario.querySelector(selector);
let marcador;

arrancar({
  n: 3,
  ficheros: "src/bloque3/listeners.js",
  funciones: { vigilar, soloUnaVez, flechasHoras, MarcadorHoras, atajos },
  montar: [
    {
      nombre: 'vigilar($(".vigilado"), $(".salida-vigilar"))',
      codigo: () => {
        vigilar($(".vigilado"), $(".salida-vigilar"));
      },
    },
    {
      nombre: 'soloUnaVez($(".una-vez"), accion)',
      codigo: () => {
        soloUnaVez($(".una-vez"), (id) => anota("accion(", id, ") · ¿es un número?", typeof id === "number"));
      },
    },
    {
      nombre: 'flechasHoras($(".horas"))',
      codigo: () => {
        flechasHoras($(".horas"));
      },
    },
    {
      nombre: 'new MarcadorHoras($(".marcador"), $(".salida-marcador"))',
      codigo: () => {
        marcador = new MarcadorHoras($(".marcador"), $(".salida-marcador"));
        window.marcador = marcador; // para la consola
        $(".desconectar").addEventListener("click", () => { marcador.desconectar(); anota("desconectar(): a partir de ahora +½ h no tiene que sumar. Lleva", marcador.horas); });
      },
    },
    {
      nombre: "atajos(escenario, { nueva, cerrar })",
      codigo: () => {
        atajos(escenario, { nueva: () => anota("nueva()"), cerrar: () => anota("cerrar()") });
      },
    },
  ],
  ejemplos: [
    {
      codigo: () => {
        const b = document.createElement("button");
        b.dataset.accion = "terminar";
        const salida = document.createElement("output");
        const quitar = vigilar(b, salida);
        b.click();
        quitar();
        b.click();
        return salida.textContent;
      },
      espera: '"click en terminar"',
      tipo: "👀",
    },
    {
      codigo: () => {
        const b = document.createElement("button");
        b.dataset.id = "3";
        const llegan = [];
        soloUnaVez(b, (id) => llegan.push(id));
        b.click();
        b.click();
        return llegan;
      },
      espera: "[3]",
    },
    {
      codigo: () => {
        const c = document.createElement("input");
        c.value = "2";
        flechasHoras(c);
        c.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
        return c.value;
      },
      espera: '"2.5"',
    },
    {
      codigo: () => {
        const b = document.createElement("button");
        b.dataset.paso = "1";
        const m = new MarcadorHoras(b, document.createElement("output"));
        b.click();
        m.desconectar();
        b.click();
        return m.horas;
      },
      espera: "1",
    },
  ],
  predicciones: { texto: textoPredicciones, respuestas: predicciones },
});
