// red.js — Bloque C · ✍️ C2. Pedir un JSON con fetch y async/await, sin fiarse de nada.

// ✍️ C2 · async obtenerJSON(url, fetchFn = fetch) → el JSON ya convertido
//   - const respuesta = await fetchFn(url)
//   - Si !respuesta.ok → lanza un Error con el código (respuesta.status) Y la url en el mensaje
//   - Si la cabecera content-type no incluye "application/json" → lanza un Error con la url
//     (Vite devuelve su index.html, con un 200, cuando el fichero no existe)
//   - Si todo va bien, devuelve respuesta.json()
//   - Los errores de red (sin conexión) NO se capturan aquí: que le lleguen a quien llama
export async function obtenerJSON(url, fetchFn = fetch) {
  const respuesta = await fetchFn(url)
  // si la respuesta no es ok lanza error dando el status y la url 
  if (!respuesta.ok) {
    throw new Error(` Respuesta: ${respuesta.status} | URL: ${url}`)
  }

  // lee la cabecera respuesta.headers(cabecera).get(conseguir)("content-type") en vez de content-type se puede sacar más info
  const tipo = respuesta.headers.get("content-type")
  
  // Si la cabecera content-type no incluye
  if (!tipo?.includes("application/json")) {
    // lanzamos un error con la url (cuado en la url se esperaba un json)
    throw new Error(`Url invalida, se esperaba un json (url): ${url}`)
  }

  // si pasa todo, devolvemos respuesta.json()
  return respuesta.json()
}
