# Píxel — Escapa del laboratorio

Juego de navegador hecho con React, TypeScript y Vite para el taller **Prácticas para el desarrollo moderno de software**. Se ejecuta localmente y no necesita servicios de IA ni conexión a internet durante una partida.

**Si participas en el taller:** empieza por la [guía rápida](./docs/GUIA_TALLER.md). Envía tu idea y prompt en el [formulario de propuestas](https://github.com/joseorteha/juego/issues/new/choose) y consulta el [flujo para abrir un PR](./docs/FLUJO_GITHUB_TALLER.md). Puedes participar aunque no tengas un agente de IA o no logres instalar el proyecto en tu computadora.

## Ejecutar

```powershell
npm ci
npm run dev
```

Abre la dirección que muestre Vite. Usa **WASD** o las flechas para mover a Píxel. Pulsa **Enter** o **espacio** para empezar y para volver a jugar después de ganar o perder.

## El juego

Elige la dificultad (Fácil, Normal, Difícil o Contrarreloj de 25 s) y empieza. En Normal recoges tres baterías y llegas a la puerta antes de que se agoten los 75 segundos, con tres vidas. Los dos drones, sus bombas y los obstáculos hacen que debas elegir una ruta; los drones aceleran con el tiempo y con cada batería. La tecla **M** activa o silencia la música. La derrota por daño o tiempo tiene prioridad si coincide con la llegada a la puerta.

Las reglas completas están en [docs/REGLAS.md](./docs/REGLAS.md) y las decisiones visuales en [docs/DISENO_VISUAL.md](./docs/DISENO_VISUAL.md).

## Estructura

```text
juego/
├── .agents/skills/       Flujo reutilizable para cambios de mecánicas
├── AGENTS.md             Contexto e instrucciones para agentes de código
├── assets/               Ilustraciones y SVG usados por el juego
├── docs/                 Reglas, diseño y arquitectura
├── src/
│   ├── App.tsx           Entrada, animación y representación en React/SVG
│   ├── gameEngine.ts     Estado y reglas del juego
│   ├── gameEngine.test.ts
│   ├── main.tsx
│   └── style.css
├── index.html
├── package.json
└── vite.config.ts
```

[docs/ARQUITECTURA.md](./docs/ARQUITECTURA.md) explica cómo se separan las reglas de la interfaz y cómo trabajar con un asistente de programación en este repo.

## Trabajar con IA

Un agente de código puede leer [AGENTS.md](./AGENTS.md) para conocer el proyecto. El skill [cambiar-mecanicas-juego](./.agents/skills/cambiar-mecanicas-juego/SKILL.md) guía los cambios en movimiento, colisiones, baterías, dron, bombas, victoria o reinicio. La IA ayuda a implementar y revisar; José decide si el comportamiento es correcto y juega la comprobación manual.

## Comandos

| Comando | Función |
| --- | --- |
| `npm run dev` | Servidor local de desarrollo |
| `npm run build` | Compilación de producción |
| `npm run preview` | Vista local de la compilación |
| `npm test` | Pruebas del motor con Vitest |

Los archivos de `assets/originales/` conservan las imágenes maestras; el juego importa las imágenes optimizadas de `assets/`.
