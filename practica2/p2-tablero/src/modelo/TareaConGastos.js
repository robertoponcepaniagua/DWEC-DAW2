import { Tarea } from "./Tarea.js";
import { PresupuestoSuperadoError } from "./errores.js";
export class TareaConGastos extends Tarea {
  //extendemos y hacemos clases privadas
  #presupuesto;
  #gastos = [];
  //constructor
  constructor(titulo, prioridad, limite, presupuesto, id = null) {
    super(titulo, prioridad, limite);
    if (!Number.isInteger(presupuesto) || presupuesto < 1) {
      throw new RangeError("Presupuesto no válido");
    }
    this.#presupuesto = presupuesto;
  }

  //get presupuesto de solo lectura, no hay setter
  //
  get presupuesto() {
    return this.#presupuesto;
  }

  // devuelve un array con un objeto de concepto y importe, el entries es cómo el items de python
  //
  get gastos() {
    const vuelto = [];
    for (const [concepto, importe] in [...this.#gastos.entries]) {
      vuelto.push({
        concepto: concepto,
        importe: importe,
      });
    }
    return;
  }
  //gastar terminado
  //
  gastar(concepto, importe) {
    if (!Number.isInteger(importe) || importe < 1) {
      throw new RangeError("Importe no válido");
    }
    if (this.#gastos.some((gasto) => gasto.concepto === concepto)) {
      throw new RangeError("Concepto repetido");
    }
    this.#gastos.push({ concepto, importe });
  }

  //comprobar movimiento terminado / comprobar paso lo hice antes de que dieras la respuesta
  //
//   comprobarMovimiento(destino) {
//     if (destino === "Hecho") {
//       const gastado = this.#gastos.reduce((total, gasto) => total + gasto.importe, 0);
//       if (gastado > this.#presupuesto) {
//         throw new PresupuestoSuperadoError(gastado, this.#presupuesto);
//       }
//     }
//   }

    // modelo 2
  comprobarPaso(desde, hasta) {
    const gastado = this.#gastos.reduce((suma, g) => suma + g.importe, 0);
    if (hasta === "Hecho" && gastado > this.#presupuesto)
      throw new PresupuestoSuperadoError(gastado, this.#presupuesto);
  }
}
