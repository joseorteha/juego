# Guía rápida para participar en el taller

**Prácticas para el desarrollo moderno de software · Píxel — Escapa del laboratorio**

El juego ya está construido. Hoy vas a proponer una mejora, explicar qué debe pasar, trabajar con código o con un agente si tienes acceso, revisar el resultado y decidir si la aceptarías. Dos mejoras de equipos distintos podrán llegar al juego de José mediante PRs. No necesitas pagar una herramienta de IA para participar.

**Página común para escribir:** [formulario de propuestas](https://github.com/joseorteha/juego/issues/new/choose). Una persona con cuenta de GitHub por equipo puede enviar la idea, el prompt y las comprobaciones. José los verá en [el tablero de Issues](https://github.com/joseorteha/juego/issues) sin recoger hojas.

## 1. Consigue la base

Repositorio: <https://github.com/joseorteha/juego>

Si el repositorio ya tiene archivos, elige una opción:

```powershell
git clone https://github.com/joseorteha/juego.git
cd juego
```

O entra a GitHub y usa **Code → Download ZIP**; descomprímelo y abre la carpeta `juego` en tu editor. Si el internet falla, José puede compartir la copia `juego-para-alumnos.zip`. En cualquiera de las opciones, todos empiezan con la misma base.

## 2. Ejecútalo si tu equipo está preparado

Necesitas Node.js compatible con Vite 7: **20.19 o superior, o 22.12 o superior**. Comprueba `node --version`. En la carpeta del proyecto:

```powershell
npm ci
npm run dev
```

Abre la dirección local que muestre Vite. `npm ci` necesita conexión para descargar dependencias si no están instaladas. Si algo falla, sigue trabajando con la partida proyectada y la [ficha de equipo](./FICHA_EQUIPO.md); no gastaremos todo el taller arreglando instalaciones.

## 3. Ubica las piezas

| Archivo | Para qué sirve |
| --- | --- |
| `src/gameEngine.ts` | Reglas: movimiento, baterías, dron, bombas, tiempo y resultado |
| `src/App.tsx` | Teclado y lo que aparece en pantalla |
| `src/style.css` | Apariencia de la interfaz |
| `docs/REGLAS.md` | Comportamiento esperado del juego base |
| `AGENTS.md` | Contexto y acuerdos para un agente de código |
| `.agents/skills/cambiar-mecanicas-juego/SKILL.md` | Procedimiento para cambios de mecánicas |

## 4. El ciclo que vamos a practicar

1. **Definir:** escribe un comportamiento observable y un límite. Ejemplo: «después de la primera batería, el dron apunta un poco hacia donde se mueve Píxel; la marca sigue visible antes del impacto».
2. **Dirigir:** da al agente contexto, archivos relevantes, alcance y criterios. Si no tienes agente, usa el mismo encargo como plan para programar en pareja o para evaluar la demostración.
3. **Revisar:** mira qué archivos cambiaron y pregunta si cada cambio corresponde al encargo. Una respuesta convincente del agente no sustituye la revisión.
4. **Comprobar:** juega un caso normal y uno límite. Escribe **esperado** y **observado**. Si no pudiste probarlo, escribe **pendiente**.
5. **Decidir:** acepta, pide una corrección concreta o conserva la base. Da una razón basada en lo observado.

Trabajen en su **propia copia local o fork**. No es necesario que todos tengan un agente. Quienes logren implementar una mejora pueden abrir un PR hacia el repositorio de José; él revisará y decidirá qué entra a `main`. Vean el [flujo de GitHub del taller](./FLUJO_GITHUB_TALLER.md). No hagan push directo a `main`.

## Si tienes agente de código

Ábrelo en la carpeta `juego` y pídele primero un plan **sin editar**. Después de revisarlo, autoriza un cambio acotado. Puede ser Codex, Claude u otra herramienta que pueda leer el proyecto; el método del taller no depende de la marca. En este proyecto José se encarga de jugar las comprobaciones de su copia y de decidir si acepta la entrega.

## Si no tienes agente o laptop

Tu equipo puede hacer las cinco acciones igualmente: definir la regla, redactar el encargo que se proyectará, revisar el plan o los cambios de la computadora principal, dirigir una prueba jugable y votar con evidencia. El trabajo de ingeniería no se reduce a teclear.

Usa el Issue de tu equipo como registro digital. Si no puedes entrar a GitHub, usa la [ficha de equipo](./FICHA_EQUIPO.md) y pide a alguien con cuenta que capture la propuesta del grupo.
