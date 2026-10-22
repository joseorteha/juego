# Arquitectura del juego y trabajo con IA

## Aplicación

```text
Teclado ──> App.tsx ──> gameEngine.ts ──> nuevo GameState
               │                              │
               └──── React/SVG + CSS <────────┘
                          │
                        assets/
```

`src/App.tsx` captura WASD, flechas, Enter y espacio. Un ciclo con `requestAnimationFrame` envía el tiempo transcurrido y las direcciones presionadas a `advanceGame`. La interfaz dibuja el estado resultante con React y SVG, usando imágenes importadas de `assets/`.

`src/gameEngine.ts` no depende de React. Define el mundo de 1600 × 900, posiciones, estado inicial y reglas. `createGame`, `startGame`, `advanceGame` y `restartGame` son sus puntos principales. `src/gameEngine.test.ts` describe casos observables del motor.

Para cambiar una regla, empieza por el motor. Para cambiar cómo se ve o se controla, empieza por `App.tsx` y `style.css`. Si una nueva regla necesita mostrarse, cambia ambas capas con una sola definición de la regla en el motor.

## Agentes de desarrollo

La IA participa en el **desarrollo del repositorio**, no en la ejecución del juego. La estructura tiene dos niveles:

- `AGENTS.md` da contexto y acuerdos permanentes a cualquier agente que abra el proyecto.
- `.agents/skills/cambiar-mecanicas-juego/SKILL.md` ofrece un procedimiento reutilizable para una tarea concreta. Se carga cuando el trabajo trata de reglas o mecánicas.

No se necesita un servidor MCP, una API de modelos ni un agente autónomo dentro de la aplicación para este flujo.

## Ciclo de trabajo

1. **Dirigir:** José describe qué debe ocurrir y en qué situación. Ejemplo: «Al reiniciar después de perder, las tres baterías deben volver a aparecer».
2. **Implementar:** el agente localiza la regla, propone un cambio acotado y modifica el código correspondiente.
3. **Evaluar:** el agente explica qué cambió y qué casos podrían fallar; José revisa el cambio y juega las situaciones indicadas.
4. **Corregir:** si el comportamiento observado no coincide con la regla, se comparte el caso exacto y se ajusta el código.

Este reparto permite usar IA para acelerar el desarrollo sin delegarle la decisión sobre si el juego funciona bien.

## Referencias de la estructura

La separación entre instrucciones permanentes y skills específicos sigue los ejemplos de [OpenAI Agents SDK](https://github.com/openai/openai-agents-python/blob/main/AGENTS.md) y [GitHub Awesome Copilot](https://github.com/github/awesome-copilot/blob/main/website/src/content/docs/learning-hub/what-are-agents-skills-instructions.md). El directorio `.agents/skills/` y el archivo `SKILL.md` siguen el [formato documentado por GitHub](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/add-skills).
