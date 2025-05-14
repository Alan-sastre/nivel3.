class AudioManager extends Phaser.Scene {
  constructor() {
    super({ key: "AudioManager" });
  }

  preload() {
    this.load.audio("musica", "assets/scenaPrincipal/musica.mp3");
  }

  create() {
    // Crear el sonido si no existe
    if (!this.sound.get("musica")) {
      this.musica = this.sound.add("musica", {
        volume: 0.1,
        loop: true,
      });
    }

    // Reproducir la música si no está sonando
    if (!this.sound.get("musica").isPlaying) {
      this.musica.play();
    }

    // Mantener esta escena activa
    this.scene.setActive(true);
  }

  // Método para pausar la música
  pauseMusic() {
    if (this.sound.get("musica") && this.sound.get("musica").isPlaying) {
      this.sound.get("musica").pause();
    }
  }

  // Método para reanudar la música
  resumeMusic() {
    if (this.sound.get("musica") && !this.sound.get("musica").isPlaying) {
      this.sound.get("musica").resume();
    }
  }

  // Método para verificar si la música está sonando
  isMusicPlaying() {
    return this.sound.get("musica") && this.sound.get("musica").isPlaying;
  }
}

window.AudioManager = AudioManager;
