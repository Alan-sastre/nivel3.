class scenaInput extends Phaser.Scene {
  constructor() {
    super({ key: "scenaInput" });
    this.codeText = "";
    this.compilerOutput = [];
    this.hints = [
      "Recuerda que necesitas declarar los pines de los LEDs",
      "No olvides configurar los pines como OUTPUT en setup()",
      "El semáforo necesita delays para cambiar de estado",
      "Asegúrate de apagar un LED antes de encender el otro",
      "El código debe estar dentro de las funciones setup() y loop()",
    ];
    this.currentHintIndex = 0;
  }

  preload() {
    this.load.image("fondoo", "assets/ScenaDialogo/fondo.jpg");
  }

  create() {
    // Limpieza previa de cualquier textarea residual
    if (this.textInput && this.textInput.parentNode) {
      this.textInput.parentNode.removeChild(this.textInput);
      this.textInput = null;
    }
    // Usa dimensiones del canvas reales
    const width = this.sys.game.config.width;
    const height = this.sys.game.config.height;

    // Elimina fondo Phaser anterior si existe
    if (this.fondo && this.fondo.destroy) {
      this.fondo.destroy();
    }
    // Elimina cualquier fondo HTML residual
    if (document.getElementById('scenaInputBg')) {
      document.getElementById('scenaInputBg').remove();
    }
    this.fondo = this.add.image(0, 0, "fondoo");
    this.fondo.setOrigin(0, 0);
    this.fondo.displayWidth = width;
    this.fondo.displayHeight = height;

    // Mostrar título inicial
    this.showInitialAlert();

    // Título arriba del input SOLO en PC
    if (!/Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent)) {
      this.createInputTitle(width, height);
    }
    // Configurar el input de texto
    this.setupTextInput(width, height);
    // Botones alineados debajo del input
    this.createSingleVerifyButton(width, height);
    // Sección del compilador
    this.createCompilerSection(width, height);

    // Registrar eventos para limpiar el textarea al salir de la escena
    this.events.on('shutdown', this.shutdown, this);
    this.events.on('destroy', this.shutdown, this);
  }

  createMainContainer(width, height) {
    // Contenedor decorativo, margen general
    const margin = 32;
    const mainContainer = this.add.graphics();
    mainContainer.fillStyle(0x2c3e50, 0.92);
    mainContainer.fillRoundedRect(margin, margin, width - margin * 2, height - margin * 2, 18);
    mainContainer.lineStyle(3, 0x3498db);
    mainContainer.strokeRoundedRect(margin, margin, width - margin * 2, height - margin * 2, 18);
  }

  // Elimina la visualización interna del código, solo deja el área de ingreso
  // Eliminado: createSingleCodeArea. Ya no se dibuja ningún recuadro ni título. Solo se usará el input HTML, los botones y el área del compilador.


  createSingleVerifyButton(width, height) {
    const isMobile = /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
    if (isMobile) {
      // HTML buttons para móvil, SIEMPRE visibles y abajo, incluso en horizontal (landscape)
      // NO usar top ni height fijos, ni media queries JS para landscape
      let btnRow = document.getElementById('input-btn-row');
      if (btnRow) btnRow.remove();
      btnRow = document.createElement('div');
      btnRow.id = 'input-btn-row';
      btnRow.style.position = 'fixed';
      btnRow.style.left = '0';
      btnRow.style.right = '0';
      btnRow.style.top = 'auto';
      btnRow.style.bottom = '0';
      btnRow.style.width = '100vw';
      btnRow.style.height = 'auto';
      btnRow.style.display = 'flex';
      btnRow.style.justifyContent = 'space-evenly';
      btnRow.style.alignItems = 'center';
      btnRow.style.background = 'rgba(30,34,43,0.97)';
      btnRow.style.zIndex = '2147483646'; // Ajusta el z-index para que los botones estén encima
      btnRow.style.gap = '3vw';
      btnRow.style.pointerEvents = 'auto';
      // NO listeners para orientation/resize que cambien layout en móvil
      // SIEMPRE agrega los botones abajo, inmediatamente
      // Elimina cualquier borde de depuración rojo
      // btnRow.style.border = '2px solid red'; // DEBUG: borde rojo para ver el contenedor
      if (!document.body.contains(btnRow)) document.body.appendChild(btnRow); // <-- Esto garantiza que el contenedor esté en el DOM

      // Ajusta el body para que no tenga scroll en móvil
      document.body.style.overflow = 'hidden';

      // Asegura que el canvas de Phaser esté detrás de los botones
      const phaserCanvas = document.querySelector('canvas');
      if (phaserCanvas) phaserCanvas.style.zIndex = '1';

      // Botón Pista
      const pistaBtn = document.createElement('button');
      pistaBtn.innerText = 'Pista';
      pistaBtn.style.flex = '1';
      pistaBtn.style.height = '7vh';
      pistaBtn.style.fontSize = '4vw';
      pistaBtn.style.fontWeight = 'bold';
      pistaBtn.style.background = '#ffe066';
      pistaBtn.style.color = '#2C3E50';
      pistaBtn.style.border = '2.5px solid #f1c40f';
      pistaBtn.style.borderRadius = '12px';
      pistaBtn.style.boxShadow = '0 2px 8px 0 rgba(241,196,15,0.13)';
      pistaBtn.style.cursor = 'pointer';
      pistaBtn.onclick = () => {
        if (this.hints && this.hints.length > 0) {
          const hint = this.hints[this.currentHintIndex % this.hints.length];
          if (window.Swal) {
            Swal.fire({ title: 'Pista', text: hint, icon: 'info', confirmButtonText: 'Ok' });
          } else {
            alert(hint);
          }
          this.currentHintIndex++;
        }
      };
      // Botón Compilar
      const compilarBtn = document.createElement('button');
      compilarBtn.innerText = 'Compilar';
      compilarBtn.style.flex = '1';
      compilarBtn.style.height = '7vh';
      compilarBtn.style.fontSize = '4vw';
      compilarBtn.style.fontWeight = 'bold';
      compilarBtn.style.background = '#2ecc71';
      compilarBtn.style.color = '#fff';
      compilarBtn.style.border = '2.5px solid #27ae60';
      compilarBtn.style.borderRadius = '12px';
      compilarBtn.style.boxShadow = '0 2px 8px 0 rgba(46,204,113,0.13)';
      compilarBtn.style.cursor = 'pointer';
      compilarBtn.onclick = () => this.compileCode();
      btnRow.appendChild(pistaBtn);
      btnRow.appendChild(compilarBtn);
    } else {
      // Phaser buttons solo en PC
      const btnW = 130;
      const btnH = 46;
      const gap = 18;
      const totalWidth = btnW * 2 + gap;
      const startX = (width - totalWidth) / 2;
      const btnY = Math.round(height * 0.55);
      // Botón Pista
      if (this.hintButton && this.hintButton.destroy) this.hintButton.destroy();
      this.hintButton = this.add.graphics();
      this.hintButton.fillStyle(0xf1c40f, 0.93);
      this.hintButton.fillRoundedRect(startX, btnY, btnW, btnH, 12);
      this.hintButton.lineStyle(2, 0xf39c12);
      this.hintButton.strokeRoundedRect(startX, btnY, btnW, btnH, 12);
      const hintText = this.add.text(startX + btnW / 2, btnY + btnH / 2, "Pista", {
        font: "bold 18px Arial",
        fill: "#2C3E50",
      }).setOrigin(0.5);
      this.add.zone(startX + btnW / 2, btnY + btnH / 2, btnW, btnH)
        .setInteractive()
        .on("pointerdown", () => {
          if (this.hints && this.hints.length > 0) {
            const hint = this.hints[this.currentHintIndex % this.hints.length];
            if (window.Swal) {
              Swal.fire({ title: 'Pista', text: hint, icon: 'info', confirmButtonText: 'Ok' });
            } else {
              alert(hint);
            }
            this.currentHintIndex++;
          }
        });
      // Botón Compilar
      if (this.compileButton && this.compileButton.destroy) this.compileButton.destroy();
      this.compileButton = this.add.graphics();
      this.compileButton.fillStyle(0x2ecc71, 0.93);
      this.compileButton.fillRoundedRect(startX + btnW + gap, btnY, btnW, btnH, 12);
      this.compileButton.lineStyle(2, 0x27ae60);
      this.compileButton.strokeRoundedRect(startX + btnW + gap, btnY, btnW, btnH, 12);
      const compileText = this.add.text(startX + btnW + gap + btnW / 2, btnY + btnH / 2, "Compilar", {
        font: "bold 18px Arial",
        fill: "#ECF0F1",
      }).setOrigin(0.5);
      this.add.zone(startX + btnW + gap + btnW / 2, btnY + btnH / 2, btnW, btnH)
        .setInteractive()
        .on("pointerdown", () => {
          this.compileCode();
        });
    }
  }

  createInputTitle(width, height) {
    // Título centrado grande y claro
    const titleY = Math.round(height * 0.10);
    const title = this.add.text(width / 2, titleY, "Ingresa tu código Arduino", {
      font: "bold 34px Arial",
      fill: "#00cfff",
      align: "center",
      stroke: "#222",
      strokeThickness: 3,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: '#000',
        blur: 5,
        fill: true
      }
    }).setOrigin(0.5);
  }

  createCompilerSection(width, height) {
    // Detecta si es móvil y horizontal
    const isMobile = /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
    const isLandscape = window.matchMedia("(orientation: landscape)").matches;
    // Crea un div HTML fijo para mostrar el resultado de la compilación
    let compilerDiv = document.getElementById("compiler-output");
    if (compilerDiv) {
      compilerDiv.remove();
    }
    compilerDiv = document.createElement("div");
    compilerDiv.id = "compiler-output";
    compilerDiv.style.position = "fixed";
    if (isMobile) {
      // Móvil: input a la izquierda, compilador a la derecha (ambos 50vw, 80vh)
      compilerDiv.style.position = "fixed";
      compilerDiv.style.left = "50vw";
      compilerDiv.style.top = "50vh";
      compilerDiv.style.width = "50vw";
      compilerDiv.style.height = "40vh";
      compilerDiv.style.margin = "0";
      compilerDiv.style.padding = "0 2vw";
    } else {
      // PC: compilador a la derecha
      compilerDiv.style.right = "6vw";
      compilerDiv.style.top = "18vh";
      compilerDiv.style.width = "38vw";
      compilerDiv.style.height = "52vh";
      compilerDiv.style.margin = "";
      compilerDiv.style.padding = "18px 16px";
    }
    compilerDiv.style.background = "#1e2430";
    compilerDiv.style.color = "#e0f7fa";
    compilerDiv.style.border = "2.5px solid #00cfff";
    compilerDiv.style.borderRadius = "14px";
    compilerDiv.style.boxShadow = "0 6px 24px 0 rgba(0,207,255,0.08), 0 2px 8px 0 rgba(44,62,80,0.13)";
    compilerDiv.style.fontFamily = "Consolas, monospace";
    compilerDiv.style.fontSize = "18px";
    compilerDiv.style.padding = "18px 16px";
    compilerDiv.style.zIndex = "900";
    compilerDiv.style.textAlign = "left";
    compilerDiv.style.letterSpacing = "0.3px";
    compilerDiv.style.overflowY = "auto";
    compilerDiv.innerHTML = "";
    document.body.appendChild(compilerDiv);
    this.compilerDiv = compilerDiv;
  }

  shutdown() {
    // Elimina el textarea del DOM si existe
    if (this.textInput && this.textInput.parentNode) {
      this.textInput.parentNode.removeChild(this.textInput);
      this.textInput = null;
    }
    // Elimina los botones HTML si existen
    const btnRow = document.getElementById('input-btn-row');
    if (btnRow && btnRow.parentNode) {
      btnRow.parentNode.removeChild(btnRow);
    }
    // Elimina el título HTML móvil si existe
    const mobileTitle = document.getElementById('input-title-mobile');
    if (mobileTitle && mobileTitle.parentNode) {
      mobileTitle.parentNode.removeChild(mobileTitle);
    }
    // Limpia el listener de orientación/resize
    if (this._btnRowResizeHandler) {
      window.removeEventListener('resize', this._btnRowResizeHandler);
      window.removeEventListener('orientationchange', this._btnRowResizeHandler);
      this._btnRowResizeHandler = null;
    }
    // Elimina la sección del compilador si existe
    const compilerDiv = document.getElementById('compiler-output');
    if (compilerDiv && compilerDiv.parentNode) {
      compilerDiv.parentNode.removeChild(compilerDiv);
    }
  }

  // Elimina el área visual Phaser del código, solo deja el textarea
  setupTextInput(width, height) {
    // Detecta si es móvil y horizontal
    const isMobile = /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
    const isLandscape = window.matchMedia("(orientation: landscape)").matches;
    // Crear un elemento HTML para el input
    const input = document.createElement("textarea");
    input.style.position = "fixed";
    if (isMobile) {
      // Móvil: input a la izquierda (50vw, 80vh)
      input.style.left = "0";
      input.style.top = "10vh";
      input.style.width = "50vw";
      input.style.height = "40vh";
      input.style.margin = "0";
      input.style.padding = "0 2vw";
    } else {
      // PC: input a la izquierda
      input.style.left = "6vw";
      input.style.top = "18vh";
      input.style.width = "38vw";
      input.style.height = "52vh";
      input.style.margin = "";
      input.style.padding = "18px 16px";
    }

    // Título HTML fijo para móviles (si no existe)
    if (isMobile && !document.getElementById('input-title-mobile')) {
      const mobileTitle = document.createElement('div');
      mobileTitle.id = 'input-title-mobile';
      mobileTitle.innerText = 'Ingresa tu código Arduino';
      mobileTitle.style.position = 'fixed';
      mobileTitle.style.top = '2vh';
      mobileTitle.style.left = '0';
      mobileTitle.style.width = '100vw';
      mobileTitle.style.textAlign = 'center';
      mobileTitle.style.fontSize = '6vw';
      mobileTitle.style.fontWeight = 'bold';
      mobileTitle.style.color = '#00cfff';
      mobileTitle.style.textShadow = '2px 2px 8px #000, 0 2px 8px #222';
      mobileTitle.style.zIndex = '2147483647';
      mobileTitle.style.pointerEvents = 'none';
      document.body.appendChild(mobileTitle);
    } else if (!isMobile && document.getElementById('input-title-mobile')) {
      document.getElementById('input-title-mobile').remove();
    }
    input.style.background = "#212733";
    input.style.color = "#e0f7fa";
    input.style.border = "2.5px solid #00cfff";
    input.style.borderRadius = "14px";
    input.style.boxShadow = "0 6px 24px 0 rgba(0,207,255,0.08), 0 2px 8px 0 rgba(44,62,80,0.13)";
    input.style.transition = "box-shadow 0.2s, border-color 0.2s";
    input.style.outline = "none";
    input.style.resize = "none";
    input.style.fontFamily = "Consolas, monospace";
    input.style.fontSize = "18px";
    input.style.padding = "18px 16px";
    input.style.letterSpacing = "0.5px";
    input.style.lineHeight = "1.5";
    input.style.caretColor = "#00cfff";
    input.placeholder = "// Escribe aquí tu código Arduino...";
    input.style.fontSize = "16px";
    input.style.padding = "16px 14px";
    input.style.overflow = "auto";
    input.style.zIndex = 20;
    input.placeholder = "Escribe aquí tu código Arduino...";
    // Efecto focus
    input.onfocus = function() {
      input.style.borderColor = "#2ecc71";
      input.style.boxShadow = "0 0 0 3px rgba(46,204,113,0.13)";
    };
    input.onblur = function() {
      input.style.borderColor = "#3498db";
      input.style.boxShadow = "0 4px 18px 0 rgba(52,152,219,0.13), 0 1.5px 6px 0 rgba(44,62,80,0.12)";
    };
    // Elimina sincronización visual interna
    input.addEventListener("input", () => {
      this.codeText = input.value;
    });
    input.style.fontFamily = "Consolas, monospace";
    input.style.fontSize = "16px";
    input.style.padding = "10px";
    input.style.resize = "none";
    input.style.outline = "none";
    input.style.overflow = "auto";
    input.style.zIndex = 10;

    // Añadir el input al DOM
    document.body.appendChild(input);

    // Guardar referencia al input
    this.textInput = input;

    // Configurar eventos
    input.addEventListener("input", () => {
      this.codeText = input.value;
      this.codeInput.setText(input.value);
    });

    // Enfocar el input
    input.focus();
  }

  createSingleVerifyButton(width, height) {
    const isMobile = /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
    const isLandscape = window.matchMedia("(orientation: landscape)").matches;
    // Botones HTML visibles debajo del input, alineados horizontalmente
    let btnRow = document.getElementById("input-btn-row");
    if (btnRow) btnRow.remove();
    btnRow = document.createElement("div");
    btnRow.id = "input-btn-row";
    btnRow.style.position = "fixed";

    function updateBtnRowLayout() {
      const isLandscapeNow = window.matchMedia("(orientation: landscape)").matches;
      if (isMobile) {
        // Móvil: botones abajo, ancho completo y SIEMPRE visibles
        btnRow.style.left = "0";
        btnRow.style.right = "0";
        btnRow.style.top = '';
        btnRow.style.width = "100vw";
        btnRow.style.margin = "0";
        btnRow.style.padding = "0 2vw";
        btnRow.style.display = 'flex';
      } else {
        btnRow.style.left = "6vw";
        btnRow.style.top = "72vh";
        btnRow.style.width = "38vw";
        btnRow.style.display = "flex";
      }
      btnRow.style.flexDirection = "row";
      btnRow.style.justifyContent = "space-between";
      btnRow.style.gap = "2vw";
      btnRow.style.zIndex = "1100";
      // Solo en móvil: asegúrate de que no haya height ni top
      if (isMobile) {
        btnRow.style.height = '';
        btnRow.style.top = '';
      }
    }
    // NO listeners para cambios de orientación/tamaño en móvil: los botones siempre van abajo
    // Limpieza garantizada en shutdown()
    if (!isMobile) {
      updateBtnRowLayout();
      this._btnRowResizeHandler = () => updateBtnRowLayout();
      window.addEventListener('resize', this._btnRowResizeHandler);
      window.addEventListener('orientationchange', this._btnRowResizeHandler);
    }

    // --- Botón Pista ---
    const pistaBtn = document.createElement("button");
    pistaBtn.innerText = "Pista";
    pistaBtn.style.flex = "1";
    pistaBtn.style.height = "54px";
    pistaBtn.style.fontSize = "20px";
    pistaBtn.style.fontWeight = "bold";
    pistaBtn.style.background = "#ffe066";
    pistaBtn.style.color = "#2C3E50";
    pistaBtn.style.border = "2.5px solid #f1c40f";
    pistaBtn.style.borderRadius = "12px";
    pistaBtn.style.boxShadow = "0 2px 8px 0 rgba(241,196,15,0.13)";
    pistaBtn.style.cursor = "pointer";
    pistaBtn.onclick = () => {
      if (this.hints && this.hints.length > 0) {
        const hint = this.hints[this.currentHintIndex % this.hints.length];
        if (window.Swal) {
          const isMobile = /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
          Swal.fire({
            title: 'Pista',
            text: hint,
            icon: 'warning',
            confirmButtonText: 'Ok',
            background: '#fffbe6',
            color: '#a67c00',
            customClass: {
              popup: isMobile ? 'swal2-pista-popup swal2-pista-mobile' : 'swal2-pista-popup',
              title: 'swal2-pista-title',
              confirmButton: 'swal2-pista-confirm',
            },
            didOpen: () => {
              // Fuerza z-index máximo para la alerta y el popup
              const swal = document.querySelector('.swal2-container');
              const popup = document.querySelector('.swal2-popup');
              if (swal) swal.style.setProperty('z-index', '2147483647', 'important');
              if (popup) popup.style.setProperty('z-index', '2147483647', 'important');
            }
          });
        } else {
          alert(hint);
        }
        this.currentHintIndex++;
      }
    };

    // Agrega estilos SweetAlert2 personalizados para pista
    if (!document.getElementById('swal2-pista-style')) {
      const style = document.createElement('style');
      style.id = 'swal2-pista-style';
      style.innerHTML = `
        .swal2-pista-popup { border: 3px solid #ffe066 !important; box-shadow: 0 0 32px #ffe06688 !important; }
        .swal2-pista-title { color: #a67c00 !important; font-weight: bold !important; }
        .swal2-pista-confirm { background: #ffe066 !important; color: #2C3E50 !important; font-weight: bold !important; }
        .swal2-icon.swal2-warning { border-color: #ffe066 !important; color: #ffe066 !important; }
        .swal2-container { z-index: 2147483647 !important; }
        .swal2-popup { z-index: 2147483647 !important; }
        .swal2-pista-mobile {
          max-width: 80vw !important;
          width: 92vw !important;
          font-size: 15px !important;
          padding: 12px 8px !important;
        }
      `;
      document.head.appendChild(style);
    }

    // --- Botón Compilar ---
    const compilarBtn = document.createElement("button");
    compilarBtn.innerText = "Compilar";
    compilarBtn.style.flex = "1";
    compilarBtn.style.height = "54px";
    compilarBtn.style.fontSize = "20px";
    compilarBtn.style.fontWeight = "bold";
    compilarBtn.style.background = "#2ecc71";
    compilarBtn.style.color = "#fff";
    compilarBtn.style.border = "2.5px solid #27ae60";
    compilarBtn.style.borderRadius = "12px";
    compilarBtn.style.boxShadow = "0 2px 8px 0 rgba(46,204,113,0.13)";
    compilarBtn.style.cursor = "pointer";
    compilarBtn.onclick = () => this.compileCode();

    btnRow.appendChild(pistaBtn);
    btnRow.appendChild(compilarBtn);
    document.body.appendChild(btnRow);
  }

  compileCode() {
    this.compilerOutput = [];

    // Análisis del código
    if (!this.codeText.includes("int ledRojo")) {
      this.compilerOutput.push("Error: Variable 'ledRojo' no declarada");
    }
    if (!this.codeText.includes("int ledVerde")) {
      this.compilerOutput.push("Error: Variable 'ledVerde' no declarada");
    }
    if (!this.codeText.includes("pinMode")) {
      this.compilerOutput.push("Error: Pines no configurados");
    }
    if (!this.codeText.includes("delay")) {
      this.compilerOutput.push("Error: No hay delays configurados");
    }

    // Verificar si el código es correcto
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

    // Mostrar resultado en el div del compilador
    if (this.compilerDiv) {
      if (this.codeText.trim() === correctCode.trim()) {
        this.compilerDiv.innerHTML = '<span style="color:green;font-weight:bold">¡Felicitaciones, tu código es correcto!</span>';
        // Transición automática a la siguiente escena tras 2 segundos
        setTimeout(() => {
          this.scene.start("scenaFin");
        }, 2000);
        return;
      }
      if (this.compilerOutput.length > 0) {
        this.compilerDiv.innerHTML = this.compilerOutput.map(e => `<span style='color:red'>${e}</span>`).join('<br>');
      } else {
        this.compilerDiv.innerHTML = '<span style="color:orange">Compilación exitosa, pero el código no es exactamente el esperado.</span>';
      }
    }
  }

  updateCompilerOutput() {
    if (this.compilerOutput.length === 0) {
      this.compilerOutputText.setText(
        "> Compilación exitosa!\n> Código válido"
      );
      this.compilerOutputText.setColor("#2ECC71");
    } else {
      this.compilerOutputText.setText("> " + this.compilerOutput.join("\n> "));
      this.compilerOutputText.setColor("#E74C3C");
    }
  }

  showHint() {
    const hint = this.hints[this.currentHintIndex];
    this.currentHintIndex = (this.currentHintIndex + 1) % this.hints.length;

    const padding = { x: 25, y: 15 };
    const maxWidth = this.scale.width * 0.6;

    const messageBg = this.add.graphics();
    const messageY = this.scale.height - 150;

    const message = this.add.text(this.scale.width / 2, messageY, hint, {
      font: "bold 20px Arial",
      fill: "#F1C40F",
      align: "center",
      wordWrap: { width: maxWidth - padding.x * 2 },
    });
    message.setOrigin(0.5, 0);

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

    // Animación de salida
    this.time.delayedCall(5000, () => {
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

  showMessage(text, color) {
    const padding = { x: 25, y: 15 };
    const maxWidth = this.scale.width * 0.6;

    const messageBg = this.add.graphics();
    const messageY = 40;

    const message = this.add.text(this.scale.width / 2, messageY, text, {
      font: "bold 22px Arial",
      fill: color,
      align: "center",
      wordWrap: { width: maxWidth - padding.x * 2 },
    });
    message.setOrigin(0.5, 0);

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

    message.setDepth(1);

    message.setAlpha(0);
    messageBg.setAlpha(0);
    this.tweens.add({
      targets: [message, messageBg],
      alpha: 1,
      duration: 200,
      ease: "Power2",
    });

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

  showInitialAlert() {
    // No mostrar ninguna alerta ni overlay
    // Mejorar la organización visual general desde createInputTitle y los estilos HTML
  }

  update() {}
}

window.scenaInput = scenaInput;
