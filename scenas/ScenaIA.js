class scenaIA extends Phaser.Scene {
  constructor() {
    super({ key: "scenaIA" });
    this.answeredCorrectly = false;
    this.messages = [
      {
        text: "Fallo en la redéctrica. Necesitamos ayuda urgente.",
        options: [
          { label: "A) Ignorar el mensaje", value: "Spam" },
          { label: "B) Clasificar como Normal", value: "Normal" },
          {
            label: "C) Clasificar como Urgente",
            value: "Urgente",
            isCorrect: true,
          },
        ],
      },
      {
        text: "Incendio en edificio residencial. Se requiere evacuación inmediata.",
        options: [
          { label: "A) Ignorar el mensaje", value: "Spam" },
          { label: "B) Clasificar como Normal", value: "Normal" },
          {
            label: "C) Clasificar como Urgente",
            value: "Urgente",
            isCorrect: true,
          },
        ],
      },
      {
        text: "Solicitud de mantenimiento de rutina para sistema de aire acondicionado.",
        options: [
          { label: "A) Ignorar el mensaje", value: "Spam" },
          {
            label: "B) Clasificar como Normal",
            value: "Normal",
            isCorrect: true,
          },
          { label: "C) Clasificar como Urgente", value: "Urgente" },
        ],
      },
    ];
    this.currentMessageIndex = 0;
    this.currentMessage = this.messages[this.currentMessageIndex];
    this.incorrectOptions = []; // Array para mantener registro de opciones incorrectas
  }

  preload() {
    // Cargar fuentes y assets necesarios
    this.load.image("gradientBg", "assets/gradient-bg.png");
    this.load.audio("musica", "assets/scenaPrincipal/musica.mp3");
  }

  create() {
    // Configuración de renderizado para optimizar lecturas frecuentes
    this.game.canvas.setAttribute("willReadFrequently", "true");

    // Fondo elegante con gradiente suave
    const gradient = this.add.graphics();
    const colors = [
      0x2c3e50, // Azul oscuro elegante
      0x34495e, // Azul medio
      0x2c3e50, // Azul oscuro elegante
    ];
    const gradientHeight = this.scale.height;
    const gradientWidth = this.scale.width;

    for (let y = 0; y < gradientHeight; y++) {
      const colorIndex = Math.floor((y / gradientHeight) * colors.length);
      gradient.fillStyle(colors[colorIndex], 0.95);
      gradient.fillRect(0, y, gradientWidth, 1);
    }

    const musica = this.sound.add("musica"); // Crea una instancia del sonido
    musica.play({ voluene: 0.1, loop: true }); // Reproduce la música con volumen 0.5 y bucle infinito

    // Título elegante
    const title = this.add
      .text(this.scale.width / 2, 50, "Clasificación de Emergencias", {
        font: "bold 36px Arial",
        color: "#ECF0F1",
        stroke: "#2C3E50",
        strokeThickness: 2,
        shadow: {
          offsetX: 1,
          offsetY: 1,
          color: "#000",
          blur: 2,
          stroke: true,
          fill: true,
        },
      })
      .setOrigin(0.5);

    // Contenedor de mensaje con diseño elegante
    const panelBg = this.add.graphics();
    panelBg.fillStyle(0xecf0f1, 0.95);
    panelBg.lineStyle(2, 0x2c3e50, 1);
    panelBg.fillRoundedRect(50, 120, this.scale.width - 100, 120, 15);
    panelBg.strokeRoundedRect(50, 120, this.scale.width - 100, 120, 15);

    // Texto del mensaje con estilo elegante
    this.messageText = this.add
      .text(this.scale.width / 2, 180, this.currentMessage.text, {
        font: "24px Arial",
        color: "#2C3E50",
        align: "center",
        wordWrap: { width: this.scale.width - 150 },
      })
      .setOrigin(0.5);

    // Crear botones de opciones con diseño elegante
    this.createOptionButtons();
  }

  createOptionButtons() {
    this.optionButtons = [];
    const buttonHeight = 60;
    const spacing = 20;
    const totalHeight =
      this.currentMessage.options.length * (buttonHeight + spacing);
    const startY = 280;

    // Mezclar aleatoriamente las opciones
    const shuffledOptions = [...this.currentMessage.options].sort(
      () => Math.random() - 0.5
    );

    shuffledOptions.forEach((option, index) => {
      // Fondo del botón con estilo elegante
      const btn = this.add.graphics();

      // Verificar si la opción ya fue marcada como incorrecta o es correcta
      const isIncorrect = this.incorrectOptions.includes(option.value);
      const isCorrect = option.isCorrect && this.answeredCorrectly;

      btn.fillStyle(isIncorrect ? 0xe74c3c : isCorrect ? 0x2ecc71 : 0xecf0f1, 0.95);
      btn.lineStyle(
        2,
        isIncorrect ? 0xe74c3c : option.isCorrect ? 0x2c3e50 : 0x7f8c8d,
        1
      );
      btn.fillRoundedRect(
        this.scale.width / 2 - (this.scale.width - 100) / 2,
        startY + index * (buttonHeight + spacing),
        this.scale.width - 100,
        buttonHeight,
        15
      );
      btn.strokeRoundedRect(
        this.scale.width / 2 - (this.scale.width - 100) / 2,
        startY + index * (buttonHeight + spacing),
        this.scale.width - 100,
        buttonHeight,
        15
      );

      // Texto del botón con estilo elegante
      const text = this.add
        .text(
          this.scale.width / 2,
          startY + index * (buttonHeight + spacing) + buttonHeight / 2,
          option.label,
          {
            font: "22px Arial",
            color: (isIncorrect || isCorrect) ? "#ECF0F1" : "#2C3E50",
            align: "center",
          }
        )
        .setOrigin(0.5);

      // Hacer el botón interactivo
      const hitArea = new Phaser.Geom.Rectangle(
        this.scale.width / 2 - (this.scale.width - 100) / 2,
        startY + index * (buttonHeight + spacing),
        this.scale.width - 100,
        buttonHeight
      );

      const button = this.add
        .zone(
          this.scale.width / 2,
          startY + index * (buttonHeight + spacing) + buttonHeight / 2,
          this.scale.width - 100,
          buttonHeight
        )
        .setInteractive({ hitArea, useHandCursor: true });

      button.setData("option", option);
      button.setData("graphics", btn);
      button.setData("text", text);
      button.setData("index", index);

      // Efectos de hover elegantes
      button.on("pointerover", () => {
        if (!this.incorrectOptions.includes(option.value)) {
          btn.clear();
          btn.fillStyle(0x2c3e50, 1);
          btn.lineStyle(2, 0x2c3e50, 1);
          btn.fillRoundedRect(
            this.scale.width / 2 - (this.scale.width - 100) / 2,
            startY + index * (buttonHeight + spacing),
            this.scale.width - 100,
            buttonHeight,
            15
          );
          btn.strokeRoundedRect(
            this.scale.width / 2 - (this.scale.width - 100) / 2,
            startY + index * (buttonHeight + spacing),
            this.scale.width - 100,
            buttonHeight,
            15
          );
          text.setColor("#ECF0F1");
        }
      });

      button.on("pointerout", () => {
        if (!this.incorrectOptions.includes(option.value)) {
          btn.clear();
          btn.fillStyle(0xecf0f1, 0.95);
          btn.lineStyle(2, option.isCorrect ? 0x2c3e50 : 0x7f8c8d, 1);
          btn.fillRoundedRect(
            this.scale.width / 2 - (this.scale.width - 100) / 2,
            startY + index * (buttonHeight + spacing),
            this.scale.width - 100,
            buttonHeight,
            15
          );
          btn.strokeRoundedRect(
            this.scale.width / 2 - (this.scale.width - 100) / 2,
            startY + index * (buttonHeight + spacing),
            this.scale.width - 100,
            buttonHeight,
            15
          );
          text.setColor("#2C3E50");
        }
      });

      button.on("pointerdown", () => this.checkAnswer(option, index));

      this.optionButtons.push(button);
    });
  }

  destroyOptionButtons() {
    if (this.optionButtons) {
      this.optionButtons.forEach((btn) => {
        btn.getData("graphics").destroy();
        btn.getData("text").destroy();
        btn.destroy();
      });
      this.optionButtons = [];
    }
  }

  checkAnswer(selectedOption, optionIndex) {
    // Deshabilitar temporalmente los botones durante la animación
    this.optionButtons.forEach((btn) => {
      btn.disableInteractive();
    });

    // Marcar la opción seleccionada como correcta o incorrecta
    const btn = this.optionButtons[optionIndex].getData("graphics");
    const text = this.optionButtons[optionIndex].getData("text");

    // Limpiar el botón actual
    btn.clear();

    // Aplicar el color correspondiente
    if (selectedOption.isCorrect) {
      this.answeredCorrectly = true;
      // Verde para respuestas correctas
      btn.fillStyle(0x2ecc71, 1);
      btn.lineStyle(2, 0x27ae60, 1);
      text.setColor("#FFFFFF");
      
      // Actualizar todas las opciones
      this.optionButtons.forEach((button, idx) => {
        if (idx !== optionIndex) {
          const btnGraphics = button.getData("graphics");
          const btnText = button.getData("text");
          const btnOption = button.getData("option");
          const btnY = 280 + idx * (60 + 20);
          
          btnGraphics.clear();
          if (btnOption.isCorrect) {
            btnGraphics.fillStyle(0x2ecc71, 1);
            btnGraphics.lineStyle(2, 0x27ae60, 1);
            btnText.setColor("#FFFFFF");
          } else {
            btnGraphics.fillStyle(0xecf0f1, 0.95);
            btnGraphics.lineStyle(2, 0x7f8c8d, 1);
          }
          
          btnGraphics.fillRoundedRect(
            this.scale.width / 2 - (this.scale.width - 100) / 2,
            btnY,
            this.scale.width - 100,
            60,
            15
          );
          btnGraphics.strokeRoundedRect(
            this.scale.width / 2 - (this.scale.width - 100) / 2,
            btnY,
            this.scale.width - 100,
            60,
            15
          );
        }
      });

      // Dibujar el botón con el nuevo color
      const buttonY = 280 + optionIndex * (60 + 20);
      btn.fillRoundedRect(
        this.scale.width / 2 - (this.scale.width - 100) / 2,
        buttonY,
        this.scale.width - 100,
        60,
        15
      );
      btn.strokeRoundedRect(
        this.scale.width / 2 - (this.scale.width - 100) / 2,
        buttonY,
        this.scale.width - 100,
        60,
        15
      );
    }

    // Configurar barra de progreso con diseño elegante
    const progressWidth = this.scale.width - 100;
    const progressHeight = 25;
    const progressX = 50;
    const progressY = this.scale.height - 80;

    // Fondo de la barra de progreso
    const progressBg = this.add.graphics();
    progressBg.fillStyle(0xecf0f1, 0.3);
    progressBg.fillRoundedRect(
      progressX,
      progressY,
      progressWidth,
      progressHeight,
      10
    );

    // Barra de progreso - siempre verde
    const progressBar = this.add.graphics();
    progressBar.fillStyle(0x2ecc71, 0.8); // Siempre verde
    progressBar.fillRoundedRect(progressX, progressY, 0, progressHeight, 10);

    // Texto de progreso con estilo elegante
    const progressText = this.add
      .text(this.scale.width / 2, this.scale.height - 50, "Procesando...", {
        font: "24px Arial",
        color: "#ECF0F1",
        stroke: "#2C3E50",
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    // Animación de la barra de progreso
    let startTime = null;
    const animationDuration = selectedOption.isCorrect ? 2000 : 1000; // 2 segundos para correctas, 1 segundo para incorrectas

    const updateProgress = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(
        100,
        Math.round((elapsed / animationDuration) * 100)
      );

      // Actualizar barra de progreso
      const currentWidth = Math.min(
        progressWidth,
        (elapsed / animationDuration) * progressWidth
      );
      progressBar.clear();
      progressBar.fillStyle(0x2ecc71, 0.8); // Siempre verde
      progressBar.fillRoundedRect(
        progressX,
        progressY,
        currentWidth,
        progressHeight,
        10
      );

      // Actualizar texto
      progressText.setText(`Procesando... ${progress}%`);

      if (elapsed < animationDuration) {
        requestAnimationFrame(updateProgress);
      } else {
        // Finalizar
        if (selectedOption.isCorrect) {
          progressText.setText("¡Clasificación Correcta!");
          progressText.setColor("#2ECC71");

          // Cambiar a la siguiente pregunta
          this.currentMessageIndex++;
          this.incorrectOptions = []; // Resetear las opciones incorrectas

          // Verificar si se han completado todas las preguntas
          if (this.currentMessageIndex >= this.messages.length) {
            // Crear fondo semi-transparente
            const overlay = this.add.graphics();
            overlay.fillStyle(0x000000, 0.7);
            overlay.fillRect(0, 0, this.scale.width, this.scale.height);

            // Crear cuadro de alerta con diseño elegante
            const alertBox = this.add.graphics();
            alertBox.fillStyle(0xecf0f1, 0.95);
            alertBox.lineStyle(2, 0x2c3e50, 1);
            alertBox.fillRoundedRect(
              this.scale.width / 2 - 200,
              this.scale.height / 2 - 100,
              400,
              200,
              15
            );
            alertBox.strokeRoundedRect(
              this.scale.width / 2 - 200,
              this.scale.height / 2 - 100,
              400,
              200,
              15
            );

            // Icono de verificación
            const checkIcon = this.add.text(
              this.scale.width / 2 - 50,
              this.scale.height / 2 - 80,
              "✓",
              {
                font: "64px Arial",
                color: "#2ECC71",
              }
            );
            checkIcon.setOrigin(0.5);

            // Texto de alerta
            const alertText = this.add.text(
              this.scale.width / 2,
              this.scale.height / 2,
              "IA Configurada Correctamente",
              {
                font: "28px Arial",
                color: "#2C3E50",
                align: "center",
                fontStyle: "bold",
              }
            );
            alertText.setOrigin(0.5);

            const countdownText = this.add.text(
              this.scale.width / 2,
              this.scale.height / 2 + 70,
              "",
              {
                font: "20px Arial",
                color: "#7F8C8D",
                align: "center",
              }
            );
            countdownText.setOrigin(0.5);

            // Limpiar elementos de progreso
            progressBg.destroy();
            progressBar.destroy();
            progressText.destroy();

            // Desactivar todos los botones
            this.optionButtons.forEach((btn) => {
              btn.disableInteractive();
            });

            // Cambiar a la siguiente escena después de 3 segundos
            this.time.delayedCall(3000, () => {
              this.scene.start("scenaUltima");
            });
          } else {
            // Esperar 2 segundos antes de actualizar a la siguiente pregunta
            this.time.delayedCall(2000, () => {
              // Limpiar elementos de progreso
              progressBg.destroy();
              progressBar.destroy();
              progressText.destroy();

              // Actualizar texto y botones
              this.currentMessage = this.messages[this.currentMessageIndex];
              this.messageText.setText(this.currentMessage.text);
              this.destroyOptionButtons();
              this.createOptionButtons();
            });
          }
        } else {
          progressText.setText("Clasificación Incorrecta");
          progressText.setColor("#E74C3C");

          // Agregar la opción incorrecta a la lista
          if (!this.incorrectOptions.includes(selectedOption.value)) {
            this.incorrectOptions.push(selectedOption.value);
          }

          // Mostrar mensaje de intentar de nuevo
          const tryAgainText = this.add
            .text(
              this.scale.width / 2,
              this.scale.height - 20,
              "Intenta de nuevo",
              {
                font: "20px Arial",
                color: "#E74C3C",
                align: "center",
              }
            )
            .setOrigin(0.5);

          // Limpiar elementos de progreso después de un tiempo
          this.time.delayedCall(1000, () => {
            progressBg.destroy();
            progressBar.destroy();
            progressText.destroy();
            tryAgainText.destroy();

            // Reactivar los botones para permitir otro intento
            this.optionButtons.forEach((btn) => {
              btn.setInteractive();
            });

            // Redibujar los botones para mostrar las opciones incorrectas en rojo
            this.destroyOptionButtons();
            this.createOptionButtons();
          });
        }
      }
    };

    requestAnimationFrame(updateProgress);
  }
}

window.scenaIA = scenaIA;
