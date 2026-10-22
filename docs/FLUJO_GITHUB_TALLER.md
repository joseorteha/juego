# Del equipo al juego integrado

**Enlace para escribir la propuesta:** <https://github.com/joseorteha/juego/issues/new/choose>  
**Tablero para que José vea todas:** <https://github.com/joseorteha/juego/issues>  
**PRs para revisar:** <https://github.com/joseorteha/juego/pulls>

El formulario «Propuesta de mejora del taller» está en GitHub Issues. Cada equipo necesita **una cuenta de GitHub**, no una cuenta de un agente de IA. Abren un Issue, escriben la idea, el prompt y cómo la comprobarían. Más tarde pueden editarlo para añadir el enlace al PR y el resultado. José ve todas las tarjetas en la lista y copia el texto que quiera proyectar. Si una mesa no tiene cuenta, una persona de otra mesa puede enviar su propuesta identificando al equipo.

## De la base al PR

1. Entren al repositorio y usen **Fork**. Así cada equipo tiene su copia y no escribe directamente en el proyecto de José.
2. Clonen su fork y creen una rama con un nombre claro, como `equipo-2-radar`. No trabajen directamente en `main`.
3. Hagan un cambio acotado. Pueden usar un agente, programar en pareja o combinar ambos. Lean `AGENTS.md` y la regla correspondiente.
4. Revisen los archivos cambiados. Jueguen en su copia si pueden y registren un caso normal, uno límite y uno de algo que ya funcionaba.
5. Hagan commit **en su rama** y suban esa rama a su fork.
6. Abran un PR hacia `joseorteha/juego`, rama base `main`. Completen la plantilla y peguen el enlace en su Issue.

Comandos orientativos si ya conocen Git:

```powershell
git clone https://github.com/TU_USUARIO/juego.git
cd juego
git switch -c equipo-2-radar
# Después de editar y revisar:
git add .
git commit -m "Agregar radar de baterías"
git push -u origin equipo-2-radar
```

Para abrir el PR pueden usar el botón **Compare & pull request** de GitHub. Revisen que **base** sea `joseorteha/juego:main` y **compare** sea su rama del fork. El código de una mesa no entra a `main` hasta que José revise y haga el merge.

## Dos mejoras que pueden convivir

La lluvia de ideas del grupo puede elegir otras mejoras. Estas dos están preparadas por si hace falta arrancar rápido:

### A · Dron táctico

Después de recoger la primera batería, las bombas apuntan un poco por delante de la dirección de movimiento de Píxel. El destino se anuncia antes del impacto y queda fijo. Requiere cambiar reglas del motor y mostrar ALERTA en la interfaz. **Zonas probables:** `src/gameEngine.ts`, `src/App.tsx`, `docs/REGLAS.md`.

### B · Radar de objetivo

Una pista pequeña señala hacia la batería sin recoger más cercana. Cuando ya se recogieron las tres, señala la puerta. No mueve al jugador ni cambia las reglas de victoria. **Zonas probables:** un componente nuevo, su estilo propio y un punto de inserción en `src/App.tsx`.

La A cambia el desafío; la B ayuda a orientarse. Ambas pueden evaluarse por separado y luego jugarse juntas. **Las dos probablemente tocarán `App.tsx`**: por eso José debe revisar el segundo PR después de integrar el primero. Que no aparezca un conflicto de Git no garantiza que la interfaz funcione bien; hay que volver a jugar.

## Cómo integra José

1. Abre el primer PR. Lee su descripción y los archivos cambiados; comprueba que corresponde al Issue y que no incluye otros cambios.
2. Si la revisión es entendible, hace merge del primer PR.
3. Abre el segundo PR. Si GitHub indica conflicto, pide a ese equipo actualizar su rama con `main` y resolverlo. Si no indica conflicto, revisa de todos modos que la lógica y la pantalla convivan.
4. Integra el segundo PR solo cuando el cambio combinado sea revisable.
5. En su computadora, con una copia local limpia: `git pull origin main`. Abre el juego y prueba **A sola, B sola cuando sea posible y A+B juntas**. Mira también tiempo, vidas, baterías, bombas y puerta.

Si un PR llega incompleto o el conflicto no se resuelve a tiempo, **queda abierto**. El cierre del taller puede mostrar una integración real y una propuesta pendiente con su razón. No fuerces un merge solo para alcanzar una cifra de funciones.

## Si no tienen Git o agente

Todavía pueden crear el Issue, escribir el encargo, revisar un PR en el navegador, jugar en la computadora de José y registrar una observación. Para abrir un PR con cambios se necesita GitHub y una rama con código; otra mesa puede ayudarles a convertir su propuesta en PR sin borrar quién la ideó.
