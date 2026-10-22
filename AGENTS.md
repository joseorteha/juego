# Guía para agentes de código

Este repositorio contiene **Píxel — Escapa del laboratorio**, un juego local de una pantalla para el taller «Prácticas para el desarrollo moderno de software». La aplicación usa React, TypeScript y Vite. No integra un modelo de IA en tiempo de ejecución: los agentes ayudan a desarrollar el código.

## Dónde hacer cambios

- `src/gameEngine.ts`: estado, tiempo, movimiento, colisiones, baterías, dron, bombas, victoria, derrota y reinicio. Mantén aquí las reglas del juego.
- `src/App.tsx`: teclado, ciclo de animación y representación React/SVG. No dupliques reglas del motor aquí.
- `src/style.css` y `assets/`: apariencia. Conserva la legibilidad de los indicadores y las señales de peligro.
- `src/gameEngine.test.ts`: casos que describen el comportamiento esperado.
- `docs/REGLAS.md`: especificación del juego; `docs/ARQUITECTURA.md`: límites de cada parte.

## Criterios del proyecto

- Mantén una sola partida y un solo nivel. Consulta `docs/REGLAS.md` si cambias una mecánica.
- Al reiniciar deben restaurarse baterías, tiempo, vidas, jugador, dron, bombas y puerta.
- Un impacto o el fin del tiempo tiene prioridad sobre la victoria si ocurren a la vez.
- Haz cambios acotados y explica qué regla modificaste, qué archivos tocaste y qué casos debería jugar José para revisarla.
- Usa el skill `.agents/skills/cambiar-mecanicas-juego/SKILL.md` cuando se pidan cambios de reglas o mecánicas.

## Forma de trabajo acordada

José realiza las pruebas del juego. No ejecutes `npm test`, `npm run build` ni pruebes la partida en el navegador salvo que lo pida. Puedes inspeccionar código y razonar sobre los casos sin ejecutar el juego.

No hagas commits ni subas cambios por iniciativa propia. Si José solicita explícitamente esas acciones, sigue su instrucción. Las peticiones del usuario tienen prioridad sobre esta guía.
