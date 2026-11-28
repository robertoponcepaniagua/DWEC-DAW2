// prueba.js — Conecta TUS funciones de pintar.js con la página de este bloque (index.html) y
// ejecuta los ejemplos que ves en ella. No hace falta tocarlo, pero es JavaScript normal: léelo y pon puntos de
// parada aquí (F12 → Sources → src/bloque2/prueba.js) para ver con qué datos se llama a tu función.
import { crearBoton, crearDato, crearTarjeta, pintarLista } from "./pintar.js";
import { predicciones } from "./predicciones.js";
import textoPredicciones from "./predicciones.js?raw";
import { arrancar, anota, nuevoTaller } from "../../pagina/banco.js";

const escenario = document.querySelector("#escenario");
const $ = (selector) => escenario.querySelector(selector);

arrancar({
  n: 2,
  ficheros: "src/bloque2/pintar.js",
  funciones: { crearBoton, crearDato, crearTarjeta, pintarLista },
  montar: [
    {
      nombre: 'pintarLista($("#reparaciones"), nuevoTaller().reparaciones())',
      codigo: () => {
        pintarLista($("#reparaciones"), nuevoTaller().reparaciones());
        anota("Pintado el taller de ejemplo. El último cliente trae HTML en el nombre: con textContent se ve como texto y no salta ninguna alerta");
      },
    },
    {
      nombre: "botones «Pintar…»",
      codigo: () => {
        $("#pintar").addEventListener("click", () => { pintarLista($("#reparaciones"), nuevoTaller().reparaciones()); anota("pintarLista con el taller"); });
        $("#vaciar").addEventListener("click", () => { pintarLista($("#reparaciones"), []); anota("pintarLista con []"); });
      },
    },
  ],
  ejemplos: [
    {
      codigo: () => crearBoton("empezar", "🔧", "<b>Empezar</b>").outerHTML,
      espera: '"<button type=\\"button\\" data-accion=\\"empezar\\"><span class=\\"icono\\">🔧</span> &lt;b&gt;Empezar&lt;/b&gt;</button>"',
      tipo: "👀",
    },
    {
      codigo: () => crearDato("bici", "Orbea").outerHTML,
      espera: '"<p class=\\"bici\\">Orbea</p>"',
    },
    {
      codigo: () => {
        const luis = nuevoTaller().reparaciones()[1];
        const t = crearTarjeta(luis);
        return [t.className, t.dataset.estado, t.querySelector(".total").textContent, t.querySelector("button").textContent];
      },
      espera: '["reparacion estado-en-taller urgente", "en-taller", "48.75 €", "✅ Terminar"]',
      nota: "el orden de las clases puede cambiar",
    },
    {
      codigo: () => crearTarjeta(nuevoTaller().reparaciones()[4]).querySelector("img"),
      espera: "null",
      nota: "¡se ha creado un img con el nombre del cliente! XSS",
    },
    {
      codigo: () => {
        const t = nuevoTaller();
        pintarLista($("#reparaciones"), t.reparaciones());
        pintarLista($("#reparaciones"), t.reparaciones());
        return [...$("#reparaciones").querySelectorAll(".cliente")].map((h) => h.textContent).slice(0, 2);
      },
      espera: '["Luis", "Ana"]',
      nota: "dos veces = las mismas 5 tarjetas, con la urgente primero",
    },
  ],
  predicciones: { texto: textoPredicciones, respuestas: predicciones },
});
