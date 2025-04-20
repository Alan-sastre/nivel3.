class scenaPregunta extends Phaser.Scene {
  constructor() {
    super({ key: "scenaPregunta" });
    this.currentStep = 0;
    this.totalSteps = 4;
    this.feedbackElements = [];
  }

  preload() {
    // Cargar el fondo
    this.load.image("fondoo", "assets/ScenaDialogo/fondo.jpg");

  }

  create() {
    const { width, height } = this.scale.displaySize;

    // Fondo
    this.fondo = this.add.image(0, 0, "fondoo");
    this.fondo.setOrigin(0, 0);
    this.fondo.displayWidth = this.scale.width;
    this.fondo.displayHeight = this.scale.height;

    // Crear los recuadros de código
    this.createCodeBoxes();
  }

  createCodeBoxes() {
    // Título de la pregunta con estilo mejorado
    const titleBg = this.add.graphics();
    titleBg.fillStyle(0x2c3e50, 0.9);
    titleBg.fillRoundedRect(
      this.scale.width * 0.1,
      30,
      this.scale.width * 0.8,
      60,
      10
    );

    const title = this.add.text(
      this.scale.width / 2,
      60,
      "¿Cuál es el problema en este código que controla el semáforo de CODEX-9?",
      {
        font: "bold 24px Arial",
        fill: "#ECF0F1",
        align: "center",
        wordWrap: { width: this.scale.width * 0.75 },
      }
    );
    title.setOrigin(0.5);

    const boxWidth = 400;
    const boxHeight = 300;
    const padding = 25;

    // Posiciones de los cuadros
    const leftX = this.scale.width / 4 - boxWidth / 2;
    const rightX = (3 * this.scale.width) / 4 - boxWidth / 2;
    const boxY = this.scale.height / 2 - boxHeight / 2;

    // Decidir aleatoriamente qué código va a la izquierda y cuál a la derecha
    const isCorrectLeft = Phaser.Math.Between(0, 1) === 1;

    // Código incorrecto
    const wrongCode = `int ledRojo = 9;
int ledVerde = 10;
void setup() {
 pinMode(ledRojo, OUTPUT);
 pinMode(ledVerde, OUTPUT);
}
void loop() {
 digitalWrite(ledRojo, HIGH);
 delay(5000);
 digitalWrite(ledRojo, LOW);
 digitalWrite(ledVerde, HIGH);
 delay(5000);
}`;

    // Código correcto
    const correctCode = `int ledRojo = 9;
int ledVerde = 10;
void setup() {
 pinMode(ledRojo, OUTPUT);
 pinMode(ledVerde, OUTPUT);
}
void loop() {
 digitalWrite(ledRojo, HIGH);
 delay(5000);
 digitalWrite(ledRojo, LOW);
 digitalWrite(ledVerde, HIGH);
 delay(5000);
 digitalWrite(ledVerde, LOW);
}`;

    // Crear los cuadros según la posición aleatoria
    const leftBox = this.add.graphics();
    leftBox.fillStyle(0x2c3e50, 0.9);
    leftBox.fillRoundedRect(leftX, boxY, boxWidth, boxHeight, 15);
    leftBox.lineStyle(3, 0x3498db);
    leftBox.strokeRoundedRect(leftX, boxY, boxWidth, boxHeight, 15);

    const rightBox = this.add.graphics();
    rightBox.fillStyle(0x2c3e50, 0.9);
    rightBox.fillRoundedRect(rightX, boxY, boxWidth, boxHeight, 15);
    rightBox.lineStyle(3, 0x3498db);
    rightBox.strokeRoundedRect(rightX, boxY, boxWidth, boxHeight, 15);

    // Asignar el código según la posición aleatoria
    const leftText = this.add.text(
      leftX + padding,
      boxY + padding,
      isCorrectLeft ? correctCode : wrongCode,
      {
        font: "18px Courier",
        fill: "#ffffff",
        backgroundColor: "transparent",
      }
    );

    const rightText = this.add.text(
      rightX + padding,
      boxY + padding,
      isCorrectLeft ? wrongCode : correctCode,
      {
        font: "18px Courier",
        fill: "#ffffff",
        backgroundColor: "transparent",
      }
    );

    // Guardar las posiciones y dimensiones para el parpadeo
    leftBox.originalBounds = {
      x: leftX,
      y: boxY,
      width: boxWidth,
      height: boxHeight,
    };

    rightBox.originalBounds = {
      x: rightX,
      y: boxY,
      width: boxWidth,
      height: boxHeight,
    };

    // Hacer los recuadros interactivos
    leftBox.setInteractive(
      new Phaser.Geom.Rectangle(leftX, boxY, boxWidth, boxHeight),
      Phaser.Geom.Rectangle.Contains
    );
    rightBox.setInteractive(
      new Phaser.Geom.Rectangle(rightX, boxY, boxWidth, boxHeight),
      Phaser.Geom.Rectangle.Contains
    );

    // Eventos de click
    leftBox.on("pointerdown", () => {
      if (isCorrectLeft) {
        // Ocultar los elementos existentes
        this.hideExistingElements();
        // Mostrar la retroalimentación paso a paso
        this.showStepByStepFeedback();
      } else {
        this.showMessage(
          "¡Inténtalo de nuevo!\nRevisa la lógica de encendido y apagado.",
          "#ff0000"
        );
        // Efecto de parpadeo en rojo
        this.flashRed(leftBox);
      }
    });

    rightBox.on("pointerdown", () => {
      if (!isCorrectLeft) {
        // Ocultar los elementos existentes
        this.hideExistingElements();
        // Mostrar la retroalimentación paso a paso
        this.showStepByStepFeedback();
      } else {
        this.showMessage(
          "¡Inténtalo de nuevo!\nRevisa la lógica de encendido y apagado.",
          "#ff0000"
        );
        // Efecto de parpadeo en rojo
        this.flashRed(rightBox);
      }
    });
  }

  hideExistingElements() {
    // Ocultar todos los elementos existentes con animación
    const elements = [
      this.fondo,
      this.titleBg,
      this.title,
      this.leftBox,
      this.rightBox,
      this.leftText,
      this.rightText,
    ];
    elements.forEach((element) => {
      if (element) {
        this.tweens.add({
          targets: element,
          alpha: 0,
          duration: 500,
          ease: "Power2",
          onComplete: () => element.destroy(),
        });
      }
    });
  }

  showStepByStepFeedback() {
    // Crear fondo para la retroalimentación
    this.feedbackBg = this.add.graphics();
    this.feedbackBg.fillStyle(0x2c3e50, 0.95);
    this.feedbackBg.fillRect(0, 0, this.scale.width, this.scale.height);
    this.feedbackBg.setAlpha(0);
    this.feedbackElements.push(this.feedbackBg);

    // Animación de entrada del fondo
    this.tweens.add({
      targets: this.feedbackBg,
      alpha: 1,
      duration: 500,
      ease: "Power2",
    });

    // Mostrar el primer paso
    this.showCurrentStep();
  }

  showCurrentStep() {
    // Limpiar elementos del paso anterior
    this.feedbackElements.forEach((element) => {
      if (element && element !== this.feedbackBg) {
        element.destroy();
      }
    });
    this.feedbackElements = [this.feedbackBg];

    // Crear contenedor para el paso actual
    const stepContainer = this.add.graphics();
    stepContainer.fillStyle(0x34495e, 0.9);
    stepContainer.fillRoundedRect(
      50,
      50,
      this.scale.width - 100,
      this.scale.height - 100,
      20
    );
    stepContainer.lineStyle(3, 0x3498db);
    stepContainer.strokeRoundedRect(
      50,
      50,
      this.scale.width - 100,
      this.scale.height - 100,
      20
    );
    this.feedbackElements.push(stepContainer);

    // Contenido específico para cada paso
    switch (this.currentStep) {
      case 0:
        this.showStep0();
        break;
      case 1:
        this.showStep1();
        break;
      case 2:
        this.showStep2();
        break;
      case 3:
        this.showStep3();
        break;
    }

    // Crear botones de navegación
    this.createNavigationButtons();
  }

  showStep0() {
    // Título del paso
    const title = this.add
      .text(this.scale.width / 2, 80, "Declaración de Variables", {
        font: "bold 28px Arial",
        fill: "#2ECC71",
        align: "center",
        stroke: "#2C3E50",
        strokeThickness: 2,
      })
      .setOrigin(0.5);
    this.feedbackElements.push(title);

    // Contenedor para el código
    const codeContainer = this.add.graphics();
    codeContainer.fillStyle(0x2c3e50, 0.95);
    codeContainer.fillRoundedRect(
      this.scale.width / 2 + 50,
      120,
      this.scale.width / 2 - 100,
      200,
      15
    );
    codeContainer.lineStyle(2, 0x3498db);
    codeContainer.strokeRoundedRect(
      this.scale.width / 2 + 50,
      120,
      this.scale.width / 2 - 100,
      200,
      15
    );
    this.feedbackElements.push(codeContainer);

    // Código resaltado
    const code = this.add.text(
      this.scale.width / 2 + 75,
      150,
      "int ledRojo = 9;\nint ledVerde = 10;",
      {
        font: "20px Courier",
        fill: "#ECF0F1",
        backgroundColor: "#2C3E50",
        padding: { x: 20, y: 10 },
        wordWrap: { width: this.scale.width / 2 - 150 },
      }
    );
    this.feedbackElements.push(code);

    // Explicación
    const explanation = this.add.text(
      100,
      150,
      "Variables para controlar los LEDs:\n\n" +
        "• ledRojo = 9: Pin para LED rojo\n" +
        "• ledVerde = 10: Pin para LED verde\n\n" +
        "Estos pines determinan dónde se\n" +
        "conectan los LEDs en el Arduino.",
      {
        font: "18px Arial",
        fill: "#ECF0F1",
        align: "left",
        wordWrap: { width: this.scale.width / 2 - 150 },
        lineSpacing: 8,
      }
    );
    this.feedbackElements.push(explanation);
  }

  showStep1() {
    const title = this.add
      .text(this.scale.width / 2, 80, "Función setup()", {
        font: "bold 28px Arial",
        fill: "#2ECC71",
        align: "center",
        stroke: "#2C3E50",
        strokeThickness: 2,
      })
      .setOrigin(0.5);
    this.feedbackElements.push(title);

    // Contenedor para el código
    const codeContainer = this.add.graphics();
    codeContainer.fillStyle(0x2c3e50, 0.95);
    codeContainer.fillRoundedRect(
      this.scale.width / 2 + 50,
      120,
      this.scale.width / 2 - 100,
      200,
      15
    );
    codeContainer.lineStyle(2, 0x3498db);
    codeContainer.strokeRoundedRect(
      this.scale.width / 2 + 50,
      120,
      this.scale.width / 2 - 100,
      200,
      15
    );
    this.feedbackElements.push(codeContainer);

    // Código resaltado
    const code = this.add.text(
      this.scale.width / 2 + 75,
      150,
      "void setup() {\n  pinMode(ledRojo, OUTPUT);\n  pinMode(ledVerde, OUTPUT);\n}",
      {
        font: "20px Courier",
        fill: "#ECF0F1",
        backgroundColor: "#2C3E50",
        padding: { x: 20, y: 10 },
        wordWrap: { width: this.scale.width / 2 - 150 },
      }
    );
    this.feedbackElements.push(code);

    // Explicación
    const explanation = this.add.text(
      100,
      150,
      "Configuración inicial:\n\n" +
        "• Se ejecuta una vez al inicio\n" +
        "• Configura pines como salidas\n" +
        "• OUTPUT para enviar señales\n" +
        "• No para leer datos",
      {
        font: "18px Arial",
        fill: "#ECF0F1",
        align: "left",
        wordWrap: { width: this.scale.width / 2 - 150 },
        lineSpacing: 8,
      }
    );
    this.feedbackElements.push(explanation);
  }

  showStep2() {
    const title = this.add
      .text(this.scale.width / 2, 80, "Función loop() - Parte 1", {
        font: "bold 28px Arial",
        fill: "#2ECC71",
        align: "center",
        stroke: "#2C3E50",
        strokeThickness: 2,
      })
      .setOrigin(0.5);
    this.feedbackElements.push(title);

    // Contenedor para el código
    const codeContainer = this.add.graphics();
    codeContainer.fillStyle(0x2c3e50, 0.95);
    codeContainer.fillRoundedRect(
      this.scale.width / 2 + 50,
      120,
      this.scale.width / 2 - 100,
      200,
      15
    );
    codeContainer.lineStyle(2, 0x3498db);
    codeContainer.strokeRoundedRect(
      this.scale.width / 2 + 50,
      120,
      this.scale.width / 2 - 100,
      200,
      15
    );
    this.feedbackElements.push(codeContainer);

    // Código resaltado
    const code = this.add.text(
      this.scale.width / 2 + 75,
      150,
      "void loop() {\n  digitalWrite(ledRojo, HIGH);\n  delay(5000);\n  digitalWrite(ledRojo, LOW);\n  digitalWrite(ledVerde, HIGH);\n  delay(5000);",
      {
        font: "20px Courier",
        fill: "#ECF0F1",
        backgroundColor: "#2C3E50",
        padding: { x: 20, y: 10 },
        wordWrap: { width: this.scale.width / 2 - 150 },
      }
    );
    this.feedbackElements.push(code);

    // Explicación
    const explanation = this.add.text(
      100,
      150,
      "Secuencia principal:\n\n" +
        "1. Enciende LED rojo\n" +
        "2. Espera 5 segundos\n" +
        "3. Apaga LED rojo\n" +
        "4. Enciende LED verde\n" +
        "5. Espera 5 segundos",
      {
        font: "18px Arial",
        fill: "#ECF0F1",
        align: "left",
        wordWrap: { width: this.scale.width / 2 - 150 },
        lineSpacing: 8,
      }
    );
    this.feedbackElements.push(explanation);
  }

  showStep3() {
    const title = this.add
      .text(this.scale.width / 2, 80, "Función loop() - Parte 2", {
        font: "bold 28px Arial",
        fill: "#2ECC71",
        align: "center",
        stroke: "#2C3E50",
        strokeThickness: 2,
      })
      .setOrigin(0.5);
    this.feedbackElements.push(title);

    // Contenedor para el código
    const codeContainer = this.add.graphics();
    codeContainer.fillStyle(0x2c3e50, 0.95);
    codeContainer.fillRoundedRect(
      this.scale.width / 2 + 50,
      120,
      this.scale.width / 2 - 100,
      200,
      15
    );
    codeContainer.lineStyle(2, 0x3498db);
    codeContainer.strokeRoundedRect(
      this.scale.width / 2 + 50,
      120,
      this.scale.width / 2 - 100,
      200,
      15
    );
    this.feedbackElements.push(codeContainer);

    // Código resaltado
    const code = this.add.text(
      this.scale.width / 2 + 75,
      150,
      "  digitalWrite(ledVerde, LOW);\n  // Apagar LED verde\n}",
      {
        font: "20px Courier",
        fill: "#ECF0F1",
        backgroundColor: "#2C3E50",
        padding: { x: 20, y: 10 },
        wordWrap: { width: this.scale.width / 2 - 150 },
      }
    );
    this.feedbackElements.push(code);

    // Explicación
    const explanation = this.add.text(
      100,
      150,
      "Final del ciclo:\n\n" +
        "• Apaga LED verde\n" +
        "• Ciclo se repite\n\n" +
        "Diferencia clave:\n" +
        "1. Asegura apagado\n" +
        "2. Evita LEDs encendidos\n" +
        "3. Transición limpia",
      {
        font: "18px Arial",
        fill: "#ECF0F1",
        align: "left",
        wordWrap: { width: this.scale.width / 2 - 150 },
        lineSpacing: 8,
      }
    );
    this.feedbackElements.push(explanation);
  }

  createNavigationButtons() {
    // Botón de siguiente
    const nextButton = this.add.graphics();
    nextButton.fillStyle(0x2ecc71, 0.9);
    nextButton.fillRoundedRect(
      this.scale.width - 200,
      this.scale.height - 100,
      150,
      50,
      10
    );
    nextButton.lineStyle(2, 0x27ae60);
    nextButton.strokeRoundedRect(
      this.scale.width - 200,
      this.scale.height - 100,
      150,
      50,
      10
    );
    this.feedbackElements.push(nextButton);

    const nextText = this.add
      .text(this.scale.width - 125, this.scale.height - 75, "Siguiente", {
        font: "bold 24px Arial",
        fill: "#ECF0F1",
        align: "center",
        stroke: "#2C3E50",
        strokeThickness: 2,
      })
      .setOrigin(0.5);
    this.feedbackElements.push(nextText);

    // Botón de anterior (solo si no es el primer paso)
    if (this.currentStep > 0) {
      const prevButton = this.add.graphics();
      prevButton.fillStyle(0x3498db, 0.9);
      prevButton.fillRoundedRect(50, this.scale.height - 100, 150, 50, 10);
      prevButton.lineStyle(2, 0x2980b9);
      prevButton.strokeRoundedRect(50, this.scale.height - 100, 150, 50, 10);
      this.feedbackElements.push(prevButton);

      const prevText = this.add
        .text(125, this.scale.height - 75, "Anterior", {
          font: "bold 24px Arial",
          fill: "#ECF0F1",
          align: "center",
          stroke: "#2C3E50",
          strokeThickness: 2,
        })
        .setOrigin(0.5);
      this.feedbackElements.push(prevText);

      // Hacer interactivo el botón anterior
      const prevZone = this.add
        .zone(125, this.scale.height - 75, 150, 50)
        .setInteractive()
        .on("pointerdown", () => {
          this.currentStep--;
          this.showCurrentStep();
        });
    }

    // Hacer interactivo el botón siguiente
    const nextZone = this.add
      .zone(this.scale.width - 125, this.scale.height - 75, 150, 50)
      .setInteractive()
      .on("pointerdown", () => {
        if (this.currentStep < this.totalSteps - 1) {
          this.currentStep++;
          this.showCurrentStep();
        } else {
          // Si es el último paso, ir a la siguiente escena
          this.scene.start("scenaFin");
        }
      });

    // Efectos hover para los botones
    nextZone.on("pointerover", () => {
      nextButton.clear();
      nextButton.fillStyle(0x27ae60, 0.9);
      nextButton.fillRoundedRect(
        this.scale.width - 200,
        this.scale.height - 100,
        150,
        50,
        10
      );
      nextButton.lineStyle(2, 0x2ecc71);
      nextButton.strokeRoundedRect(
        this.scale.width - 200,
        this.scale.height - 100,
        150,
        50,
        10
      );
    });

    nextZone.on("pointerout", () => {
      nextButton.clear();
      nextButton.fillStyle(0x2ecc71, 0.9);
      nextButton.fillRoundedRect(
        this.scale.width - 200,
        this.scale.height - 100,
        150,
        50,
        10
      );
      nextButton.lineStyle(2, 0x27ae60);
      nextButton.strokeRoundedRect(
        this.scale.width - 200,
        this.scale.height - 100,
        150,
        50,
        10
      );
    });
  }

  showMessage(text, color) {
    const padding = { x: 25, y: 15 };
    const maxWidth = this.scale.width * 0.6; // 60% del ancho de la pantalla

    // Crear el fondo del mensaje
    const messageBg = this.add.graphics();
    const messageY = 40;

    // Crear el texto primero para obtener sus dimensiones
    const message = this.add.text(this.scale.width / 2, messageY, text, {
      font: "bold 22px Arial",
      fill: color,
      align: "center",
      wordWrap: { width: maxWidth - padding.x * 2 },
    });
    message.setOrigin(0.5, 0);

    // Dibujar el fondo basado en las dimensiones del texto
    const bgWidth = message.width + padding.x * 2;
    const bgHeight = message.height + padding.y * 2;
    messageBg.fillStyle(0x2c3e50, 0.95);
    messageBg.fillRoundedRect(
      message.x - bgWidth / 2,
      messageY - padding.y,
      bgWidth,
      bgHeight,
      10
    );

    // Asegurarse que el texto esté sobre el fondo
    message.setDepth(1);

    // Animación de entrada
    message.setAlpha(0);
    messageBg.setAlpha(0);
    this.tweens.add({
      targets: [message, messageBg],
      alpha: 1,
      duration: 200,
      ease: "Power2",
    });

    // Animación de salida y destrucción
    this.time.delayedCall(1800, () => {
      this.tweens.add({
        targets: [message, messageBg],
        alpha: 0,
        duration: 200,
        ease: "Power2",
        onComplete: () => {
          message.destroy();
          messageBg.destroy();
        },
      });
    });
  }

  flashRed(box) {
    let flashCount = 0;
    const maxFlashes = 3;
    const flashInterval = 200; // milisegundos

    const flash = () => {
      if (flashCount >= maxFlashes * 2) return;

      const bounds = box.originalBounds;
      box.clear(); // Limpiar el gráfico antes de redibujar

      // Redibujar el fondo
      box.fillStyle(0x333333, 0.5);
      box.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);

      // Dibujar el borde con el color correspondiente
      if (flashCount % 2 === 0) {
        box.lineStyle(2, 0xff0000); // Rojo
      } else {
        box.lineStyle(2, 0x00ff00); // Verde original
      }
      box.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);

      flashCount++;
      if (flashCount < maxFlashes * 2) {
        setTimeout(flash, flashInterval);
      }
    };

    flash();
  }

  update() {}
}
