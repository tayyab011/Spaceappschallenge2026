
export type StoryScene =
  | 'space'
  | 'earth'
  | 'sputnik'
  | 'mars'
  | 'opportunity_climax'
  | 'opportunity_hope'
  | 'moon'
  | 'deep_space'
  | 'finale';

let audioCtx: AudioContext | null = null;
let soundEnabled = false; 
let currentScene: StoryScene = 'space';

interface AmbientTrackState {
  oscillators: OscillatorNode[];
  gainNodes: GainNode[];
  noiseSource?: AudioBufferSourceNode;
  masterGain: GainNode | null;
  arpeggioTimer?: number;
  intervalId?: number;
}

const ambientState: AmbientTrackState = {
  oscillators: [],
  gainNodes: [],
  masterGain: null,
};

export const setSoundEnabled = (enabled: boolean) => {
  soundEnabled = enabled;
  if (!enabled) {
    stopAmbientMusic(0.2);
  } else if (currentScene) {
    playSceneMusic(currentScene);
  }
};

export const getSoundEnabled = () => soundEnabled;

export const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
};


if (typeof window !== 'undefined') {
  const resumeAudio = () => {
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
  };
  window.addEventListener('click', resumeAudio, { once: false, passive: true });
  window.addEventListener('scroll', resumeAudio, { once: false, passive: true });
  window.addEventListener('touchstart', resumeAudio, { once: false, passive: true });
}


export const stopAmbientMusic = (fadeDuration = 0.8) => {
  if (ambientState.intervalId) {
    window.clearInterval(ambientState.intervalId);
    ambientState.intervalId = undefined;
  }
  if (ambientState.arpeggioTimer) {
    window.clearInterval(ambientState.arpeggioTimer);
    ambientState.arpeggioTimer = undefined;
  }

  if (ambientState.masterGain && audioCtx) {
    const currTime = audioCtx.currentTime;
    try {
      ambientState.masterGain.gain.cancelScheduledValues(currTime);
      ambientState.masterGain.gain.setValueAtTime(ambientState.masterGain.gain.value, currTime);
      ambientState.masterGain.gain.linearRampToValueAtTime(0.0001, currTime + fadeDuration);
    } catch {
    
    }
  }

  const prevOscs = [...ambientState.oscillators];
  const prevNoise = ambientState.noiseSource;

  setTimeout(() => {
    prevOscs.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
   
      }
    });
    if (prevNoise) {
      try {
        prevNoise.stop();
        prevNoise.disconnect();
      } catch {
    
      }
    }
  }, (fadeDuration + 0.1) * 1000);

  ambientState.oscillators = [];
  ambientState.gainNodes = [];
  ambientState.noiseSource = undefined;
  ambientState.masterGain = null;
};


const createNoiseBuffer = (ctx: AudioContext, seconds = 3): AudioBuffer => {
  const bufferSize = ctx.sampleRate * seconds;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let lastOut = 0.0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    
    lastOut = (lastOut * 0.95) + (white * 0.05);
    data[i] = lastOut * 1.5;
  }
  return buffer;
};


const playHarmonicNote = (ctx: AudioContext, freq: number, delaySeconds = 0, volume = 0.04) => {
  if (!soundEnabled) return;
  try {
    const startTime = ctx.currentTime + delaySeconds;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 1.5);
  } catch {
   
  }
};


export const playSceneMusic = (scene: StoryScene) => {
  currentScene = scene;
  if (!soundEnabled) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  
  stopAmbientMusic(0.8);

  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
  masterGain.connect(ctx.destination);
  ambientState.masterGain = masterGain;


  const targetVolume = scene === 'opportunity_climax' ? 0.035 : 0.08;
  masterGain.gain.linearRampToValueAtTime(targetVolume, ctx.currentTime + 1.4);

  if (scene === 'space') {
    const freqs = [130.81, 196.00, 293.66, 392.00];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450 + idx * 100, ctx.currentTime);

      gain.gain.setValueAtTime(0.05 / (idx + 1), ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      osc.start();
      ambientState.oscillators.push(osc);
      ambientState.gainNodes.push(gain);
    });


    const notes = [523.25, 659.25, 783.99, 1046.5, 880.0];
    let noteIdx = 0;
    const chimeTimer = window.setInterval(() => {
      if (!soundEnabled || currentScene !== 'space') return;
      playHarmonicNote(ctx, notes[noteIdx % notes.length], 0, 0.03);
      if (Math.random() > 0.4) {
        playHarmonicNote(ctx, notes[(noteIdx + 2) % notes.length], 0.35, 0.02);
      }
      noteIdx++;
    }, 4800);
    ambientState.arpeggioTimer = chimeTimer;

  } else if (scene === 'earth') {
 
    const freqs = [174.61, 220.00, 261.63, 329.63];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.035, ctx.currentTime);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start();
      ambientState.oscillators.push(osc);
      ambientState.gainNodes.push(gain);
    });

  } else if (scene === 'sputnik') {
  
    const baseFreq = 220; 
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start();
    ambientState.oscillators.push(osc);
    ambientState.gainNodes.push(gain);


    const pingInterval = window.setInterval(() => {
      if (!soundEnabled || currentScene !== 'sputnik') return;
      playRadioBeep(880, 0.08);
    }, 3000);
    ambientState.intervalId = pingInterval;

  } else if (scene === 'mars') {

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(98.0, ctx.currentTime); 
    gain.gain.setValueAtTime(0.045, ctx.currentTime);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start();
    ambientState.oscillators.push(osc);

  
    try {
      const noiseBuffer = createNoiseBuffer(ctx, 4);
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const windFilter = ctx.createBiquadFilter();
      windFilter.type = 'bandpass';
      windFilter.frequency.setValueAtTime(320, ctx.currentTime);
      windFilter.Q.setValueAtTime(1.8, ctx.currentTime);

      const windGain = ctx.createGain();
      windGain.gain.setValueAtTime(0.025, ctx.currentTime);

      noiseSource.connect(windFilter);
      windFilter.connect(windGain);
      windGain.connect(masterGain);
      noiseSource.start();

      ambientState.noiseSource = noiseSource;
    } catch {
     
    }

   
    const marsNotes = [392.0, 440.0, 523.25, 587.33];
    let mIdx = 0;
    ambientState.arpeggioTimer = window.setInterval(() => {
      if (!soundEnabled || currentScene !== 'mars') return;
      playHarmonicNote(ctx, marsNotes[mIdx % marsNotes.length], 0, 0.025);
      mIdx++;
    }, 5500);

  } else if (scene === 'opportunity_climax') {
   
    try {
      const noiseBuffer = createNoiseBuffer(ctx, 4);
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const windFilter = ctx.createBiquadFilter();
      windFilter.type = 'lowpass';
      windFilter.frequency.setValueAtTime(200, ctx.currentTime);

      const windGain = ctx.createGain();
      windGain.gain.setValueAtTime(0.02, ctx.currentTime);

      noiseSource.connect(windFilter);
      windFilter.connect(windGain);
      windGain.connect(masterGain);
      noiseSource.start();

      ambientState.noiseSource = noiseSource;
    } catch {
     
    }

  } else if (scene === 'opportunity_hope') {

    const freqs = [146.83, 220.00, 293.66, 369.99]; 
    freqs.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();
      ambientState.oscillators.push(osc);
      ambientState.gainNodes.push(gain);
    });

  } else if (scene === 'moon') {

    const freqs = [110.00, 164.81, 246.94]; 
    freqs.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();
      ambientState.oscillators.push(osc);
      ambientState.gainNodes.push(gain);
    });

    const moonNotes = [440.0, 493.88, 659.25, 880.0];
    let lIdx = 0;
    ambientState.arpeggioTimer = window.setInterval(() => {
      if (!soundEnabled || currentScene !== 'moon') return;
      playHarmonicNote(ctx, moonNotes[lIdx % moonNotes.length], 0, 0.02);
      lIdx++;
    }, 6000);

  } else if (scene === 'deep_space') {
   
    const freqs = [65.41, 130.81, 196.00]; 
    freqs.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.028, ctx.currentTime);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();
      ambientState.oscillators.push(osc);
      ambientState.gainNodes.push(gain);
    });

    const deepNotes = [392.0, 523.25, 783.99, 1046.5];
    let dIdx = 0;
    ambientState.arpeggioTimer = window.setInterval(() => {
      if (!soundEnabled || currentScene !== 'deep_space') return;
      playHarmonicNote(ctx, deepNotes[dIdx % deepNotes.length], 0, 0.022);
      dIdx++;
    }, 6500);

  } else if (scene === 'finale') {
  
    const freqs = [130.81, 196.00, 261.63, 329.63, 392.00]; 
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04 / (idx * 0.4 + 1), ctx.currentTime);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();
      ambientState.oscillators.push(osc);
      ambientState.gainNodes.push(gain);
    });
  }
};


export const playPageTurn = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const noiseBuffer = createNoiseBuffer(ctx, 0.22);
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.2);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.07, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
    noise.stop(ctx.currentTime + 0.23);
  } catch {
   
  }
};


export const playRadioBeep = (frequency = 750, duration = 0.12) => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    
  }
};


export const playBloop = (frequency = 440) => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.14);
  } catch {
  
  }
};


export const playRoverRoll = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(135, ctx.currentTime + 0.2);
    osc.frequency.linearRampToValueAtTime(115, ctx.currentTime + 0.4);

    gain.gain.setValueAtTime(0.045, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.48);
  } catch {
 
  }
};


export const playOrbitCue = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99]; 
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0.07, ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.38);
    });
  } catch {

  }
};

export const playSpiritCue = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const notes = [392.00, 523.25, 659.25];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.09);
      gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.09 + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.09);
      osc.stop(ctx.currentTime + idx * 0.09 + 0.32);
    });
  } catch {
   
  }
};

export const playOppyCue = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const notes = [659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);
      gain.gain.setValueAtTime(0.075, ctx.currentTime + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.07 + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.07);
      osc.stop(ctx.currentTime + idx * 0.07 + 0.3);
    });
  } catch {
   
  }
};

export const playExplorerCue = () => {
  playRadioBeep(660, 0.15);
};

export const playChirp = () => {
  playOrbitCue();
};

export const playWhoosh = () => {
  playPageTurn();
};


export const playCheer = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const chord = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; 
    chord.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

      gain.gain.setValueAtTime(0.09, ctx.currentTime + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2 + idx * 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.06);
      osc.stop(ctx.currentTime + 1.4 + idx * 0.06);
    });
  } catch {

  }
};
