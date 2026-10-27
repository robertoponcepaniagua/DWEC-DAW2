// Bloque 1 · Objetos literales, this, referencias y copias
// Explicación: web de DWEC → UD4 · 4.1 Batería de ejercicios → Bloque 1 (y los apartados 2–5 de la UD4).
// Comprueba con:  ./bateria.sh comprobar 1

// 👀 EJEMPLO RESUELTO ─────────────────────────────────────────────────────────
// Un libro como objeto literal. El método resumen() usa this: «el objeto con el que se llama».
export function crearLibro(titulo, autor, paginas) {
  return {
    titulo,
    autor,
    paginas,
    prestado: false,
    resumen() {
      return `${this.titulo} (${this.autor}), ${this.paginas} págs.`;
    },
  };
}

// 🪜 ESCALERA ──────────────────────────────────────────────────────────────────
// 🪜 1 · Devuelve el valor de la propiedad cuyo nombre está en `clave`.
//        leerPropiedad({ a: 1, "b c": 2 }, "b c") → 2      (pista: con punto no se puede; con corchetes, sí)
export function leerPropiedad(objeto, clave) {
  return objeto[clave]
}

// 🪜 2 · ¿Tiene el objeto esa propiedad COMO PROPIA (no heredada)?
//        tienePropia({ a: 1 }, "a") → true · tienePropia({ a: 1 }, "toString") → false
export function tienePropia(objeto, clave) {
  return Object.hasOwn(objeto, clave) 
}

// ✍️ TU TURNO ─────────────────────────────────────────────────────────────────
// ✍️ 1 · Devuelve un libro NUEVO igual que el que te pasan, pero con prestado: true.
//        El original NO puede cambiar (el comprobador te lo pasa congelado).
export function marcarPrestado(libro) {
  const libro_copia = {...libro}

  libro_copia.prestado = true

  return libro_copia
}

// ✍️ 2 · Cuenta cuántos libros hay de cada autor.
//        contarPorAutor([{ autor: "Ende" }, { autor: "Tolkien" }, { autor: "Ende" }]) → { Ende: 2, Tolkien: 1 }
export function contarPorAutor(libros) {
  return [...libros].
    reduce((acc, libro) => {
      let autor = libro.autor

      if (!acc[autor]) {
        acc[autor] = 0
      }

      acc[autor] += 1

      return acc
    },{})
}

// ✍️ 3 · Copia un socio de forma que cambiar la COPIA no cambie nunca el ORIGINAL.
//        socio = { nombre: "Ana", direccion: { ciudad: "Cádiz" }, prestamos: ["111"] }
//        Cuidado: { ...socio } no basta. ¿Por qué? (predicción p3)
export function copiaProfunda(socio) {
  const socio_copia = {...socio, direccion: {...socio.direccion}, prestamo: [...socio.prestamo]}
  return socio_copia
}

// ✍️ 4 · Una línea con todas las propiedades del libro que NO son funciones, separadas por « · ».
//        ficha(crearLibro("Momo", "Ende", 300)) → "titulo: Momo · autor: Ende · paginas: 300 · prestado: false"
//        (pista: Object.entries + filter + map + join)
export function ficha(libro) {

  const linea = "";

  const libro_objeto = Object.entries(libro)

  libro_objeto
    .filter(valor => typeof valor === "function")
    .map(valor => {
      "autor"; valor.autor,
      "titulo"; valor.titulo,
      "autor"; valor.autor,
      "paginas"; valor.paginas,
      "prestado"; valor.prestado
    })
    
}
