import { config } from "./config";

export class AudioManager {
  private audioContext: AudioContext | null = null;
  private motorGain: GainNode | null = null;
  private hornGain: GainNode | null = null;
  private winGain: GainNode | null = null;
  private enemyGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private motorOsc: OscillatorNode | null = null;
  private hornOsc: OscillatorNode | null = null;
  private winOsc: OscillatorNode | null = null;
  private enemyOsc: OscillatorNode | null = null;
  private musicOsc: OscillatorNode | null = null;
  private bassOsc: OscillatorNode | null = null;
  private audioStarted = false;
  private currentLevel: number = 1;
  private musicInterval: number | null = null;

  constructor() {
    // Initialize with level 1
    this.currentLevel = 1;
  }

  public setLevel(level: number): void {
    this.currentLevel = level;
    // Restart music with new BPM if already playing
    if (this.audioStarted && this.musicInterval) {
      this.stopMusic();
      this.playMusic();
    }
  }

  private calculateBPM(): number {
    // Linear interpolation from 60 BPM (level 1) to 210 BPM (level 10)
    const minBPM = 60;
    const maxBPM = 210;
    const minLevel = 1;
    const maxLevel = 10;

    const level = Math.min(Math.max(this.currentLevel, minLevel), maxLevel);
    const progress = (level - minLevel) / (maxLevel - minLevel);

    return Math.round(minBPM + (maxBPM - minBPM) * progress);
  }

  private getBeatDuration(): number {
    const bpm = this.calculateBPM();
    return 60 / bpm; // Convert BPM to seconds per beat
  }

  public async initializeAudio(): Promise<void> {
    if (this.audioStarted) return;

    // Skip audio initialization if disabled in dev mode
    if (config.disable_audio_in_dev) {
      return;
    }

    try {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      // Resume audio context if it's suspended (required for autoplay policies)
      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }

      // Create gain nodes
      this.motorGain = this.audioContext.createGain();
      this.hornGain = this.audioContext.createGain();
      this.winGain = this.audioContext.createGain();
      this.enemyGain = this.audioContext.createGain();
      this.musicGain = this.audioContext.createGain();

      // Create oscillators
      this.motorOsc = this.audioContext.createOscillator();
      this.hornOsc = this.audioContext.createOscillator();
      this.winOsc = this.audioContext.createOscillator();
      this.enemyOsc = this.audioContext.createOscillator();
      this.musicOsc = this.audioContext.createOscillator();
      this.bassOsc = this.audioContext.createOscillator();

      // Configure motor sound (original: sine, 100Hz, gain 0)
      this.motorOsc.type = "sine";
      this.motorOsc.frequency.setValueAtTime(
        100,
        this.audioContext.currentTime
      );
      this.motorOsc.connect(this.motorGain);
      this.motorGain.connect(this.audioContext.destination);
      this.motorGain.gain.setValueAtTime(0, this.audioContext.currentTime);

      // Configure horn sound (original: square, 600Hz, gain 0)
      this.hornOsc.type = "square";
      this.hornOsc.frequency.setValueAtTime(600, this.audioContext.currentTime);
      this.hornOsc.connect(this.hornGain);
      this.hornGain.connect(this.audioContext.destination);
      this.hornGain.gain.setValueAtTime(0, this.audioContext.currentTime);

      // Configure win sound (original: triangle, 800Hz, gain 0)
      this.winOsc.type = "triangle";
      this.winOsc.frequency.setValueAtTime(800, this.audioContext.currentTime);
      this.winOsc.connect(this.winGain);
      this.winGain.connect(this.audioContext.destination);
      this.winGain.gain.setValueAtTime(0, this.audioContext.currentTime);

      // Configure enemy sound (original: sawtooth, 300Hz, gain 0)
      this.enemyOsc.type = "sawtooth";
      this.enemyOsc.frequency.setValueAtTime(
        300,
        this.audioContext.currentTime
      );
      this.enemyOsc.connect(this.enemyGain);
      this.enemyGain.connect(this.audioContext.destination);
      this.enemyGain.gain.setValueAtTime(0, this.audioContext.currentTime);

      // Configure music (original: square, 440Hz, gain 0.05)
      this.musicOsc.type = "square";
      this.musicOsc.frequency.setValueAtTime(
        440,
        this.audioContext.currentTime
      );
      this.musicOsc.connect(this.musicGain);
      this.musicGain.connect(this.audioContext.destination);
      this.musicGain.gain.setValueAtTime(0.05, this.audioContext.currentTime);

      // Configure bass (original: sine, 110Hz)
      this.bassOsc.type = "sine";
      this.bassOsc.frequency.setValueAtTime(110, this.audioContext.currentTime);
      this.bassOsc.connect(this.musicGain);

      // Start oscillators
      this.motorOsc.start();
      this.hornOsc.start();
      this.winOsc.start();
      this.enemyOsc.start();
      this.musicOsc.start();
      this.bassOsc.start();

      this.audioStarted = true;
    } catch (error) {
      console.warn("Audio initialization failed:", error);
    }
  }

  public playMotorSound(isMoving: boolean): void {
    if (
      config.disable_audio_in_dev ||
      !this.audioStarted ||
      !this.motorGain ||
      !this.audioContext
    )
      return;

    if (isMoving) {
      this.motorGain.gain.setTargetAtTime(
        0.1,
        this.audioContext.currentTime,
        0.1
      );
    } else {
      this.motorGain.gain.setTargetAtTime(
        0,
        this.audioContext.currentTime,
        0.1
      );
    }
  }

  public playHorn(): void {
    if (
      config.disable_audio_in_dev ||
      !this.audioStarted ||
      !this.hornGain ||
      !this.audioContext
    )
      return;

    this.hornGain.gain.setTargetAtTime(
      0.2,
      this.audioContext.currentTime,
      0.05
    );
    setTimeout(
      () =>
        this.hornGain!.gain.setTargetAtTime(
          0,
          this.audioContext!.currentTime,
          0.1
        ),
      200
    );
  }

  public playWinSound(): void {
    if (
      config.disable_audio_in_dev ||
      !this.audioStarted ||
      !this.winGain ||
      !this.audioContext
    )
      return;

    this.winGain.gain.setTargetAtTime(0.2, this.audioContext.currentTime, 0.05);
    setTimeout(
      () =>
        this.winGain!.gain.setTargetAtTime(
          0,
          this.audioContext!.currentTime,
          0.1
        ),
      300
    );
  }

  public playEnemySiren(): void {
    if (
      config.disable_audio_in_dev ||
      !this.audioStarted ||
      !this.enemyGain ||
      !this.audioContext
    )
      return;

    this.enemyGain.gain.setTargetAtTime(
      0.2,
      this.audioContext.currentTime,
      0.05
    );
    setTimeout(
      () =>
        this.enemyGain!.gain.setTargetAtTime(
          0,
          this.audioContext!.currentTime,
          0.1
        ),
      300
    );
  }

  public playMusic(): void {
    if (
      config.disable_audio_in_dev ||
      !this.audioStarted ||
      !this.musicOsc ||
      !this.bassOsc ||
      !this.audioContext
    )
      return;

    // Stop existing music if playing
    this.stopMusic();

    // Original melody pattern
    const melody = [
      440, 523, 659, 523, 440, 392, 440, 523, 659, 784, 659, 523, 440, 523, 440,
      392,
    ];
    const bassPattern = [110, 110, 146, 146, 110, 110, 146, 146];

    let noteIndex = 0;
    let bassIndex = 0;

    const playNextNote = () => {
      if (
        this.audioStarted &&
        this.musicOsc &&
        this.bassOsc &&
        this.audioContext
      ) {
        this.musicOsc.frequency.setValueAtTime(
          melody[noteIndex],
          this.audioContext.currentTime
        );
        this.bassOsc.frequency.setValueAtTime(
          bassPattern[bassIndex],
          this.audioContext.currentTime
        );
        noteIndex = (noteIndex + 1) % melody.length;
        bassIndex = (bassIndex + 1) % bassPattern.length;
      }
    };

    // Calculate interval based on current BPM
    const beatDuration = this.getBeatDuration();
    const intervalMs = beatDuration * 1000; // Convert to milliseconds

    this.musicInterval = setInterval(playNextNote, intervalMs);
  }

  public stopMusic(): void {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  public pauseAllAudio(): void {
    // Stop music
    this.stopMusic();

    // Stop and disconnect all oscillators
    if (this.motorOsc) {
      try {
        this.motorOsc.stop();
      } catch (e) {
        /* ignore */
      }
      this.motorOsc.disconnect();
      this.motorOsc = null;
    }
    if (this.hornOsc) {
      try {
        this.hornOsc.stop();
      } catch (e) {
        /* ignore */
      }
      this.hornOsc.disconnect();
      this.hornOsc = null;
    }
    if (this.winOsc) {
      try {
        this.winOsc.stop();
      } catch (e) {
        /* ignore */
      }
      this.winOsc.disconnect();
      this.winOsc = null;
    }
    if (this.enemyOsc) {
      try {
        this.enemyOsc.stop();
      } catch (e) {
        /* ignore */
      }
      this.enemyOsc.disconnect();
      this.enemyOsc = null;
    }
    if (this.musicOsc) {
      try {
        this.musicOsc.stop();
      } catch (e) {
        /* ignore */
      }
      this.musicOsc.disconnect();
      this.musicOsc = null;
    }
    if (this.bassOsc) {
      try {
        this.bassOsc.stop();
      } catch (e) {
        /* ignore */
      }
      this.bassOsc.disconnect();
      this.bassOsc = null;
    }

    // Reset the audio started flag so it can be re-initialized
    this.audioStarted = false;
  }

  public resumeAudio(): void {
    // This method is deprecated - use initializeAudio() instead
    // Audio will be properly re-initialized when needed
    // PRODUCTION: Console logs removed for performance
    // console.log("🔊 resumeAudio() called - audio will be re-initialized when needed");
  }

  public stopAllAudio(): void {
    this.stopMusic();

    if (!this.audioContext) return;

    try {
      this.audioContext.close();
      this.audioStarted = false;
    } catch (error) {
      console.warn("Error stopping audio:", error);
    }
  }

  public isAudioStarted(): boolean {
    return this.audioStarted;
  }

  public getCurrentBPM(): number {
    return this.calculateBPM();
  }

  public testAudio(): void {
    if (!this.audioStarted || !this.audioContext) {
      console.warn("Audio not initialized");
      return;
    }

    // Test motor sound
    if (this.motorGain) {
      this.motorGain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      setTimeout(() => {
        if (this.motorGain) {
          this.motorGain.gain.setValueAtTime(0, this.audioContext!.currentTime);
        }
      }, 500);
    }

    // Test horn sound
    this.playHorn();
  }
}
