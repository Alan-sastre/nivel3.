class scenaPregunta extends Phaser.Scene {
    constructor() {
        super({ key: "scenaPregunta" });
    }

    preload() {
      // Cargar el fondo
      this.load.image('fondoo', 'assets/ScenaDialogo/fondo.jpg');

      this.load.audio('MusicRobot', 'assets/ScenaDialogo/MusicRobot.mp3');
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
      titleBg.fillStyle(0x2C3E50, 0.9);
      titleBg.fillRoundedRect(this.scale.width * 0.1, 30, this.scale.width * 0.8, 60, 10);

      const title = this.add.text(this.scale.width / 2, 60, '¿Cuál es el problema en este código que controla el semáforo de CODEX-9?', {
        font: 'bold 24px Arial',
        fill: '#ECF0F1',
        align: 'center',
        wordWrap: { width: this.scale.width * 0.75 }
      });
      title.setOrigin(0.5);

      const boxWidth = 400;
      const boxHeight = 300;
      const padding = 25;

      // Posiciones de los cuadros
      const leftX = this.scale.width / 4 - boxWidth / 2;
      const rightX = 3 * this.scale.width / 4 - boxWidth / 2;
      const boxY = this.scale.height / 2 - boxHeight / 2;

      // Código incorrecto (izquierda)
      const leftBox = this.add.graphics();
      leftBox.fillStyle(0x2C3E50, 0.9);
      leftBox.fillRoundedRect(leftX, boxY, boxWidth, boxHeight, 15);
      leftBox.lineStyle(3, 0x3498DB);
      leftBox.strokeRoundedRect(leftX, boxY, boxWidth, boxHeight, 15);
      
      const wrongCode = 
      `int ledRojo = 9;
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
}`

      const leftText = this.add.text(leftX + padding, 
        boxY + padding, 
        wrongCode, 
        { 
          font: '18px Courier',
          fill: '#ffffff',
          backgroundColor: 'transparent'
        });

      // Guardar las posiciones y dimensiones para el parpadeo
      leftBox.originalBounds = { x: leftX, y: boxY, width: boxWidth, height: boxHeight };

      // Código correcto (derecha)
      const rightBox = this.add.graphics();
      rightBox.fillStyle(0x2C3E50, 0.9);
      rightBox.fillRoundedRect(rightX, boxY, boxWidth, boxHeight, 15);
      rightBox.lineStyle(3, 0x3498DB);
      rightBox.strokeRoundedRect(rightX, boxY, boxWidth, boxHeight, 15);

      const correctCode = 
      `int ledRojo = 9;
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
 // Apagar el LED verde antes de repetir el ciclo
}`

      const rightText = this.add.text(rightX + padding, 
        boxY + padding, 
        correctCode, 
        { 
          font: '18px Courier',
          fill: '#ffffff',
          backgroundColor: 'transparent'
        });

      // Guardar las posiciones y dimensiones para el parpadeo del cuadro derecho
      rightBox.originalBounds = { x: rightX, y: boxY, width: boxWidth, height: boxHeight };

      // Hacer los recuadros interactivos
      leftBox.setInteractive(new Phaser.Geom.Rectangle(leftX, boxY, boxWidth, boxHeight), Phaser.Geom.Rectangle.Contains);
      rightBox.setInteractive(new Phaser.Geom.Rectangle(rightX, boxY, boxWidth, boxHeight), Phaser.Geom.Rectangle.Contains);

      // Eventos de click
      leftBox.on('pointerdown', () => {
        this.showMessage('¡Inténtalo de nuevo!\nRevisa la lógica de encendido y apagado.', '#ff0000');
        // Efecto de parpadeo en rojo
        this.flashRed(leftBox);
      });

      rightBox.on('pointerdown', () => {
        this.showMessage('¡Bien hecho!\nPara un semáforo funcional, es importante\napagar una luz antes de encender la otra.', '#00ff00');
        setTimeout(() => {
          this.scene.start("scenaRobot");
        }, 4000);
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
        font: 'bold 22px Arial',
        fill: color,
        align: 'center',
        wordWrap: { width: maxWidth - padding.x * 2 }
      });
      message.setOrigin(0.5, 0);

      // Dibujar el fondo basado en las dimensiones del texto
      const bgWidth = message.width + padding.x * 2;
      const bgHeight = message.height + padding.y * 2;
      messageBg.fillStyle(0x2C3E50, 0.95);
      messageBg.fillRoundedRect(
        message.x - bgWidth/2,
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
        ease: 'Power2'
      });

      // Animación de salida y destrucción
      this.time.delayedCall(1800, () => {
        this.tweens.add({
          targets: [message, messageBg],
          alpha: 0,
          duration: 200,
          ease: 'Power2',
          onComplete: () => {
            message.destroy();
            messageBg.destroy();
          }
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