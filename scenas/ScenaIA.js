class scenaIA extends Phaser.Scene {
  constructor() {
    super({ key: "scenaIA" });
    this.messages = [
      {
        text: "Fallo en la red eléctrica. Necesitamos ayuda urgente.",
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

    this.currentMessage.options.forEach((option, index) => {
      // Fondo del botón con estilo elegante
      const btn = this.add.graphics();

      // Verificar si la opción ya fue marcada como incorrecta
      const isIncorrect = this.incorrectOptions.includes(index);

      btn.fillStyle(isIncorrect ? 0xe74c3c : 0xecf0f1, 0.95);
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
            color: isIncorrect ? "#ECF0F1" : "#2C3E50",
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
        if (!this.incorrectOptions.includes(index)) {
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
        if (!this.incorrectOptions.includes(index)) {
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

    // Barra de progreso
    const progressBar = this.add.graphics();
    const barColor = selectedOption.isCorrect ? 0x2c3e50 : 0xe74c3c;
    progressBar.fillStyle(barColor, 0.8);
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
    const animationDuration = 2000;

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
      progressBar.fillStyle(barColor, 0.8);
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
              this.scene.start("scenaPregunta");
            });
          } else {
            // Actualizar texto y botones
            this.currentMessage = this.messages[this.currentMessageIndex];
            this.messageText.setText(this.currentMessage.text);
            this.destroyOptionButtons();
            this.createOptionButtons();
          }
        } else {
          progressText.setText("Clasificación Incorrecta");
          progressText.setColor("#E74C3C");

          // Agregar la opción incorrecta a la lista
          if (!this.incorrectOptions.includes(optionIndex)) {
            this.incorrectOptions.push(optionIndex);
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
