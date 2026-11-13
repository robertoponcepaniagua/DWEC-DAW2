// formulario.js — Bloque B · 👀 leerFormulario (RESUELTO) y ✍️ B2 (mostrarErrores).

// 👀 Resuelto. Del formulario TODO llega como texto: aquí se limpia y se convierte.
/**
 * Lee el formulario de alta y devuelve los datos LIMPIOS para el modelo:
 * { titulo, prioridad, limite, cadaDias }. Texto sin espacios de más, limite "AAAA-MM-DD" o null,
 * cadaDias un número o undefined (si está vacío).
 */
export function leerFormulario(form) {
  const campos = Object.fromEntries(new FormData(form));
  const datos = {
    titulo: (campos.titulo ?? "").trim(),
    prioridad: campos.prioridad,
    limite: campos.limite ? campos.limite : null,
  };
  if (campos.cadaDias?.trim()) datos.cadaDias = Number(campos.cadaDias);
  return datos;
}

// ✍️ B2 · mostrarErrores(form, errores)   errores = { campo: "mensaje" }
//   - Recorre los <p data-error-de="campo"> del formulario (querySelectorAll)
//   - Si ese campo tiene error: el mensaje en el <p> y aria-invalid="true" en el control
//     (el control es form.elements[campo])
//   - Si no lo tiene: <p> vacío y SIN aria-invalid (removeAttribute)
//   Pista: p.dataset.errorDe es el nombre del campo (data-error-de → dataset.errorDe)
export function mostrarErrores(form, errores) {
  // busca dentro del formulario, y devuelve una colección de elementos HTML
  const parrafos = form.querySelectorAll("[data-error-de]")

  for (const parrafo of parrafos) {
    // nombre campo obtiene los nombres de los campos (email, nombre...)
    let nombre_campo = parrafo.dataset.errorDe
    const input = form.elements[nombre_campo];
    // SI EN EL OBJETO ERRORES DEVUELVE ALGO CON ERRORES[NOMBRE_CAMPO] ES TRUE Y SI NO ES FALSE
    if (errores[nombre_campo]) {
      parrafo.textContent = errores[nombre_campo];
      input.setAttribute("aria-invalid", "true")
    } else {
      // vaciar el campo
      parrafo.textContent = "";
      // Si no tiene error dejar p vacío y sin aria-invalid
      input.removeAttribute("aria-invalid")
    }
  }
}
