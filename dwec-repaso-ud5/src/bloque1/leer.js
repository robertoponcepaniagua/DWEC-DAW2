// Bloque 1 · Seleccionar, leer y modificar
// Explicación: web de DWEC → Practicar → UD 5.2 · Repaso para el Parcial 2 → Bloque 1 (y los apartados 3, 4 y 5 de la UD5).
// Comprueba con:  docker compose run --rm web npm run comprobar 1
//
// La página de este bloque ya está pintada (no la creas tú: la lees y la cambias):
//   <ul id="reparaciones">
//     <li class="reparacion estado-pendiente" data-id="1" data-estado="pendiente" data-horas="2">
//       <h3 class="cliente">Ana</h3> <p class="bici">Orbea Alma</p> …
//       <button type="button" data-accion="empezar"><span class="icono">🔧</span> Empezar</button>
//     </li>
//     <li class="reparacion urgente estado-en-taller" data-id="2" data-estado="en-taller" data-horas="1.5"> … </li>
//     …
//   </ul>

// 👀 EJEMPLO RESUELTO ─────────────────────────────────────────────────────────
// Los nombres de los clientes con reparaciones en ese estado, en el orden de la página.
// querySelectorAll da una NodeList: con [...] se pasa a array para poder usar map.
export function clientes(raiz, estado) {
  const titulos = raiz.querySelectorAll(`.reparacion[data-estado="${estado}"] .cliente`);
  return [...titulos].map((h3) => h3.textContent);
}

// 🪜 ESCALERA ──────────────────────────────────────────────────────────────────
// 🪜 1 · Cuántas reparaciones urgentes hay (las que tienen la clase urgente).
export function contarUrgentes(raiz) {
  const total = raiz.querySelectorAll(".urgente")
  return total.length
}

// 🪜 2 · Desde CUALQUIER elemento de dentro de una tarjeta (el botón, el span del botón, el h3…),
//        el id de su reparación, como NÚMERO. Si el elemento no está dentro de ninguna tarjeta, null.
export function idDe(elemento) {
  const reparacion = elemento.closest(".reparacion")
  if (reparacion === null) {
    return null
  }
  return Number(reparacion.dataset.id)
}

// ✍️ TU TURNO ─────────────────────────────────────────────────────────────────
// ✍️ 1 · La suma de las horas (data-horas) de las reparaciones «pendiente». Con la página de ejemplo, 2.5.
export function horasPendientes(raiz) {
  // con esto tengo el dom de todos los pendientes
  const pendientes = raiz.querySelectorAll(".reparacion.estado-pendiente")
  // ahora de los pendientes tengo que sacar el data-horas por separado
  let horas = 0
  for (const pendiente of pendientes) {
    horas += Number(pendiente.dataset.horas)
  }
  return horas
}

// ✍️ 2 · Cambia el estado de una tarjeta y devuelve el que tenía.
//        - data-estado pasa a ser el nuevo estado;
//        - de las clases estado-pendiente, estado-en-taller y estado-lista, solo queda la del estado nuevo;
//        - las demás clases (reparacion, urgente…) no se tocan.
//        marcarEstado(tarjeta, "lista") → "pendiente"   (si la tarjeta estaba pendiente)

export function marcarEstado(tarjeta, estado) {
  // en la tarjeta que nos pasan guardamos el estado que tenía para después devolverlo
  // antes de devolver el estado viejo hay que cambiar el viejo por el nuevo
  const estado_antes = tarjeta.dataset.estado
  // ya tengo el estado anterior
  tarjeta.dataset.estado = estado

  // las clases estado-pendiente, estado-en-taller y estado-lista hay que eliminarlas o por lo menos eso he entendido
  tarjeta.classList.remove("estado-pendiente", "estado-en-taller", "estado-lista")

  // añadir nueva clase de estado
  tarjeta.classList.add(`estado-${estado}`)

  // devolver estado anterior
  return estado_antes
}

// ➕ OPCIONAL (para ir a por nota) · Recorre el árbol hacia abajo: el id (número) de la SIGUIENTE tarjeta que tiene el mismo estado
//        que esta, o null si no hay ninguna más abajo. Solo mira las que van después, no las de antes.
export function siguienteIgual(tarjeta) {
  // para recorrer el árbol hacía abajo es con querySelector, hacía arriba es con closest
  // para buscar elementos que coinciden en tener el mismo data-estado por ejemplo se puede utilizar nextElementSibling

  // nextElementSibling sirve para buscar los hermanos por así decirlo

  // guardamos el estado de la tarjeta recibida
  const estado_tarjeta_recibida = tarjeta.dataset.estado

  // buscamos los hermamos de la tarjeta
  // declaramos con let porque pueden haber más tarjetas hermanas
  let tarjeta_hermana = tarjeta.nextElementSibling

  // cuando no quedan más nextElementSibling devuelve null, voy a utilizar un bucle while tarjeta_hermana != null, si da null para
  while (tarjeta_hermana !== null) {
    // obtenemos el primer hermano
    let tarjeta_hermana = tarjeta.nextElementSibling;
    // recorremos los hermanos mientras existan
    while (tarjeta_hermana !== null) {
        const estado_tarjeta_hermana = tarjeta_hermana.dataset.estado;
        // si tienen el mismo estado, devolvemos su ID
        if (estado_tarjeta_hermana === estado_tarjeta_recibida) {
            return Number(tarjeta_hermana.dataset.id);
        }
        // avanzamos al siguiente hermano
        tarjeta_hermana = tarjeta_hermana.nextElementSibling;
    }
    // no hemos encontrado ninguna coincidencia
    return null;
  }
}
