
class StarboundAudioController {
  private ctx: AudioContext | null = null;
  private bgMusic: HTMLAudioElement | null = null;

  private ambientEnabled = true;
  private roverEffectsEnabled = true;

 
  private ambientOsc1: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;
  private ambientFilter: BiquadFilterNode | null = null;
  private ambientGain: GainNode | null = null;
  private isAmbientPlaying = false;

  
  private driveOsc: OscillatorNode | null = null;
  private driveSubOsc: OscillatorNode | null = null;
  private driveGain: GainNode | null = null;
  private isDrivePlaying = false;

 
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private lfo: OscillatorNode | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying = false;
  private playedFullChime = false;
  private lastImpactTime = 0;

  private init() {
    if (this.ctx) return;
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    this.ctx = new AudioContextClass();
  }

  private resumeContext() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

public setAudioSettings(ambientEnabled: boolean, roverEffectsEnabled: boolean) {
  const ambientChanged = this.ambientEnabled !== ambientEnabled;
  const roverChanged = this.roverEffectsEnabled !== roverEffectsEnabled;

  this.ambientEnabled = ambientEnabled;
  this.roverEffectsEnabled = roverEffectsEnabled;

  if (ambientChanged) {
    if (ambientEnabled) {
      this.startAmbientSpace();
      this.startBackgroundMusic();
    } else {
      this.stopAmbientSpace();
      this.stopBackgroundMusic();
    }
  }

  if (roverChanged && !roverEffectsEnabled) {
    this.stopRoverDrive();
    this.stopCharging();
  }
}
  public startBackgroundMusic() {
  if (!this.ambientEnabled) return;

  if (!this.bgMusic) {
    this.bgMusic = new Audio('/assets/sounds/game.mp3');
    this.bgMusic.loop = true;
    this.bgMusic.volume = 0.35;
  }

  this.bgMusic.play().catch(() => {});
}

public stopBackgroundMusic() {
  if (!this.bgMusic) return;

  this.bgMusic.pause();
  this.bgMusic.currentTime = 0;
}

  public startAmbientSpace() {
    if (!this.ambientEnabled) return;
    this.resumeContext();
    if (!this.ctx || this.isAmbientPlaying) return;

    try {
      const now = this.ctx.currentTime;
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.001, now);
      this.ambientGain.gain.exponentialRampToValueAtTime(0.065, now + 0.8);

      this.ambientFilter = this.ctx.createBiquadFilter();
      this.ambientFilter.type = 'lowpass';
      this.ambientFilter.frequency.setValueAtTime(240, now);

    
      this.ambientOsc1 = this.ctx.createOscillator();
      this.ambientOsc1.type = 'sine';
      this.ambientOsc1.frequency.setValueAtTime(73.42, now);

      this.ambientOsc2 = this.ctx.createOscillator();
      this.ambientOsc2.type = 'triangle';
      this.ambientOsc2.frequency.setValueAtTime(110.0, now);

      this.ambientOsc1.connect(this.ambientFilter);
      this.ambientOsc2.connect(this.ambientFilter);
      this.ambientFilter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      this.ambientOsc1.start(now);
      this.ambientOsc2.start(now);
      this.isAmbientPlaying = true;
    } catch {
     
    }
  }

  public stopAmbientSpace() {
    if (!this.isAmbientPlaying || !this.ctx || !this.ambientGain) return;
    try {
      const now = this.ctx.currentTime;
      this.ambientGain.gain.setTargetAtTime(0.0001, now, 0.15);
      setTimeout(() => {
        try {
          this.ambientOsc1?.stop();
          this.ambientOsc1?.disconnect();
        } catch {}
        try {
          this.ambientOsc2?.stop();
          this.ambientOsc2?.disconnect();
        } catch {}
        try {
          this.ambientFilter?.disconnect();
          this.ambientGain?.disconnect();
        } catch {}
        this.ambientOsc1 = null;
        this.ambientOsc2 = null;
        this.ambientFilter = null;
        this.ambientGain = null;
        this.isAmbientPlaying = false;
      }, 220);
    } catch {
      this.isAmbientPlaying = false;
    }
  }

  public updateRoverDrive(speed: number) {
    const absSpeed = Math.abs(speed);
    if (!this.roverEffectsEnabled || absSpeed < 0.08) {
      if (this.isDrivePlaying) {
        this.stopRoverDrive();
      }
      return;
    }

    

    if (this.ambientEnabled && !this.isAmbientPlaying) {
      this.startAmbientSpace();
    }

    this.resumeContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const speedRatio = Math.min(1, absSpeed / 9.5);
    const targetFreq = 58 + speedRatio * 52;
    const targetGain = 0.025 + speedRatio * 0.045;

    if (this.isDrivePlaying && this.driveOsc && this.driveSubOsc && this.driveGain) {
      this.driveOsc.frequency.setTargetAtTime(targetFreq, now, 0.08);
      this.driveSubOsc.frequency.setTargetAtTime(targetFreq * 1.5, now, 0.08);
      this.driveGain.gain.setTargetAtTime(targetGain, now, 0.08);
      return;
    }

    try {
      this.driveGain = this.ctx.createGain();
      this.driveGain.gain.setValueAtTime(0.001, now);
      this.driveGain.gain.setTargetAtTime(targetGain, now, 0.1);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(210, now);

      this.driveOsc = this.ctx.createOscillator();
      this.driveOsc.type = 'sawtooth';
      this.driveOsc.frequency.setValueAtTime(targetFreq, now);

      this.driveSubOsc = this.ctx.createOscillator();
      this.driveSubOsc.type = 'sine';
      this.driveSubOsc.frequency.setValueAtTime(targetFreq * 1.5, now);

      this.driveOsc.connect(filter);
      this.driveSubOsc.connect(filter);
      filter.connect(this.driveGain);
      this.driveGain.connect(this.ctx.destination);

      this.driveOsc.start(now);
      this.driveSubOsc.start(now);
      this.isDrivePlaying = true;
    } catch {}
  }

  public stopRoverDrive() {
    if (!this.isDrivePlaying || !this.ctx || !this.driveGain) return;
    try {
      const now = this.ctx.currentTime;
      this.driveGain.gain.setTargetAtTime(0.0001, now, 0.08);
      setTimeout(() => {
        try {
          this.driveOsc?.stop();
          this.driveOsc?.disconnect();
        } catch {}
        try {
          this.driveSubOsc?.stop();
          this.driveSubOsc?.disconnect();
        } catch {}
        try {
          this.driveGain?.disconnect();
        } catch {}
        this.driveOsc = null;
        this.driveSubOsc = null;
        this.driveGain = null;
        this.isDrivePlaying = false;
      }, 120);
    } catch {
      this.isDrivePlaying = false;
    }
  }

  public playGemCollect() {
    if (!this.roverEffectsEnabled) return;
    this.resumeContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [587.33, 880.0]; 
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.14, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.22);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.24);
      });
    } catch {}
  }

  public startCharging(batteryPercent: number) {
    if (!this.roverEffectsEnabled) {
      if (this.isPlaying) this.stopCharging();
      return;
    }
    this.resumeContext();
    if (!this.ctx) return;

    if (this.isPlaying) {
      this.updatePitch(batteryPercent);
      return;
    }

    try {
      const now = this.ctx.currentTime;
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.18, now + 0.25);
      this.masterGain.connect(this.ctx.destination);

      const baseFreq = 260 + (batteryPercent / 100) * 180;

      this.osc1 = this.ctx.createOscillator();
      this.osc1.type = 'sine';
      this.osc1.frequency.setValueAtTime(baseFreq, now);

      this.osc2 = this.ctx.createOscillator();
      this.osc2.type = 'triangle';
      this.osc2.frequency.setValueAtTime(baseFreq * 1.25, now);

      this.lfo = this.ctx.createOscillator();
      this.lfo.frequency.setValueAtTime(5.0, now);
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(0.06, now);

      this.lfo.connect(lfoGain);
      lfoGain.connect(this.masterGain.gain);

      this.osc1.connect(this.masterGain);
      this.osc2.connect(this.masterGain);

      this.osc1.start();
      this.osc2.start();
      this.lfo.start();
      this.isPlaying = true;
      this.playedFullChime = false;
    } catch {}
  }

  public updatePitch(batteryPercent: number) {
    if (!this.ctx || !this.isPlaying) return;
    const now = this.ctx.currentTime;
    const baseFreq = 260 + (batteryPercent / 100) * 180;
    if (this.osc1) this.osc1.frequency.setTargetAtTime(baseFreq, now, 0.08);
    if (this.osc2) this.osc2.frequency.setTargetAtTime(baseFreq * 1.25, now, 0.08);
  }

  public stopCharging() {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      this.masterGain.gain.setTargetAtTime(0.001, now, 0.12);
      setTimeout(() => {
        if (this.osc1) {
          try {
            this.osc1.stop();
            this.osc1.disconnect();
          } catch {}
          this.osc1 = null;
        }
        if (this.osc2) {
          try {
            this.osc2.stop();
            this.osc2.disconnect();
          } catch {}
          this.osc2 = null;
        }
        if (this.lfo) {
          try {
            this.lfo.stop();
            this.lfo.disconnect();
          } catch {}
          this.lfo = null;
        }
        if (this.masterGain) {
          try {
            this.masterGain.disconnect();
          } catch {}
          this.masterGain = null;
        }
        this.isPlaying = false;
      }, 160);
    } catch {
      this.isPlaying = false;
    }
  }

  public playFullyChargedChime() {
    if (this.playedFullChime) return;
    this.playedFullChime = true;
    this.stopCharging();
    if (!this.roverEffectsEnabled) return;
    this.resumeContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.22, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.38);
      });
    } catch {}
  }

  public playRockImpact(strength = 1.0) {
    if (!this.roverEffectsEnabled) return;
    const nowMs = performance.now();
    if (nowMs - this.lastImpactTime < 180) return;
    this.lastImpactTime = nowMs;

    this.resumeContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const clamped = Math.min(1.2, Math.max(0.35, strength));

   
      const osc = this.ctx.createOscillator();
      const thudGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(135 * clamped, now);
      osc.frequency.exponentialRampToValueAtTime(38, now + 0.16);

      thudGain.gain.setValueAtTime(0.32 * clamped, now);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(thudGain);
      thudGain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.19);

     
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.12);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(620, now);
      filter.Q.setValueAtTime(1.4, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.22 * clamped, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + 0.12);
    } catch {}
  }
}

export const solarAudio = new StarboundAudioController();
