/**
 * Audio Synthesizer for Realistic Book Page Flip Sound Effects
 * Uses Web Audio API for zero-latency, offline-capable, tactile page turning acoustics.
 */

type SoundPreference = 'enabled' | 'disabled' | 'unprompted';

const SOUND_PREF_KEY = 'johnnyblue1_page_flip_sound_pref';

class PageFlipSoundService {
  private audioCtx: AudioContext | null = null;
  private preference: SoundPreference = 'unprompted';
  private lastPlayTimestamp: number = 0;
  private isListenerAttached: boolean = false;
  private subscribers: Set<(enabled: boolean) => void> = new Set();

  constructor() {
    this.loadPreference();
    // If user already enabled it in a previous session, attach click listener
    if (this.preference === 'enabled') {
      this.attachGlobalClickListener();
    }
  }

  private loadPreference() {
    try {
      const saved = localStorage.getItem(SOUND_PREF_KEY);
      if (saved === 'enabled' || saved === 'disabled') {
        this.preference = saved;
      } else {
        this.preference = 'unprompted';
      }
    } catch {
      this.preference = 'unprompted';
    }
  }

  public getPreference(): SoundPreference {
    return this.preference;
  }

  public isEnabled(): boolean {
    return this.preference === 'enabled';
  }

  public setPreference(pref: 'enabled' | 'disabled') {
    this.preference = pref;
    try {
      localStorage.setItem(SOUND_PREF_KEY, pref);
    } catch {
      // Ignore localStorage quotas or restrictions
    }

    if (pref === 'enabled') {
      this.attachGlobalClickListener();
      // Play a confirmation flip
      this.playFlipSound();
    } else {
      this.detachGlobalClickListener();
    }

    this.notifySubscribers();
  }

  public toggle(): boolean {
    const nextPref = this.preference === 'enabled' ? 'disabled' : 'enabled';
    this.setPreference(nextPref);
    return nextPref === 'enabled';
  }

  public subscribe(callback: (enabled: boolean) => void): () => void {
    this.subscribers.add(callback);
    callback(this.isEnabled());
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers() {
    const enabled = this.isEnabled();
    this.subscribers.forEach((cb) => {
      try {
        cb(enabled);
      } catch {}
    });
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }

    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }

    return this.audioCtx;
  }

  /**
   * Synthesize an authentic, crisp book page flip sound effect
   */
  public playFlipSound() {
    // Rate limit to prevent audio clipping or distortion on rapid clicks
    const now = performance.now();
    if (now - this.lastPlayTimestamp < 65) return;
    this.lastPlayTimestamp = now;

    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const startTime = ctx.currentTime;
      const duration = 0.11; // 110ms total flip duration

      // 1. Paper Friction/Flutter (White Noise with Bandpass & Lowpass Filters)
      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        // High frequency paper flutter texture with natural taper
        const decay = Math.exp(-i / (bufferSize * 0.45));
        output[i] = (Math.random() * 2 - 1) * decay;
      }

      const whiteNoiseNode = ctx.createBufferSource();
      whiteNoiseNode.buffer = noiseBuffer;

      // Bandpass filter for the page rustle sweep
      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(2200, startTime);
      bandpass.frequency.exponentialRampToValueAtTime(550, startTime + duration * 0.85);
      bandpass.Q.setValueAtTime(2.2, startTime);

      // Lowpass filter for warm paper body
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(3600, startTime);
      lowpass.frequency.exponentialRampToValueAtTime(700, startTime + duration);

      // Amplitude Envelope for the whoosh
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.001, startTime);
      gainNode.gain.linearRampToValueAtTime(0.22, startTime + 0.015);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      whiteNoiseNode.connect(bandpass);
      bandpass.connect(lowpass);
      lowpass.connect(gainNode);
      gainNode.connect(ctx.destination);

      whiteNoiseNode.start(startTime);
      whiteNoiseNode.stop(startTime + duration);

      // 2. Subtle low-mid paper snap/page landing thump (130Hz -> 65Hz)
      const thumpOsc = ctx.createOscillator();
      const thumpGain = ctx.createGain();

      thumpOsc.type = 'triangle';
      thumpOsc.frequency.setValueAtTime(140, startTime + 0.01);
      thumpOsc.frequency.exponentialRampToValueAtTime(60, startTime + 0.07);

      thumpGain.gain.setValueAtTime(0.001, startTime);
      thumpGain.gain.linearRampToValueAtTime(0.09, startTime + 0.02);
      thumpGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.07);

      thumpOsc.connect(thumpGain);
      thumpGain.connect(ctx.destination);

      thumpOsc.start(startTime + 0.01);
      thumpOsc.stop(startTime + 0.07);
    } catch {
      // Graceful fallback in environments with audio policy restrictions
    }
  }

  /**
   * Preview/test sound even before enabling in settings
   */
  public testSound() {
    const ctx = this.getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().then(() => this.playFlipSound()).catch(() => {});
    } else {
      this.playFlipSound();
    }
  }

  private handleGlobalClick = (e: MouseEvent) => {
    if (this.preference !== 'enabled') return;

    // Trigger on interactive elements or any click on the document
    const target = e.target as HTMLElement | null;
    if (!target) return;

    // Do not sound on plain text selection or drag events
    if (e.detail === 0) return;

    this.playFlipSound();
  };

  public attachGlobalClickListener() {
    if (this.isListenerAttached || typeof window === 'undefined') return;
    document.addEventListener('click', this.handleGlobalClick, true);
    this.isListenerAttached = true;
  }

  public detachGlobalClickListener() {
    if (!this.isListenerAttached || typeof window === 'undefined') return;
    document.removeEventListener('click', this.handleGlobalClick, true);
    this.isListenerAttached = false;
  }
}

export const soundService = new PageFlipSoundService();
