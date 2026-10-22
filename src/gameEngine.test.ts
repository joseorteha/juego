import { describe, expect, it } from "vitest";
import {
  advanceGame,
  BATTERIES,
  createGame,
  DOOR,
  DRONE,
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
  });

  it("restaura baterías, tiempo, vidas, jugador, dron y bombas", () => {
    const reset = restartGame(dirty());
    expect(reset.phase).toBe("ready");
    expect(reset.batteries).toEqual([false, false, false]);
    expect(reset.time).toBe(ROUND_SECONDS);
    expect(reset.health).toBe(MAX_HEALTH);
    expect(reset.player).toEqual(START);
    expect(reset.droneX).toBe(DRONE.left);
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
