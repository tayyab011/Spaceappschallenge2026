/**
 * Speech Synthesis & Audio Feedback Utility for Kid-Friendly Exploration
 */
import confetti from 'canvas-confetti';

// Keep track of active utterance
let currentUtterance: SpeechSynthesisUtterance | null = null;
let speechListeners: Set<(isSpeaking: boolean) => void> = new Set();

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function subscribeSpeechState(listener: (isSpeaking: boolean) => void): () => void {
  speechListeners.add(listener);
  return () => speechListeners.delete(listener);
}

function notifySpeechState(isSpeaking: boolean) {
  speechListeners.forEach((fn) => fn(isSpeaking));
}

/**
 * Reads aloud text with a warm, clear, friendly pitch and cadence for kids.
 */
export function speakText(text: string, onDone?: () => void): void {
  if (!isSpeechSupported()) {
    onDone?.();
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Strip Markdown / formatting artifacts
  const cleanText = text
    .replace(/[#*`_~]/g, '')
    .replace(/https?:\/\/\S+/g, '')
    .trim();

  if (!cleanText) {
    onDone?.();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = 0.95; // Slightly slower for younger listeners
  utterance.pitch = 1.05; // Slightly warmer pitch

  // Pick a natural English voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(
    (v) =>
      v.lang.startsWith('en') &&
      (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Google') || v.name.includes('Daniel'))
  ) || voices.find((v) => v.lang.startsWith('en'));

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  utterance.onstart = () => {
    currentUtterance = utterance;
    notifySpeechState(true);
  };

  utterance.onend = () => {
    currentUtterance = null;
    notifySpeechState(false);
    onDone?.();
  };

  utterance.onerror = () => {
    currentUtterance = null;
    notifySpeechState(false);
    onDone?.();
  };

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
    notifySpeechState(false);
  }
}

/**
 * Web Audio API synthesizer for positive reinforcement chimes.
 * Generates warm, playful, ascending pentatonic bell tones without external mp3s.
 */
export function playChimeSound(type: 'badge' | 'discovery' | 'click' = 'badge'): void {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
      return;
    }

    // Playful ascending arpeggio for discoveries & badges (C5 -> E5 -> G5 -> C6)
    const notes = type === 'badge' ? [523.25, 659.25, 783.99, 1046.5] : [587.33, 739.99, 880.0];
    const duration = 0.14;

    notes.forEach((freq, idx) => {
      const startTime = ctx.currentTime + idx * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.18, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  } catch {
    // Graceful fallback if audio context is blocked
  }
}

/**
 * Trigger vibrant, colorful confetti celebration
 */
export function triggerCelebrationConfetti(): void {
  try {
    // Burst from center
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#38bdf8', '#fbbf24', '#ff6b4a', '#4ade80', '#c084fc', '#f472b6'],
      ticks: 200,
    });

    // Secondary stars
    setTimeout(() => {
      confetti({
        particleCount: 30,
        angle: 60,
        spread: 55,
        origin: { x: 0.2, y: 0.7 },
        colors: ['#ffd700', '#38bdf8', '#ff8a65'],
      });
      confetti({
        particleCount: 30,
        angle: 120,
        spread: 55,
        origin: { x: 0.8, y: 0.7 },
        colors: ['#a78bfa', '#34d399', '#f472b6'],
      });
    }, 150);
  } catch {
    // Fallback if canvas is unavailable
  }
}
