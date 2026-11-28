// Bloque 3 · Listeners y el objeto evento
// Explicación: web de DWEC → Practicar → UD 5.2 · Repaso para el Parcial 2 → Bloque 3 (y los apartados 9, 10.4 y 11 de la UD5).
// Comprueba con:  docker compose run --rm web npm run comprobar 3

// 👀 EJEMPLO RESUELTO ─────────────────────────────────────────────────────────
// Al pulsar el botón, escribe en `salida` qué evento ha sido y la acción del botón que lo escucha:
//   <button data-accion="empezar"><span>🔧</span> Empezar</button>  →  «click en empezar»
// Devuelve una función que lo desconecta.
//   - e.currentTarget es el botón (el que escucha), aunque se pulse el <span> de dentro (eso es e.target).
//   - La función tiene NOMBRE: así removeEventListener recibe la MISMA y la puede quitar.
export function vigilar(boton, salida) {
  function alPulsar(e) {
    salida.textContent = `${e.type} en ${e.currentTarget.dataset.accion}`;
  }
  boton.addEventListener("click", alPulsar);
  return () => boton.removeEventListener("click", alPulsar);
}

// 🪜 ESCALERA ──────────────────────────────────────────────────────────────────
// 🪜 1 · La PRIMERA vez que se pulse el botón, llama a accion(id) con el data-id del botón como número.
//        Las siguientes veces, nada.   <button data-id="7">  →  accion(7), una sola vez
export function soloUnaVez(boton, accion) {
  // para que solo se ejecute una vez podemos quitarle la clase que se llama una vez
  boton.addEventListener("click", () => {
    const boton_id = Number(boton.dataset.id)
    accion(boton_id)
    // once para que solo sea una vez
  }, { once: true })
}

// 🪜 2 · En el campo de las horas (<input type="number">), con el teclado:
//        - flecha arriba (ArrowUp): suma 0.5 a lo que haya escrito;
//        - flecha abajo (ArrowDown): resta 0.5, pero nunca baja de 0.5;
//        - con las flechas, que el navegador NO haga además lo suyo (preventDefault);
//        - con cualquier otra tecla, nada.
//        Si pone "2" → ArrowUp → "2.5".
export function flechasHoras(campo) {
  campo.addEventListener("keydown", (e) => {
    let campo_value = Number(campo.value)
    if (e.key === "ArrowUp") {
      e.preventDefault()
      // sumamos
      campo_value += 0.5
      campo.value = campo_value
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      // restamos
      campo_value = Math.max(0.5, campo_value - 0.5);
      campo.value = campo_value
    }
  })
}

// ✍️ TU TURNO ─────────────────────────────────────────────────────────────────
// ✍️ 1 · Un marcador de horas unido a un botón:  <button data-paso="0.5">+½ h</button>  y un <output>.
//        new MarcadorHoras(boton, salida)
//          - cada clic en el botón llama a this.sumar(paso del botón, como número);
//        sumar(paso): suma a las horas (privadas, empiezan en 0) y escribe «2.5 h» en la salida.
//        get horas: las horas que lleva.
//        desconectar(): a partir de ahí, los clics ya no suman.
//        Cuidado con `this` dentro del listener, y con qué función le das a removeEventListener.
export class MarcadorHoras {
  #horas
  #manegador
  constructor(boton, salida) {
    this.boton = boton
    this.salida = salida
    this.#horas = 0

    this.#manegador = () => {
      this.sumar(Number(boton.dataset.paso))
    }
    this.boton.addEventListener("click", this.#manegador)
  }

  sumar(paso) {
    this.#horas += paso
    this.salida.textContent = `${this.#horas} h`
  }

  get horas() {
    return this.#horas
  }

  desconectar() {
    this.boton.removeEventListener("click", this.#manegador)
  }
}

// ➕ OPCIONAL (para ir a por nota) · Atajos de teclado de la página. UN listener de keydown en raiz:
//        - «n» → acciones.nueva(), pero NO si se está escribiendo en un campo (input o textarea)
//          ni si va con Control (Ctrl+N es del navegador);
//        - «Escape» → acciones.cerrar(), esté donde esté el foco (también dentro de un campo).
//        Devuelve una función que quita los atajos.
export function atajos(raiz, acciones) {
  const manegador = (e) => {
    if (e.key === "n") {
      if (!e.ctrlKey) {
        if (e.target.tagName !== "TEXTAREA" && e.target.tagName !== "INPUT") {
          acciones.nueva()
        }
      }
    }
    if (e.key === "Escape") {
      acciones.cerrar()
    }
  };
  raiz.addEventListener("keydown", manegador)
  // se devuelve con una función felcha para que se pueda acceder al manejador
  return () => raiz.removeEventListener("keydown", manegador)
}
