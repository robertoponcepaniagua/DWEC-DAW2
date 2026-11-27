# DWEC · Repaso de la UD4 para el Parcial 2 (objetos y clases)

**Opcional** y **no cuenta para la nota**: es para preparar el examen del 1 de diciembre. El escenario es el taller de
bicis **«La Cadena»**: construyes su modelo (reparaciones, mecánicos y el taller) bloque a bloque, y el bloque 6 es un
**simulacro**: un ejercicio grande de 5 puntos (+1 opcional).

Se trabaja **igual que en la práctica**: todo con `docker compose` (Node y Vite van dentro del contenedor; en tu
ordenador no se instala nada más).

```bash
docker compose run --rm web npm install            # 1 vez, con internet
docker compose run --rm web npm run comprobar      # todos los bloques (al principio, 5 de 34 en verde)
docker compose run --rm web npm run comprobar 3    # solo el bloque 3 (un 💡 por ejercicio y el porqué de cada predicción)
docker compose run --rm web npm run comprobar 6    # el simulacro: te da «X/5 puntos»
docker compose run --rm web npm run empezar 4      # empezar en el bloque 4 (con los bloques 2 y 3 ya hechos)
docker compose run --rm web npm run probar "EXPR"  # ejecuta código y enseña lo que da
docker compose up                                  # la página en http://localhost:5173 (Ctrl+C para pararla)
```

| Bloque | Dónde trabajas |
|---|---|
| 1 · Objetos, `this` y referencias | `src/bloque1/referencias.js` |
| 2 · Clases: validar, getters/setters y `static` | `src/modelo/reparacion.js` |
| 3 · Encapsulación | `src/modelo/reparacion.js` |
| 4 · Herencia y polimorfismo | `src/modelo/reparacion.js` y `src/bloque4/polimorfismo.js` |
| 5 · Composición y errores propios | `src/modelo/errores.js`, `reparacion.js`, `mecanico.js` y `taller.js` |
| 6 · Simulacro: la reparación en garantía | `src/modelo/garantia.js`, `errores.js` y `taller.js` |

Las predicciones 🔮 de cada bloque están en `src/bloqueN/predicciones.js`.

1. Lee la explicación de cada bloque en la web de DWEC: **Practicar → 🎯 Repaso Parcial 2 → UD4 · Objetos y clases**.
2. Haz **solo los bloques que te cuesten**, en el orden que quieras. El modelo de `src/modelo/` crece de un bloque a
   otro: para empezar en el bloque N sin hacer los anteriores, `docker compose run --rm web npm run empezar N` (pone lo de antes ya hecho y guarda
   lo tuyo en `copias/`).
3. Para **ver y depurar** tu código: `docker compose up` y abre **http://localhost:5173**.
4. Los ejercicios ➕ son **opcionales**, para ir a por nota: el comprobador los enseña aparte y no cuentan en el total.
5. Al terminar, contesta `respuestas.md`.
