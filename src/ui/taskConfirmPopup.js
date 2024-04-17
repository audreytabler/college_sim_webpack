import Phaser from "phaser";

export class TaskConfirm extends Phaser.GameObjects.Graphics {
    constructor(scene,clock) {
        super(scene, 'taskConfirm');
        this.scene = scene
        this.clock = clock
        this.shadedBG;
        this.numHours;
        this.numHoursText;
        this.text;
        this.upArrow
        this.downArrow;
        this.decorContainer;
        this.arrows
        this.confirm;
        this.cancel;
       // this.campusActivities = data

        this.isHours = true
        this.maxNumHours =12

        this.chooseFriend = false

        this.action
        this.setUpDisplay()
    }
    display(isHours){
        this.chooseFriend = false
        this.isHours = isHours
        
        this.shadedBG.setVisible(true)
        this.text.setVisible(true)
        this.upArrow.setVisible(true)

        if(this.action == "study"){
            this.maxNumHours =  Math.round(((this.scene.statsOverlay.focusNum)/1.4)/10)
        }
        if(this.isHours){
            this.numHours = 1
            this.maxNumHours=13
            //this.numHoursText.fontSize = '80px'
            this.text.setText(("How many hours would you like to "+this.action+" for?"))
        }
        if(!this.isHours){
            this.numHours = 10
            this.maxNumHours = 90
           // this.numHoursText.fontSize = '80px'
            this.text.setText(("How many minutes would you like to "+this.action+" for?"))    
        }
        this.numHoursText.setText(this.numHours)
        if(this.action == "make plans"){
            this.numHoursText.font = '45px Courier New'
            this.chooseFriend = true
            this.maxNumHours = this.scene.friendsList.length -1
            this.text.setText(("Who would \nyou like to make plans with?"))
            //this.numHoursText.font = '20px Courier New'
           // this.numHoursText.fontSize = '45px'
            this.numHoursText.setText(this.scene.friendsList[this.numHours])
            //this.uiScene.submitPlans({numHours}) // and then it would do the following code from uiscene using that persons' schedule


        }
        
        
        this.numHoursText.setVisible(true)
        this.downArrow.setVisible(true)
        this.arrows.setVisible(true)
        this.confirm.setVisible(true)
        this.cancel.setVisible(true)
        this.decorContainer.setVisible(true)
    }

    hide(){
        this.shadedBG.setVisible(false)
        this.text.setVisible(false)
        this.numHoursText.setText("")
        this.upArrow.setVisible(false)
        this.downArrow.setVisible(false)
        this.arrows.setVisible(false)
        this.cancel.setVisible(false)
        this.confirm.setVisible(false)
        this.decorContainer.setVisible(false)
    }
    setUpDisplay(){
        this.shadedBG = this.scene.add.graphics();
        this.shadedBG.fillStyle(0x2F2E30, 0.6); 
        this.shadedBG.fillRoundedRect(700, 30, 300, 250,15);
        this.decorContainer = this.scene.add.container(0,0)
        this.cancel = this.scene.add.rectangle(970,60,30,30,0x465A7F).setInteractive()
        this.cancel.toString = function() {
            // Customize the output based on your requirements
            return "clickable box";
        };
        this.confirm = this.scene.add.rectangle(950,230,50,50,0x465A7F).setInteractive()
        this.confirm.toString = function() {
            // Customize the output based on your requirements
            return "clickable box";
        };
        this.arrows = this.scene.make.text({x:936,y:215,text:'✓',style: {font: '40px Courier New',fill: 'white',style: 'bold',}})
        this.decorContainer.add(this.arrows)
        this.arrows = this.scene.make.text({x:960,y:40,text:'x',style: {font: '35px Courier New',fill: 'white',style: 'bold',}})
        this.decorContainer.add(this.arrows)
        this.text = this.scene.make.text({
            x: 710,
            y: 40,
            text: 'How many hours would you like to sleep?',
            origin: { x: 0, y: 0},
            style: {
                font: '35px Courier New',
                fill: 'white',
                style: 'bold',
                wordWrap: { width: 295 }
            }
        });
        
        this.numHoursText = this.scene.make.text({x:780,y:190,style:{ 
            fontSize: '50px',fontFamily:'courier new',
            //fontSize: '80px', 
            color: '#ffffff'
        }})
        this.upArrow = this.scene.add.circle(750,205,15,0x465A7F).setInteractive()//this.scene.add.rectangle(850,200,35,35,0x9BD9AC).setInteractive();
        this.arrows= this.scene.make.text({x:734,y:188,text:'⏶',style: {font: '35px Courier New',fill: 'white',style: 'bold',}})
        this.decorContainer.add(this.arrows)
        this.decorContainer.setDepth(1)
        this.upArrow.toString = function() {
            // Customize the output based on your requirements
            return "clickable box";
        };
        this.upArrow.on('pointerdown', () => {
            //increment num hours by 1 
            if(!this.isHours){
                if(this.numHours < this.maxNumHours){
                this.numHours+=10;
                this.numHoursText.setText(this.numHours)
                }
                return
            }
            if(this.numHours < this.maxNumHours){
            this.numHours++;
            this.numHoursText.setText(this.numHours)
            if(this.action == "make plans"){
                this.numHoursText.setText(this.scene.friendsList[this.numHours])
            }
        }
        });
        this.cancel.on('pointerdown', () => {
            this.hide()
        });
        this.confirm.on('pointerdown', () => {
            this.confirmTask()
        });

        this.downArrow = this.scene.add.circle(750,240,15,0x465A7F).setInteractive()//this.scene.add.rectangle(850,250,35,35,0xD69D80).setInteractive();
        this.arrows= this.scene.make.text({x:734,y:225,text:'⏷',style: {font: '35px Courier New',fill: 'white',style: 'bold',}})
        this.downArrow.toString = function() {
            return "clickable box";
        };
        this.downArrow.on('pointerdown', () => {
            if(!this.isHours){
                if(this.numHours > 0){
                this.numHours-=10;
                this.numHoursText.setText(this.numHours)
            }
                return
            }
            if(this.numHours>0)
                this.numHours--;
            this.numHoursText.setText(this.numHours)
            if(this.action == "make plans"){
                this.numHoursText.setText(this.scene.friendsList[this.numHours])
            }
            //increment num hours by -1
        });
        

        this.hide()
    }

    makePlans(){
        this.isHours =true

    }

    confirmTask(){
        this.hide();
        let statIncrement =0;
        if(this.action == "make plans"){
            this.scene.submitPlans(this.numHours)
            return
        }
        if(this.isHours){
            statIncrement = 14 * this.numHours;
            this.scene.clock.advanceTime(this.numHours * 60)
            this.scene.narrator.startDialogText("You " + this.action + " for " + this.numHours + " hours.")
        }
        else{
            statIncrement = 0.6 * this.numHours;
            this.scene.clock.advanceTime(this.numHours)
            this.scene.narrator.startDialogText("You " + this.action + " for " + this.numHours + " minutes.")
        }
        
        if(this.action === "sleep"){ //increase energy by 12.5 per hour slept
            this.scene.statsOverlay.updateEnergy(statIncrement)
            //this.scene.statsOverlay.displayUpdateText(12,statIncrement,"energy")
        }
        if(this.action === "study"){ //decrease focus, but increase academic score
            this.scene.statsOverlay.updateFocus(-statIncrement)
           // this.scene.statsOverlay.displayUpdateText(39,statIncrement,"focus")
            this.scene.statsOverlay.updateEnergy(-statIncrement)
            this.scene.phone.changeStudyHours(-this.numHours)
           // this.scene.statsOverlay.displayUpdateText(12,-statIncrement,"energy")
            //increase academic score when added
        }
        if(this.action === "chat"){ 
            this.scene.statsOverlay.updateSocial(statIncrement)

            this.scene.statsOverlay.updateEnergy(-statIncrement)
        }
        if(this.action === "read"){ 
            this.scene.statsOverlay.updateFocus(statIncrement)

            this.scene.statsOverlay.updateEnergy(-statIncrement)
        }
        if(this.action === "call home"){ 
            this.scene.statsOverlay.updateSocial(statIncrement)
            this.scene.statsOverlay.updateEnergy(-statIncrement)
        }
        if(this.action === "text"){ 
            this.scene.statsOverlay.updateSocial(statIncrement)
            this.scene.statsOverlay.updateEnergy(-statIncrement)
        }
        if(this.action === "scroll on social media"){ 
            this.scene.statsOverlay.updateSocial(statIncrement*0.5)
            this.scene.statsOverlay.updateFocus(statIncrement*0.5)
            this.scene.statsOverlay.updateEnergy(-statIncrement)
        }
        if(this.action === "view flash cards"){ 
            this.scene.statsOverlay.updateFocus(-statIncrement)
            //increase academic score
            this.scene.statsOverlay.updateEnergy(-statIncrement*0.5)
        }
        
    }
}

export default TaskConfirm