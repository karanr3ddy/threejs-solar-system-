// Zero-dependency procedural Web Audio API synthesizer for planetary harmonic resonance

class SpaceAudioEngine {
  private ctx: AudioContext | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private isMuted: boolean = true;
  private currentFreq: number = 136.1;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean, baseFreqHz = 136.1) {
    this.isMuted = muted;
    this.currentFreq = baseFreqHz;

    if (!muted) {
      this.initContext();
      this.startDrone(baseFreqHz);
    } else {
      this.stopDrone();
    }
  }

  public updatePlanetFrequency(freqHz: number) {
    this.currentFreq = freqHz;
    if (this.isMuted || !this.ctx || !this.droneOsc1 || !this.droneOsc2) return;

    const now = this.ctx.currentTime;
    this.droneOsc1.frequency.exponentialRampToValueAtTime(Math.max(40, freqHz * 0.5), now + 0.8);
    this.droneOsc2.frequency.exponentialRampToValueAtTime(Math.max(60, freqHz * 0.75), now + 0.8);
  }

  public playSelectPing(freqHz = 440) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freqHz * 2, now);
    osc.frequency.exponentialRampToValueAtTime(freqHz * 3, now + 0.14);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.19);
  }

  private startDrone(freqHz: number) {
    if (!this.ctx) return;
    this.stopDrone();

    const now = this.ctx.currentTime;
    this.droneOsc1 = this.ctx.createOscillator();
    this.droneOsc2 = this.ctx.createOscillator();
    this.filterNode = this.ctx.createBiquadFilter();
    this.droneGain = this.ctx.createGain();

    this.droneOsc1.type = 'sine';
    this.droneOsc1.frequency.setValueAtTime(freqHz * 0.5, now);

    this.droneOsc2.type = 'triangle';
    this.droneOsc2.frequency.setValueAtTime(freqHz * 0.75, now);

    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(240, now);

    this.droneGain.gain.setValueAtTime(0.001, now);
    this.droneGain.gain.linearRampToValueAtTime(0.045, now + 1.0);

    this.droneOsc1.connect(this.filterNode);
    this.droneOsc2.connect(this.filterNode);
    this.filterNode.connect(this.droneGain);
    this.droneGain.connect(this.ctx.destination);

    this.droneOsc1.start(now);
    this.droneOsc2.start(now);
  }

  private stopDrone() {
    try {
      if (this.droneOsc1) {
        this.droneOsc1.stop();
        this.droneOsc1.disconnect();
        this.droneOsc1 = null;
      }
      if (this.droneOsc2) {
        this.droneOsc2.stop();
        this.droneOsc2.disconnect();
        this.droneOsc2 = null;
      }
    } catch {
      // Ignore already stopped oscillators
    }
  }
}

export const spaceAudio = new SpaceAudioEngine();
