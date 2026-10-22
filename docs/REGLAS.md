# Escapa del laboratorio

> Minijuego de navegador para el workshop **Prácticas para el desarrollo moderno de software**.

La paleta, jerarquía visual y reglas de legibilidad están en [Diseño visual](./DISENO_VISUAL.md).

## La idea

Píxel, un pequeño robot explorador, quedó encerrado en un laboratorio. La puerta necesita energía para abrirse. Debe recoger **tres baterías**, rodear los obstáculos, esquivar a dos drones y sus bombas, y llegar a la salida antes de que se agote el tiempo.

Es un juego corto que cualquier persona puede entender y jugar en menos de un minuto. Su valor para el taller está en que las reglas parecen evidentes hasta que empezamos a preguntar qué debe ocurrir en situaciones límite.

## Lo que ve el jugador

Una sola pantalla horizontal, con el laboratorio de fondo. Píxel inicia cerca de la esquina inferior izquierda. Hay tres baterías separadas entre sí, cajas y reactores que bloquean el camino, dos drones y una puerta luminosa al otro extremo.

Encima del escenario aparece una barra sencilla:

```text
PÍXEL: ESCAPA DEL LABORATORIO       VIDAS 3/3       BATERÍAS 0/3       TIEMPO 75
```

La puerta muestra que está bloqueada mientras falten baterías. Al reunir las tres, cambia a un estado visual abierto y el jugador puede llegar a ella para ganar. Las instrucciones iniciales caben en una frase: **«Muévete con WASD o las flechas. Recoge las tres baterías y llega a la puerta. Evita al dron.»**

## Una partida, paso a paso

1. En la pantalla de inicio el jugador elige la dificultad (botones o teclas **1** a **4**; por defecto **Normal**) y pulsa **Empezar**. En Normal el tiempo comienza en 75 segundos y tiene tres vidas.
2. Mueve a Píxel por el escenario con WASD o las flechas. El personaje no puede salir de los límites visibles ni atravesar los obstáculos; puede deslizarse a lo largo de ellos.
3. Al tocar una batería, esta desaparece, el contador aumenta una vez y aparece una señal breve de recolección.
4. Si toca la puerta antes de reunir las tres, recibe un mensaje breve: **«Faltan baterías»**. La partida continúa.
5. Al recoger la tercera batería, la puerta cambia de apariencia para indicar que ya puede usarse.
6. Si Píxel toca la puerta abierta con tiempo restante, aparece **«¡Escapaste!»** con la opción **Jugar otra vez**.
7. Un dron patrulla el centro. El segundo vigila el lado derecho, persigue a Píxel cuando se acerca y apunta sus bombas por delante de su movimiento. Ambos lanzan bombas cada pocos segundos. Un círculo rojo marca dónde caerá cada una, con tiempo para apartarse. Cada contacto con un dron o una explosión quita una vida; tras un impacto hay un breve periodo de protección.
8. Los drones aceleran a medida que avanza la partida: +10 % al cumplir 30 segundos de juego y +20 % al cumplir 40, con el aviso **«¡Los drones aceleran!»**. Además, cada batería recogida suma un 5 % de velocidad, con un tope del 10 % por baterías.
9. Si pierde todas sus vidas o el tiempo llega a cero, aparece **«Misión fallida»** con la opción **Reintentar**.
10. Durante la partida suena una música en bucle generada por el navegador. Se activa o silencia con el botón **Música** o la tecla **M**.

## Dificultad

La dificultad solo ajusta parámetros; las reglas son las mismas en los cuatro modos. Se elige antes de empezar, no puede cambiarse a mitad de partida y el navegador recuerda la última elección.

| Parámetro | Fácil | Normal | Difícil | Contrarreloj |
| --- | --- | --- | --- | --- |
| Tiempo límite | 90 s | 75 s | 60 s | 25 s |
| Vidas | 4 | 3 | 2 | 3 |
| Baterías para abrir la puerta | 3 | 3 | 4 | 3 |
| Velocidad base de los drones | 0,8× | 1× | 1,3× | 1× |
| Espera entre bombas | 1,3× (menos bombas) | 1× | 0,75× (más bombas) | 1× |

**Contrarreloj** es Normal con 25 segundos: si el tiempo llega a cero se pierde al instante, y tocar la puerta abierta con 1 o 2 segundos restantes sigue siendo victoria. Como dura menos de 30 segundos, la aceleración por tiempo nunca se activa; la de las baterías sí.

En Difícil aparece una cuarta batería en la esquina inferior derecha. La aceleración por tiempo y por baterías se aplica sobre la velocidad base de cada modo.

Una partida ideal dura entre 40 y 75 segundos. El juego debe poder entenderse mirando la pantalla y leyendo la instrucción inicial.

## Reglas exactas

| Situación | Resultado |
| --- | --- |
| Tocar una batería disponible | Se recoge, desaparece y el contador sube una unidad. |
| Volver a pasar por una batería ya recogida | No cambia nada. |
| Tocar la puerta con menos baterías de las requeridas | No gana; se indica cuántas faltan. |
| Tocar la puerta con todas las baterías y tiempo mayor que cero | Gana; el juego se detiene. |
| Tocar cualquiera de los drones | Pierde una vida y obtiene una breve protección. |
| Permanecer en el círculo de una bomba al explotar | Pierde una vida y obtiene una breve protección. |
| Chocar con una caja o reactor | El obstáculo lo detiene; puede rodearlo. |
| Cumplir 30 o 40 segundos de partida | Los drones aceleran y aparece un aviso. |
| Recoger una batería | Los drones aceleran un 5 %, hasta un máximo del 10 % por baterías. |
| Perder todas las vidas | Pierde; el juego se detiene. |
| El tiempo llega a cero | Pierde; el juego se detiene. |
| Reiniciar después de ganar o perder | Vuelven Píxel, las baterías, ambos drones, las vidas y el tiempo de la dificultad elegida (en Normal: tres vidas, 75 segundos, contador `0/3`), su velocidad base, la puerta bloqueada y sin bombas activas. La dificultad se conserva. |

Si dos sucesos ocurren casi al mismo tiempo, **la derrota por daño o por tiempo tiene prioridad**. Así evitamos una pantalla que diga a la vez «ganaste» y «perdiste».

## Aspecto y movimiento

- **Estilo:** ilustración 2D de ciencia ficción amable. Azul marino en el escenario, luces cian para la energía y acentos ámbar para avisos y peligro.
- **Píxel:** el robot blanco y azul rebota e inclina el cuerpo al caminar, deja pequeñas chispas bajo los pies y se ilumina al recibir daño.
- **Baterías:** tres copias del mismo asset, colocadas en posiciones fijas y fáciles de distinguir del fondo.
- **Drones:** el primero patrulla horizontal y verticalmente y apunta a la posición del jugador. El segundo vigila el lado derecho y persigue al jugador cuando está a menos de 440 unidades; sus bombas anticipan 0,65 segundos de movimiento. Ambos tienen anillos animados y señalan la zona de impacto durante el vuelo.
- **Obstáculos:** cajas metálicas y reactores energizados con assets SVG independientes. Sus formas visibles corresponden a sus zonas de colisión.
- **Puerta:** visible desde el principio. Su cambio de estado debe notarse mediante brillo, color del indicador o una etiqueta HTML; la ilustración por sí sola no debe cargar toda la información.
- **Sonido:** una melodía en bucle generada con Web Audio (sin archivos ni conexión) suena mientras se juega y se puede silenciar con **M**. El juego tiene que entenderse también sin audio.

## Assets ya disponibles

Todos están en [`assets/`](../assets/):

| Archivo | Uso en pantalla |
| --- | --- |
| [`robot-pixel.png`](../assets/robot-pixel.png) | Jugador. |
| [`bateria.png`](../assets/bateria.png) | Se repite tres veces. |
| [`dron.png`](../assets/dron.png) | Enemigo. |
| [`puerta.png`](../assets/puerta.png) | Salida. |
| [`laboratorio.jpg`](../assets/laboratorio.jpg) | Fondo del nivel. |

Los assets vectoriales son [`caja-industrial.svg`](../assets/caja-industrial.svg), [`reactor-horizontal.svg`](../assets/reactor-horizontal.svg), [`reactor-vertical.svg`](../assets/reactor-vertical.svg), [`bomba-dron.svg`](../assets/bomba-dron.svg), [`alerta-bomba.svg`](../assets/alerta-bomba.svg) y [`explosion-bomba.svg`](../assets/explosion-bomba.svg). Son archivos de imagen separados que se pueden abrir y editar sin tocar la lógica del juego.

Los objetos recortados tienen transparencia; los textos, botones, contador y mensajes se dibujan como interfaz para que sigan siendo nítidos en el proyector.

## Pantallas necesarias

1. **Inicio:** título, instrucción breve, selector de dificultad y botón **Empezar**. El nivel se ve detrás.
2. **Jugando:** escenario, indicador `0/3`, temporizador y mensajes breves.
3. **Victoria:** «¡Escapaste!», tiempo restante y botón **Jugar otra vez**.
4. **Derrota:** «Misión fallida», causa —dron o tiempo— y botón **Reintentar**.

No hacen falta otros menús, cuentas, guardado de partidas ni más niveles.

## Criterio de terminado

Una persona que no conoce el proyecto puede iniciar, ganar, perder y reiniciar usando solo lo que aparece en pantalla. Los casos de la tabla de reglas se reproducen de forma consistente. El juego funciona localmente, sin conexión a internet, y cabe completo en la pantalla del proyector.
