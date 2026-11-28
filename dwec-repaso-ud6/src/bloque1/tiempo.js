// Bloque 1 · El event loop y los temporizadores
// Explicación: web de DWEC → Practicar → UD 6.2 · Repaso para el Parcial 2 → Bloque 1 (y el apartado 2 de la UD6).
// Comprueba con:  docker compose run --rm web npm run comprobar 1

// 👀 EJEMPLO RESUELTO ─────────────────────────────────────────────────────────
// setTimeout no devuelve una promesa: se «envuelve» en una. resolve se llama cuando salta el temporizador.
export function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 🪜 ESCALERA ──────────────────────────────────────────────────────────────────
// 🪜 1 · Una promesa que, pasados `ms` milisegundos, se cumple con el texto del aviso de recogida:
//        avisoDeRecogida({ cliente: "Ana", bici: "BH" }, 50) → (a los 50 ms) "Ana: tu BH está lista"
export function avisoDeRecogida(reparacion, ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`${reparacion.cliente}: tu ${reparacion.bici} está lista`)
    }, ms)
  })
}

// ✍️ TU TURNO ─────────────────────────────────────────────────────────────────
// ✍️ 1 · Programa los avisos del día. Cada aviso es { ms, texto }: a los `ms` milisegundos se escribe su texto con
//        console.log. Devuelve una promesa que se cumple, cuando han salido TODOS, con los textos en el orden en que
//        han salido (que no tiene por qué ser el del array).
//        programarAvisos([{ ms: 60, texto: "B" }, { ms: 20, texto: "A" }]) → escribe A, luego B → se cumple con ["A", "B"]
export function programarAvisos(avisos) {
  const antes = []
  const despues = []

  for (const aviso of avisos) {
    antes.push(new Promise((resolve) => 
    setTimeout(() => {
      despues.push(aviso.texto) //metemos en después las promesas
      resolve() //resolvemos las promesas
    },aviso.ms)))
  }

  // Esperamos a que TODAS las promesas se cumplan.
   // Cuando terminan, devolvemos el array de textos.
  return Promise.all(antes).then(() => despues)
}

// ✍️ 2 · Un aviso que se puede cancelar. Devuelve un objeto { promesa, cancelar }:
//        - promesa: se cumple con `valor` a los `ms` milisegundos;
//        - cancelar(): para el temporizador (clearTimeout) y la promesa se RECHAZA con new Error("Cancelado").
//          Si ya se había cumplido, cancelar() no hace nada.
export function cancelable(ms, valor) {
  let temporizador;
  let rechazar;
  const promesa = new Promise((resolve, reject) => {
    // guardamos el identidicador del temporizador
    rechazar = reject
    temporizador = setTimeout(() => {
      resolve(valor)
    }, ms)
  })
  return {
    "promesa": promesa,
    "cancelar": () => {
      if (temporizador !== ms) {
        // le quitamos el tiempo
        clearTimeout(temporizador)
        //la rechazamos
        reject(rechazar);
      }
    }
  }  
}
