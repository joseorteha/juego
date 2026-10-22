# Dirección visual y colores — Escapa del laboratorio

## Personalidad

**Retrofuturismo industrial amable.** El laboratorio tiene piezas metálicas usadas y luces de energía; Píxel tiene formas redondas y una cara expresiva. La interfaz parece un pequeño panel de control físico, con etiquetas cortas y estados muy claros.

La dirección sale de los assets que ya existen: suelo azul pizarra, robot color marfil, energía cian y luces ámbar. Para que tenga identidad propia, el marfil del robot también vive en la tipografía y el ámbar se reserva para las decisiones y advertencias. Evitamos cubrir toda la pantalla de neón, paneles de vidrio transparente o indicadores diminutos.

## Paleta propuesta

| Token | Color | Función |
| --- | --- | --- |
| Tinta profunda | `#091523` | Marco exterior y fondo más oscuro. |
| Panel | `#10283D` | Banda del marcador y ventanas de inicio, victoria y derrota. |
| Panel elevado | `#183950` | Botones secundarios y paneles sobrepuestos. |
| Marfil de Píxel | `#F3E5CE` | Texto principal y contornos claros; conecta con el personaje. |
| Texto secundario | `#C6D6DE` | Instrucciones y datos de menor jerarquía. |
| Energía | `#5CF4EE` | Baterías, progreso y puerta disponible. |
| Señal ámbar | `#FFC466` | Botón principal, foco de teclado, puerta bloqueada y avisos. |
| Alerta coral | `#FF7D72` | Derrota y tiempo crítico, siempre acompañados por texto o icono. |
| Línea clara | `#6B91A2` | Contorno de controles sobre el panel. |

El escenario ya contiene tonos azul pizarra cercanos a `#26496A` y `#3B5C7A`; esos tonos pertenecen a la ilustración, no deben repetirse como color de texto sobre el suelo. Para las proporciones visuales: predominan azul oscuro y pizarra, el marfil lleva la lectura, el cian aparece donde hay energía y el ámbar/coral solo cuando hay una acción o consecuencia.

### Variables listas para implementar

```css
:root {
  --lab-ink: #091523;
  --lab-panel: #10283d;
  --lab-panel-raised: #183950;
  --lab-text: #f3e5ce;
  --lab-text-muted: #c6d6de;
  --lab-energy: #5cf4ee;
  --lab-signal: #ffc466;
  --lab-danger: #ff7d72;
  --lab-line: #6b91a2;
}
```

## Contraste comprobado de los pares principales

Valores calculados con la fórmula de contraste de WCAG; son aproximaciones para **colores sólidos**. La legibilidad final sobre el escenario ilustrado se tiene que comprobar en pantalla y en el proyector.

| Combinación | Relación aproximada | Uso |
| --- | ---: | --- |
| Marfil sobre panel | `12.1:1` | Texto principal. |
| Texto secundario sobre panel | `10.1:1` | Instrucciones. |
| Cian sobre panel | `11.2:1` | Número de baterías. |
| Ámbar sobre panel | `9.6:1` | Avisos. |
| Coral sobre panel | `6.1:1` | Derrota y tiempo crítico. |
| Tinta profunda sobre botón cian | `13.7:1` | Texto de botón alternativo. |
| Tinta profunda sobre botón ámbar | `11.7:1` | Texto del botón principal. |
| Línea clara contra panel | `4.4:1` | Contornos y foco. |

El coral **no se usará directamente como texto sobre el suelo**: en un área clara del escenario puede bajar de `3:1`. Los mensajes estarán en un panel opaco. WCAG recomienda al menos `4.5:1` para texto normal y `3:1` para texto grande o componentes esenciales; buscamos margen adicional por la proyección en un salón. [W3C, contraste de texto](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [W3C, contraste no textual](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast).

## Dónde va cada color

| Elemento | Tratamiento |
| --- | --- |
| Barra superior | Panel `#10283D` sólido u opacidad cercana al 100 %, texto marfil. |
| Baterías `0/3` | Número cian más icono de batería y texto; nunca solo tres puntos de color. |
| Tiempo normal | Marfil. En los últimos 10 segundos cambia a coral y añade «¡Tiempo!»; no parpadea. |
| Puerta cerrada | Imagen de puerta con etiqueta **BLOQUEADA · FALTAN 2** en ámbar. |
| Puerta abierta | Contorno cian con etiqueta **SALIDA ABIERTA** y símbolo de confirmación. |
| Dron | Silueta oscura existente con anillo o contorno ámbar para separarla del suelo; icono de advertencia opcional. |
| Botón Empezar / Reintentar | Fondo ámbar, texto tinta profunda, borde visible y foco claro. |
| Victoria | Panel opaco, titular marfil y acento cian; mensaje «¡Escapaste!». |
| Derrota | Panel opaco, titular marfil y acento coral; mensaje explica si fue el dron o el tiempo. |

La batería y la puerta comparten luz cian en los assets, así que se diferencian por **forma, tamaño, posición y etiquetas**. El dron oscuro necesita comprobación especial contra el suelo azul; su contorno ámbar es parte de la interfaz del juego, no un cambio a la imagen original. La guía de Xbox aconseja que la información importante no dependa solo del color y que los objetos clave se distingan del fondo. [Xbox, canales visuales](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/103), [Xbox, contraste](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/102).

## Composición de la pantalla

```text
┌──────────────────────────────────────────────────────────────────────┐
│ PÍXEL / LAB 01              ⚡ BATERÍAS 0/3             TIEMPO 75  │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│                    ESCENARIO ILUSTRADO 16:9                          │
│          robot    batería     dron    batería    puerta             │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│ ← ↑ ↓ → o WASD para moverte              OBJETIVO: 3 baterías       │
└──────────────────────────────────────────────────────────────────────┘
```

- La **barra superior** queda fuera de la zona de juego y no tapa al robot ni la puerta.
- La **franja inferior** contiene una instrucción corta; puede ocultarse tras los primeros segundos si se mantiene un botón visible de ayuda.
- Inicio, victoria y derrota usan un panel central opaco con un solo botón principal. El fondo se oscurece ligeramente detrás, sin desenfoque fuerte.
- Mantener el objetivo y el avance visibles reduce lo que el jugador tiene que recordar. [Xbox, claridad del objetivo](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/109).

## Tipografía y detalles que evitan un aspecto genérico

- Titulares cortos con una **sans geométrica de carácter técnico**; texto de instrucciones con sans sencilla y legible. Los números del HUD pueden usar una monoespaciada si sigue leyéndose bien a distancia.
- En proyección 1080p, empezar con **HUD de 28–32 px**, instrucciones de **24–28 px** y titulares de **48–56 px**; ajustar después de probar desde el fondo del salón. Son objetivos de diseño para este taller, no mínimos universales. Xbox recomienda considerar la distancia y no usar texto demasiado pequeño. [Xbox, texto en juegos](https://learn.microsoft.com/gaming/accessibility/xbox-accessibility-guidelines/101).
- El laboratorio tiene paneles con esquinas recortadas, una línea de unión metálica y pequeñas marcas de mantenimiento. Usar esos detalles **en uno o dos sitios**, no en cada botón.
- Las luces pueden tener un brillo suave y localizado. No usar un resplandor permanente alrededor de todo el HUD.
- Un botón siempre lleva verbo visible: **Empezar**, **Reintentar**, **Jugar otra vez**.
- El foco del teclado debe verse con un contorno ámbar grueso; no depender únicamente del cambio de fondo.

El análisis de interfaz de *Forever Skies* es una referencia útil para separar una paleta estructural de otra que comunica estados; aquí lo adaptamos a un juego más cálido y simple. [Caso del diseñador de Forever Skies](https://kjamiolkowski.com/work/forever-skies).

## Movimiento y efectos

Permitir un pequeño rebote de Píxel al caminar y una respuesta breve al recoger una batería. No usar sacudidas de cámara, flashes, texto parpadeante ni animaciones constantes detrás de las instrucciones. Si hay animaciones decorativas, respetar `prefers-reduced-motion`. [Xbox, distracciones y movimiento](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/117).

## Comprobaciones antes del taller

1. Abrirlo en el proyector real o en una pantalla 1080p y leer contador, tiempo e instrucciones desde el fondo del salón.
2. Jugar con sonido apagado: todas las decisiones importantes siguen siendo comprensibles.
3. Verlo en escala de grises: batería, dron, puerta cerrada y puerta abierta siguen distinguiéndose por forma, texto o contorno. [Game Accessibility Guidelines, color](https://gameaccessibilityguidelines.com/ensure-no-essential-information-is-conveyed-by-a-fixed-colour-alone/).
4. Comprobar que ninguna etiqueta aparece directamente sobre una zona clara o muy detallada del fondo. [Game Accessibility Guidelines, contraste](https://gameaccessibilityguidelines.com/provide-high-contrast-between-text-ui-and-background/).
5. Probar enfoque visible con teclado en **Empezar**, **Reintentar** y **Jugar otra vez**.

Esta es una **dirección visual y un conjunto de tokens**, todavía no una pantalla implementada. Al construirla, la prioridad será verificarla con los assets colocados a tamaño real.
