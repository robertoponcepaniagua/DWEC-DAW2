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

## 📦 Modelo de datos

```javascript
const producto = {
  id: "1",
  title: "Pokémon Amarilla",
  platform: ["GAME BOY"],
  category: ["RPG"],
  basePrice: 50.00,
  state: "usado-caja-danada",
  stock: 2
};
```

| Propiedad | Tipo | Descripción |
|---|---|---|
| `id` | `string` | Identificador único |
| `title` | `string` | Título del videojuego |
| `platform` | `array<string>` | Plataformas (un juego puede estar en varias, ej. PS1 y N64) |
| `category` | `array<string>` | Categorías (un juego puede tener varias, ej. RPG y Lucha) |
| `basePrice` | `number` | Precio antes de la Tabla A |
| `state` | `string` | Estado de conservación (4 valores fijos) |
| `stock` | `number` | Unidades disponibles |

**Justificación:** `platform` y `category` son `array` porque un mismo juego puede pertenecer a varias plataformas o categorías a la vez, por lo que su filtrado usa `.includes()` en vez de `===`. `state` es `string` porque cada producto solo tiene un estado de conservación a la vez, lo que permite comparar con `===` en la Tabla A. `basePrice` y `stock` son `number` por ser usados en cálculos aritméticos. El modelo es plano, sin anidamiento
