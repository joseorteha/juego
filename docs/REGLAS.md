# Escapa del laboratorio

> Minijuego de navegador para el workshop **Prácticas para el desarrollo moderno de software**.

La paleta, jerarquía visual y reglas de legibilidad están en [Diseño visual](./DISENO_VISUAL.md).

## La idea

Píxel, un pequeño robot explorador, quedó encerrado en un laboratorio. La puerta necesita energía para abrirse. Debe recoger **tres baterías**, rodear los obstáculos, esquivar al dron y sus bombas, y llegar a la salida antes de que se agote el tiempo.

Es un juego corto que cualquier persona puede entender y jugar en menos de un minuto. Su valor para el taller está en que las reglas parecen evidentes hasta que empezamos a preguntar qué debe ocurrir en situaciones límite.

## Lo que ve el jugador

Una sola pantalla horizontal, con el laboratorio de fondo. Píxel inicia cerca de la esquina inferior izquierda. Hay tres baterías separadas entre sí, cajas y reactores que bloquean el camino, un dron que patrulla por el centro y una puerta luminosa al otro extremo.

Encima del escenario aparece una barra sencilla:

```text
PÍXEL: ESCAPA DEL LABORATORIO       VIDAS 3/3       BATERÍAS 0/3       TIEMPO 75
```

La puerta muestra que está bloqueada mientras falten baterías. Al reunir las tres, cambia a un estado visual abierto y el jugador puede llegar a ella para ganar. Las instrucciones iniciales caben en una frase: **«Muévete con WASD o las flechas. Recoge las tres baterías y llega a la puerta. Evita al dron.»**

## Una partida, paso a paso

1. El jugador pulsa **Empezar**. El tiempo comienza en 75 segundos y tiene tres vidas.
2. Mueve a Píxel por el escenario con WASD o las flechas. El personaje no puede salir de los límites visibles ni atravesar los obstáculos; puede deslizarse a lo largo de ellos.
3. Al tocar una batería, esta desaparece, el contador aumenta una vez y aparece una señal breve de recolección.
4. Si toca la puerta antes de reunir las tres, recibe un mensaje breve: **«Faltan baterías»**. La partida continúa.
5. Al recoger la tercera batería, la puerta cambia de apariencia para indicar que ya puede usarse.
6. Si Píxel toca la puerta abierta con tiempo restante, aparece **«¡Escapaste!»** con la opción **Jugar otra vez**.
7. El dron se desplaza en dos ejes y lanza bombas cada pocos segundos. Un círculo rojo marca dónde caerá cada una, con tiempo para apartarse. Cada impacto del dron o una explosión quita una vida; tras un impacto hay un breve periodo de protección.
8. Si pierde las tres vidas o el tiempo llega a cero, aparece **«Misión fallida»** con la opción **Reintentar**.

Una partida ideal dura entre 40 y 75 segundos. El juego debe poder entenderse mirando la pantalla y leyendo la instrucción inicial.

## Reglas exactas

| Situación | Resultado |
| --- | --- |
| Tocar una batería disponible | Se recoge, desaparece y el contador sube una unidad. |
| Volver a pasar por una batería ya recogida | No cambia nada. |
| Tocar la puerta con menos de tres baterías | No gana; se indica cuántas faltan. |
| Tocar la puerta con tres baterías y tiempo mayor que cero | Gana; el juego se detiene. |
| Tocar al dron | Pierde una vida y obtiene una breve protección. |
| Permanecer en el círculo de una bomba al explotar | Pierde una vida y obtiene una breve protección. |
| Chocar con una caja o reactor | El obstáculo lo detiene; puede rodearlo. |
| Perder las tres vidas | Pierde; el juego se detiene. |
| El tiempo llega a cero | Pierde; el juego se detiene. |
| Reiniciar después de ganar o perder | Vuelven Píxel, las tres baterías, el dron, las tres vidas y los 75 segundos; contador `0/3`, puerta bloqueada y sin bombas activas. |

Si dos sucesos ocurren casi al mismo tiempo, **la derrota por daño o por tiempo tiene prioridad**. Así evitamos una pantalla que diga a la vez «ganaste» y «perdiste».

## Aspecto y movimiento

- **Estilo:** ilustración 2D de ciencia ficción amable. Azul marino en el escenario, luces cian para la energía y acentos ámbar para avisos y peligro.
- **Píxel:** el robot blanco y azul rebota e inclina el cuerpo al caminar, deja pequeñas chispas bajo los pies y se ilumina al recibir daño.
- **Baterías:** tres copias del mismo asset, colocadas en posiciones fijas y fáciles de distinguir del fondo.
- **Dron:** patrulla horizontal y verticalmente, con anillos animados, y lanza bombas hacia la posición del jugador. La zona de impacto se señala durante el vuelo.
- **Obstáculos:** cajas metálicas y reactores energizados con assets SVG independientes. Sus formas visibles corresponden a sus zonas de colisión.
- **Puerta:** visible desde el principio. Su cambio de estado debe notarse mediante brillo, color del indicador o una etiqueta HTML; la ilustración por sí sola no debe cargar toda la información.
- **Sonido:** señales breves para recoger, ganar y perder son opcionales. El juego tiene que entenderse también sin audio.

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

1. **Inicio:** título, instrucción de una frase y botón **Empezar**. El nivel se ve detrás.
2. **Jugando:** escenario, indicador `0/3`, temporizador y mensajes breves.
3. **Victoria:** «¡Escapaste!», tiempo restante y botón **Jugar otra vez**.
4. **Derrota:** «Misión fallida», causa —dron o tiempo— y botón **Reintentar**.

No hacen falta menús adicionales, cuentas, guardado ni más niveles.

## Criterio de terminado

Una persona que no conoce el proyecto puede iniciar, ganar, perder y reiniciar usando solo lo que aparece en pantalla. Los casos de la tabla de reglas se reproducen de forma consistente. El juego funciona localmente, sin conexión a internet, y cabe completo en la pantalla del proyector.
