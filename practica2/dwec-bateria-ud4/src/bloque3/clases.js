// Bloque 3 · Clases: constructor que valida, getters/setters, campos #privados, static y el this perdido
// Explicación: web → 4.1 Batería → Bloque 3 (y el apartado 7 de la UD4).
// Comprueba con:  ./bateria.sh comprobar 3

// 👀 EJEMPLO RESUELTO ─────────────────────────────────────────────────────────
// Un campo privado (#valor) que solo se puede leer con un getter y cambiar con un método.
export class Contador {
  #valor = 0;
  incrementar() {
    this.#valor++;
    return this; // devolver this permite encadenar: c.incrementar().incrementar()
  }
  get valor() {
    return this.#valor;
  }
}

// 🪜 ESCALERA ──────────────────────────────────────────────────────────────────
// 🪜 1 · Una clase Punto con x e y, y un método distanciaAlOrigen().  new Punto(3, 4).distanciaAlOrigen() → 5
//        (pista: Math.hypot)
export class Punto {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
  distanciaAlOrigen() {
    return Math.hypot(this.x, this.y)
  }
}

// ✍️ TU TURNO ─────────────────────────────────────────────────────────────────
// ✍️ 1 · La clase Libro:
//   - constructor(titulo, autor, paginas). El título se guarda SIN espacios al principio y al final, y si está
//     vacío (o no es un texto) se lanza un Error: un libro sin título no se crea.
//   - paginas en un campo PRIVADO #paginas, con un getter y un SETTER que lanza un Error si no es un entero > 0
//     (y en ese caso no cambia nada). El constructor también tiene que pasar por el setter.
//   - un getter esLargo: true a partir de 400 páginas.
//   - resumen() → "Momo (Ende), 300 págs."
// ✍️ 2 · Y en la misma clase, lo que es de la CLASE y no de cada libro (static):
//   - Libro.creados: cuántos libros se han creado (un contador privado y static, con un getter static).
//   - Libro.desde({ titulo, autor, paginas }) → un Libro nuevo a partir de un objeto.
export class Libro {

  // Atributo privado de instancia: almacena las páginas de cada libro.
  #paginas

  // Atributo estático privado: contador compartido por toda la clase.
  static #creados = 0

  constructor(titulo, autor, paginas) {

    // Validación: comprueba que el título sea un string y no esté vacío.
    if (typeof titulo !== "string" || titulo.trim() === "") {
      throw new Error("Falta el titulo")
    }

    // Asignación de atributos de instancia.
    this.titulo = titulo.trim()
    this.autor = autor
    this.paginas = paginas

    // Incrementa el contador de libros creados.
    Libro.#creados++
  }

  // Getter: permite consultar las páginas del libro.
  get paginas() {
    return this.#paginas
  }

  // Setter: valida y modifica el número de páginas.
  set paginas(n) {
    if (!Number.isInteger(n) || n <= 0) {
      throw new Error("Las páginas tienen que ser un entero mayor que 0")
    }

    this.#paginas = n
  }

  // Getter calculado: indica si el libro tiene 400 páginas o más.
  get esLargo() {
    return this.#paginas >= 400
  }

  // Método de instancia: devuelve un resumen del libro.
  resumen() {
    return `${this.titulo} (${this.autor}), ${this.#paginas} págs.`
  }

  // Getter estático: permite consultar el contador desde la clase.
  static get creados() {
    return Libro.#creados
  }

  // Método estático de fábrica: permite crear un libro pasando un objeto.
  static desde({ titulo, autor, paginas }) {
    return new Libro(titulo, autor, paginas)
  }
}

// ✍️ 3 · Devuelve una FUNCIÓN que, al llamarla suelta (avisar()), devuelva libro.resumen().
//        Si devuelves libro.resumen tal cual, se pierde this. ¿Cómo lo evitas? (apartado 7.7)
export function crearAvisador(libro) {
  const funcion = libro.resumen.bind(libro)
  return funcion
}
