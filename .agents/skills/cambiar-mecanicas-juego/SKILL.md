---
name: cambiar-mecanicas-juego
description: Modificar reglas o mecánicas de Píxel — Escapa del laboratorio, como movimiento, colisiones, baterías, dron, bombas, victoria, derrota o reinicio.
---

# Cambiar mecánicas del juego

Úsalo cuando se solicite añadir, corregir o ajustar una regla del juego. Para cambios solo visuales, trabaja directamente con `src/App.tsx`, `src/style.css` y `assets/`.

1. Lee la regla afectada en `docs/REGLAS.md` y la implementación correspondiente en `src/gameEngine.ts`. Consulta `src/App.tsx` solo si la interacción o la representación también cambian.
2. Define el comportamiento esperado con un caso normal y uno límite. Si la petición ya lo deja claro, continúa sin pedir confirmación.
3. Haz el cambio más pequeño que preserve las demás reglas. Mantén la lógica de la partida en `gameEngine.ts` y la presentación en React/SVG.
4. Actualiza la especificación o los casos de `src/gameEngine.test.ts` cuando el comportamiento esperado cambie. No alteres una prueba solo para ocultar un defecto.
5. Revisa estáticamente el resultado y entrega a José una lista breve de situaciones concretas para jugar. Respeta `AGENTS.md` sobre ejecución de pruebas y acciones de Git.
