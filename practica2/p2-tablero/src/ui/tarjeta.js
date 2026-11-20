// tarjeta.js — Bloque B · 👀 EJEMPLO RESUELTO (crearTarjeta) y ✍️ B1 (pintarLista).
import { formatear } from "../modelo/fechas.js";

/** Tarea → <article class="tarjeta tarjeta--alta" data-id="3"> con su título y su límite */
export function crearTarjeta(tarea, hoy = new Date()) {
  const tarjeta = document.createElement("article");
  tarjeta.classList.add("tarjeta", `tarjeta--${tarea.prioridad}`);
  tarjeta.classList.toggle("tarjeta--vencida", tarea.estaVencida(hoy));
  tarjeta.dataset.id = tarea.id; // en el HTML: data-id="3" (siempre texto)

  const titulo = document.createElement("h3");
  titulo.textContent = tarea.titulo; // textContent, NUNCA innerHTML con lo que escribe el usuario
  tarjeta.append(titulo);

  if (tarea.limite) {
    const limite = document.createElement("p");
    limite.className = "tarjeta__limite";
    limite.textContent = `Límite: ${formatear(tarea.limite)}`;
    tarjeta.append(limite);
  }
  return tarjeta;
}

// ✍️ B1 · pintarLista(contenedor, tareas, hoy = new Date())
//   - Vacía el contenedor y pone una tarjeta por tarea (usa crearTarjeta), en el mismo orden.
//   - Pintar dos veces NO puede duplicar: primero vacía. Pista: contenedor.replaceChildren(...)
//   - Sin tareas: deja SOLO un <p class="vacia">Sin tareas</p>
export function pintarLista(contenedor, tareas, hoy = new Date()) {
  // Para vaciar el contenedor
  contenedor.replaceChildren();

  // Si no hay tareas mostrar un mensaje
  if (tareas.length === 0) {
    // Sin tareas: deja SOLO un <p class="vacia">Sin tareas</p>
    // creo el elemento
    const elemento = document.createElement("p");
    // creo la clase en el elemento
    elemento.className = "vacia";
    // metemos el contexto (lo que se ve en el html)
    elemento.textContent = "Sin tareas";

    // lo metemos en el contendor
    contenedor.append(elemento);
    return;
  }
  
  // un for of ya que hay que crear la tarjeta una a una
  for (const tarea of tareas) {
    // Utilizo la función indicada
    const tarjeta = crearTarjeta(tarea, hoy);
    contenedor.append(tarjeta);
  }
}
