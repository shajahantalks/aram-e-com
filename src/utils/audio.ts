/**
 * Web Audio API synthesizer for an authentic Indian temple bell resonance.
 * Generates harmonic overtone frequencies that recreate a heavy bronze bell toll.
 */
class TempleBellAudio {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

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

  public ring() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Fundamental frequencies of bronze bell: ~587Hz (D5), harmonic overtones at 1.5x, 2x, 2.76x, 4x
      const partials = [
        { freq: 587.33, gain: 0.6, decay: 2.8 },
        { freq: 880.00, gain: 0.35, decay: 2.2 },
        { freq: 1174.66, gain: 0.25, decay: 1.6 },
        { freq: 1620.00, gain: 0.18, decay: 1.2 },
        { freq: 2349.32, gain: 0.12, decay: 0.8 },
      ];

      partials.forEach(p => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(p.freq, now);

        // Strike attack & slow resonant ring decay
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(p.gain, now + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + p.decay);
      });
    } catch {
      // Audio playback silently gracefully ignored if browser blocked
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }
}

export const templeBell = new TempleBellAudio();
