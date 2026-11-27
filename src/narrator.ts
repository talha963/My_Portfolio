/* Voice-over + subtitles for the story ("movie") scenes.
   Uses the browser's built-in speech engine — no audio files needed. */

type Listener = (line: string | null) => void;

class Narrator {
  enabled = false;
  private current: string | null = null;
  private listeners: Listener[] = [];
  private voice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const pick = () => {
      const vs = window.speechSynthesis.getVoices();
      const prefs = [
        'Google UK English Male',
        'Microsoft Ryan Online',
        'Microsoft Guy Online',
        'Microsoft Christopher Online',
        'Daniel',
        'Arthur',
        'Google US English',
        'Microsoft David',
        'Alex',
      ];
      this.voice =
        prefs.map((p) => vs.find((v) => v.name.includes(p))).find(Boolean) ??
        vs.find((v) => v.lang === 'en-GB') ??
        vs.find((v) => v.lang.startsWith('en')) ??
        null;
    };
    pick();
    window.speechSynthesis.onvoiceschanged = pick;
  }

  get supported() {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  subscribe(fn: Listener) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  /** Say a line once (ignored if it's already the current line). Pass null to clear. */
  say(line: string | null) {
    if (line === this.current) return;
    this.current = line;
    this.listeners.forEach((l) => l(line));
    if (!this.supported) return;
    window.speechSynthesis.cancel();
    if (!line || !this.enabled) return;
    const u = new SpeechSynthesisUtterance(line);
    if (this.voice) u.voice = this.voice;
    u.rate = 0.94;
    u.pitch = 0.88;
    u.volume = 1;
    window.speechSynthesis.speak(u);
  }

  setEnabled(on: boolean) {
    this.enabled = on;
    if (!this.supported) return;
    window.speechSynthesis.cancel();
    if (on && this.current) {
      const line = this.current;
      this.current = null;
      this.say(line);
    }
  }
}

export const narrator = new Narrator();
