class DialogBox {
  constructor(scene, width, height) {
    this.scene = scene;

    this.animationSpeed = 50; // Adjust the speed of the animation (milliseconds per character)
    this.isAnimating = false;
    this.clickToSkip = false;

    const x = (scene.sys.game.config.width -(width*0.6))/2; // Adjust as needed
    const y = scene.sys.game.config.height - height - 10; // Adjust as needed

    this.dialogBox = scene.add.graphics();
    this.dialogBox.fillStyle(0xFFFFFF, 0.7); // White background color
    this.dialogBox.fillRoundedRect(0, 0, width, height,15);

    this.dialogBox.setPosition(x, y);



    // Add text with black color
    this.dialogText = scene.add.text(x+10, y+10, 'DEBUG', { fontSize: '18px', fill: '#000' });
    this.dialogText.setOrigin(0, 0);
 
    this.dialogBox.setVisible(true);
    this.dialogText.setVisible(true);
  }

  setTextWithAnimation(text) {
    this.isAnimating = true;
    this.clickToSkip = false;

    let currentIndex = 0;
    const totalCharacters = text.length;

    const animateCharacter = () => {
      if (this.isAnimating && currentIndex < totalCharacters) {
        this.dialogText.setText(text.substring(0, currentIndex + 1));
        currentIndex++;

        setTimeout(animateCharacter, this.animationSpeed);
      } else {
        this.isAnimating = false;

        // Check if the user clicked to skip
        if (this.clickToSkip) {
          this.dialogText.setText(text);
        }
      }
    };

    animateCharacter();
  }

  show(text) {
    console.log("Show was called!")
    this.dialogBox.setVisible(true);
    this.dialogText.setVisible(true)
    this.setTextWithAnimation(text);

    // Allow the user to click to skip animation
    this.scene.input.on('pointerdown', () => {
      if (this.isAnimating) {
        this.clickToSkip = true;
      }
    });
  }

  hide() {
    this.dialogBox.setVisible(false);
    this.dialogText.setVisible(false);
    this.dialogText.setText('');
    this.isAnimating = false;
    this.clickToSkip = false;
  }
}

export default DialogBox;
