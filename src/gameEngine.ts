export type Phase = "ready" | "playing" | "won" | "lost";
export type Direction = "left" | "right" | "up" | "down";
export type Difficulty = "facil" | "normal" | "dificil" | "contrarreloj";
export type DifficultySettings = {
  label: string;
  seconds: number;
  health: number;
  batteries: number;
  droneSpeed: number;
  bombInterval: number;
};
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
// Cada dificultad ajusta parámetros; las reglas son las mismas en las tres.
// bombInterval multiplica la espera entre bombas: menor valor, más bombas.
export const DIFFICULTIES: Record<Difficulty, DifficultySettings> = {
  facil: {
    label: "Fácil",
    seconds: 90,
    health: 4,
    batteries: 3,
    droneSpeed: 0.8,
    bombInterval: 1.3,
  },
  normal: {
    label: "Normal",
    seconds: 75,
    health: 3,
    batteries: 3,
    droneSpeed: 1,
    bombInterval: 1,
  },
  dificil: {
    label: "Difícil",
    seconds: 60,
    health: 2,
    batteries: 4,
    droneSpeed: 1.3,
    bombInterval: 0.75,
  },
  // Igual que Normal, pero con 25 segundos.
  contrarreloj: {
    label: "Contrarreloj",
    seconds: 25,
    health: 3,
    batteries: 3,
    droneSpeed: 1,
    bombInterval: 1,
  },
};
export const ROUND_SECONDS = DIFFICULTIES.normal.seconds;
export const MAX_HEALTH = DIFFICULTIES.normal.health;
// La cuarta batería solo aparece en difícil.
export const BATTERIES: Point[] = [
  { x: 345, y: 265 },
  { x: 795, y: 670 },
  { x: 1190, y: 280 },
  { x: 1450, y: 760 },
];
// Los drones aceleran con el tiempo jugado y con cada batería recogida.
export const PACE_STEPS = [
  { after: 30, boost: 0.1 },
  { after: 40, boost: 0.2 },
];
export const BATTERY_BOOST = 0.05;
export const MAX_BATTERY_BOOST = 0.1;
export const DOOR: Point = { x: 1435, y: 450 };
export const DRONE = { left: 550, right: 1110, y: 430 };
export const HUNTER_DRONE: Point = { x: 1250, y: 260 };
export const OBSTACLES: Obstacle[] = [
  { x: 505, y: 525, width: 148, height: 108, kind: "crate" },
  { x: 860, y: 230, width: 154, height: 98, kind: "reactor" },
  { x: 1035, y: 680, width: 176, height: 96, kind: "crate" },
  { x: 1280, y: 515, width: 112, height: 150, kind: "reactor" },
];

export type GameState = {
  phase: Phase;
  difficulty: Difficulty;
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
  hunter: Point;
  bombs: Bomb[];
  bombTimer: number;
  hunterBombTimer: number;
  nextBombId: number;
  message: string;
  messageTime: number;
  lossReason: "drone" | "bomb" | "time" | null;
};

export const batteryCount = (state: GameState) =>
  state.batteries.filter(Boolean).length;
export const settingsFor = (state: GameState) =>
  DIFFICULTIES[state.difficulty];

const timeBoost = (worldTime: number) =>
  PACE_STEPS.reduce(
    (boost, step) => (worldTime >= step.after ? step.boost : boost),
    0,
  );

export function dronePace(state: GameState): number {
  const batteryBoost = Math.min(
    MAX_BATTERY_BOOST,
    batteryCount(state) * BATTERY_BOOST,
  );
  return (
    settingsFor(state).droneSpeed *
    (1 + timeBoost(state.worldTime) + batteryBoost)
  );
}

export function createGame(difficulty: Difficulty = "normal"): GameState {
  const settings = DIFFICULTIES[difficulty];
  return {
    phase: "ready",
    difficulty,
    player: { ...START },
    batteries: Array<boolean>(settings.batteries).fill(false),
    time: settings.seconds,
    health: settings.health,
    invulnerability: 0,
    facing: "right",
    worldTime: 0,
    droneX: DRONE.left,
    droneY: DRONE.y,
    droneDirection: 1,
    hunter: { ...HUNTER_DRONE },
    bombs: [],
    bombTimer: 3 * settings.bombInterval,
    hunterBombTimer: 4.5 * settings.bombInterval,
    nextBombId: 1,
    message: "",
    messageTime: 0,
    lossReason: null,
  };
}

export function restartGame(previous: GameState): GameState {
  // Todo lo que cambia durante una partida vuelve a su valor inicial.
  // La dificultad elegida se conserva.
  return { ...previous, ...createGame(previous.difficulty) };
}

export function chooseDifficulty(
  state: GameState,
  difficulty: Difficulty,
): GameState {
  // Solo se elige antes de empezar; a mitad de partida no cambia nada.
  return state.phase === "ready" ? createGame(difficulty) : state;
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
  const settings = settingsFor(state);
  const required = state.batteries.length;
  const pace = dronePace(state);
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

  let droneX = state.droneX + state.droneDirection * 285 * pace * dt;
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

  // El segundo dron vigila el lado derecho y persigue a Píxel al detectarlo.
  const playerVelocity = dt > 0
    ? { x: (player.x - state.player.x) / dt, y: (player.y - state.player.y) / dt }
    : { x: 0, y: 0 };
  const seesPlayer = distance(state.hunter, player) < 440;
  const hunterTarget = seesPlayer
    ? {
        x: clamp(player.x + playerVelocity.x * 0.35, 900, 1470),
        y: clamp(player.y + playerVelocity.y * 0.35, 140, 720),
      }
    : {
        x: 1250 + Math.sin(worldTime * 0.75) * 180,
        y: 260 + Math.sin(worldTime * 1.1) * 110,
      };
  const hunterDistance = distance(state.hunter, hunterTarget);
  const hunterStep = Math.min(hunterDistance, 185 * pace * dt);
  const hunter = hunterDistance > 0
    ? {
        x: state.hunter.x + (hunterTarget.x - state.hunter.x) * hunterStep / hunterDistance,
        y: state.hunter.y + (hunterTarget.y - state.hunter.y) * hunterStep / hunterDistance,
      }
    : { ...state.hunter };

  let bombTimer = state.bombTimer - dt;
  let hunterBombTimer = state.hunterBombTimer - dt;
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
    bombTimer = 3.1 * settings.bombInterval;
  }
  if (hunterBombTimer <= 0) {
    bombs.push({
      id: nextBombId++,
      origin: { ...hunter },
      target: {
        x: clamp(player.x + playerVelocity.x * 0.65, 70, WORLD.width - 70),
        y: clamp(player.y + playerVelocity.y * 0.65, 110, WORLD.height - 75),
      },
      elapsed: 0,
      duration: 1.45,
      blastLeft: 0,
    });
    hunterBombTimer = 4.2 * settings.bombInterval;
  }

  const batteries = state.batteries.map(
    (taken, index) => taken || distance(player, BATTERIES[index]) < 70,
  );
  const count = batteries.filter(Boolean).length;
  let messageTime = Math.max(0, state.messageTime - dt);
  let message = messageTime > 0 ? state.message : "";
  if (timeBoost(worldTime) > timeBoost(state.worldTime)) {
    message = "¡Los drones aceleran!";
    messageTime = 1.5;
  }
  if (count > batteryCount(state)) {
    message =
      count === required
        ? "¡Salida desbloqueada!"
        : `Batería ${count}/${required} recuperada`;
    messageTime = 1.5;
  }

  let health = state.health;
  let invulnerability = Math.max(0, state.invulnerability - dt);
  const droneHit = distance(player, { x: droneX, y: droneY }) < 84 ||
    distance(player, hunter) < 84;
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
    hunter,
    bombs,
    bombTimer,
    hunterBombTimer,
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
    if (count === required) {
      return {
        ...updated,
        phase: "won",
        message: "",
        messageTime: 0,
        lossReason: null,
      };
    }
    if (messageTime <= 0) {
      const missing = required - count;
      message = `Falta${missing === 1 ? "" : "n"} ${missing} batería${missing === 1 ? "" : "s"}`;
      messageTime = 1.8;
    }
  }
  return { ...updated, message, messageTime };
}
