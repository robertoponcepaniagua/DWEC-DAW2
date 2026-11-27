// empezar.mjs — Empezar en el bloque que quieras: docker compose run --rm web npm run empezar N
// Pone en src/modelo/ lo de los bloques anteriores ya hecho (bases/bloqueN). Antes guarda lo tuyo en copias/.
import { cpSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const n = process.argv[2];
const base = join(raiz, "bases", `bloque${n}`);

if (!n || n === "1") {
  console.log("El bloque 1 no necesita base: sus ejercicios están en src/bloque1/ y no dependen de nada. ¡Empieza cuando quieras!");
  process.exit(0);
}
if (!existsSync(base)) {
  console.log(`No hay base para «${n}». Puedes empezar en los bloques 2, 3, 4, 5 o 6 (el 1 no la necesita).`);
  process.exit(1);
}

let copia = join(raiz, "copias", `antes-del-bloque-${n}`);
for (let i = 2; existsSync(copia); i++) copia = join(raiz, "copias", `antes-del-bloque-${n}-${i}`);
cpSync(join(raiz, "src", "modelo"), copia, { recursive: true });
cpSync(base, join(raiz, "src", "modelo"), { recursive: true });

console.log(`✔ src/modelo/ queda como al empezar el bloque ${n}: lo de los bloques anteriores, hecho; lo demás, sin hacer.`);
console.log(`  Lo que tenías está guardado en ${copia.replace(raiz + "/", "")}/. Ahora: docker compose run --rm web npm run comprobar ${n}`);
