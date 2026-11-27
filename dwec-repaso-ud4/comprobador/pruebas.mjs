// pruebas.mjs — Las pruebas de cada bloque del repaso de la UD4. Puedes leerlas: dicen QUÉ se espera, no CÓMO hacerlo.
// Cada prueba devuelve: true (bien) · "pendiente" · un texto (lo que falla) · { aviso: "..." } · { bien|mal, info }
import { inspect } from "node:util";

// ───────────────────────── utilidades ─────────────────────────
const muestra = (v) => inspect(v, { depth: 4, breakLength: Infinity, compact: true });

function igual(a, b) {
  if (Object.is(a, b)) return true;
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  return ka.length === kb.length && ka.every((k) => igual(a[k], b[k]));
}

// Prueba una función con varios casos y explica el primero que falla
function casos(fn, nombre, lista) {
  for (const [argumentos, esperado] of lista) {
    const obtenido = fn(...argumentos);
    if (!igual(obtenido, esperado)) {
      return `${nombre}(${argumentos.map(muestra).join(", ")}) debería dar ${muestra(esperado)} y da ${muestra(obtenido)}${pistaDe(obtenido, esperado)}`;
    }
  }
  return true;
}

// Lo que suele estar detrás de un resultado raro
function pistaDe(obtenido, esperado) {
  if (obtenido === undefined && esperado !== undefined) return " → ¿te falta el return?";
  if (typeof obtenido === "string" && typeof esperado === "number") return " → es un TEXTO: toFixed devuelve string. Redondea con Math.round(x * 100) / 100";
  if (typeof obtenido === "number" && typeof esperado === "number" && Math.abs(obtenido - esperado) < 0.001) return " → casi: los decimales no son exactos (apartado 10.1). Redondea a 2 decimales";
  if (Number.isNaN(obtenido)) return " → sale NaN: estás sumando algo que es undefined o un texto";
  return "";
}

// ¿Lanza un error de esta clase? Devuelve null si sí, o el texto de lo que ha pasado
function lanza(fn, Clase = Error) {
  try {
    fn();
  } catch (e) {
    if (e?.message === "Sin hacer") throw e;
    if (/Maximum call stack/.test(e?.message)) throw e;
    if (e instanceof Clase) return null;
    const otro = e?.name === "ErrorTaller" && Clase.name !== "ErrorTaller" ? " (¿le has puesto su name a la subclase? sale «ErrorTaller»)" : "";
    return `lanza un ${e?.name ?? typeof e} («${e?.message}»), no un ${Clase.name}${otro}`;
  }
  return `no lanza ningún error (debería lanzar un ${Clase.name})`;
}

// Igual que lanza, pero devuelve el error (para mirar sus datos) o un texto si no es el esperado
function capturar(fn, Clase) {
  try {
    fn();
  } catch (e) {
    if (e?.message === "Sin hacer") throw e;
    if (/Maximum call stack/.test(e?.message)) throw e;
    return e instanceof Clase ? e : `lanza un ${e?.name ?? typeof e} («${e?.message}»), no un ${Clase.name}`;
  }
  return `no lanza ningún error (debería lanzar un ${Clase.name})`;
}

// El código fuente sin comentarios (para buscar instanceof y compañía sin que cuenten los comentarios)
const sinComentarios = (t) => (t ?? "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
const trozo = (t, desde, hasta) => {
  const i = t.indexOf(desde);
  if (i < 0) return "";
  const j = hasta ? t.indexOf(hasta, i + desde.length) : -1;
  return t.slice(i, j < 0 ? undefined : j);
};
const PREGUNTA_EL_TIPO = /\binstanceof\b|\.constructor\b|\btypeof\b|\.tipo\s*[!=]==?|[!=]==?\s*["'](normal|urgente|socio|garantia)["']|\bswitch\s*\(/;
const queTipo = (cuerpo) => cuerpo.match(PREGUNTA_EL_TIPO)?.[0];

// Predicciones: no se dice cuál es la buena. Al acertar, se explica POR QUÉ; al fallar, una pista.
function predicciones(datos) {
  return ({ pred }) => {
    const p = pred.predicciones ?? {};
    const claves = Object.keys(datos);
    const sinContestar = claves.filter((k) => p[k] === undefined);
    if (sinContestar.length === claves.length) return "pendiente";
    if (sinContestar.length > 0) return `Te faltan: ${sinContestar.join(", ")}`;
    const falladas = claves.filter((k) => !igual(p[k], datos[k][1]));
    const info = claves.map((k) => {
      const [expresion, valor, porque, pista] = datos[k];
      return falladas.includes(k)
        ? `✘ ${k} · ${expresion}  → no es ${muestra(p[k])}. Pista: ${pista}`
        : `✔ ${k} · ${expresion}  → ${muestra(valor)}: ${porque}`;
    });
    if (falladas.length > 0) {
      return { mal: `${claves.length - falladas.length}/${claves.length} bien. Revisa: ${falladas.join(", ")} → pruébalas con docker compose run --rm web npm run probar "…"`, info };
    }
    return { bien: true, info };
  };
}

// Crear una reparación avisando de los fallos típicos del constructor
function nueva(Clase, ...args) {
  try {
    return new Clase(...args);
  } catch (e) {
    if (/Maximum call stack/.test(e?.message)) throw new Error("💥 un getter o setter se llama a sí mismo sin fin: dentro de set horas guarda en this.#horas, no en this.horas", { cause: e });
    if (/Must call super constructor/.test(e?.message)) throw new Error("💥 en el constructor de la subclase falta super(…) ANTES de usar this (apartado 8.2). Si no añade nada, no escribas constructor: se hereda", { cause: e });
    throw e;
  }
}

// ───────────────────────── las predicciones ─────────────────────────
// [expresión (la misma que en el comentario de predicciones.js), valor, por qué, pista]
export const PREDICCIONES = {
  1: {
    p1: ['const r = { id: 1 }; const lista = [r]; lista.includes({ id: 1 })', false, "includes compara REFERENCIAS: { id: 1 } es un objeto nuevo, aunque tenga lo mismo dentro", "¿{ id: 1 } y r son el mismo objeto o dos objetos iguales?"],
    p2: ['const a = { bici: { marca: "Orbea" } }; const b = { ...a }; b.bici.marca = "BH"; a.bici.marca', "BH", "el spread copia un nivel: b.bici y a.bici son el MISMO objeto", "¿el spread copia también el objeto que hay dentro de bici?"],
    p3: ['const a = { bici: { marca: "Orbea" } }; const b = structuredClone(a); b.bici.marca = "BH"; a.bici.marca', "Orbea", "structuredClone copia todos los niveles: b.bici es un objeto nuevo", "¿qué diferencia hay entre { ...a } y structuredClone(a)?"],
    p4: ["const t = { extra: 1, sumar(lista) { return lista.map((x) => x + this.extra); } }; t.sumar([1, 2])", [2, 3], "la flecha no tiene this propio: usa el de sumar, que es t", "¿qué this usa una función flecha?"],
    p5: ["const t = { extra: 1, sumar(lista) { return lista.map(function (x) { return x + this?.extra; }); } }; t.sumar([1, 2])", [NaN, NaN], "una function normal tiene SU this, y map la llama suelta: this no es t, this?.extra es undefined y x + undefined da NaN", "¿quién llama a esa function, y con qué delante del punto?"],
  },
  2: {
    p1: ['class R { constructor(h) { if (h <= 0) throw new RangeError("Horas"); this.h = h; } }; let r = "sin crear"; try { r = new R(0); } catch {}; r', "sin crear", "si el constructor lanza, el objeto no llega a existir y la asignación no se hace", "¿llega new R(0) a devolver algo?"],
    p2: ["class C { static total = 0; constructor() { C.total++; } }; new C(); new C(); [new C().total, C.total]", [undefined, 3], "total es de la CLASE (C.total), no de cada objeto; y ya se han creado tres", "¿dónde vive una propiedad static? ¿cuántos new C() hay?"],
    p3: ['class T { #h = 1; get horas() { return this.#h; } set horas(v) { if (v <= 0) throw new RangeError("no"); this.#h = v; } }; const t = new T(); try { t.horas = -2; } catch {}; t.horas', 1, "el setter valida ANTES de guardar: al lanzar, #h se queda como estaba", "¿llega a ejecutarse this.#h = v cuando v es -2?"],
    p4: ['new TypeError("x") instanceof RangeError', false, "TypeError y RangeError son hermanos (los dos heredan de Error), no padre e hijo", "repasa el dibujo del apartado 10.4: ¿de quién hereda TypeError?"],
  },
  3: {
    p1: ["class C { #l = [1]; get l() { return this.#l; } }; const c = new C(); c.l.push(2); c.l.length", 2, "el getter devuelve la referencia al array privado: desde fuera se puede cambiar", "¿c.l es una copia o el mismo array que #l?"],
    p2: ["class C { #l = [1]; get l() { return [...this.#l]; } }; const c = new C(); c.l.push(2); c.l.length", 1, "cada lectura de c.l da una COPIA nueva: el push cambia la copia, no #l", "¿qué devuelve [...this.#l]?"],
    p3: ["class C { #l = [{ n: 1 }]; get l() { return [...this.#l]; } }; const c = new C(); c.l[0].n = 9; c.l[0].n", 9, "[...] copia el array, pero los objetos de dentro son los mismos: copia superficial", "la copia es del array… ¿y de los objetos que hay dentro?"],
    p4: ["class C { #doble(n) { return n * 2; } calcular(n) { return this.#doble(n) + 1; } }; [new C().calcular(3), typeof new C().doble]", [7, "undefined"], "un método #privado se usa dentro de la clase; desde fuera no existe (y doble sin # es otra cosa)", "¿#doble y doble son lo mismo?"],
    p5: ["JSON.stringify(new (class { #secreto = 1; visible = 2; })())", '{"visible":2}', "los campos # no son propiedades: ni JSON ni Object.keys los ven", "¿JSON.stringify ve los campos #?"],
  },
  4: {
    p1: ["class A { get t() { return 10; } } class B extends A { get t() { return super.t * 2; } }; new B().t", 20, "B sobrescribe el getter y con super.t lee el del padre", "¿qué da super.t dentro de B?"],
    p2: ["class A { constructor(n) { this.n = n; } } class B extends A {}; new B(5).n", 5, "si B no escribe constructor, JavaScript pone uno que llama a super(...args)", "¿qué constructor tiene B si no escribe ninguno?"],
    p3: ['class A { quien() { return "A"; } hola() { return "Soy " + this.quien(); } } class B extends A { quien() { return "B"; } }; new B().hola()', "Soy B", "hola es de A, pero this es el objeto B: this.quien() busca primero en B (polimorfismo)", "dentro de hola, ¿quién es this?"],
    p4: ["class A { #x = 1; leer() { return this.#x; } } class B extends A {}; new B().leer()", 1, "un B también tiene los campos privados de A, y los métodos de A pueden leerlos", "¿quién crea los campos de A cuando haces new B()?"],
    p5: ["class A {} class B extends A {}; new A() instanceof B", false, "un A no es un B: instanceof mira hacia ARRIBA en la cadena", "¿todo vehículo es un coche?"],
  },
  5: {
    p1: ['class E extends Error { constructor(m) { super(m); this.name = "E"; } } class F extends E {}; new F("x").name', "E", "F no pone su name y se queda con el que pone el constructor de E", "¿quién escribe this.name al crear un F?"],
    p2: ['class E extends Error { constructor(m, datos = {}) { super(m); this.datos = datos; } }; new E("x").datos.id ?? "sin id"', "sin id", "sin datos se usa el valor por defecto {}: existe (no revienta), pero no tiene id, y ?? da el de la derecha", "¿qué vale datos si no lo pasas?"],
    p3: ['const m = new Map(); m.set(1, "a"); m.set("1", "b"); m.size', 2, "en un Map las claves pueden ser de cualquier tipo: 1 y \"1\" son claves distintas", "¿es lo mismo el número 1 que el texto \"1\"? (repasa el apartado 10.5)"],
    p4: ['const caja = { dentro: [], fuera: ["R1"] }; try { caja.dentro.push(caja.fuera[0]); throw new Error("lleno"); } catch {}; [caja.dentro.length, caja.fuera.length]', [1, 1], "el error llega DESPUÉS del push: R1 queda dentro y fuera a la vez (estado a medias)", "¿qué se había hecho ya cuando saltó el error?"],
  },
};

const d = (a, m, dia, h = 10) => new Date(a, m - 1, dia, h, 0); // fecha local: d(2026, 11, 20) = 20/11/2026 10:00

class Revisor {
  constructor(nombre) {
    this.nombre = nombre;
    this.hechas = 0;
  }
  revisar(r) {
    this.hechas++;
    return `${this.nombre} revisa ${r.bici}`;
  }
}

// ───────────────────────── bloques ─────────────────────────
export const BLOQUES = [
  {
    id: "1",
    titulo: "Bloque 1 · Objetos, this y referencias",
    modulos: { m: "src/bloque1/referencias.js", pred: "src/bloque1/predicciones.js" },
    pruebas: [
      { id: "1.p", texto: "🔮 Predicciones", fn: predicciones(PREDICCIONES[1]) },
      {
        id: "1.E",
        texto: "👀 Ejemplo: crearAvisador (la flecha conserva this)",
        fn: ({ m }) => {
          const a = m.crearAvisador("La Cadena");
          if (a.avisarTodos(["frenos", "cadena"]) !== 2) return "avisarTodos no devuelve 2";
          return a.avisos[1] === "La Cadena: cadena" || `avisos es ${muestra(a.avisos)}`;
        },
      },
      {
        id: "1.e1",
        texto: "🪜 estaEnLista: la misma reparación, aunque sea otra copia",
        fn: ({ m }) => {
          const lista = [{ id: 1, bici: "Orbea" }, { id: 2, bici: "BH" }];
          if (m.estaEnLista(lista, { id: 2, bici: "BH" }) === false && m.estaEnLista(lista, lista[1]) === true)
            return "con el MISMO objeto da true, pero con una copia da false: includes (y ===) comparan referencias. Compara por id";
          return casos(m.estaEnLista, "estaEnLista", [
            [[lista, { id: 2, bici: "BH" }], true],
            [[lista, { id: 3, bici: "BH" }], false],
            [[[], { id: 1 }], false],
          ]);
        },
      },
      {
        id: "1.1",
        texto: "✍️ rebajar: un presupuesto NUEVO, sin tocar el original ni sus piezas",
        fn: ({ m }) => {
          const piezas = [Object.freeze({ nombre: "Cadena", precio: 19.99 }), Object.freeze({ nombre: "Cubierta", precio: 32.5 })];
          const original = Object.freeze({ cliente: "Ana", piezas: Object.freeze(piezas) });
          const r = m.rebajar(original, 10);
          if (r === original) return "devuelves el MISMO presupuesto: crea uno nuevo";
          if (r?.piezas === original.piezas) return "el presupuesto nuevo comparte el array de piezas con el original: haz uno nuevo (map)";
          const esperado = { cliente: "Ana", piezas: [{ nombre: "Cadena", precio: 17.99 }, { nombre: "Cubierta", precio: 29.25 }] };
          if (!igual(r, esperado)) return `rebajar(…, 10) debería dar ${muestra(esperado)} y da ${muestra(r)}${pistaDe(r?.piezas?.[0]?.precio, 17.99)}`;
          return casos(m.rebajar, "rebajar", [[[{ cliente: "Luis", piezas: [{ nombre: "Sillín", precio: 10 }] }, 15], { cliente: "Luis", piezas: [{ nombre: "Sillín", precio: 8.5 }] }]]);
        },
      },
      {
        id: "1.2",
        opcional: true,
        texto: "➕ ✍️ copiarFicha: copia PROFUNDA (también la fecha)",
        fn: ({ m }) => {
          const original = { cliente: "Ana", bici: { marca: "Orbea", talla: "M" }, entrada: d(2026, 11, 20), notas: ["frenos"] };
          const c = m.copiarFicha(original);
          if (c === undefined) return "copiarFicha no devuelve nada: ¿te falta el return?";
          if (c === original) return "devuelves la MISMA ficha: eso no es una copia";
          if (!(c.entrada instanceof Date)) return `en la copia, entrada es ${muestra(c.entrada)} y no un Date. ¿JSON.parse(JSON.stringify(…))? Convierte las fechas en texto. Hay otra forma que sí las conserva (apartado 4)`;
          if (c.cliente !== "Ana" || c.bici?.talla !== "M" || c.entrada.getTime() !== original.entrada.getTime()) return `la copia no tiene lo mismo: ${muestra(c)}`;
          c.bici.marca = "BH";
          if (original.bici.marca !== "Orbea") return "copia SUPERFICIAL: al cambiar la marca de la copia cambia la del original (bici es el mismo objeto). Necesitas copiar todos los niveles";
          c.entrada.setDate(25);
          if (original.entrada.getDate() !== 20) return "la fecha es un OBJETO: la copia y el original comparten el mismo Date y setDate cambia los dos";
          c.notas.push("cadena");
          return original.notas.length === 1 || "las notas son el mismo array en la copia y en el original";
        },
      },
      {
        id: "1.3",
        opcional: true,
        texto: "➕ ✍️ revisarTodas: pasar un método como callback sin perder this",
        fn: ({ m }) => {
          const rosa = new Revisor("Rosa");
          let r;
          try {
            r = m.revisarTodas([{ bici: "Orbea" }, { bici: "BH" }], rosa);
          } catch (e) {
            if (e instanceof TypeError && /undefined/.test(e.message))
              return `💥 ${e.message} → se ha perdido this: map(revisor.revisar) pasa la función SIN el revisor delante. Que la llame una flecha (apartado 7.7)`;
            throw e;
          }
          if (r === undefined) return "revisarTodas no devuelve nada: ¿te falta el return? (forEach no devuelve nada; map sí)";
          if (!igual(r, ["Rosa revisa Orbea", "Rosa revisa BH"])) return `da ${muestra(r)} y debería dar ["Rosa revisa Orbea", "Rosa revisa BH"]`;
          return rosa.hechas === 2 || `el revisor lleva ${rosa.hechas} hechas y deberían ser 2: ¿lo llamas dos veces por reparación?`;
        },
      },
    ],
  },
  {
    id: "2",
    titulo: "Bloque 2 · Clases: validar, getters/setters y static",
    modulos: { r: "src/modelo/reparacion.js", mec: "src/modelo/mecanico.js", pred: "src/bloque2/predicciones.js" },
    pruebas: [
      { id: "2.p", texto: "🔮 Predicciones", fn: predicciones(PREDICCIONES[2]) },
      {
        id: "2.E",
        texto: "👀 Ejemplo: el constructor de Mecanico valida (TypeError / RangeError)",
        fn: ({ mec }) => {
          const m = new mec.Mecanico(" Rosa ", 3);
          if (m.nombre !== "Rosa" || m.max !== 3) return `el mecánico guarda ${muestra({ ...m })}`;
          return !lanza(() => new mec.Mecanico("", 2), TypeError) && !lanza(() => new mec.Mecanico("Rosa", 0), RangeError) && !lanza(() => new mec.Mecanico("Rosa", "2"), TypeError) || "el constructor de Mecanico no valida bien";
        },
      },
      {
        id: "2.e1",
        texto: "🪜 constructor: cliente y bici (texto sin espacios de más; si no, TypeError)",
        fn: ({ r }) => {
          const rep = nueva(r.Reparacion, "  Ana ", " Orbea Alma ", 2);
          if (rep.cliente !== "Ana" || rep.bici !== "Orbea Alma") return `guarda cliente ${muestra(rep.cliente)} y bici ${muestra(rep.bici)}: sin los espacios del principio y del final (trim)`;
          for (const [c, b] of [["", "Orbea"], ["   ", "Orbea"], [undefined, "Orbea"], ["Ana", 42], ["Ana", ""]]) {
            const f = lanza(() => new r.Reparacion(c, b, 2), TypeError);
            if (f) return `new Reparacion(${muestra(c)}, ${muestra(b)}, 2) ${f}${/no un TypeError/.test(f) && !/ningún/.test(f) ? ". Un dato que no es del TIPO que toca (no es un texto, o está vacío) → TypeError" : ""}`;
          }
          return true;
        },
      },
      {
        id: "2.1",
        texto: "✍️ horas: get/set privado que valida (TypeError / RangeError)",
        fn: ({ r }) => {
          const rep = nueva(r.Reparacion, "Ana", "Orbea", 2);
          if (rep.horas !== 2) return `rep.horas da ${muestra(rep.horas)}: hace falta get horas() que devuelva this.#horas`;
          rep.horas = 1.5;
          if (rep.horas !== 1.5) return "rep.horas = 1.5 no cambia las horas: ¿has escrito set horas(valor)?";
          for (const [malo, Clase] of [["2", TypeError], [Number.NaN, TypeError], [0, RangeError], [-1, RangeError]]) {
            const f = lanza(() => {
              rep.horas = malo;
            }, Clase);
            if (f) return `rep.horas = ${muestra(malo)} ${f}`;
            if (rep.horas !== 1.5) return `tras rep.horas = ${muestra(malo)} (que no vale), las horas han cambiado a ${muestra(rep.horas)}: valida ANTES de guardar`;
          }
          let f = lanza(() => new r.Reparacion("Ana", "Orbea", 0), RangeError);
          if (f) return `new Reparacion("Ana", "Orbea", 0) ${f}: el constructor tiene que pasar por el setter (this.horas = horas)`;
          f = lanza(() => new r.Reparacion("Ana", "Orbea", "2"), TypeError);
          if (f) return `new Reparacion("Ana", "Orbea", "2") ${f}`;
          return !Object.keys(rep).includes("horas") || "horas es una propiedad pública: guárdalas en un campo privado #horas";
        },
      },
      {
        id: "2.2",
        texto: "✍️ static: id automático (sin repetir) y la fecha de entrada",
        fn: ({ r }) => {
          const R = r.Reparacion;
          const a = nueva(R, "Ana", "Orbea", 1);
          const b = nueva(R, "Luis", "BH", 1);
          if (typeof a.id !== "number") return `el id es ${muestra(a.id)}: un número que da la CLASE (static #ultimoId)`;
          if (b.id !== a.id + 1) return `dos reparaciones seguidas tienen id ${a.id} y ${b.id}: deberían ser consecutivos. El contador es de la clase, no de cada objeto`;
          const c = nueva(R, "Eva", "Trek", 1, { id: 500 });
          if (c.id !== 500) return `con { id: 500 } el id debería ser 500 y es ${c.id}`;
          const e = nueva(R, "Eva", "Trek", 1);
          if (e.id !== 501) return `después de crear la 500, la siguiente sale con id ${e.id} y debería ser 501: si te pasan un id mayor, el contador salta hasta él (si no, se repetirían)`;
          nueva(R, "Eva", "Trek", 1, { id: 3 });
          const f = nueva(R, "Eva", "Trek", 1);
          if (f.id !== 502) return `tras crear una con { id: 3 }, la siguiente sale con id ${f.id} y debería ser 502: el contador nunca vuelve atrás`;
          try {
            new R("", "Trek", 1);
          } catch {
            /* no se crea */
          }
          try {
            new R("Eva", "Trek", -1);
          } catch {
            /* no se crea */
          }
          const g = nueva(R, "Eva", "Trek", 1);
          if (g.id !== 503) return `dos reparaciones que NO se han creado (datos malos) han gastado ids: la siguiente sale con ${g.id} y debería ser 503. Valida ANTES de tocar el contador`;
          if (!(a.entrada instanceof Date) || Math.abs(Date.now() - a.entrada.getTime()) > 60000) return `sin entrada, debería ser la fecha de ahora (un Date) y es ${muestra(a.entrada)}`;
          const fecha = d(2026, 11, 20);
          const h = nueva(R, "Eva", "Trek", 1, { entrada: fecha });
          if (!(h.entrada instanceof Date) || h.entrada.getTime() !== fecha.getTime()) return `con { entrada } la fecha debería ser esa y es ${muestra(h.entrada)}`;
          if (h.entrada === fecha) return "guardas el MISMO Date que te pasan: si fuera alguien hace setDate, cambia la entrada de tu reparación. Guarda una copia (apartado 4)";
          return Object.keys(R).length === 0 || { aviso: `funciona, pero el contador se ve desde fuera (${Object.keys(R).join(", ")}): mejor static #privado` };
        },
      },
      {
        id: "2.3",
        opcional: true,
        texto: "➕ ✍️ static desdeLinea: una fábrica que lee «cliente; bici; horas»",
        fn: ({ r }) => {
          const R = r.Reparacion;
          if (typeof R.desdeLinea !== "function") return "Reparacion.desdeLinea no existe: es un método de la CLASE (static desdeLinea(linea))";
          let rep;
          try {
            rep = R.desdeLinea(" Ana ; Orbea Alma ; 1.5 ");
          } catch (e) {
            if (e instanceof TypeError && e.message !== "Sin hacer") return `R.desdeLinea(" Ana ; Orbea Alma ; 1.5 ") lanza TypeError («${e.message}»): esa línea es buena. ¿Las horas siguen siendo un TEXTO? Conviértelas con Number`;
            throw e;
          }
          if (!(rep instanceof R)) return "desdeLinea no devuelve una Reparacion: return new Reparacion(…)";
          if (rep.cliente !== "Ana" || rep.bici !== "Orbea Alma" || rep.horas !== 1.5) return `da cliente ${muestra(rep.cliente)}, bici ${muestra(rep.bici)} y horas ${muestra(rep.horas)}`;
          for (const [linea, Clase] of [["Ana;;2", TypeError], ["Ana; BH; dos", TypeError], ["Ana; BH", TypeError], ["Ana; BH; 0", RangeError]]) {
            const f = lanza(() => R.desdeLinea(linea), Clase);
            if (f) return `desdeLinea(${muestra(linea)}) ${f}. La validación ya la hace el constructor: no la repitas, úsalo`;
          }
          return true;
        },
      },
    ],
  },
  {
    id: "3",
    titulo: "Bloque 3 · Encapsulación: #privados, copias y métodos privados",
    modulos: { r: "src/modelo/reparacion.js", mec: "src/modelo/mecanico.js", pred: "src/bloque3/predicciones.js" },
    pruebas: [
      { id: "3.p", texto: "🔮 Predicciones", fn: predicciones(PREDICCIONES[3]) },
      {
        id: "3.E",
        texto: "👀 Ejemplo: Mecanico.trabajos devuelve una copia del Set privado",
        fn: ({ mec }) => {
          const m = new mec.Mecanico("Rosa", 2);
          m.trabajos.push(99);
          if (m.trabajos.length !== 0) return "trabajos deja cambiar el Set privado";
          return (m.libres === 2 && igual(Object.keys(m).sort(), ["max", "nombre"])) || "libres o las propiedades de Mecanico no son las esperadas";
        },
      },
      {
        id: "3.e1",
        texto: "🪜 estado: empieza en «pendiente» y desde fuera solo se lee",
        fn: ({ r }) => {
          const rep = nueva(r.Reparacion, "Ana", "Orbea", 2);
          if (rep.estado !== "pendiente") return `una reparación nueva tiene estado ${muestra(rep.estado)} y debería ser "pendiente"`;
          try {
            rep.estado = "lista";
          } catch {
            /* sin set: en un módulo, asignar lanza TypeError. Está bien */
          }
          if (rep.estado !== "pendiente") return "rep.estado = \"lista\" cambia el estado desde fuera: guárdalo en un campo #estado con solo un get (sin set)";
          return !Object.keys(rep).includes("estado") || "estado es una propiedad pública: guárdalo en #estado";
        },
      },
      {
        id: "3.1",
        texto: "✍️ anadirPieza: valida con un método #privado (TypeError / RangeError)",
        fn: ({ r }, ctx) => {
          const rep = nueva(r.Reparacion, "Ana", "Orbea", 2);
          rep.anadirPieza(" Cadena ", 19.99);
          rep.anadirPieza("Cámara", 0);
          for (const [nombre, precio, Clase] of [["", 5, TypeError], [5, 5, TypeError], ["Pastillas", "5", TypeError], ["Pastillas", -1, RangeError]]) {
            const f = lanza(() => rep.anadirPieza(nombre, precio), Clase);
            if (f) return `anadirPieza(${muestra(nombre)}, ${muestra(precio)}) ${f}`;
          }
          if (Object.keys(rep).some((k) => /pieza/i.test(k))) return `las piezas están en una propiedad pública (${Object.keys(rep).join(", ")}): van en un campo privado #piezas`;
          let piezas;
          try {
            piezas = rep.piezas;
          } catch (e) {
            if (e?.message !== "Sin hacer") throw e;
          }
          if (piezas && piezas.length !== 2) return `después de 2 piezas buenas y 4 malas hay ${piezas.length}: si la pieza no vale, no se añade (valida ANTES del push)`;
          const fuente = sinComentarios(ctx.leer("src/modelo/reparacion.js"));
          const clase = trozo(fuente, "class Reparacion", "class ReparacionUrgente");
          if (!/^\s*#\w+\s*\([^)]*\)\s*\{/m.test(clase)) return "funciona, pero la validación tiene que ir en un MÉTODO PRIVADO de la clase (#validarPieza(nombre, precio)) y anadirPieza lo llama (apartado 7.4)";
          return true;
        },
      },
      {
        id: "3.2",
        texto: "✍️ piezas: el getter devuelve una COPIA (del array y de cada pieza)",
        fn: ({ r }) => {
          const rep = nueva(r.Reparacion, "Ana", "Orbea", 2);
          if (!igual(rep.piezas, [])) return `sin piezas, rep.piezas debería ser [] y es ${muestra(rep.piezas)}`;
          rep.anadirPieza(" Cadena ", 19.99);
          const p = rep.piezas;
          if (!igual(p, [{ nombre: "Cadena", precio: 19.99 }])) return `rep.piezas da ${muestra(p)} y debería dar [{ nombre: "Cadena", precio: 19.99 }] (nombre sin espacios de más)`;
          p.push({ nombre: "Truco", precio: 0 });
          if (rep.piezas.length !== 1) return "GETTER QUE DEVUELVE LA REFERENCIA INTERNA: al hacer push en lo que devuelve piezas, cambia el #piezas de la reparación. Devuelve una copia";
          rep.piezas[0].precio = 0;
          if (rep.piezas[0].precio !== 19.99) return "COPIA SUPERFICIAL: copias el array, pero cada pieza sigue siendo el mismo objeto y se puede cambiar su precio desde fuera. Copia también cada pieza";
          return true;
        },
      },
      {
        id: "3.3",
        texto: "✍️ total: horas × PRECIO_HORA + piezas, redondeado a 2 decimales",
        fn: ({ r }) => {
          if (r.PRECIO_HORA !== 25) return "falta exportar PRECIO_HORA = 25";
          const rep = nueva(r.Reparacion, "Ana", "Orbea", 2);
          if (rep.total !== 50) return `2 h sin piezas deberían ser 50 € y da ${muestra(rep.total)}${pistaDe(rep.total, 50)}`;
          rep.anadirPieza("Cadena", 19.99);
          if (rep.total !== 69.99) return `2 h + una cadena de 19.99 deberían ser 69.99 y da ${muestra(rep.total)}${pistaDe(rep.total, 69.99)}`;
          rep.horas = 3;
          if (rep.total !== 94.99) return `tras cambiar las horas a 3, total da ${muestra(rep.total)} y debería dar 94.99: el total se CALCULA al leerlo (get), no se guarda en el constructor`;
          const otra = nueva(r.Reparacion, "Luis", "BH", 0.5);
          otra.anadirPieza("Radio", 10.1);
          otra.anadirPieza("Tapón", 0.2);
          return otra.total === 22.8 || `0.5 h + 10.1 + 0.2 deberían ser 22.8 y da ${muestra(otra.total)}${pistaDe(otra.total, 22.8)}`;
        },
      },
    ],
  },
  {
    id: "4",
    titulo: "Bloque 4 · Herencia y polimorfismo",
    modulos: { r: "src/modelo/reparacion.js", p: "src/bloque4/polimorfismo.js", pred: "src/bloque4/predicciones.js" },
    pruebas: [
      { id: "4.p", texto: "🔮 Predicciones", fn: predicciones(PREDICCIONES[4]) },
      {
        id: "4.E",
        texto: "👀 Ejemplo: describir, sin preguntar el tipo",
        fn: ({ p }) => {
          const texto = p.describir({ id: 7, cliente: "Ana", bici: "Orbea", tipo: "urgente", total: 65 });
          return texto === "#7 Ana · Orbea · urgente · 65 €" || `describir da ${muestra(texto)}`;
        },
      },
      {
        id: "4.e1",
        texto: "🪜 get tipo: «normal» en Reparacion y «urgente» en ReparacionUrgente",
        fn: ({ r }) => {
          const n = nueva(r.Reparacion, "Ana", "Orbea", 2);
          const u = nueva(r.ReparacionUrgente, "Luis", "BH", 2);
          if (!(u instanceof r.Reparacion)) return "ReparacionUrgente no hereda de Reparacion (extends)";
          if (u.cliente !== "Luis" || u.horas !== 2) return "la urgente no guarda sus datos: si escribes constructor, llama a super(cliente, bici, horas, opciones)… o no lo escribas";
          if (n.tipo !== "normal") return `una Reparacion tiene tipo ${muestra(n.tipo)}: debería ser "normal"`;
          if (u.tipo !== "urgente") return `una ReparacionUrgente tiene tipo ${muestra(u.tipo)}: sobrescribe get tipo() en la subclase`;
          return !Object.hasOwn(n, "tipo") || "tipo es una propiedad guardada en cada objeto: hazlo un getter de la clase (get tipo())";
        },
      },
      {
        id: "4.1",
        texto: "✍️ ReparacionUrgente: total +30 % reutilizando el del padre (super)",
        fn: ({ r }, ctx) => {
          const u = nueva(r.ReparacionUrgente, "Luis", "BH", 2);
          let total;
          try {
            total = u.total;
          } catch (e) {
            if (/Maximum call stack/.test(e?.message)) return "💥 get total se llama a sí mismo sin fin: dentro de la subclase, this.total vuelve a ser el de la urgente. El total del PADRE es super.total";
            throw e;
          }
          if (total === 50) return "una urgente de 2 h da 50, como una normal: sobrescribe get total() en ReparacionUrgente";
          if (total !== 65) return `una urgente de 2 h debería dar 65 (50 + 30 %) y da ${muestra(total)}${pistaDe(total, 65)}`;
          u.anadirPieza("Cadena", 10);
          if (u.total !== 78) return `con una pieza de 10 debería dar 78 ((50 + 10) × 1.3) y da ${muestra(u.total)}: el 30 % va sobre TODO el total del padre`;
          const u2 = nueva(r.ReparacionUrgente, "Eva", "Trek", 1.5);
          u2.anadirPieza("Freno", 33.33);
          if (u2.total !== 92.08) return `1.5 h + 33.33 en urgente debería dar 92.08 y da ${muestra(u2.total)}${pistaDe(u2.total, 92.08)}`;
          if (nueva(r.Reparacion, "Ana", "Orbea", 2).total !== 50) return "has cambiado el total de las normales";
          const urgente = trozo(sinComentarios(ctx.leer("src/modelo/reparacion.js")), "class ReparacionUrgente");
          return /super\.total/.test(urgente) || { aviso: "funciona, pero no usas super.total: si mañana cambia el cálculo del padre, la urgente se queda atrás" };
        },
      },
      {
        id: "4.2",
        texto: "✍️ facturaPorTipo: polimorfismo, sin instanceof ni if de tipos",
        fn: ({ r, p }, ctx) => {
          const a = nueva(r.Reparacion, "Ana", "Orbea", 0.5);
          a.anadirPieza("Tapón", 0.8); // 13.3
          const b = nueva(r.Reparacion, "Luis", "BH", 1);
          b.anadirPieza("Cubierta", 15.6); // 40.6
          const c = nueva(r.ReparacionUrgente, "Eva", "Trek", 2);
          c.anadirPieza("Cadena", 10); // 78
          const res = casos(p.facturaPorTipo, "facturaPorTipo", [[[[a, b, c]], { normal: 53.9, urgente: 78 }], [[[]], {}]]);
          if (res !== true) return res;
          const cuerpo = trozo(sinComentarios(ctx.leer("src/bloque4/polimorfismo.js")), "function facturaPorTipo", "class ReparacionSocio");
          const pregunta = queTipo(cuerpo);
          return pregunta ? `funciona, pero preguntas el tipo («${pregunta}»): eso no es polimorfismo. Cada reparación ya SABE su tipo y su total: úsalos directamente (apartado 8.3)` : true;
        },
      },
      {
        id: "4.3",
        opcional: true,
        texto: "➕ ✍️ ReparacionSocio: −20 % solo en la mano de obra",
        fn: ({ r, p }) => {
          if (typeof p.ReparacionSocio !== "function") return "falta exportar la clase ReparacionSocio";
          const s = nueva(p.ReparacionSocio, "Ana", "Orbea", 2);
          if (!(s instanceof r.Reparacion)) return "ReparacionSocio no hereda de Reparacion";
          s.anadirPieza("Cadena", 10);
          if (s.total === 48) return "da 48: rebajas también la pieza. El 20 % es solo de la mano de obra (horas × PRECIO_HORA); las piezas se cobran enteras";
          if (s.total !== 50) return `2 h + una pieza de 10 deberían ser 50 (50 − 10 + 10) y da ${muestra(s.total)}${pistaDe(s.total, 50)}`;
          const s2 = nueva(p.ReparacionSocio, "Luis", "BH", 1.5);
          s2.anadirPieza("Freno", 3.33);
          if (s2.total !== 33.33) return `1.5 h + 3.33 deberían ser 33.33 y da ${muestra(s2.total)}${pistaDe(s2.total, 33.33)}`;
          if (s.tipo !== "socio") return `su tipo es ${muestra(s.tipo)} y debería ser "socio"`;
          const f = p.facturaPorTipo([s, nueva(r.Reparacion, "Eva", "Trek", 2)]);
          return igual(f, { socio: 50, normal: 50 }) || `facturaPorTipo con un socio y una normal da ${muestra(f)}: tiene que funcionar con la clase nueva sin tocarla`;
        },
      },
    ],
  },
  {
    id: "5",
    titulo: "Bloque 5 · Composición y errores propios",
    modulos: { e: "src/modelo/errores.js", r: "src/modelo/reparacion.js", mec: "src/modelo/mecanico.js", t: "src/modelo/taller.js", pred: "src/bloque5/predicciones.js" },
    pruebas: [
      { id: "5.p", texto: "🔮 Predicciones", fn: predicciones(PREDICCIONES[5]) },
      {
        id: "5.E",
        texto: "👀 Ejemplo: ErrorTaller con name y datos",
        fn: ({ e }) => {
          const err = new e.ErrorTaller("No hay sitio", { id: 1 });
          return (err instanceof Error && err.name === "ErrorTaller" && err.datos.id === 1 && igual(new e.ErrorTaller("x").datos, {})) || "ErrorTaller no tiene name o datos";
        },
      },
      {
        id: "5.e1",
        texto: "🪜 ErrorEstado y ErrorMecanicoLleno: hijos de ErrorTaller, con su name y sus datos",
        fn: ({ e }) => {
          for (const [Clase, args, nombre, datos] of [
            [e.ErrorEstado, [7, "lista"], "ErrorEstado", { id: 7, estado: "lista" }],
            [e.ErrorMecanicoLleno, ["Rosa", 2], "ErrorMecanicoLleno", { mecanico: "Rosa", max: 2 }],
          ]) {
            const err = new Clase(...args);
            if (!(err instanceof e.ErrorTaller)) return `${nombre} no hereda de ErrorTaller: extends ErrorTaller (así un catch puede preguntar por todos los del taller a la vez)`;
            if (err.name === "ErrorTaller") return `new ${nombre}(…).name da "ErrorTaller": la subclase se queda con el name del padre (predicción p1). Pon el suyo después de super`;
            if (err.name !== nombre) return `new ${nombre}(…).name da ${muestra(err.name)}`;
            if (!igual(err.datos, datos)) return `new ${nombre}(${args.map(muestra).join(", ")}).datos da ${muestra(err.datos)} y debería ser ${muestra(datos)}: pásalos a super(mensaje, { … })`;
            if (typeof err.message !== "string" || err.message.length < 5) return `${nombre} necesita un mensaje que explique qué pasa`;
          }
          return true;
        },
      },
      {
        id: "5.1",
        texto: "✍️ Mecanico: asignar y liberar (ErrorMecanicoLleno sin dejarlo a medias)",
        fn: ({ e, mec }) => {
          const m = new mec.Mecanico("Rosa", 2);
          m.asignar({ id: 1 });
          m.asignar({ id: 2 });
          if (!igual(m.trabajos, [1, 2])) return `tras asignar las reparaciones 1 y 2, trabajos da ${muestra(m.trabajos)}: guarda el id en #trabajos`;
          if (m.libres !== 0) return `con 2 de 2, libres da ${muestra(m.libres)}`;
          const err = capturar(() => m.asignar({ id: 3 }), e.ErrorMecanicoLleno);
          if (typeof err === "string") return `asignar a un mecánico lleno ${err}`;
          if (!igual(err.datos, { mecanico: "Rosa", max: 2 })) return `el error tiene datos ${muestra(err.datos)}`;
          if (m.trabajos.length !== 2) return "ESTADO A MEDIAS: al lanzar ErrorMecanicoLleno, el trabajo se ha quedado dentro igualmente. Comprueba ANTES de añadir";
          m.liberar(1);
          if (!igual(m.trabajos, [2]) || m.libres !== 1) return `tras liberar(1), trabajos da ${muestra(m.trabajos)} y libres ${muestra(m.libres)}`;
          m.liberar(99);
          return m.trabajos.length === 1 || "liberar un id que no tiene no debería cambiar nada";
        },
      },
      {
        id: "5.2",
        texto: "✍️ empezar y terminar: pendiente → en-taller → lista (ErrorEstado si no toca)",
        fn: ({ e, r }) => {
          const rep = nueva(r.Reparacion, "Ana", "Orbea", 2);
          let err = capturar(() => rep.terminar(), e.ErrorEstado);
          if (typeof err === "string") return `terminar una reparación pendiente ${err}`;
          if (rep.estado !== "pendiente") return "tras el error, el estado ha cambiado: lanza ANTES de cambiarlo";
          rep.empezar();
          if (rep.estado !== "en-taller") return `tras empezar(), estado es ${muestra(rep.estado)}`;
          err = capturar(() => rep.empezar(), e.ErrorEstado);
          if (typeof err === "string") return `empezar dos veces ${err}`;
          if (!igual(err.datos, { id: rep.id, estado: "en-taller" })) return `el ErrorEstado debería traer { id, estado } con el estado ACTUAL: trae ${muestra(err.datos)}`;
          rep.terminar();
          if (rep.estado !== "lista") return `tras terminar(), estado es ${muestra(rep.estado)}`;
          for (const accion of ["terminar", "empezar"]) {
            err = capturar(() => rep[accion](), e.ErrorEstado);
            if (typeof err === "string") return `${accion}() con la reparación ya «lista» ${err}`;
          }
          return rep.estado === "lista" || "una reparación lista ha cambiado de estado";
        },
      },
      {
        id: "5.3",
        texto: "✍️ Taller: nuevaReparacion, buscar, reparaciones, pendientes y contratar",
        fn: ({ e, r, mec, t }) => {
          const taller = new t.Taller();
          const a = taller.nuevaReparacion({ cliente: "Ana", bici: "Orbea", horas: 2 });
          const u = taller.nuevaReparacion({ cliente: "Luis", bici: "BH", horas: 1, urgente: true });
          if (!(a instanceof r.Reparacion) || a.tipo !== "normal") return "nuevaReparacion sin urgente debería devolver una Reparacion normal";
          if (!(u instanceof r.ReparacionUrgente)) return "con urgente: true debería crear una ReparacionUrgente";
          if (taller.buscar(a.id) !== a) return "buscar(id) no devuelve la reparación (la misma, no una copia)";
          if (taller.buscar(-1) !== null) return `buscar(-1) da ${muestra(taller.buscar(-1))} y debería dar null: no existe`;
          const lista = taller.reparaciones();
          if (!Array.isArray(lista) || lista.length !== 2 || lista[0] !== a || lista[1] !== u) return `reparaciones() debería dar [a, u] en orden y da ${muestra(lista)}`;
          lista.push("intruso");
          if (taller.reparaciones().length !== 2) return "reparaciones() devuelve el array interno: con un push desde fuera se cuela otra. Devuelve uno nuevo";
          if (taller.pendientes().length !== 2) return `pendientes() debería dar las 2 y da ${muestra(taller.pendientes())}`;
          const f = lanza(() => taller.nuevaReparacion({ cliente: "", bici: "Trek", horas: 1 }), TypeError);
          if (f) return `nuevaReparacion con cliente vacío ${f}`;
          if (taller.reparaciones().length !== 2) return "una reparación que no se ha podido crear se ha guardado en el taller";
          const rosa = taller.contratar("Rosa", 1);
          if (!(rosa instanceof mec.Mecanico) || rosa.max !== 1) return "contratar(nombre, max) debería crear el Mecanico, guardarlo y devolverlo";
          const g = lanza(() => taller.contratar("Rosa", 3), e.ErrorTaller);
          return g ? `contratar dos veces a Rosa ${g}` : true;
        },
      },
      {
        id: "5.4",
        texto: "✍️ Taller: asignar y terminar (orden de los errores, nada a medias) y facturacion",
        fn: ({ e, r, t }, ctx) => {
          const taller = new t.Taller();
          const rosa = taller.contratar("Rosa", 1);
          const a = taller.nuevaReparacion({ cliente: "Ana", bici: "Orbea", horas: 0.5 });
          a.anadirPieza("Tapón", 0.8); // 13.3
          const b = taller.nuevaReparacion({ cliente: "Luis", bici: "BH", horas: 1 });
          b.anadirPieza("Cubierta", 15.6); // 40.6
          let f = lanza(() => taller.asignar(999, "Rosa"), e.ErrorTaller);
          if (f) return `asignar una reparación que no existe ${f}`;
          f = lanza(() => taller.asignar(a.id, "Nadie"), e.ErrorTaller);
          if (f) return `asignar a un mecánico que no existe ${f}`;
          if (a.estado !== "pendiente") return "al asignar a un mecánico que no existe, la reparación ha empezado igualmente";
          taller.asignar(a.id, "Rosa");
          if (a.estado !== "en-taller" || !igual(rosa.trabajos, [a.id])) return `tras asignar, la reparación está ${muestra(a.estado)} y Rosa tiene ${muestra(rosa.trabajos)}: asignar EMPIEZA la reparación y se la da al mecánico`;
          f = lanza(() => taller.asignar(b.id, "Rosa"), e.ErrorMecanicoLleno);
          if (f) return `asignar a Rosa (llena) ${f}`;
          if (b.estado !== "pendiente") return "ESTADO A MEDIAS: Rosa estaba llena y la reparación ha empezado igualmente. Empieza la reparación solo cuando sepas que el mecánico puede cogerla";
          const err = capturar(() => taller.asignar(a.id, "Rosa"), e.ErrorEstado);
          if (typeof err === "string") return `ORDEN DE LOS ERRORES: la reparación ya está en el taller Y Rosa está llena; manda el estado y debería salir ErrorEstado, pero ${err}`;
          const pepe = taller.contratar("Pepe", 2);
          f = lanza(() => taller.asignar(a.id, "Pepe"), e.ErrorEstado);
          if (f) return `asignar a Pepe una reparación que ya está en el taller ${f}`;
          if (pepe.trabajos.length !== 0) return "ESTADO A MEDIAS: la reparación ya estaba en el taller (ErrorEstado), pero Pepe se ha quedado con el trabajo. Comprueba el estado ANTES de asignarla al mecánico";
          f = lanza(() => taller.terminar(b.id), e.ErrorEstado);
          if (f) return `terminar una reparación pendiente ${f}`;
          taller.terminar(a.id);
          if (a.estado !== "lista") return `tras terminar, la reparación está ${muestra(a.estado)}`;
          if (rosa.libres !== 1) return "al terminar, el mecánico no queda libre: libéralo";
          taller.asignar(b.id, "Rosa");
          taller.terminar(b.id);
          if (taller.facturacion !== 53.9) return `con dos listas de 13.3 y 40.6, facturacion da ${muestra(taller.facturacion)} y debería dar 53.9${pistaDe(taller.facturacion, 53.9)}`;
          const u = taller.nuevaReparacion({ cliente: "Eva", bici: "Trek", horas: 2, urgente: true });
          if (taller.facturacion !== 53.9) return "facturacion cuenta reparaciones que no están «lista»";
          taller.asignar(u.id, "Rosa");
          taller.terminar(u.id);
          if (taller.facturacion !== 118.9) return `con una urgente de 65 más, facturacion da ${muestra(taller.facturacion)} y debería dar 118.9: usa el total de cada reparación (polimorfismo)`;
          const pregunta = queTipo(sinComentarios(ctx.leer("src/modelo/taller.js")).replace(/new\s+\w+/g, ""));
          return pregunta && !/typeof/.test(pregunta) ? `funciona, pero en taller.js preguntas el tipo («${pregunta}»): cada reparación sabe su total y su estado` : true;
        },
      },
    ],
  },
  {
    id: "6",
    titulo: "Bloque 6 · Simulacro: la reparación en garantía",
    modulos: { e: "src/modelo/errores.js", r: "src/modelo/reparacion.js", mec: "src/modelo/mecanico.js", t: "src/modelo/taller.js", g: "src/modelo/garantia.js" },
    puntos: true,
    pruebas: [
      {
        id: "6.1",
        punto: 1,
        texto: "1 · new ReparacionGarantia(cliente, bici, horas, meses): hereda y valida meses",
        fn: ({ r, g }) => {
          const G = g.ReparacionGarantia;
          const rep = nueva(G, " Ana ", "Orbea", 1.5, 12);
          if (!(rep instanceof r.Reparacion)) return "ReparacionGarantia no hereda de Reparacion";
          if (rep.cliente !== "Ana" || rep.horas !== 1.5 || rep.estado !== "pendiente" || typeof rep.id !== "number") return "no tiene todo lo del padre (cliente, horas, estado, id): super(cliente, bici, horas, opciones)";
          if (rep.meses !== 12) return `meses da ${muestra(rep.meses)}`;
          if (rep.tipo !== "garantia") return `tipo da ${muestra(rep.tipo)} y debería ser "garantia"`;
          rep.anadirPieza("Cadena", 20);
          if (rep.total !== 0) return `con una pieza de 20, total da ${muestra(rep.total)}: en garantía el cliente no paga nada (0)`;
          for (const [malo, Clase] of [["12", TypeError], [0, RangeError], [25, RangeError], [2.5, RangeError]]) {
            const f = lanza(() => new G("Ana", "Orbea", 1, malo), Clase);
            if (f) return `meses = ${muestra(malo)} ${f}`;
          }
          try {
            rep.meses = 3;
          } catch {
            /* sin set: bien */
          }
          if (rep.meses !== 12) return "meses se puede cambiar desde fuera: solo lectura";
          return !Object.keys(rep).some((k) => /mes|revis/.test(k)) || `el estado nuevo está en propiedades públicas (${Object.keys(rep).join(", ")}): privado`;
        },
      },
      {
        id: "6.2",
        punto: 2,
        texto: "2 · revisiones: privadas y el getter da una copia profunda",
        fn: ({ g }) => {
          const rep = nueva(g.ReparacionGarantia, "Ana", "Orbea", 1, 6);
          if (!igual(rep.revisiones, [])) return `al crearla, revisiones debería ser [] y es ${muestra(rep.revisiones)}`;
          rep.revisar("Frenos", true);
          const lista = rep.revisiones;
          if (!igual(lista, [{ punto: "Frenos", ok: true }])) return `tras revisar("Frenos", true), revisiones da ${muestra(lista)}`;
          lista.push({ punto: "Truco", ok: true });
          if (rep.revisiones.length !== 1) return "el getter devuelve la REFERENCIA interna: desde fuera se cuelan revisiones";
          rep.revisiones[0].ok = false;
          return rep.revisiones[0].ok === true || "copia SUPERFICIAL: desde fuera se puede cambiar el ok de una revisión";
        },
      },
      {
        id: "6.3a",
        punto: 3,
        texto: "3 · revisar(punto, ok): TypeError, RangeError si se repite, y nada a medias",
        fn: ({ g }) => {
          const rep = nueva(g.ReparacionGarantia, "Ana", "Orbea", 1, 6);
          rep.revisar("Frenos", true);
          for (const [punto, ok, Clase] of [["", true, TypeError], [7, true, TypeError], ["Cadena", "sí", TypeError], ["Frenos", false, RangeError]]) {
            const f = lanza(() => rep.revisar(punto, ok), Clase);
            if (f) return `revisar(${muestra(punto)}, ${muestra(ok)}) ${f}`;
          }
          return rep.revisiones.length === 1 || `tras 4 revisiones que no valen hay ${rep.revisiones.length}: si no vale, no se añade`;
        },
      },
      {
        id: "6.3b",
        punto: 3,
        texto: "3 · porcentajeOk: entero redondeado, y 0 sin revisiones",
        fn: ({ g }) => {
          const rep = nueva(g.ReparacionGarantia, "Ana", "Orbea", 1, 6);
          if (rep.porcentajeOk !== 0) return `sin revisiones, porcentajeOk da ${muestra(rep.porcentajeOk)} y debería dar 0${Number.isNaN(rep.porcentajeOk) ? " (0 / 0 es NaN: ese caso va aparte)" : ""}`;
          rep.revisar("Frenos", true);
          rep.revisar("Cadena", true);
          rep.revisar("Luces", false);
          if (rep.porcentajeOk !== 67) return `2 de 3 bien debería dar 67 y da ${muestra(rep.porcentajeOk)}${pistaDe(rep.porcentajeOk, 67)}`;
          const otra = nueva(g.ReparacionGarantia, "Luis", "BH", 1, 6);
          otra.revisar("Frenos", false);
          otra.revisar("Cadena", false);
          otra.revisar("Luces", true);
          return otra.porcentajeOk === 33 || `1 de 3 bien debería dar 33 y da ${muestra(otra.porcentajeOk)}`;
        },
      },
      {
        id: "6.4",
        punto: 4,
        texto: "4 · taller.nuevaReparacion({ …, meses }) la crea, y las demás siguen igual",
        fn: ({ r, t, g }) => {
          nueva(g.ReparacionGarantia, "Ana", "Orbea", 1, 6);
          const taller = new t.Taller();
          const rep = taller.nuevaReparacion({ cliente: "Ana", bici: "Orbea", horas: 1, meses: 6 });
          if (!(rep instanceof g.ReparacionGarantia)) return "con meses, nuevaReparacion debería crear una ReparacionGarantia";
          if (rep.meses !== 6 || taller.buscar(rep.id) !== rep) return "la de garantía no tiene sus meses o no se guarda en el taller";
          const n = taller.nuevaReparacion({ cliente: "Luis", bici: "BH", horas: 2 });
          const u = taller.nuevaReparacion({ cliente: "Eva", bici: "Trek", horas: 2, urgente: true });
          if (n.tipo !== "normal" || !(u instanceof r.ReparacionUrgente)) return "las normales y las urgentes tienen que seguir igual";
          let creada;
          try {
            creada = taller.nuevaReparacion({ cliente: "Eva", bici: "Trek", horas: 1, meses: 0 });
          } catch (e) {
            if (e instanceof RangeError) creada = null;
            else throw e;
          }
          if (creada) return `con meses: 0 se ha creado una reparación ${muestra(creada.tipo)}: debería lanzar RangeError. Decide por si VIENE meses, no por si «es verdadero» (0 es falsy)`;
          const taller2 = new t.Taller();
          taller2.contratar("Rosa", 3);
          const gar = taller2.nuevaReparacion({ cliente: "Ana", bici: "Orbea", horas: 2, meses: 6 });
          const nor = taller2.nuevaReparacion({ cliente: "Luis", bici: "BH", horas: 2 });
          taller2.asignar(gar.id, "Rosa");
          taller2.asignar(nor.id, "Rosa");
          for (const punto of ["Frenos", "Cadena", "Luces"]) gar.revisar(punto, true);
          taller2.terminar(gar.id);
          taller2.terminar(nor.id);
          return taller2.facturacion === 50 || `con una de garantía y una normal de 50 listas, facturacion da ${muestra(taller2.facturacion)}: la de garantía cuenta 0`;
        },
      },
      {
        id: "6.5a",
        punto: 5,
        texto: "5 · ErrorRevision: hijo de ErrorTaller, con name y datos",
        fn: ({ e }) => {
          const err = new e.ErrorRevision(7, 2, 1);
          if (!(err instanceof e.ErrorTaller)) return "ErrorRevision tiene que heredar de ErrorTaller";
          if (err.name !== "ErrorRevision") return `name da ${muestra(err.name)}`;
          return igual(err.datos, { id: 7, revisadas: 2, fallos: 1 }) || `new ErrorRevision(7, 2, 1).datos da ${muestra(err.datos)} y debería ser { id: 7, revisadas: 2, fallos: 1 }`;
        },
      },
      {
        id: "6.5b",
        punto: 5,
        texto: "5 · la regla: para terminar, 3 revisiones o más y ninguna con fallo",
        fn: ({ e, g }) => {
          const rep = nueva(g.ReparacionGarantia, "Ana", "Orbea", 1, 6);
          rep.empezar();
          rep.revisar("Frenos", true);
          rep.revisar("Cadena", true);
          let err = capturar(() => rep.terminar(), e.ErrorRevision);
          if (typeof err === "string") return `terminar con solo 2 revisiones ${err}`;
          if (!igual(err.datos, { id: rep.id, revisadas: 2, fallos: 0 })) return `los datos del error son ${muestra(err.datos)}`;
          if (rep.estado !== "en-taller") return "tras el ErrorRevision, la reparación ha cambiado de estado: tiene que seguir «en-taller»";
          rep.revisar("Luces", false);
          err = capturar(() => rep.terminar(), e.ErrorRevision);
          if (typeof err === "string") return `terminar con una revisión con fallo ${err}`;
          if (err.datos.fallos !== 1) return `con una revisión mala, datos.fallos da ${muestra(err.datos.fallos)}`;
          const buena = nueva(g.ReparacionGarantia, "Luis", "BH", 1, 6);
          buena.empezar();
          for (const punto of ["Frenos", "Cadena", "Luces"]) buena.revisar(punto, true);
          buena.terminar();
          return buena.estado === "lista" || "con 3 revisiones buenas debería poder terminar";
        },
      },
      {
        id: "6.6a",
        punto: 6,
        opcional: true,
        texto: "➕ 6 · trampa: la regla vale también por taller.terminar, y el mecánico no se libera",
        fn: ({ e, t, g }) => {
          nueva(g.ReparacionGarantia, "Ana", "Orbea", 1, 6);
          const taller = new t.Taller();
          const rosa = taller.contratar("Rosa", 1);
          const rep = taller.nuevaReparacion({ cliente: "Ana", bici: "Orbea", horas: 1, meses: 6 });
          taller.asignar(rep.id, "Rosa");
          rep.revisar("Frenos", true);
          rep.revisar("Cadena", true);
          const f = lanza(() => taller.terminar(rep.id), e.ErrorRevision);
          if (f) return `taller.terminar con solo 2 revisiones ${f}: la regla tiene que valer por todos los caminos`;
          if (rep.estado !== "en-taller") return `tras el error, la reparación está ${muestra(rep.estado)}`;
          if (rosa.libres !== 0) return "ESTADO A MEDIAS: la reparación no ha podido terminar, pero Rosa ha quedado libre. Si terminar falla, el mecánico sigue con ella";
          rep.revisar("Luces", true);
          taller.terminar(rep.id);
          return (rep.estado === "lista" && rosa.libres === 1) || "con 3 revisiones buenas, taller.terminar debería terminarla y liberar a Rosa";
        },
      },
      {
        id: "6.6b",
        punto: 6,
        opcional: true,
        texto: "➕ 6 · trampa: el estado manda sobre la revisión, y sin preguntar el tipo",
        fn: ({ e, g }, ctx) => {
          const rep = nueva(g.ReparacionGarantia, "Ana", "Orbea", 1, 6);
          const err = capturar(() => rep.terminar(), e.ErrorEstado);
          if (typeof err === "string") return `ORDEN DE LOS ERRORES: terminar una pendiente sin revisiones tiene DOS problemas; manda el estado y debería salir ErrorEstado, pero ${err}`;
          const pregunta = queTipo(sinComentarios(ctx.leer("src/modelo/taller.js")).replace(/new\s+\w+/g, ""));
          if (pregunta && !/typeof/.test(pregunta)) return `en taller.js preguntas el tipo («${pregunta}»): la regla va en la propia clase (sobrescribe terminar)`;
          return true;
        },
      },
    ],
  },
];

// 💡 Para empezar: lo que enseña el comprobador junto al ejercicio que toca hacer (el primero ⏳).
// Más ayuda, paso a paso (idea → ejemplo parecido → esqueleto), en la web: «🆘 ¿Atascado?» de cada bloque.
export const EMPEZAR = {
  "1.p": "En predicciones.js cambia cada undefined por lo que crees que da. Equivocarse no pasa nada: el comprobador te dice por qué.",
  "1.e1": "Dos objetos con lo mismo dentro NO son ===. Busca en la lista alguno con el mismo id (some).",
  "1.1": "Un objeto nuevo con todo lo del presupuesto ({ ...presupuesto }) y piezas: un array NUEVO de piezas NUEVAS (map + spread).",
  "1.2": "Hay una función del lenguaje que copia todos los niveles, fechas incluidas (apartado 4 de la UD4).",
  "1.3": "map recorre y devuelve. El callback, una flecha que llama al método CON el revisor delante.",
  "2.p": "En predicciones.js cambia cada undefined por lo que crees que da.",
  "2.e1": "Copia la forma del constructor de Mecanico (arriba, en mecanico.js): primero las comprobaciones con throw, luego this.… = ….",
  "2.1": "Como precio en el apartado 7.3: #horas; arriba, get horas() y set horas(valor) que valida y guarda. En el constructor, this.horas = horas.",
  "2.2": "static #ultimoId = 0 en la clase. En el constructor: id = el que te pasan o el siguiente, y el contador sube hasta el mayor (Math.max). Fecha: new Date(…) de lo que te pasen.",
  "2.3": "static desdeLinea(linea): split(\";\"), trim a cada trozo, Number a las horas y return new Reparacion(…).",
  "3.p": "En predicciones.js cambia cada undefined por lo que crees que da.",
  "3.e1": "#estado = \"pendiente\" arriba de la clase, y get estado() que lo devuelve. Sin set.",
  "3.1": "#piezas = [] arriba. anadirPieza llama a this.#validarPieza(nombre, precio) (que lanza si algo no vale) y después hace el push.",
  "3.2": "Una copia del array cuyos elementos sean copias de cada pieza: map + spread.",
  "3.3": "reduce para sumar los precios (empieza en 0), más horas × PRECIO_HORA, y redondea a 2 decimales con Math.round(x * 100) / 100.",
  "4.p": "En predicciones.js cambia cada undefined por lo que crees que da.",
  "4.e1": "get tipo() en Reparacion devuelve \"normal\". ReparacionUrgente extends Reparacion y sobrescribe get tipo().",
  "4.1": "En ReparacionUrgente, get total(): lo del padre (super.total) × 1.3, redondeado. No puedes leer #piezas desde la subclase: no te hace falta.",
  "4.2": "Un objeto vacío como contador: por cada reparación, súmale su total a la casilla de su tipo (?? 0 la primera vez). Redondea al sumar.",
  "4.3": "extends Reparacion. get total(): super.total menos el 20 % de horas × PRECIO_HORA. Y get tipo().",
  "5.p": "En predicciones.js cambia cada undefined por lo que crees que da.",
  "5.e1": "Como ErrorTaller (arriba), pero extends ErrorTaller: super(mensaje, { …datos }) y después this.name = \"…\".",
  "5.1": "asignar: si ya tiene max trabajos → throw new ErrorMecanicoLleno(…); si no, añade reparacion.id al Set. liberar: delete.",
  "5.2": "empezar: si el estado no es \"pendiente\" → throw new ErrorEstado(this.id, this.#estado); si no, cámbialo. terminar, igual desde \"en-taller\".",
  "5.3": "Dos Map privados: id → reparación y nombre → mecánico. nuevaReparacion crea la que toque, la guarda y la devuelve.",
  "5.4": "Primero TODAS las comprobaciones (en el orden del enunciado), luego los cambios. Un tercer Map (id → nombre del mecánico) te ayuda a terminar.",
  "6.1": "Simulacro: como en un examen, primero lee entero lo que pide src/modelo/garantia.js. Empieza por el constructor (super y la validación de meses).",
  "6.2": "Igual que piezas en el bloque 3.",
  "6.3a": "Como anadirPieza: primero todas las comprobaciones, después el push.",
  "6.3b": "Cuenta las ok y divide. El caso sin revisiones va aparte.",
  "6.4": "En taller.js, nuevaReparacion: ¿viene meses? (ojo con el 0).",
  "6.5a": "Como los errores del bloque 5.",
  "6.5b": "Sobrescribe terminar() en ReparacionGarantia: comprueba la regla y, si se cumple, deja que el padre haga el resto (super.terminar()).",
  "6.6a": "Si la regla está en la clase, taller.terminar la cumple solo… siempre que llame a terminar ANTES de liberar al mecánico.",
  "6.6b": "¿Qué comprueba primero tu terminar? Lee el orden que pide el enunciado.",
};
