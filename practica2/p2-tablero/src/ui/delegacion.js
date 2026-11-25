// delegacion.js — Bloque B · ✍️ B3 (delegar).

// ✍️ B3 · delegar(contenedor, tipo, selector, manejador)
//   - UN solo addEventListener, en el contenedor (no en cada botón)
//   - Dentro: el elemento que encaja es evento.target.closest(selector). Si lo hay y está DENTRO
//     del contenedor (contenedor.contains(...)), llama a manejador(elemento, evento)
//   - Devuelve una función que quita el listener (removeEventListener con la MISMA función)
export function delegar(contenedor, tipo, selector, manejador) {
    // función que se ejecutará cuando ocurra el evento
    const funcion = (evento) => {

        // buscar el elemento más cercano que coincida con el selector
        const elemento = evento.target.closest(selector);

        // si no existe nos vamos
        if (!elemento) {
            return;
        }

        // Si pertenece al contenedor, ejecutar el manejador
        if (contenedor.contains(elemento)) {
            manejador(elemento, evento);
        }
    };
    // registrar el evento
    contenedor.addEventListener(tipo, funcion);

  // devolvemos una funciíon que permite eliminar el evento
  return () => {
    contenedor.removeEventListener(tipo,funcion);
  }
}


// contenedor = Elemento HTML donde se escuchan los eventos.
// tipo = Tipo de evento que queremos escuchar ("click", "change", "input"...).
// selector = Selector CSS del elemento que queremos detectar (".eliminar", "#boton"...).
// manejador = Función que se ejecuta cuando el elemento cumple las condiciones.