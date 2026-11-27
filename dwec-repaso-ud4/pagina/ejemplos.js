// ejemplos.js — Qué enseña la página en cada bloque. No hace falta tocarlo.
//   modulos:  los ficheros del bloque. Todo lo que exportan queda en la consola (F12) con su nombre.
//   ejemplos: código que la página ejecuta con TUS clases y funciones; «espera» es lo que debería salir.
//             Si espera es "💥", lo correcto es que lance un error.
// El comprobador (docker compose run --rm web npm run comprobar N) prueba muchos más casos: esto es para VER y DEPURAR.
const ficheros = import.meta.glob("../src/**/*.js");
const cargar = (ruta) => ficheros[`../src/${ruta}`]();

const MODELO = ["modelo/errores.js", "modelo/reparacion.js", "modelo/mecanico.js", "modelo/taller.js", "modelo/garantia.js"];

export const BLOQUES = [
  {
    n: 1,
    titulo: "Objetos, this y referencias",
    modulos: ["bloque1/referencias.js"],
    ejemplos: [
      { codigo: 'const a = crearAvisador("La Cadena");\na.avisarTodos(["frenos", "cadena"]);\na.avisos', espera: '["La Cadena: frenos", "La Cadena: cadena"]', tipo: "👀" },
      { codigo: "const lista = [{ id: 1 }, { id: 2 }];\nestaEnLista(lista, { id: 2 })", espera: "true" },
      {
        codigo: 'const p = { cliente: "Ana", piezas: [{ nombre: "Cadena", precio: 19.99 }] };\nconst r = rebajar(p, 10);\n[p.piezas[0].precio, r.piezas[0].precio]',
        espera: "[19.99, 17.99]",
      },
      {
        codigo: 'const f = { cliente: "Ana", bici: { marca: "Orbea" }, entrada: new Date(2026, 10, 20), notas: [] };\nconst c = copiarFicha(f);\nc.bici.marca = "BH";\nc.entrada.setDate(25);\n[f.bici.marca, f.entrada.getDate(), c.entrada instanceof Date]',
        espera: '["Orbea", 20, true]',
      },
      {
        codigo: 'const rosa = { nombre: "Rosa", hechas: 0, revisar(r) { this.hechas++; return this.nombre + " revisa " + r.bici; } };\nrevisarTodas([{ bici: "Orbea" }, { bici: "BH" }], rosa)',
        espera: '["Rosa revisa Orbea", "Rosa revisa BH"]',
      },
    ],
  },
  {
    n: 2,
    titulo: "Clases: validar, getters/setters y static",
    modulos: ["modelo/reparacion.js", "modelo/mecanico.js"],
    ejemplos: [
      { codigo: 'new Mecanico(" Rosa ", 3)', espera: 'Mecanico { nombre: "Rosa", max: 3 }', tipo: "👀" },
      { codigo: 'new Mecanico("Rosa", 0)', espera: "💥", tipo: "👀" },
      { codigo: 'const r = new Reparacion("  Ana ", " Orbea ", 2);\n[r.cliente, r.bici, r.horas]', espera: '["Ana", "Orbea", 2]' },
      { codigo: 'new Reparacion("", "Orbea", 2)', espera: "💥" },
      { codigo: 'new Reparacion("Ana", "Orbea", 0)', espera: "💥" },
      { codigo: 'const r = new Reparacion("Ana", "Orbea", 2);\ntry { r.horas = -1; } catch {}\nr.horas', espera: "2" },
      { codigo: 'const a = new Reparacion("Ana", "Orbea", 1);\nconst b = new Reparacion("Luis", "BH", 1);\nb.id - a.id', espera: "1" },
      { codigo: 'new Reparacion("Eva", "Trek", 1, { id: 900 });\nnew Reparacion("Eva", "Trek", 1).id', espera: "901" },
      { codigo: 'const r = Reparacion.desdeLinea("Ana; Orbea Alma; 1.5");\n[r.cliente, r.bici, r.horas]', espera: '["Ana", "Orbea Alma", 1.5]' },
    ],
  },
  {
    n: 3,
    titulo: "Encapsulación: #privados y copias",
    modulos: ["modelo/reparacion.js", "modelo/mecanico.js"],
    ejemplos: [
      { codigo: 'const m = new Mecanico("Rosa", 2);\nm.trabajos.push(99);\n[m.trabajos, m.libres]', espera: "[[], 2]", tipo: "👀" },
      { codigo: 'new Reparacion("Ana", "Orbea", 2).estado', espera: '"pendiente"' },
      { codigo: 'const r = new Reparacion("Ana", "Orbea", 2);\nr.anadirPieza(" Cadena ", 19.99);\nr.piezas', espera: '[{ nombre: "Cadena", precio: 19.99 }]' },
      { codigo: 'new Reparacion("Ana", "Orbea", 2).anadirPieza("Freno", -5)', espera: "💥" },
      { codigo: 'const r = new Reparacion("Ana", "Orbea", 2);\nr.anadirPieza("Cadena", 19.99);\nr.piezas[0].precio = 0;\nr.piezas[0].precio', espera: "19.99" },
      { codigo: 'const r = new Reparacion("Luis", "BH", 0.5);\nr.anadirPieza("Radio", 10.1);\nr.anadirPieza("Tapón", 0.2);\nr.total', espera: "22.8" },
    ],
  },
  {
    n: 4,
    titulo: "Herencia y polimorfismo",
    modulos: ["modelo/reparacion.js", "bloque4/polimorfismo.js"],
    ejemplos: [
      { codigo: 'describir({ id: 7, cliente: "Ana", bici: "Orbea", tipo: "urgente", total: 65 })', espera: '"#7 Ana · Orbea · urgente · 65 €"', tipo: "👀" },
      { codigo: 'const u = new ReparacionUrgente("Luis", "BH", 2);\n[u.tipo, u.total, u instanceof Reparacion]', espera: '["urgente", 65, true]' },
      { codigo: 'const u = new ReparacionUrgente("Luis", "BH", 2);\nu.anadirPieza("Cadena", 10);\nu.total', espera: "78" },
      { codigo: 'const s = new ReparacionSocio("Ana", "Orbea", 2);\ns.anadirPieza("Cadena", 10);\n[s.tipo, s.total]', espera: '["socio", 50]' },
      {
        codigo: 'facturaPorTipo([new Reparacion("Ana", "Orbea", 2), new ReparacionUrgente("Luis", "BH", 2), new ReparacionSocio("Eva", "Trek", 2)])',
        espera: "{ normal: 50, urgente: 65, socio: 40 }",
      },
    ],
  },
  {
    n: 5,
    titulo: "Composición y errores propios",
    modulos: MODELO,
    ejemplos: [
      { codigo: 'const e = new ErrorTaller("No hay sitio", { id: 1 });\n[e.name, e.datos.id, e instanceof Error]', espera: '["ErrorTaller", 1, true]', tipo: "👀" },
      { codigo: 'const e = new ErrorEstado(7, "lista");\n[e.name, e.datos, e instanceof ErrorTaller]', espera: '["ErrorEstado", { id: 7, estado: "lista" }, true]' },
      { codigo: 'const m = new Mecanico("Rosa", 1);\nm.asignar({ id: 1 });\nm.asignar({ id: 2 })', espera: "💥" },
      { codigo: 'const r = new Reparacion("Ana", "Orbea", 2);\nr.empezar();\nr.terminar();\nr.estado', espera: '"lista"' },
      { codigo: 'new Reparacion("Ana", "Orbea", 2).terminar()', espera: "💥" },
      {
        codigo: 'const t = new Taller();\nt.contratar("Rosa", 1);\nconst a = t.nuevaReparacion({ cliente: "Ana", bici: "Orbea", horas: 2 });\nconst b = t.nuevaReparacion({ cliente: "Luis", bici: "BH", horas: 1 });\nt.asignar(a.id, "Rosa");\ntry { t.asignar(b.id, "Rosa"); } catch (e) { console.info(e.name); }\n[a.estado, b.estado]',
        espera: '["en-taller", "pendiente"]',
      },
      {
        codigo: 'const t = new Taller();\nt.contratar("Rosa", 2);\nconst a = t.nuevaReparacion({ cliente: "Ana", bici: "Orbea", horas: 2 });\nconst u = t.nuevaReparacion({ cliente: "Luis", bici: "BH", horas: 2, urgente: true });\nt.asignar(a.id, "Rosa");\nt.asignar(u.id, "Rosa");\nt.terminar(a.id);\nt.terminar(u.id);\nt.facturacion',
        espera: "115",
      },
    ],
  },
  {
    n: 6,
    titulo: "Simulacro: la reparación en garantía",
    modulos: MODELO,
    ejemplos: [
      { codigo: 'const g = new ReparacionGarantia("Ana", "Orbea", 1, 6);\ng.anadirPieza("Cadena", 20);\n[g.tipo, g.total, g.meses]', espera: '["garantia", 0, 6]' },
      { codigo: 'new ReparacionGarantia("Ana", "Orbea", 1, 30)', espera: "💥" },
      { codigo: 'const g = new ReparacionGarantia("Ana", "Orbea", 1, 6);\ng.revisar("Frenos", true);\ng.revisar("Cadena", true);\ng.revisar("Luces", false);\n[g.revisiones.length, g.porcentajeOk]', espera: "[3, 67]" },
      {
        codigo: 'const t = new Taller();\nconst rosa = t.contratar("Rosa", 1);\nconst g = t.nuevaReparacion({ cliente: "Ana", bici: "Orbea", horas: 1, meses: 6 });\nt.asignar(g.id, "Rosa");\ng.revisar("Frenos", true);\ntry { t.terminar(g.id); } catch (e) { console.info(e.name, e.datos); }\n[g.estado, rosa.libres]',
        espera: '["en-taller", 0]',
      },
    ],
  },
];

export async function cargarBloque(bloque) {
  const modulos = await Promise.all(bloque.modulos.map(cargar));
  return Object.assign({}, ...modulos);
}

// Las predicciones: el texto de predicciones.js (para leer las expresiones) y tus respuestas
const textos = import.meta.glob("../src/bloque*/predicciones.js", { query: "?raw", import: "default" });
export async function cargarPredicciones(n) {
  const ruta = `../src/bloque${n}/predicciones.js`;
  if (!textos[ruta]) return [];
  const [texto, modulo] = await Promise.all([textos[ruta](), ficheros[ruta]()]);
  return [...texto.matchAll(/^\s*(p\d+):.*?\/\/\s*(.+)$/gm)].map(([, clave, expresion]) => ({
    clave,
    expresion: expresion.trim(),
    tuya: modulo.predicciones?.[clave],
  }));
}
