# Arquitectura del Proyecto

## Estructura de Archivos
```
slidable/
├── js/
│   ├── main.ts           # Punto de entrada de la aplicación
│   ├── scene.ts         # Configuración de la escena ThreeJS
│   └── wingsuit.ts      # Clase del traje de alas
├── models/              # Modelos 3D (pendiente)
├── memory-bank/        # Documentación y planificación
├── index.html          # HTML principal
├── package.json        # Dependencias y scripts
├── tsconfig.json       # Configuración de TypeScript
└── vite.config.ts      # Configuración de Vite
```

## Componentes Principales

### scene.ts
- Responsable de la configuración base de ThreeJS
- Gestiona la escena, cámara y renderer
- Configura la iluminación básica
- Implementa el terreno inicial
- Maneja el redimensionamiento de la ventana
- Gestiona el bucle de animación y seguimiento de cámara

### main.ts
- Punto de entrada de la aplicación
- Inicializa la escena
- Monta el canvas en el DOM
- Inicia el bucle de renderizado

### wingsuit.ts
- Implementa la clase WingSuit
- Gestiona la geometría y materiales del modelo
- Maneja la lógica de movimiento y física
- Proporciona métodos de actualización para animación

## Tecnologías Principales
- **Three.js**: Motor de renderizado 3D
- **TypeScript**: Tipado estático y mejores prácticas de desarrollo
- **Vite**: Bundler y servidor de desarrollo
- **Node.js**: Entorno de ejecución

## Convenciones de Código
- Uso de TypeScript para todo el código
- Exports nombrados para mejor tree-shaking
- Arquitectura modular para mejor mantenibilidad
- Documentación inline para funciones principales
- Interfaces para configuración de componentes

## Sistema de Componentes
- Cada entidad principal tiene su propia clase
- Uso de interfaces para configuración
- Separación clara de responsabilidades
- Patrón de actualización por frame

## Planes de Expansión
- Sistema de física para el vuelo
- Sistema de colisiones
- Gestión de estados del juego
- Sistema de puntuación y tiempo
- Interfaz de usuario en juego
- Sistema de partículas para efectos visuales
