// Bloque 2 · Crear nodos sin XSS y pintar desde el modelo
// Explicación: web de DWEC → Practicar → UD 5.2 · Repaso para el Parcial 2 → Bloque 2 (y los apartados 6, 7 y 8 de la UD5).
// Comprueba con:  docker compose run --rm web npm run comprobar 2
//
// Aquí el HTML ya no está escrito: lo creas tú desde el modelo (las reparaciones de src/modelo).
// Una tarjeta tiene que quedar así (sin espacios ni saltos de línea entre etiquetas):
//   <li class="reparacion urgente estado-en-taller" data-id="2" data-estado="en-taller">
//     <h3 class="cliente">Luis</h3>
//     <p class="bici">BH Ultimate</p>
//     <p class="tipo">urgente</p>
//     <p class="total">48.75 €</p>
//     <p class="estado">en-taller</p>
//     <button type="button" data-accion="terminar"><span class="icono">✅</span> Terminar</button>
//   </li>

// 👀 EJEMPLO RESUELTO ─────────────────────────────────────────────────────────
// Un botón con su acción, un icono y un texto:
//   <button type="button" data-accion="empezar"><span class="icono">🔧</span> Empezar</button>
// Todo con createElement y textContent: aunque el texto trajera etiquetas, se vería como texto.
export function crearBoton(accion, icono, texto) {
  const boton = document.createElement("button");
  boton.type = "button";
  boton.dataset.accion = accion;
  const span = document.createElement("span");
  span.className = "icono";
  span.textContent = icono;
  boton.append(span, ` ${texto}`);
  return boton;
}

// 🪜 ESCALERA ──────────────────────────────────────────────────────────────────
// 🪜 1 · Un párrafo con esa clase y ese texto: crearDato("bici", "Orbea") → <p class="bici">Orbea</p>
export function crearDato(clase, texto) {
  // creamos el parrafo con document.createElemet
  const p = document.createElement("p")
  // le añadimos la clase bici
  p.classList.add(clase)
  // le cambiamos el texto
  p.textContent = texto

  // devolvemos el html
  return p
}

// ✍️ TU TURNO ─────────────────────────────────────────────────────────────────
// ✍️ 1 · La tarjeta de una reparación, como la de arriba:
//        - clases: reparacion, urgente (solo si su tipo es "urgente") y estado-<su estado>;
//        - data-id y data-estado;
//        - h3.cliente, p.bici, p.tipo, p.total (el total con 2 decimales y « €») y p.estado;
//        - el botón según el estado (usa crearBoton):
//            «pendiente» → crearBoton("empezar", "🔧", "Empezar")
//            «en-taller» → crearBoton("terminar", "✅", "Terminar")
//            «lista»     → ninguno
//        ¡Ojo! El cliente y la bici los escribe la gente en un formulario: nada de innerHTML con ellos.
export function crearTarjeta(reparacion) {
  // reparación es una clase, viene explicado al principio del fichero
    
  // guardamos todos los datos para convertirlo a html
  const reparacion_estado = reparacion.estado
  const reparacion_tipo = reparacion.tipo
  const reparacion_id = reparacion.id
  const reparacion_cliente = reparacion.cliente
  const reparacion_bici = reparacion.bici
  const reparacion_total = reparacion.total

  // creamos el li
  const li = document.createElement("li")

  li.classList.add("reparacion", `estado-${reparacion_estado}`)

    li.dataset.id = reparacion_id
    li.dataset.estado = reparacion_estado

  // si reparación es urgente:
  if (reparacion_tipo === "urgente") {
    // añadimos la clase urgente
    li.classList.add("urgente")
  }

  // creamos el h3
  const h3 = document.createElement("h3")
  h3.classList.add("cliente")
  h3.textContent = reparacion_cliente
  // lo metemos dentro de li
  li.append(h3)

  // Creamos el párrafo de la bicicleta
  const p_bici = document.createElement("p");
  p_bici.classList.add("bici");
  p_bici.textContent = reparacion_bici;
  li.append(p_bici);

  // Creamos el párrafo del tipo
  const p_tipo = document.createElement("p");
  p_tipo.classList.add("tipo");
  p_tipo.textContent = reparacion_tipo;
  li.append(p_tipo);

  // Creamos el párrafo del total
  const p_total = document.createElement("p");
  p_total.classList.add("total");
  p_total.textContent = `${reparacion_total.toFixed(2)} €`;
  li.append(p_total);

  // Creamos el párrafo del estado
  const p_estado = document.createElement("p");
  p_estado.classList.add("estado");
  p_estado.textContent = reparacion_estado;
  li.append(p_estado);

  if (reparacion_estado === "pendiente") {
    const button = crearBoton("empezar", "🔧", "Empezar")
    li.append(button)
  } else if (reparacion_estado === "en-taller") {
    const button = crearBoton("terminar", "✅", "Terminar")
    li.append(button)
  }
  return li
}

// ✍️ 2 · Pinta la lista desde el modelo. Cada vez que se llama, la lista queda SOLO con estas tarjetas
//        (llamarla dos veces no duplica nada) y en este orden:
//          primero las urgentes y después las normales; dentro de cada grupo, por fecha de entrada
//          (la más antigua primero).
//        No cambies el array que te pasan (puede ser el del taller). Si está vacío, la lista tiene un
//        único <li class="vacio">No hay reparaciones</li>.
export function pintarLista(lista, reparaciones) {

  // ordenamos la lista antes de meterlo en la lista

  const repraciones_ordenadas = [...reparaciones].sort((a, b) => {
    // sacamos los tipos de los 2
    const a_tipo = a.tipo
    const b_tipo = b.tipo 

    const a_fecha = a.entrada
    const b_fecha = b.entrada

    // si los tipos son iguales también comparamos por la fecha
    if (a.tipo === b.tipo) {
      if (a.fecha < b.fecha) {
        return -1
      } else if (b.fecha < a.fecha) {
        return 1
      } else {
        return 0
      }
    } else {
      // si los tipos no son iguales miramos cual es el tipo más urgente

      if (a.tipo === "urgente") {
        return -1
      } else {
        return 1
      }
    }
  })


  // si la lista de reparaciones está vacía hacemos lo que nos piden
  if (reparaciones.length === 0) {
    const li = document.createElement("li")
    li.classList.add("vacio")
    li.textContent = "No hay reparaciones";
    lista.append(li)
    return lista
  }

  for (const reparacion of repraciones_ordenadas) {
    const tarjeta = crearTarjeta(reparacion)
    lista.append(tarjeta)
  }

  return lista
}
