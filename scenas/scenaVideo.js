class scenaVideo extends Phaser.Scene {
  constructor() {
    super({ key: "scenaVideo" });
  }

  preload() {
    this.load.video("introVideo", "assets/scenaVideo/0418.webm", "loadeddata");
  }

  create() {
    const screenWidth = this.sys.game.config.width;
    const screenHeight = this.sys.game.config.height;

    // Pausar la música usando el AudioManager
    const audioManager = this.scene.get("AudioManager");
    if (audioManager) {
      audioManager.pauseMusic();
    }

    this.add.rectangle(
      screenWidth / 2,
      screenHeight / 2,
      screenWidth,
      screenHeight,
      0x000000
    );

    const video = this.add.video(
      screenWidth / 2,
      screenHeight / 2,
      "introVideo"
    );

    const videoElement = video.video;
    videoElement.muted = false;

    video.on("play", () => {
      const videoWidth = videoElement.videoWidth;
      const videoHeight = videoElement.videoHeight;

      if (videoWidth && videoHeight) {
        const videoAspectRatio = videoWidth / videoHeight;
        const screenAspectRatio = screenWidth / screenHeight;

        if (videoAspectRatio > screenAspectRatio) {
          video.setDisplaySize(screenWidth, screenWidth / videoAspectRatio);
        } else {
          video.setDisplaySize(screenHeight * videoAspectRatio, screenHeight);
        }
      }
    });

    video.play();

    video.on("complete", () => {
      // Reanudar la música antes de cambiar de escena
      if (audioManager) {
        audioManager.resumeMusic();
      }
      this.scene.start("scenaPregunta");
    });

    const buttonStyle = {
      fontSize: "20px",
      fontFamily: "Arial",
      color: "#ffffff",
      backgroundColor: "#000000",
      padding: "10px",
      borderRadius: "5px",
    };

    // Botón para activar sonido
    const soundOnButton = this.add
      .text(screenWidth - 150, 50, "🔊 Sonido", buttonStyle)
      .setInteractive()
      .setOrigin(0.5)
      .on("pointerdown", () => {
        videoElement.muted = false;
        videoElement.volume = 1;
      });

    // Botón para silenciar
    const soundOffButton = this.add
      .text(screenWidth - 150, 100, "🔇 Silencio", buttonStyle)
      .setInteractive()
      .setOrigin(0.5)
      .on("pointerdown", () => {
        videoElement.muted = true;
      });

    // Mejorar la interactividad visual de los botones
    [soundOnButton, soundOffButton].forEach((button) => {
      button.setPadding(10);
      button.setStyle({ backgroundColor: "#222", borderRadius: "8px" });
      button.on("pointerover", () =>
        button.setStyle({ backgroundColor: "#444" })
      );
      button.on("pointerout", () =>
        button.setStyle({ backgroundColor: "#222" })
      );
    });
  }
}

window.scenaVideo = scenaVideo;
