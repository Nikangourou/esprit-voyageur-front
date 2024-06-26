import { Howl } from "howler";

export default class SoundManager {
  static instance;
  isPlaying = null;
  hasStarted = null;
  soundsList = null;
  currentSound = null;

  constructor() {
    if (SoundManager.instance) {
      return SoundManager.instance;
    }
    this.hasStarted = true;
    const snds = this.loadSounds();

    SoundManager.instance = this;
  }

  async startXp(key, animationStart = null) {
    // Définit l'état des sons
    this.soundsList[key].play();
    this.soundsList[key].fade(0, 0.5, 500);
    this.currentSound = this.soundsList[key];
    this.isPlaying = true;
    if (animationStart) {
      animationStart();
    }
  }

  transitionMusic(room) {
    if (this.currentSound) {
      this.currentSound.fade(0.5, 0, 1000);
      this.currentSound.stop(); // Arrête l'instance audio actuelle
    }

    if (this.soundsList[room]) {
      this.soundsList[room].play();
      if (this.isPlaying) {
        this.soundsList[room].fade(0, 0.5, 1000);
      }
      this.currentSound.current = this.soundsList[room];
    }
  }

  toggleSound(animationStop, animationStart) {
    if (this.soundsList) {
      if (this.isPlaying) {
        for (const [key, value] of Object.entries(this.soundsList)) {
          this.soundsList[key].fade(0.5, 0, 500);
        }
        animationStop();
      } else {
        animationStart();
        for (const [key, value] of Object.entries(this.soundsList)) {
          this.soundsList[key].fade(0, 0.5, 500);
        }
      }
      this.isPlaying = !this.isPlaying;
    }
  }

  playSingleSound(sound, volume = 0.35) {
    if (this.soundsList && this.isPlaying && this.soundsList[sound]) {
      this.soundsList[sound].volume(volume);
      this.soundsList[sound].play();
    }
  }

  stopSingleSound(sound) {
    if (this.soundsList && this.isPlaying && this.soundsList[sound]) {
      this.soundsList[sound].fade(this.soundsList[sound]._volume, 0, 1000);
      this.soundsList[sound].stop();
    }
  }
  async loadSounds() {
    const tmp = {};

    const loadAudio = async (key, src, volume, loop = false) => {
      tmp[key] = new Howl({
        src: [src],
        loop: loop,
        volume: volume,
      });
    };

    await Promise.all([
      loadAudio("global", "/audio/Ambiance_final.mp3", 1, true),
      loadAudio("cta", "/audio/Click_final.mp3", 0),
      loadAudio("pawn", "/audio/Pawn_final.mp3", 0),
      loadAudio("win", "/audio/Winner_final.mp3", 0),
    ]);

    this.soundsList = tmp;
  }
}
