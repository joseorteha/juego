# Guía para agentes de código

Este repositorio contiene **Píxel — Escapa del laboratorio**, un juego local para el taller «Prácticas para el desarrollo moderno de software». La aplicación usa React, TypeScript y Vite. No integra un modelo de IA en tiempo de ejecución: los agentes ayudan a desarrollar el código.

## Dónde hacer cambios

- `src/gameEngine.ts`: estado, tiempo, movimiento, colisiones, baterías, dron, bombas, victoria, derrota y reinicio. Mantén aquí las reglas del juego.
- `src/App.tsx`: teclado, ciclo de animación y representación React/SVG. No dupliques reglas del motor aquí.
- `src/style.css` y `assets/`: apariencia. Conserva la legibilidad de los indicadores y las señales de peligro.
- `src/gameEngine.test.ts`: casos que describen el comportamiento esperado.
- `docs/REGLAS.md`: especificación del juego; `docs/ARQUITECTURA.md`: límites de cada parte.

## Criterios del proyecto

- El juego puede tener varios niveles, modos y escenarios más grandes que la pantalla. Cada nivel se define como datos en `gameEngine.ts` (obstáculos, baterías, drones, puerta, tamaño del mapa); no dupliques la lógica por nivel. Consulta `docs/REGLAS.md` si cambias una mecánica y actualízalo cuando una propuesta aprobada lo contradiga.
- Al reiniciar deben restaurarse baterías, tiempo, vidas, jugador, drones, bombas y puerta. Reiniciar tras perder vuelve al inicio del nivel actual; «Jugar otra vez» tras completar el último nivel vuelve al nivel 1.
- En Normal se conservan las tres vidas iniciales, la velocidad de Píxel y la cadencia de las bombas, salvo que una propuesta aprobada diga lo contrario.
- Un impacto o el fin del tiempo tiene prioridad sobre la victoria si ocurren a la vez.
- Haz cambios acotados y explica qué regla modificaste, qué archivos tocaste y qué casos debería jugar José para revisarla.
- Usa el skill `.agents/skills/cambiar-mecanicas-juego/SKILL.md` cuando se pidan cambios de reglas o mecánicas.

## Propuestas aprobadas pendientes

Vienen de los issues del taller. Impleméntalas con el skill de mecánicas, una por una, y marca cada una como hecha aquí al terminarla.

1. ✅ **Hecho.** **Modo Contrarreloj de 25 s (#7).** Cuarto modo junto a Fácil, Normal y Difícil: el tiempo empieza en 25 s; vidas, velocidad de Píxel, velocidad de los drones y cadencia de bombas iguales a Normal. Llegar a 0 s es derrota inmediata; tocar la puerta abierta con 1–2 s restantes es victoria.
2. **Niveles (#3, #8).** Al tocar la puerta abierta del nivel 1 se pasa al nivel 2, un laberinto con más obstáculos donde los drones siguen persiguiendo a Píxel. Muestra un mensaje de cambio de nivel. Sin todas las baterías la puerta no deja avanzar. Las vidas se conservan entre niveles; el tiempo se restablece en cada nivel. Ganar el último nivel muestra «¡Escapaste!».
3. **Misión de drones y baterías ocultas (#10).** En el nivel que la use hay 5 drones; cada batería permanece oculta hasta derrotar a un dron. Recoger una batería recupera una vida, sin superar el máximo de la dificultad. Define en `REGLAS.md` cómo se derrota a un dron antes de programarlo.
4. **Mapa más grande y esquive (#6).** Escenario mayor que la pantalla con una cámara que sigue a Píxel, sin cambiar el tamaño ni la estética de los personajes. Píxel puede saltar para esquivar: durante el salto no recibe daño de explosiones, tiene un tiempo de recarga y no ignora los obstáculos. No cambies la velocidad de los disparos ni la de los personajes.

## Forma de trabajo acordada

José realiza las pruebas del juego. No ejecutes `npm test`, `npm run build` ni pruebes la partida en el navegador salvo que lo pida. Puedes inspeccionar código y razonar sobre los casos sin ejecutar el juego.

No hagas commits ni subas cambios por iniciativa propia. Si José solicita explícitamente esas acciones, sigue su instrucción. Las peticiones del usuario tienen prioridad sobre esta guía.
