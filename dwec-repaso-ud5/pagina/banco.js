// banco.js — Lo común a las páginas de prueba de los bloques. No hace falta tocarlo.
// Cada bloque tiene su página en src/bloqueN/: index.html (el HTML del escenario) y prueba.js (conecta TUS
// funciones con ese HTML y ejecuta los ejemplos). Este fichero pinta lo demás: el registro, los resultados de los
// ejemplos, las predicciones, la caja «Prueba tu código» y la ayuda para depurar.
import * as modelo from "../src/modelo/taller.js";

const BLOQUES = [
  "Seleccionar, leer y modificar",
  "Crear nodos sin XSS y pintar desde el modelo",
  "Listeners y el objeto evento",
  "Propagación y delegación",
  "Formularios",
  "Simulacro: «Añadir pieza»",
];

// ── Mostrar un valor como lo enseñaría la consola (en corto) ──
export function mostrar(v, prof = 0) {
  if (v === undefined) return "undefined";
  if (v === null) return "null";
  if (typeof v === "string") return JSON.stringify(v);
  if (typeof v === "function") return /^class\b/.test(Function.prototype.toString.call(v)) ? `class ${v.name}` : `ƒ ${v.name || "(anónima)"}()`;
  if (typeof v !== "object") return String(v);
  if (v instanceof Element) {
    const attrs = [...v.attributes].map((a) => ` ${a.name}="${a.value}"`).join("");
    return `<${v.tagName.toLowerCase()}${attrs}>`;
  }
  if (v instanceof Text) return `#text ${JSON.stringify(v.data)}`;
  if (v instanceof NodeList || v instanceof HTMLCollection) return `${v.constructor.name}(${v.length}) [${[...v].map((x) => mostrar(x, prof + 1)).join(", ")}]`;
  if (v instanceof Date) return Number.isNaN(v.getTime()) ? "Invalid Date" : `Date(${v.toLocaleString("es-ES")})`;
  if (v instanceof Error) return `${v.name}: ${v.message}`;
  if (prof > 3) return "…";
  if (v instanceof Map) return `Map(${v.size}) {${[...v].map(([k, x]) => ` ${mostrar(k, prof + 1)} => ${mostrar(x, prof + 1)}`).join(",")} }`;
  if (Array.isArray(v)) return `[${v.map((x) => mostrar(x, prof + 1)).join(", ")}]`;
  const clase = v.constructor && v.constructor !== Object ? `${v.constructor.name} ` : "";
  const props = Object.entries(v).map(([k, x]) => `${k}: ${mostrar(x, prof + 1)}`);
  return props.length ? `${clase}{ ${props.join(", ")} }` : `${clase}{}`;
}

// ── El texto de una función de ejemplo, para enseñarlo en la página: lo de dentro de () => … ──
function textoDe(fn) {
  const codigo = fn.toString().replace(/^(async\s*)?\(\)\s*=>\s*/, "");
  if (!codigo.startsWith("{")) return codigo;
  const lineas = codigo.slice(1, -1).split("\n");
  while (lineas.length && !lineas[0].trim()) lineas.shift();
  while (lineas.length && !lineas.at(-1).trim()) lineas.pop();
  const sangria = Math.min(...lineas.filter((l) => l.trim()).map((l) => l.match(/^\s*/)[0].length));
  return lineas.map((l) => l.slice(sangria)).join("\n");
}

const el = (etiqueta, props = {}, ...hijos) => {
  const nodo = Object.assign(document.createElement(etiqueta), props);
  nodo.append(...hijos);
  return nodo;
};

const faltaAlgo = (error) => error instanceof TypeError && / is not a (function|constructor)$/.test(error.message);

function textoError(error, codigo) {
  if (error?.message === "Sin hacer") return ["pendiente", "⏳ Sin hacer todavía"];
  // «x is not a function»: casi siempre, algo que tu función tenía que devolver y no devuelve
  const pista = faltaAlgo(error) ? "   ¿Tu función devuelve lo que debe? (¿falta un return?)" : "";
  // A la consola, con su pila: pinchando en el enlace (src/bloqueN/…:línea) vas directo a la línea que falla
  console.error(`💥 al ejecutar: ${codigo.split("\n").at(-1)}\n`, error);
  return ["mal", `💥 ${error?.name ?? "Error"}: ${error?.message ?? error}${pista}   (más detalle en la consola, F12)`];
}

function ejecutar(fn) {
  try {
    return { ok: true, valor: fn() };
  } catch (error) {
    return { ok: false, error };
  }
}

// Para la caja «Prueba tu código» y el botón «Probar» de las predicciones: el código escrito a mano se ejecuta como
// en la consola (da el valor de la última sentencia) y ve por su nombre lo que hay en window.
const enLaConsola = (codigo) => ejecutar(() => (0, eval)(codigo));

// ── El registro: lo que van haciendo tus funciones cuando usas el escenario ──
const registro = el("ul", { className: "registro" });
export function anota(...partes) {
  const texto = partes.map((p) => (typeof p === "string" ? p : mostrar(p))).join(" ");
  registro.prepend(el("li", { textContent: `${new Date().toLocaleTimeString("es-ES")} · ${texto}` }));
  console.log("📝", ...partes);
}

// Un taller de ejemplo, nuevo cada vez: Ana y Sergio pendientes, Luis urgente en el taller (con Paco, que ya está
// lleno), Marta lista y un cliente con malas intenciones (su nombre trae HTML: con textContent se ve como texto).
export function nuevoTaller() {
  const t = new modelo.Taller();
  t.contratar("Lucía", 2);
  t.contratar("Paco", 1);
  t.nuevaReparacion({ cliente: "Ana", bici: "Orbea Alma", horas: 2 });
  const luis = t.nuevaReparacion({ cliente: "Luis", bici: "BH Ultimate", horas: 1.5, urgente: true });
  const marta = t.nuevaReparacion({ cliente: "Marta", bici: "Trek Marlin", horas: 3 });
  t.nuevaReparacion({ cliente: "Sergio", bici: "Canyon Grail", horas: 0.5 });
  t.nuevaReparacion({ cliente: '<img src="x" onerror="alert(\'XSS\')">', bici: "Bici misteriosa", horas: 1 });
  t.asignar(luis.id, "Paco");
  t.asignar(marta.id, "Lucía");
  t.terminar(marta.id);
  return t;
}

// ── Las secciones de la página ──
function seccionConexiones(montar) {
  let pendiente = false; // si TU función de montar está sin hacer, los ejemplos que dependen de ella esperan
  const filas = montar.map(({ nombre, codigo }) => {
    const r = ejecutar(codigo);
    const [clase, texto] = r.ok ? ["bien", "✔ conectado"] : textoError(r.error, nombre);
    if (!r.ok) pendiente = true;
    return el("li", { className: clase, textContent: `${nombre}  →  ${texto}` });
  });
  if (filas.length === 0) return { seccion: "", pendiente };
  const seccion = el("div", { className: "panel" }, el("h2", { textContent: "📝 Lo que pasa en el escenario" }), el("ul", { className: "conexiones" }, ...filas), registro);
  return { seccion, pendiente };
}

function filaEjemplo({ codigo, espera, tipo = "✍️", nota, trasMontar }, { montajePendiente, primerMontaje }) {
  const texto = textoDe(codigo);
  const fila = (clase, resultado) =>
    el("li", { className: `ejemplo ${clase}` }, el("span", { className: "tipo", textContent: tipo }), el("pre", { className: "codigo", textContent: texto }), el("div", { className: "resultado", textContent: `→ ${resultado}` }));
  if (trasMontar && montajePendiente) return fila("pendiente", `⏳ Cuando funcione ${primerMontaje}`);
  const r = ejecutar(codigo);
  if (!r.ok) return fila(...textoError(r.error, texto));
  const sale = mostrar(r.valor);
  return sale === espera ? fila("bien", `${sale}  ✔`) : fila("mal", `${sale}   ✘ se esperaba ${espera}${nota ? ` (${nota})` : ""}`);
}

// Las predicciones: las claves y las expresiones salen de los comentarios de predicciones.js
function seccionPredicciones({ texto, respuestas }) {
  const lista = [...texto.matchAll(/^\s*(p\d+):.*?\/\/\s*(.+)$/gm)].map(([, clave, expresion]) => ({ clave, expresion: expresion.trim(), tuya: respuestas?.[clave] }));
  if (lista.length === 0) return "";
  const filas = lista.map(({ clave, expresion, tuya }) => {
    const salida = el("td", { className: "real" });
    const boton = el("button", { type: "button", textContent: "Probar", title: expresion });
    boton.addEventListener("click", () => {
      const r = enLaConsola(expresion);
      salida.textContent = r.ok ? mostrar(r.valor) : `💥 ${r.error.name}: ${r.error.message}`;
      console.log(`🔮 ${clave}:\n${expresion}\n→`, r.ok ? r.valor : r.error);
    });
    return el("tr", {}, el("td", { textContent: clave }), el("td", {}, el("code", { textContent: expresion })), el("td", { textContent: tuya === undefined ? "(sin contestar)" : mostrar(tuya) }), el("td", {}, boton), salida);
  });
  return el(
    "div",
    { className: "panel" },
    el("h2", { textContent: "🔮 Predicciones" }),
    el("p", { textContent: "Contesta primero en predicciones.js. Después pulsa «Probar»: en la consola (F12) sale el código exacto que se ejecuta, para que lo pruebes tú y lo cambies. El PORQUÉ te lo da docker compose run --rm web npm run comprobar." }),
    el("table", {}, el("thead", {}, el("tr", {}, ...["", "Expresión", "Tu respuesta", "", "Lo que da"].map((t) => el("th", { textContent: t })))), el("tbody", {}, ...filas)),
  );
}

function seccionProbar(inicial) {
  const area = el("textarea", { rows: 4, spellcheck: false, value: inicial });
  const salida = el("pre", { className: "salida" });
  const boton = el("button", { type: "button", textContent: "▶ Ejecutar" });
  boton.addEventListener("click", () => {
    const r = enLaConsola(area.value);
    salida.className = `salida ${r.ok ? "bien" : "mal"}`;
    salida.textContent = r.ok ? `→ ${mostrar(r.valor)}` : textoError(r.error, area.value)[1];
  });
  return el(
    "div",
    { className: "panel" },
    el("h2", { textContent: "🧪 Prueba tu código" }),
    el("p", { textContent: 'Como en la consola: se enseña lo que da la última línea. Puedes usar todo lo del bloque, escenario y $("selector") (busca dentro del escenario).' }),
    area,
    boton,
    salida,
  );
}

function seccionDepurar(n, ficheros, nombres) {
  return el(
    "div",
    { className: "panel depurar" },
    el("h2", { textContent: "🐞 Depurar en el navegador" }),
    el(
      "ol",
      {},
      el("li", { textContent: `Esta página son dos ficheros de src/bloque${n}/: index.html (el HTML del escenario) y prueba.js (conecta tus funciones con ese HTML y ejecuta los ejemplos de arriba). Tu código está en ${ficheros}.` }),
      el("li", { textContent: "F12 → Consola: están tus funciones con su nombre, y también escenario y $(\"selector\"). Prueba, por ejemplo: " }, el("code", { textContent: nombres.join(", ") })),
      el("li", { textContent: "F12 → Elements (Elementos): mira cómo cambia el HTML del escenario cuando tus funciones lo tocan (se ilumina lo que cambia)." }),
      el("li", { textContent: "Si algo sale 💥, en la consola está el error: pincha en el enlace azul (src/bloque…:línea) y te lleva a la línea que falla." }),
      el("li", { textContent: `Para ver tu código paso a paso: F12 → Sources (Fuentes) → src/bloque${n}/ → pincha en el número de línea (punto de parada) de tu fichero, o de prueba.js para parar justo antes de que se llame a tu función, y recarga o vuelve a pulsar en el escenario. O escribe debugger; dentro de tu función.` }),
      el("li", { textContent: "Con el código parado: pasa el ratón por las variables (e, e.target, e.currentTarget…) y avanza con F10 (siguiente) y F11 (entrar en la función)." }),
    ),
  );
}

// ── Arrancar la página del bloque: la llama prueba.js ──
//   n, ficheros:   el número del bloque y dónde está tu código (para la ayuda)
//   funciones:     las tuyas, para tenerlas en la consola por su nombre
//   montar:        cómo se conectan tus funciones al escenario: [{ nombre, codigo: () => { … } }]
//   ejemplos:      [{ codigo: () => …, espera, tipo, nota, trasMontar }]; «espera» es lo que debería salir
//   predicciones:  { texto, respuestas } de predicciones.js
export function arrancar({ n, ficheros, funciones, montar = [], ejemplos = [], predicciones }) {
  const escenario = document.querySelector("#escenario");
  const $ = (selector) => escenario.querySelector(selector);
  Object.assign(window, funciones, { escenario, $, anota, nuevoTaller }, modelo);
  const nombres = Object.keys(funciones);
  console.info(`Bloque ${n}: tienes en la consola ${nombres.join(", ")}, escenario, $, nuevoTaller() y las clases del modelo (Taller, Reparacion…)`);

  // Lo que falla al usar el escenario (un error en un listener, una promesa rechazada sin catch) sale también en el
  // registro, no solo en la consola
  window.addEventListener("error", (e) => anota(e.error?.message === "Sin hacer" ? "⏳ Sin hacer todavía" : "💥 Error sin capturar:", e.error ?? e.message, "(la pila, en la consola: F12)"));
  window.addEventListener("unhandledrejection", (e) => anota(e.reason?.message === "Sin hacer" ? "⏳ Sin hacer todavía" : "💥 Promesa rechazada sin catch:", e.reason, "(la pila, en la consola: F12)"));
  document.querySelector("#aviso-carga")?.remove();

  document.querySelector("#bloques").append(...BLOQUES.map((titulo, i) => el("a", { href: `../bloque${i + 1}/`, className: i + 1 === n ? "activo" : "", textContent: `${i + 1} · ${titulo}` })));

  const conexiones = seccionConexiones(montar);
  const anotadoAlMontar = registro.children.length;
  const estado = { montajePendiente: conexiones.pendiente, primerMontaje: montar[0]?.nombre };
  const filas = ejemplos.map((ejemplo) => filaEjemplo(ejemplo, estado));
  const ultimo = ejemplos.length ? textoDe(ejemplos.at(-1).codigo).replace(/^return (.*);$/m, "$1") : "";

  document.querySelector("#app").append(
    conexiones.seccion,
    el(
      "div",
      { className: "panel" },
      el("h2", { textContent: "▶ Tus funciones, en marcha" }),
      el("p", { textContent: `prueba.js ejecuta estos ejemplos con TU código cada vez que guardas (algunos cambian el escenario de arriba). 👀 = ejemplo resuelto. docker compose run --rm web npm run comprobar ${n} prueba muchos casos más.` }),
      el("ul", { className: "ejemplos" }, ...filas),
    ),
    predicciones ? seccionPredicciones(predicciones) : "",
    seccionProbar(ultimo),
    seccionDepurar(n, ficheros, nombres),
  );
  // Lo que hayan anotado los ejemplos no cuenta: en el registro solo queda el montaje y lo que hagas tú
  while (registro.children.length > anotadoAlMontar) registro.firstElementChild.remove();
  document.body.dataset.listo = "si";
}
