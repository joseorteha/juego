import { describe, expect, it } from "vitest";
import {
  advanceGame,
  BATTERIES,
  chooseDifficulty,
  createGame,
  dronePace,
  DOOR,
  DRONE,
  HUNTER_DRONE,
  MAX_HEALTH,
  OBSTACLES,
  restartGame,
  ROUND_SECONDS,
  START,
  startGame,
} from "./gameEngine";

// Este archivo documenta las reglas observables del juego.

const still = new Set<never>();
const playing = () => startGame(createGame());

describe("recoger baterías", () => {
  it("no recoge dos veces una batería", () => {
    const state = { ...playing(), player: { ...BATTERIES[0] } };
    const first = advanceGame(state, still, 0.016);
    const second = advanceGame(first, still, 0.016);
    expect(first.batteries).toEqual([true, false, false]);
    expect(second.batteries).toEqual([true, false, false]);
  });
});

describe("la puerta", () => {
  it("con menos de tres baterías no gana y avisa cuántas faltan", () => {
    const state = {
      ...playing(),
      batteries: [true, false, false],
      player: { ...DOOR },
    };
    const next = advanceGame(state, still, 0.016);
    expect(next.phase).toBe("playing");
    expect(next.message).toBe("Faltan 2 baterías");
  });

  it("con tres baterías y tiempo restante gana", () => {
    const state = {
      ...playing(),
      batteries: [true, true, true],
      player: { ...DOOR },
    };
    expect(advanceGame(state, still, 0.016).phase).toBe("won");
  });

  it("una vez terminada la partida, no cambia nada más", () => {
    const won = { ...playing(), phase: "won" as const };
    expect(advanceGame(won, new Set(["right"]), 0.05)).toBe(won);
  });
});

describe("derrotas", () => {
  it("el dron quita una vida y da protección breve", () => {
    const state = { ...playing(), player: { x: DRONE.left, y: DRONE.y } };
    const hit = advanceGame(state, still, 0.016);
    expect(hit.health).toBe(MAX_HEALTH - 1);
    expect(hit.phase).toBe("playing");
    expect(advanceGame(hit, still, 0.016).health).toBe(hit.health);
  });

  it("sin vidas, pierde por el dron", () => {
    const state = {
      ...playing(),
      player: { x: DRONE.left, y: DRONE.y },
      health: 1,
    };
    const lost = advanceGame(state, still, 0.016);
    expect(lost.phase).toBe("lost");
    expect(lost.lossReason).toBe("drone");
  });

  it("al llegar a cero segundos pierde, aunque esté en la puerta", () => {
    const state = {
      ...playing(),
      player: { ...DOOR },
      batteries: [true, true, true],
      time: 0.01,
    };
    const lost = advanceGame(state, still, 0.05);
    expect(lost.phase).toBe("lost");
    expect(lost.lossReason).toBe("time");
  });

  it("el tiempo se agota solo con el paso normal de los fotogramas", () => {
    let state = playing();
    for (let i = 0; i < 1600 && state.phase === "playing"; i++)
      state = advanceGame(
        { ...state, health: MAX_HEALTH, bombs: [] },
        still,
        0.05,
      );
    expect(state.phase).toBe("lost");
    expect(state.lossReason).toBe("time");
    expect(state.time).toBe(0);
  });

  it("el dron avisa dónde caerá una bomba y la explosión quita una vida", () => {
    let state = playing();
    for (let i = 0; i < 61; i++) state = advanceGame(state, still, 0.05);
    expect(state.bombs).toHaveLength(1);
    expect(state.bombs[0].target).toEqual(START);
    expect(state.health).toBe(MAX_HEALTH);
    for (let i = 0; i < 30; i++) state = advanceGame(state, still, 0.05);
    expect(state.health).toBe(MAX_HEALTH - 1);
    expect(state.phase).toBe("playing");
  });

  it("el segundo dron se acerca al jugador cuando lo detecta", () => {
    const state = { ...playing(), player: { x: 1250, y: 520 } };
    const next = advanceGame(state, still, 0.05);
    expect(next.hunter.y).toBeGreaterThan(state.hunter.y);
    expect(next.hunter.x).toBe(state.hunter.x);
  });

  it("el segundo dron anticipa el movimiento al lanzar una bomba", () => {
    const state = {
      ...playing(),
      player: { x: 700, y: 700 },
      hunterBombTimer: 0.01,
    };
    const next = advanceGame(state, new Set(["right"]), 0.05);
    expect(next.bombs).toHaveLength(1);
    expect(next.bombs[0].target.x).toBeGreaterThan(next.player.x);
    expect(next.bombs[0].target.y).toBe(next.player.y);
  });

  it("la bomba anticipada permanece dentro del escenario", () => {
    const state = {
      ...playing(),
      player: { x: 1520, y: 700 },
      hunterBombTimer: 0.01,
    };
    const next = advanceGame(state, new Set(["right"]), 0.05);
    expect(next.bombs[0].target.x).toBe(1530);
  });

  it("el segundo dron también quita una vida por contacto", () => {
    const state = { ...playing(), player: { ...HUNTER_DRONE } };
    const next = advanceGame(state, still, 0.016);
    expect(next.health).toBe(MAX_HEALTH - 1);
  });
});

describe("obstáculos", () => {
  it("bloquean al robot y permiten deslizarse por sus bordes", () => {
    const obstacle = OBSTACLES[0];
    const left = obstacle.x - obstacle.width / 2 - 40;
    const state = { ...playing(), player: { x: left, y: obstacle.y } };
    const blocked = advanceGame(state, new Set(["right"]), 0.05);
    expect(blocked.player.x).toBe(left);
    const sliding = advanceGame(state, new Set(["right", "down"]), 0.05);
    expect(sliding.player.y).toBeGreaterThan(state.player.y);
  });
});

describe("dificultad", () => {
  it("normal conserva los valores originales", () => {
    const state = createGame();
    expect(state.difficulty).toBe("normal");
    expect(state.time).toBe(75);
    expect(state.health).toBe(3);
    expect(state.batteries).toHaveLength(3);
  });

  it("fácil y difícil ajustan tiempo, vidas y baterías", () => {
    const easy = createGame("facil");
    expect([easy.time, easy.health, easy.batteries.length]).toEqual([90, 4, 3]);
    const hard = createGame("dificil");
    expect([hard.time, hard.health, hard.batteries.length]).toEqual([60, 2, 4]);
  });

  it("contrarreloj empieza en 25 s y conserva el resto de Normal", () => {
    const rush = createGame("contrarreloj");
    const normal = createGame("normal");
    expect(rush.time).toBe(25);
    expect(rush.health).toBe(3);
    expect(rush.batteries).toHaveLength(3);
    expect(rush.bombTimer).toBe(normal.bombTimer);
    expect(dronePace(startGame(rush))).toBe(dronePace(startGame(normal)));
  });

  it("en contrarreloj, a cero segundos pierde sin tiempo extra", () => {
    const state = {
      ...startGame(createGame("contrarreloj")),
      time: 0.01,
    };
    const lost = advanceGame(state, still, 0.05);
    expect(lost.phase).toBe("lost");
    expect(lost.lossReason).toBe("time");
  });

  it("en contrarreloj, con un segundo restante aún puede escapar", () => {
    const state = {
      ...startGame(createGame("contrarreloj")),
      time: 1,
      batteries: [true, true, true],
      player: { ...DOOR },
    };
    expect(advanceGame(state, still, 0.016).phase).toBe("won");
  });

  it("en difícil tres baterías no bastan para salir", () => {
    const state = {
      ...startGame(createGame("dificil")),
      batteries: [true, true, true, false],
      player: { ...DOOR },
    };
    const next = advanceGame(state, still, 0.016);
    expect(next.phase).toBe("playing");
    expect(next.message).toBe("Falta 1 batería");
    const all = { ...state, batteries: [true, true, true, true] };
    expect(advanceGame(all, still, 0.016).phase).toBe("won");
  });

  it("en difícil la primera bomba llega antes", () => {
    let state = startGame(createGame("dificil"));
    for (let i = 0; i < 46; i++) state = advanceGame(state, still, 0.05);
    expect(state.bombs).toHaveLength(1);
  });

  it("solo se elige antes de empezar", () => {
    const ready = createGame();
    expect(chooseDifficulty(ready, "facil").difficulty).toBe("facil");
    const running = playing();
    expect(chooseDifficulty(running, "facil")).toBe(running);
  });

  it("reiniciar conserva la dificultad elegida", () => {
    const hard = {
      ...startGame(createGame("dificil")),
      phase: "lost" as const,
      health: 0,
    };
    const reset = restartGame(hard);
    expect(reset.difficulty).toBe("dificil");
    expect(reset.health).toBe(2);
    expect(reset.time).toBe(60);
    expect(reset.batteries).toEqual([false, false, false, false]);
  });
});

describe("aceleración de los drones", () => {
  it("aceleran a los 30 y a los 40 segundos de partida", () => {
    expect(dronePace({ ...playing(), worldTime: 29.9 })).toBe(1);
    expect(dronePace({ ...playing(), worldTime: 30 })).toBeCloseTo(1.1);
    expect(dronePace({ ...playing(), worldTime: 40 })).toBeCloseTo(1.2);
  });

  it("cada batería suma un 5 % con un tope del 10 %", () => {
    const pace = (batteries: boolean[]) =>
      dronePace({ ...playing(), batteries });
    expect(pace([true, false, false])).toBeCloseTo(1.05);
    expect(pace([true, true, false])).toBeCloseTo(1.1);
    expect(pace([true, true, true])).toBeCloseTo(1.1);
  });

  it("el dron patrulla más rápido tras recoger baterías", () => {
    const base = playing();
    const boosted = { ...base, batteries: [true, true, false] };
    const step = (state: typeof base) =>
      advanceGame(state, still, 0.05).droneX - state.droneX;
    expect(step(boosted)).toBeCloseTo(step(base) * 1.1);
  });

  it("avisa cuando los drones aceleran", () => {
    const state = { ...playing(), worldTime: 29.99 };
    expect(advanceGame(state, still, 0.05).message).toBe(
      "¡Los drones aceleran!",
    );
  });
});

describe("reiniciar", () => {
  const dirty = () => ({
    ...playing(),
    phase: "lost" as const,
    batteries: [true, false, true],
    time: 3,
    health: 0,
    player: { ...DOOR },
    bombs: [
      {
        id: 9,
        origin: { x: 0, y: 0 },
        target: { x: 1, y: 1 },
        elapsed: 1,
        duration: 1.45,
        blastLeft: 0,
      },
    ],
    droneX: DRONE.right,
    hunter: { x: 900, y: 700 },
    hunterBombTimer: 0.2,
  });

  it("restaura baterías, tiempo, vidas, jugador, dron y bombas", () => {
    const reset = restartGame(dirty());
    expect(reset.phase).toBe("ready");
    expect(reset.batteries).toEqual([false, false, false]);
    expect(reset.time).toBe(ROUND_SECONDS);
    expect(reset.health).toBe(MAX_HEALTH);
    expect(reset.player).toEqual(START);
    expect(reset.droneX).toBe(DRONE.left);
    expect(reset.hunter).toEqual(HUNTER_DRONE);
    expect(reset.hunterBombTimer).toBe(4.5);
    expect(reset.bombs).toEqual([]);
  });

  it("tras ganar, una nueva partida empieza con la puerta bloqueada", () => {
    const won = {
      ...dirty(),
      phase: "won" as const,
      batteries: [true, true, true],
    };
    const next = startGame(restartGame(won));
    const atDoor = advanceGame({ ...next, player: { ...DOOR } }, still, 0.016);
    expect(atDoor.phase).toBe("playing");
  });
});
