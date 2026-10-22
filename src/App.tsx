import { useCallback, useEffect, useRef, useState } from "react";
import robot from "../assets/robot-pixel.png";
import battery from "../assets/bateria.png";
import drone from "../assets/dron.png";
import door from "../assets/puerta.png";
import lab from "../assets/laboratorio.jpg";
import crateArt from "../assets/caja-industrial.svg";
import reactorWideArt from "../assets/reactor-horizontal.svg";
import reactorTallArt from "../assets/reactor-vertical.svg";
import bombArt from "../assets/bomba-dron.svg";
import bombWarningArt from "../assets/alerta-bomba.svg";
import bombExplosionArt from "../assets/explosion-bomba.svg";
import {
  advanceGame,
  BATTERIES,
  batteryCount,
  bombPosition,
  createGame,
  DOOR,
  MAX_HEALTH,
  OBSTACLES,
  restartGame,
  startGame,
  type Bomb,
  type Direction,
  type GameState,
  type Obstacle,
} from "./gameEngine";

const keyDirections: Record<string, Direction> = {
  arrowleft: "left",
  a: "left",
  arrowright: "right",
  d: "right",
  arrowup: "up",
  w: "up",
  arrowdown: "down",
  s: "down",
};

function resetLabel(phase: GameState["phase"]) {
  return phase === "won" ? "Jugar otra vez" : "Reintentar";
}

function ObstacleSprite({ obstacle }: { obstacle: Obstacle }) {
  const { x, y, width, height, kind } = obstacle;
  const art =
    kind === "crate"
      ? crateArt
      : height > width
        ? reactorTallArt
        : reactorWideArt;
  return (
    <image
      href={art}
      className={`obstacle-art obstacle-${kind}`}
      x={x - width / 2}
      y={y - height / 2}
      width={width}
      height={height}
      preserveAspectRatio="none"
    />
  );
}

function BombSprite({ bomb }: { bomb: Bomb }) {
  const position = bombPosition(bomb);
  const progress = bomb.elapsed / bomb.duration;
  return (
    <g className="bomb-effect">
      {bomb.blastLeft > 0 ? (
        <g
          transform={`translate(${bomb.target.x} ${bomb.target.y})`}
          className="bomb-blast"
        >
          <image
            href={bombExplosionArt}
            x="-130"
            y="-130"
            width="260"
            height="260"
          />
        </g>
      ) : (
        <>
          <g
            transform={`translate(${bomb.target.x} ${bomb.target.y})`}
            className="bomb-target"
          >
            <image
              className="target-decal"
              href={bombWarningArt}
              x="-120"
              y="-120"
              width="240"
              height="240"
            />
            <text y="118" textAnchor="middle">
              ¡CUIDADO!
            </text>
          </g>
          <g
            transform={`translate(${position.x} ${position.y}) scale(${1 + progress * 0.55})`}
            className="flying-bomb"
          >
            <image
              className="bomb-art"
              href={bombArt}
              x="-36"
              y="-36"
              width="72"
              height="72"
            />
          </g>
        </>
      )}
    </g>
  );
}

export function App() {
  const [game, setGame] = useState<GameState>(() => createGame());
  const keys = useRef<Set<Direction>>(new Set());
  const count = batteryCount(game);

  const restart = useCallback(() => {
    keys.current.clear();
    setGame((previous) => restartGame(previous));
  }, []);

  const begin = useCallback(() => {
    keys.current.clear();
    setGame((previous) => startGame(previous));
  }, []);

  useEffect(() => {
    const onDown = (event: KeyboardEvent) => {
      const direction = keyDirections[event.key.toLowerCase()];
      if (direction) {
        event.preventDefault();
        keys.current.add(direction);
      }
      if (event.key === "Enter" || event.key === " ") {
        if (game.phase === "ready") {
          event.preventDefault();
          begin();
        } else if (game.phase === "won" || game.phase === "lost") {
          event.preventDefault();
          restart();
        }
      }
    };
    const onUp = (event: KeyboardEvent) => {
      const direction = keyDirections[event.key.toLowerCase()];
      if (direction) keys.current.delete(direction);
    };
    const onBlur = () => keys.current.clear();
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
      window.removeEventListener("blur", onBlur);
    };
  }, [begin, restart, game.phase]);

  useEffect(() => {
    if (game.phase !== "playing") return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      // Captura los valores antes de encolar la actualización de React.
      // El updater puede ejecutarse después de que `last` y las teclas cambien.
      const elapsed = (now - last) / 1000;
      const input = new Set(keys.current);
      last = now;
      setGame((previous) => advanceGame(previous, input, elapsed));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [game.phase]);

  const exitOpen = count === 3;
  const isMoving = keys.current.size > 0 && game.phase === "playing";

  return (
    <main className="app-shell">
      <div className="frame">
        <header className="hud">
          <div className="brand">
            <span className="brand-kicker">LAB 01 / MISIÓN</span>
            <strong>
              PÍXEL <span className="brand-light">·</span> ESCAPA
            </strong>
          </div>
          <div className="status-group">
            <div
              className={`status health-status ${game.health === 1 ? "critical" : ""}`}
              aria-label={`${game.health} de ${MAX_HEALTH} vidas restantes`}
            >
              <span className="status-icon" aria-hidden="true">
                ♥
              </span>
              <span className="status-label">VIDAS</span>
              <strong>
                {game.health}
                <span className="status-total">/{MAX_HEALTH}</span>
              </strong>
            </div>
            <div
              className="status battery-status"
              aria-label={`${count} de 3 baterías recogidas`}
            >
              <span className="status-icon" aria-hidden="true">
                ▰
              </span>
              <span className="status-label">BATERÍAS</span>
              <strong>
                {count}
                <span className="status-total">/3</span>
              </strong>
            </div>
            <div
              className={`status time-status ${game.time <= 10 && game.phase === "playing" ? "critical" : ""}`}
              aria-label={`${Math.ceil(game.time)} segundos restantes`}
            >
              <span className="status-icon" aria-hidden="true">
                ◷
              </span>
              <span className="status-label">TIEMPO</span>
              <strong>{String(Math.ceil(game.time)).padStart(2, "0")}</strong>
            </div>
          </div>
        </header>

        <section className="stage" aria-label="Escenario del laboratorio">
          <svg
            className="game-world"
            viewBox="0 0 1600 900"
            role="img"
            aria-label={`Píxel en el laboratorio. ${count} de 3 baterías. ${Math.ceil(game.time)} segundos.`}
          >
            <image
              href={lab}
              x="0"
              y="0"
              width="1600"
              height="900"
              preserveAspectRatio="xMidYMid slice"
            />
            <rect
              x="44"
              y="78"
              width="1512"
              height="744"
              rx="20"
              className="floor-boundary"
            />
            {OBSTACLES.map((obstacle, index) => (
              <ObstacleSprite key={index} obstacle={obstacle} />
            ))}
            <ellipse
              cx={DOOR.x}
              cy={DOOR.y + 105}
              rx="106"
              ry="27"
              className={exitOpen ? "door-shadow open" : "door-shadow"}
            />
            <image
              href={door}
              x={DOOR.x - 94}
              y={DOOR.y - 120}
              width="188"
              height="237"
            />
            <g className={`door-status ${exitOpen ? "open" : "locked"}`}>
              <rect
                x={DOOR.x - 110}
                y={DOOR.y + 100}
                width="220"
                height="48"
                rx="10"
              />
              <text x={DOOR.x} y={DOOR.y + 132} textAnchor="middle">
                {exitOpen ? "SALIDA ABIERTA" : "BLOQUEADA"}
              </text>
            </g>
            {BATTERIES.map(
              (point, index) =>
                !game.batteries[index] && (
                  <g key={index} className="battery-sprite">
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="56"
                      className="battery-halo"
                    />
                    <image
                      href={battery}
                      x={point.x - 43}
                      y={point.y - 53}
                      width="86"
                      height="106"
                    />
                  </g>
                ),
            )}
            {game.bombs.map((bomb) => (
              <BombSprite key={bomb.id} bomb={bomb} />
            ))}
            <g
              transform={`translate(${game.droneX} ${game.droneY})`}
              className="drone-rig"
            >
              <circle r="75" className="drone-ring" />
              <circle r="92" className="drone-scan" />
              <image href={drone} x="-74" y="-52" width="148" height="104" />
              <circle className="drone-eye" r="11" />
            </g>
            <g
              transform={`translate(${game.player.x} ${game.player.y})`}
              className={`player-rig ${isMoving ? "walking" : ""} ${game.invulnerability > 0 ? "hurt" : ""}`}
            >
              <ellipse cy="52" rx="40" ry="11" className="player-shadow" />
              {isMoving && (
                <g className="foot-sparks">
                  <circle cx="-27" cy="47" r="5" />
                  <circle cx="23" cy="52" r="4" />
                </g>
              )}
              <g transform={game.facing === "left" ? "scale(-1 1)" : undefined}>
                <g className="player-body">
                  <image
                    href={robot}
                    x="-57"
                    y="-62"
                    width="114"
                    height="112"
                  />
                </g>
              </g>
            </g>
          </svg>

          {game.phase === "playing" && game.message && (
            <div className="toast" role="status">
              {game.message}
            </div>
          )}

          {game.phase !== "playing" && (
            <div className="overlay">
              <div className="modal">
                <div className="modal-kicker">
                  {game.phase === "ready"
                    ? "MISIÓN 01 / LABORATORIO"
                    : game.phase === "won"
                      ? "MISIÓN COMPLETADA"
                      : "MISIÓN INTERRUMPIDA"}
                </div>
                <h1>
                  {game.phase === "ready" ? (
                    <>
                      ESCAPA DEL
                      <br />
                      <em>LABORATORIO</em>
                    </>
                  ) : game.phase === "won" ? (
                    <>
                      ¡LO <em>LOGRASTE!</em>
                    </>
                  ) : (
                    <>
                      MISIÓN <em>FALLIDA</em>
                    </>
                  )}
                </h1>
                <p>
                  {game.phase === "ready"
                    ? "Recoge las tres baterías, esquiva al dron y sus bombas, y llega a la salida. Tienes tres vidas."
                    : game.phase === "won"
                      ? `Saliste con ${Math.ceil(game.time)} segundos restantes.`
                      : game.lossReason === "drone"
                        ? "El dron agotó tus vidas. Inténtalo otra vez."
                        : game.lossReason === "bomb"
                          ? "Las bombas agotaron tus vidas. Inténtalo otra vez."
                          : "Se agotó el tiempo. Inténtalo otra vez."}
                </p>
                {game.phase === "ready" && (
                  <div className="controls-tip">
                    <span>W A S D</span>
                    <span>o</span>
                    <span>← ↑ ↓ →</span>
                    <span>para moverte</span>
                  </div>
                )}
                <button
                  className="primary-button"
                  type="button"
                  onClick={game.phase === "ready" ? begin : restart}
                >
                  {game.phase === "ready"
                    ? "Empezar misión"
                    : resetLabel(game.phase)}{" "}
                  <span aria-hidden="true">↗</span>
                </button>
              </div>
            </div>
          )}
        </section>

        <footer className="bottom-bar">
          <span>
            <span className="key-cap">WASD</span> o{" "}
            <span className="key-cap">FLECHAS</span> para moverte
          </span>
          <span className="objective">
            <span className="objective-dot" />{" "}
            {exitOpen
              ? "OBJETIVO: LLEGA A LA SALIDA"
              : `OBJETIVO: REÚNE ${3 - count} BATERÍAS`}
          </span>
          <button type="button" className="reset-button" onClick={restart}>
            Reiniciar ↺
          </button>
        </footer>
      </div>
    </main>
  );
}
