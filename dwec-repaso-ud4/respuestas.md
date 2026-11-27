# Explícalo con tus palabras

Cuando tengas el comprobador en verde, contesta aquí sin mirar los apuntes (2–4 líneas cada una).
Son preguntas del tipo de las que te pueden preguntar.

1. Al pasar un método como callback, ¿por qué `reparaciones.map(revisor.revisar)` revienta y `reparaciones.map((r) => revisor.revisar(r))` no?

2. ¿Por qué `get piezas() { return [...this.#piezas]; }` no protege del todo las piezas de la reparación? ¿Qué hace falta?

3. Si un dato de `new Reparacion(…)` no vale, ¿cuándo lanzas `TypeError` y cuándo `RangeError`? ¿Y por qué una reparación que no se crea no debe gastar un id?

4. En `ReparacionUrgente`, ¿por qué el total se calcula con `super.total` y no con `this.total`, ni leyendo `#piezas`?

5. En `taller.asignar`, ¿qué pasaría si llamaras a `reparacion.empezar()` antes de `mecanico.asignar(reparacion)` y el mecánico estuviera lleno?
