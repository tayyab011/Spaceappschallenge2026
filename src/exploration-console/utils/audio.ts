// Web Audio API Synthesizer for authentic NASA telemetry and probe soundscapes
//made wirh ai studio
class SoundController {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Telemetry chirp (short, crisp NASA Deep Space Network pulse)
  public playChirp() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1450, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch {}
  }

  // Spectrometer activation hum (resonant frequency sweep as detector warms up and collects counts)
  public playSpectrometerHum() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(440, this.ctx.currentTime + 0.35);
      osc.frequency.exponentialRampToValueAtTime(330, this.ctx.currentTime + 0.7);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.05, this.ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.75);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.78);
    } catch {}
  }

  // Science discovery harmonic chord
  public playDiscoveryChime() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);

        const startTime = this.ctx.currentTime + idx * 0.08;
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.06, startTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.65);
      });
    } catch {}
  }

  // Thruster pulse or rover drive feedback
  public playThrusterPulse() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      // White noise buffer
      const bufferSize = this.ctx.sampleRate * 0.15;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start();
      whiteNoise.stop(this.ctx.currentTime + 0.16);
    } catch {}
  }
}

export const soundFx = new SoundController();
