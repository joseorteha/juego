// Música de fondo generada con Web Audio: no necesita archivos ni conexión.
// El patrón se repite en bucle mientras la partida está en curso.

const STEP_SECONDS = 0.19;
const BASS = [110, 0, 110, 0, 131, 0, 98, 0, 110, 0, 110, 0, 147, 0, 131, 0];
const LEAD = [440, 523, 659, 523, 494, 587, 740, 587, 440, 523, 659, 784, 698, 587, 494, 587];

export type Music = { start: () => void; stop: () => void };

export function createMusic(): Music {
  let context: AudioContext | null = null;
  let output: GainNode | null = null;
  let timer = 0;
  let step = 0;

  const note = (frequency: number, type: OscillatorType, volume: number) => {
    if (!context || !output || frequency === 0) return;
    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    envelope.gain.setValueAtTime(volume, now);
    envelope.gain.exponentialRampToValueAtTime(0.001, now + STEP_SECONDS * 0.9);
    oscillator.connect(envelope).connect(output);
    oscillator.start(now);
    oscillator.stop(now + STEP_SECONDS);
  };

  const tick = () => {
    note(BASS[step], "triangle", 0.5);
    note(LEAD[step], "square", 0.12);
    step = (step + 1) % LEAD.length;
  };

  return {
    start() {
      if (timer) return;
      try {
        context ??= new AudioContext();
        if (!output) {
          output = context.createGain();
          output.gain.value = 0.18;
          output.connect(context.destination);
        }
        void context.resume();
      } catch {
        // Sin Web Audio el juego sigue funcionando en silencio.
        return;
      }
      timer = window.setInterval(tick, STEP_SECONDS * 1000);
    },
    stop() {
      window.clearInterval(timer);
      timer = 0;
      step = 0;
      void context?.suspend();
    },
  };
}
