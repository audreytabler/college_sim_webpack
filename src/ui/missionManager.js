import Phaser from 'phaser';

class MissionManager extends Phaser.GameObjects.Graphics {
    constructor(scene) {
        super(scene, 'MissionManager');
        if (!MissionManager.instance) {
            MissionManager.instance = this;
            this.currentMission = 0;
            this.missionText = this.scene.add.text(300,15,'debug text',{ fontFamily: 'sans-serif', fontSize: '16px', fontStyle:'bold', fill:'black',blendMode: 'MULTIPLY' });
            this.criteria;
            this.targetBox;
            this.criteriaMet = false
            this.criteria
            this.missionInProgress = false;
            this.roomToFind;
            this.uiScene = scene
            //eventsCenter.on('shower',this.shower,this)
            //this.scene.events.on('update', this.updatePosition, this);
        }
        MissionManager.instance.scene = scene
        return MissionManager.instance;

    }

    async startMission(m){
        console.log("mission " + m + " started")
        this.missionInProgress = true
        this.criteriaMet = false
        this.criteria = m
        if (m === "shower"){
            if(!this.uiScene.daySchedule.hasShowered){
            this.drawText("Current task: Take a warm shower")
            await this.until(_ => this.criteriaMet == true);
            this.scene.narrator.startDialogg(2)
            this.endMission()
            return;
            }
            else{
                this.endMission()
                return;
            }
        }
        else if (m === "CAMPUS_SCENE"){
            this.drawText("Current task: Leave dorm to find campus")
            await this.until(_ => this.criteriaMet == true);
            this.scene.narrator.startDialogg(3)
            this.endMission()
            return;
           // this.scene.narrator.startDialog() 
        }
        else if (m === "CLASS_SCENE"){
            this.drawText("Current task: Find the science building (top right path)")
            await this.until(_ => this.criteriaMet == true);
             
        }
        else if (m === "107"){
            this.drawText("Current task: Select room 107")
            await this.until(_ => this.criteriaMet == true);
           // this.scene.narrator.startDialog() 
        }
        
        this.scene.narrator.startDialog()
        this.endMission()
    }
    endMission(){
        //play checkbox animation next to current mission and then trigger next dialogue
        this.missionInProgress =false;
        this.missionText.setVisible(false)
    }
    drawText(text){
        this.missionText.setVisible(true)
        this.missionText.setText(text)
    }

    setCriteriaMet(val){
        this.criteriaMet = val
    }

    shower(){
        console.log("showered was called in mission manager")
        if(this.criteria === "shower"){
            this.criteriaMet = true;
        }
    }
    enteredMap(map){
        if(this.criteria===map){
            this.criteriaMet = true;
        }
    }
    checkClassRoom(room){
        if(this.criteria === room){
            this.criteriaMet = true
        }
    }

    until(conditionFunction) {
        const poll = resolve => {
          if(conditionFunction()) resolve();
          else setTimeout(_ => poll(resolve), 400);
        }
      
        return new Promise(poll);
      }

}
export default MissionManager;