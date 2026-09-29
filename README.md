# DWEC-DAW2

DESAROLLO WEB EN ENTORNO CLIENTE - ROBERTO PONCE PANIAGUA 2DAW

# 🕹️ RetroStock — Gestor de Inventario y Ventas

## 🏗️ I. Arquitectura y Organización del Código

```text
retrostock/
├── package.json             # Scripts y dependencias del proyecto
├── README.md                # Documentación técnica
└── src/
    ├── main.js              # Bucle del menú principal e interacción (UD3)
    ├── data/
    │   └── catalog.js       # Catálogo inicial de productos (UD2)
    ├── services/
    │   ├── business.js      # Lógica de negocio pura (Tablas A, B y C)
    │   └── sessionState.js  # Closure que encapsula el estado y la caja
    └── utils/
        └── helpers.js       # Funciones auxiliares, HOFs y formateadores
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

**Justificación:** todas las propiedades son valores simples (`string` o `number`) porque cada producto tiene una única plataforma y una única categoría — no hay necesidad de modelar relaciones uno-a-muchos aquí. Esto mantiene el filtrado por categoría y la comprobación de plataformas cubiertas en el catálogo (mínimo 4 categorías distintas) como comparaciones directas con `===`, sin aplanar arrays ni usar `.includes()`. `state` usa los 4 valores exactos definidos por la Tabla A, lo que permite validarlo y usarlo como clave de un objeto de ajustes (`AJUSTE_ESTADO[state]`). `basePrice` y `stock` son `number` por participar directamente en los cálculos de la Tabla A, B y C.

## 🐳 Docker

- **`Dockerfile`**: imagen `node:20-alpine`, instala dependencias y arranca Vite en el puerto `5173`.
- **`docker-compose.yml`**: levanta el contenedor, mapea el puerto `5173` y monta el código como volumen para hot reload.

\`\`\`bash
docker compose up
\`\`\`

App disponible en `http://localhost:5173`.