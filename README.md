# DWEC-DAW2

DESAROLLO WEB EN ENTORNO CLIENTE - ROBERTO PONCE PANIAGUA 2DAW

# 🕹️ RetroStock — Gestor de Inventario y Ventas

## 🏗️ I. Arquitectura y Organización del Código

```text
retrostock/
└── src/
    ├── data/
    │   └── catalog.js
    ├── services/
    │   ├── business.js         # Tablas A, B y C (cálculos puros)
    │   ├── catalogService.js   # Buscar, vender, reponer (opera sobre el catálogo)
    │   └── sessionState.js     # Closure de la sesión
    └── utils/
        └── helpers.js
```

## 📦 Modelo de datos

```javascript
const producto = {
  id: 1,
  title: "Pokémon Amarilla",
  platform: "GAME BOY",
  category: "RPG",
  basePrice: 50.00,
  state: "usado-caja-danada",
  stock: 2
};
```

| Propiedad | Tipo | Descripción |
|---|---|---|
| `id` | `number` | Identificador único |
| `title` | `string` | Título del videojuego |
| `platform` | `string` | Plataforma en la que se juega |
| `category` | `string` | Categoría del videojuego, para poder filtrar el catálogo |
| `basePrice` | `number` | Precio antes de la Tabla A |
| `state` | `string` | Estado de conservación (4 valores fijos) |
| `stock` | `number` | Unidades disponibles |

**Justificación del Modelo de Datos:**

He diseñado las propiedades de los objetos de forma sencilla utilizando solo cadenas de texto (`string`) y números (`number`), ya que cada videojuego pertenece a una sola plataforma y categoría. Esto simplifica el código al máximo: nos permite filtrar por categoría o verificar las plataformas requeridas con comparaciones directas (`===`) sin tener que liar la lógica recorriendo arrays anidados. 

Por otro lado, la propiedad `state` utiliza los 4 valores exactos indicados en el enunciado (`nuevo-precintado`, `usado-como-nuevo`, `usado-caja-danada` y `solo-cartucho`). c`basePrice` y `stock` se guardan como números para operar con ellos en las operaciones de la caja y los descuentos etc..

## 🐳 Docker

- **`Dockerfile`**: imagen `node:20-alpine`, instala dependencias y arranca Vite en el puerto `5173`.
- **`docker-compose.yml`**: levanta el contenedor, mapea el puerto `5173` y monta el código como volumen para hot reload.

\`\`\`bash
docker compose up
\`\`\`

App disponible en `http://localhost:5173`.

## Depuración y Resolución de Bugs (Breakpoint)

### Descripción del Bug
Al intentar listar los productos o reponer stock, la aplicación lanzaba el error `Uncaught TypeError: can't access property "id", game is undefined`, bloqueando el menú por completo.

### Depuración con Breakpoint
1. Puse un **breakpoint** en la primera línea de `allCatalog()` en las DevTools
2. Al pausar la ejecución e inspeccionar `currentCatalog` en el panel de variables, vi que el array tenía elementos `undefined` (`[{id: 1, ...}, undefined, ...]`)
3. El fallo venía de `addStock()`: al hacer el `.map()`, había caminos que no devolvían ningún objeto, colando ese `undefined` en el nuevo catálogo

### Solución Implementada
Reescribí `addStock()` asegurando que `.map()` **siempre retorne un objeto** en cada vuelta y validando que la cantidad sea un número válido:

```javascript
export function addStock(currentCatalog,id, quantity) {
    // Hay que hacerlo

    return currentCatalog.map(game => {
        // SI NO ES EL QUE QUEREMOS SIGUIENTE
        if (game.id !== id) {
            return game;
        }

        // BLOQUEO DE AÑADIR NEGATIVOS
        if (quantity < 0) {
            console.log("No se puede añadir < 0");
            return currentCatalog;
        }

        
        let newStock = game.stock + quantity;
        console.log(`El stock se ha añadido:  [${game.id}]: ${game.title} ${game.stock}`)
        // Devolvemos una COPIA NUEVA con todo actualizado
        return {
            ...game,
            stock: newStock
        };
    })
}