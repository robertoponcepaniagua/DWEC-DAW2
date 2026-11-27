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
  throw new Error("Sin hacer");
}

// 🪜 2 · Desde CUALQUIER elemento de dentro de una tarjeta (el botón, el span del botón, el h3…),
//        el id de su reparación, como NÚMERO. Si el elemento no está dentro de ninguna tarjeta, null.
export function idDe(elemento) {
  throw new Error("Sin hacer");
}

// ✍️ TU TURNO ─────────────────────────────────────────────────────────────────
// ✍️ 1 · La suma de las horas (data-horas) de las reparaciones «pendiente». Con la página de ejemplo, 2.5.
export function horasPendientes(raiz) {
  throw new Error("Sin hacer");
}

// ✍️ 2 · Cambia el estado de una tarjeta y devuelve el que tenía.
//        - data-estado pasa a ser el nuevo estado;
//        - de las clases estado-pendiente, estado-en-taller y estado-lista, solo queda la del estado nuevo;
//        - las demás clases (reparacion, urgente…) no se tocan.
//        marcarEstado(tarjeta, "lista") → "pendiente"   (si la tarjeta estaba pendiente)
export function marcarEstado(tarjeta, estado) {
  throw new Error("Sin hacer");
}

// ➕ OPCIONAL (para ir a por nota) · Recorre el árbol hacia abajo: el id (número) de la SIGUIENTE tarjeta que tiene el mismo estado
//        que esta, o null si no hay ninguna más abajo. Solo mira las que van después, no las de antes.
export function siguienteIgual(tarjeta) {
  throw new Error("Sin hacer");
}
