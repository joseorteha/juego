export type Phase = "ready" | "playing" | "won" | "lost";
export type Direction = "left" | "right" | "up" | "down";
export type Point = { x: number; y: number };
export type Obstacle = Point & {
  width: number;
  height: number;
  kind: "crate" | "reactor";
};
export type Bomb = {
  id: number;
  origin: Point;
  target: Point;
  elapsed: number;
  duration: number;
  blastLeft: number;
};

export const WORLD = { width: 1600, height: 900 };
export const START: Point = { x: 150, y: 690 };
export const ROUND_SECONDS = 75;
export const MAX_HEALTH = 3;
export const BATTERIES: Point[] = [
  { x: 345, y: 265 },
  { x: 795, y: 670 },
  { x: 1190, y: 280 },
];
export const DOOR: Point = { x: 1435, y: 450 };
export const DRONE = { left: 550, right: 1110, y: 430 };
export const OBSTACLES: Obstacle[] = [
  { x: 505, y: 525, width: 148, height: 108, kind: "crate" },
  { x: 860, y: 230, width: 154, height: 98, kind: "reactor" },
  { x: 1035, y: 680, width: 176, height: 96, kind: "crate" },
  { x: 1280, y: 515, width: 112, height: 150, kind: "reactor" },
];

export type GameState = {
  phase: Phase;
  player: Point;
  batteries: boolean[];
  time: number;
  health: number;
  invulnerability: number;
  facing: "left" | "right";
  worldTime: number;
  droneX: number;
  droneY: number;
  droneDirection: 1 | -1;
  bombs: Bomb[];
  bombTimer: number;
  nextBombId: number;
  message: string;
  messageTime: number;
  lossReason: "drone" | "bomb" | "time" | null;
};

export const batteryCount = (state: GameState) =>
  state.batteries.filter(Boolean).length;

export function createGame(): GameState {
  return {
    phase: "ready",
    player: { ...START },
    batteries: [false, false, false],
    time: ROUND_SECONDS,
    health: MAX_HEALTH,
    invulnerability: 0,
    facing: "right",
    worldTime: 0,
    droneX: DRONE.left,
    droneY: DRONE.y,
    droneDirection: 1,
    bombs: [],
    bombTimer: 3,
    nextBombId: 1,
    message: "",
    messageTime: 0,
    lossReason: null,
  };
}

export function restartGame(previous: GameState): GameState {
  // Todo lo que cambia durante una partida vuelve a su valor inicial.
  return { ...previous, ...createGame() };
}

export function startGame(state: GameState): GameState {
  return { ...state, phase: "playing", message: "", messageTime: 0 };
}

const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const playerBlocked = (point: Point) =>
  OBSTACLES.some((obstacle) => {
    const nearestX = clamp(
      point.x,
      obstacle.x - obstacle.width / 2,
      obstacle.x + obstacle.width / 2,
    );
    const nearestY = clamp(
      point.y,
      obstacle.y - obstacle.height / 2,
      obstacle.y + obstacle.height / 2,
    );
    return distance(point, { x: nearestX, y: nearestY }) < 37;
  });

export function bombPosition(bomb: Bomb): Point {
  const progress = clamp(bomb.elapsed / bomb.duration, 0, 1);
  return {
    x: bomb.origin.x + (bomb.target.x - bomb.origin.x) * progress,
    y:
      bomb.origin.y +
      (bomb.target.y - bomb.origin.y) * progress -
      Math.sin(progress * Math.PI) * 155,
  };
}

export function advanceGame(
  state: GameState,
  input: ReadonlySet<Direction>,
  elapsed: number,
): GameState {
  if (state.phase !== "playing") return state;
  const dt = clamp(elapsed, 0, 0.05);
  const time = Math.max(0, state.time - dt);
  const worldTime = state.worldTime + dt;

  let dx = Number(input.has("right")) - Number(input.has("left"));
  let dy = Number(input.has("down")) - Number(input.has("up"));
  const magnitude = Math.hypot(dx, dy);
  if (magnitude > 0) {
    dx /= magnitude;
    dy /= magnitude;
  }
  const nextX = clamp(state.player.x + dx * 350 * dt, 70, WORLD.width - 70);
  const nextY = clamp(state.player.y + dy * 350 * dt, 110, WORLD.height - 75);
  const player = { ...state.player };
  if (!playerBlocked({ x: nextX, y: player.y })) player.x = nextX;
  if (!playerBlocked({ x: player.x, y: nextY })) player.y = nextY;
  const facing = dx < 0 ? "left" : dx > 0 ? "right" : state.facing;

  let droneX = state.droneX + state.droneDirection * 285 * dt;
  let droneDirection = state.droneDirection;
  if (droneX > DRONE.right) {
    droneX = DRONE.right - (droneX - DRONE.right);
    droneDirection = -1;
  }
  if (droneX < DRONE.left) {
    droneX = DRONE.left + (DRONE.left - droneX);
    droneDirection = 1;
  }
  const droneY = DRONE.y + Math.sin(worldTime * 2.15) * 76;

  let bombTimer = state.bombTimer - dt;
  let nextBombId = state.nextBombId;
  const bombs = state.bombs
    .map((bomb) => {
      if (bomb.blastLeft > 0)
        return { ...bomb, blastLeft: bomb.blastLeft - dt };
      const elapsed = bomb.elapsed + dt;
      return elapsed >= bomb.duration
        ? { ...bomb, elapsed: bomb.duration, blastLeft: 0.48 }
        : { ...bomb, elapsed };
    })
    .filter((bomb) => bomb.blastLeft > 0 || bomb.elapsed < bomb.duration);
  if (bombTimer <= 0) {
    bombs.push({
      id: nextBombId++,
      origin: { x: droneX, y: droneY },
      target: { ...player },
      elapsed: 0,
      duration: 1.45,
      blastLeft: 0,
    });
    bombTimer = 3.1;
  }

  const batteries = state.batteries.map(
    (taken, index) => taken || distance(player, BATTERIES[index]) < 70,
  );
  const count = batteries.filter(Boolean).length;
  let messageTime = Math.max(0, state.messageTime - dt);
  let message = messageTime > 0 ? state.message : "";
  if (count > batteryCount(state)) {
    message =
      count === 3 ? "¡Salida desbloqueada!" : `Batería ${count}/3 recuperada`;
    messageTime = 1.5;
  }

  let health = state.health;
  let invulnerability = Math.max(0, state.invulnerability - dt);
  const droneHit = distance(player, { x: droneX, y: droneY }) < 84;
  const bombHit = bombs.some(
    (bomb) => bomb.blastLeft > 0 && distance(player, bomb.target) < 94,
  );
  let lossReason: GameState["lossReason"] = null;
  if (invulnerability <= 0 && (droneHit || bombHit)) {
    health -= 1;
    invulnerability = 1.55;
    lossReason = droneHit ? "drone" : "bomb";
    message = health > 0 ? `¡Impacto! Quedan ${health} vidas` : "";
    messageTime = health > 0 ? 1.35 : 0;
  }

  const updated = {
    ...state,
    player,
    facing,
    batteries,
    time,
    health,
    invulnerability,
    worldTime,
    droneX,
    droneY,
    droneDirection,
    bombs,
    bombTimer,
    nextBombId,
    message,
    messageTime,
  };

  // Los peligros y el tiempo tienen prioridad sobre la puerta.
  if (health <= 0) {
    return {
      ...updated,
      phase: "lost",
      message: "",
      messageTime: 0,
      lossReason,
    };
  }
  if (time <= 0) {
    return {
      ...updated,
      phase: "lost",
      time: 0,
      message: "",
      messageTime: 0,
      lossReason: "time",
    };
  }
  if (distance(player, DOOR) < 92) {
    if (count === 3) {
      return {
        ...updated,
        phase: "won",
        message: "",
        messageTime: 0,
        lossReason: null,
      };
    }
    if (messageTime <= 0) {
      message = `Faltan ${3 - count} baterías`;
      messageTime = 1.8;
    }
  }
  return { ...updated, message, messageTime };
}
