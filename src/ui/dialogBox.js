import Phaser from 'phaser'


class DialogBox extends Phaser.GameObjects.Graphics {

  //data;
  constructor(scene, width, height,data) {
    super(scene, 'DialogBox');
    this.scene = scene;
    this.height = height
    this.width=width

    this.isAnimating = false;
    this.clickToSkip = false;
    this.dialogEnabled = false;

    this.goal;
    this.data =data //data holds json data
    this.dialogLength //how many bubbles in a conversation
    this.dialogIndex = 1;
    this.currentIndex //current index within a conversation

    this.storedDialogIdx = this.dialogIndex //store dialog index in case a custom dialog idx is called out of order this will remember prior

    this.isVisible = false;
    this.clicksAllowed = true;

    this.dialogList =[] 
    this.dialogQueue = []
    this.statMessage;

    const x = (scene.sys.game.config.width -(width*0.6))/2; // Adjust as needed
    const y = scene.sys.game.config.height - height - 10; // Adjust as needed
    this.dialogBox = scene.add.graphics();
    this.dialogBox.fillStyle(0xFFFFFF, 0.7); // White background color
    this.dialogBox.fillRoundedRect(0, 0, width, height,15);
    this.clickableBox = this.scene.add.rectangle(x+350,y+50,width,height,0x36B540).setInteractive();
    this.clickableBox.setAlpha(0.01)
    this.clickableBox.setData('name', 'clickable box')
    
    //this.clickableBox.toString() => {{return "clickable box";}
    this.clickableBox.toString = function() {
      // Customize the output based on your requirements
      return "clickable box";
    };

    this.dialogBox.setPosition(x, y);
    this.dialogText = scene.make.text({
      x: x+10,
      y: y+10,
      text: 'DEBUG',
      origin: { x: 0, y: 0},
      style: {
          font: '20px Courier New',
          fill: 'black',
          wordWrap: { width: (width - 20) }
      }
  });
    this.dialogText.setOrigin(0, 0);

    this.handleClicks()
    //this.scene.events.on('update', this.updatePosition, this);
  }

  getIsVisible(){
    return this.isVisible
  }
  disableClicks(){
    this.clicksAllowed=false
  }
  enableClicks(){
    this.clicksAllowed=true
  }

  handleClicks(){
    if(this.clicksAllowed){
      this.clickableBox.on('pointerdown', () => {
      if (this.isAnimating)
          this.clickToSkip = true
      else if (this.currentIndex == this.dialogLength -1){
        this.nextDialog();
        this.statHandler()
      }
      else if (this.currentIndex < this.dialogLength)
        this.nextDialog();
      else if (this.dialogEnabled){ 
        this.hide();
      }
  }, this);
}
  }


  setTextWithAnimation(text) {
    if(!this.clicksAllowed)
      return
    this.isAnimating = true;
    this.clickToSkip = false;

    let currentIndex = 0;
    const totalCharacters = text.length;

    const animateCharacter = () => {
        if (this.isAnimating && currentIndex < totalCharacters) {
            this.dialogText.setText(text.substring(0, currentIndex + 1));
            currentIndex++;

            if (this.clickToSkip) {
                this.isAnimating = false;
                this.dialogText.setText(text);
                return;
            }

            // Using requestAnimationFrame for smoother animations
            requestAnimationFrame(animateCharacter);
        } else {
            this.isAnimating = false;
        }
    };

    animateCharacter();
}
  startStatUpdate(name){
    if (name === "shower")
    this.statMessage = this.data.statUpdates[0]
    else if (name === "class")
    this.statMessage = this.data.statUpdates[1]
    else if (name === "sleep")
    this.statMessage = this.data.statUpdates[2]
  }

  startDialogg(index){ //start dialog with given index
    this.scene.characterMovable =false
    this.dialogQueue.push(index)
    if(this.dialogEnabled == true){
      return
    }

    this.dialogEnabled=true;
    if (index>=this.data.dialogList.length)
    this.dialogIndex = this.data.dialogList.length - 1
    else this.dialogIndex = index
   this.dialogLength = this.data.dialogList[index].dialog.length; //length of conversation
   this.currentIndex = 0;
    //which conversation
   this.nextDialog();
   this.statHandler()
  }

  startDialog(){ //will go off of whatever the last index is
    this.dialogQueue.push(this.dialogIndex)
    if(this.dialogEnabled == true){
      return
    }
    this.scene.characterMovable =false
    this.dialogEnabled=true;
    if (this.dialogIndex >= this.data.dialogList.length)
      this.dialogIndex = this.data.dialogList.length - 1

   this.dialogLength = this.data.dialogList[this.dialogIndex].dialog.length; //length of conversation
   this.currentIndex = 0;
   this.dialogIndex = this.storedDialogIdx

   this.nextDialog();
  }
  startDialogText(text){
    this.dialogQueue.push(this.dialogIndex)
    if(this.dialogEnabled == true){
      return
    }
    this.scene.characterMovable =false
    this.dialogEnabled=true;
    this.dialogIndex = 0

   this.dialogLength = 0 //length of conversation
   this.currentIndex = 0;
   this.dialogIndex = this.storedDialogIdx
   this.storedDialogIdx = this.storedDialogIdx-1

   this.show(text)
  }

  nextDialog(){
    this.show(this.data.dialogList[this.dialogIndex].dialog[this.currentIndex].text)
    this.currentIndex++
  }

  show(text) {
    this.scene.clock.timeActive = false
    this.dialogBox.setVisible(true);
    this.dialogText.setVisible(true);
    this.isVisible = true;
    //this.handleClicks()
    this.setTextWithAnimation(text);
  }

  hide() {
    if(this.dialogQueue.length >1 && this.dialogQueue[1] == this.dialogQueue[0])
      this.dialogQueue.shift()
    this.dialogQueue.shift();

    this.scene.characterMovable =true
    this.scene.clock.timeActive = true
    this.dialogIndex++;
    this.storedDialogIdx = this.storedDialogIdx+1//this.dialogIndex;
    this.dialogBox.setVisible(false);
    this.dialogText.setVisible(false);
    this.dialogText.setText('');
    this.isVisible = false;
    this.isAnimating = false;
    this.clickToSkip = false;
    this.dialogEnabled = false
    if(this.dialogQueue.length >0){
      this.startDialogg(this.dialogQueue[0])}
  }

  statHandler(){
    let stat = this.data.dialogList[this.dialogIndex].dialog[this.currentIndex-1].goal
    if(stat !=null){
      this.goal = this.data.dialogList[this.dialogIndex].dialog[this.currentIndex-1].goal
      this.scene.missionManager.startMission(this.goal)
    }
    if(this.data.dialogList[this.dialogIndex].dialog[this.currentIndex-1].stat){2
      stat = this.data.dialogList[this.dialogIndex].dialog[this.currentIndex-1].stat
      if(stat === "energy"){
        console.log("energy called")
        this.scene.statsOverlay.updateEnergy(this.data.dialogList[this.dialogIndex].dialog[this.currentIndex-1].increment)
        this.scene.phone.clock.advanceTime(this.data.dialogList[this.dialogIndex].dialog[this.currentIndex-1].mins)
      }
      else if (stat === "social"){
        console.log("social called")
        this.scene.statsOverlay.updateEnergy(this.data.dialogList[this.dialogIndex].dialog[this.currentIndex-1].increment)
        this.scene.phone.clock.advanceTime(this.data.dialogList[this.dialogIndex].dialog[this.currentIndex-1].mins)
      }
      else if (stat === "focus"){
        console.log("focus called")
        this.scene.statsOverlay.updateFocus(this.data.dialogList[this.dialogIndex].dialog[this.currentIndex-1].increment)
        this.scene.phone.clock.advanceTime(this.data.dialogList[this.dialogIndex].dialog[this.currentIndex-1].mins)
      }
    }

  }
}

export default DialogBox;
