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

  public initializeAudio(): void {
    if (this.audioStarted) return;

    try {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

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
    if (!this.audioStarted || !this.motorGain || !this.audioContext) return;

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
    if (!this.audioStarted || !this.hornGain || !this.audioContext) return;

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
    if (!this.audioStarted || !this.winGain || !this.audioContext) return;

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
    if (!this.audioStarted || !this.enemyGain || !this.audioContext) return;

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
      !this.audioStarted ||
      !this.musicOsc ||
      !this.bassOsc ||
      !this.audioContext
    )
      return;

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

    setInterval(playNextNote, 400);
  }

  public stopAllAudio(): void {
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
}
