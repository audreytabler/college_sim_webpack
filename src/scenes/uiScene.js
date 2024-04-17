import Phaser from 'phaser';
import DialogBox from '../ui/dialogBox.js'
import Clock from '../ui/clock.js'
import Phone from '../ui/phone.js'
import PlayerStats from '../ui/playerStats.js'
import MissionManager from '../ui/missionManager.js';
import TaskConfirm from '../ui/taskConfirmPopup.js';
import { DaySchedule } from '../ui/daySchedule.js';
import eventsCenter from '../ui/eventCenter.js';


export class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: "UI_SCENE", active: true }); // Make UIScene always active
        
        this.clock
        this.phone
        this.narrator;
        this.taskConfirm
        this.statsOverlay;
        this.missionManager
        this.activeScene;
        this.playerSpawnX =8159 //6830    6830.0000000000055 Y: 7111.666666666748
        this.playerSpawnY =5325 //   7111

        this.skinTone=1
        this.hairType=1;
        this.hairColor =0x6D4C41
        this.shirtColor = 0x6999B4

        this.ambientColor = 0xF7F7F7;
        this.tutorialInProgress = true;
        this.daySchedule;
        this.characterMovable = true
        this.numberArray = [];
        this.npcDialog //=this.cache.json.get('dialog')

        this.activitiesData;
        
    }
    preload(){
        this.load.json('narrator', "./assets/narratorDialog.json")
        this.load.json('npc-dialog', "./assets/npcDialog.json")
        this.load.json('campusActivities', "./assets/campusActivities.json")
    }

    create() {
        this.friendsList = ["Alice","Bob","Lucy"]
        this.classScene= this.scene.get("CLASS_SCENE")
        this.daySchedule = new DaySchedule(this,this.clock,this.phone)
        this.activitiesData = this.cache.json.get('campusActivities')
        this.phone = new Phone(this)
        this.clock = this.phone.clock
        this.npcDialog =this.cache.json.get('npc-dialog')
        
        this.narrator = new DialogBox(this, 700, 100, this.cache.json.get('narrator'));
        this.narrator.startDialog(0)


        this.statsOverlay = new PlayerStats(this)
        this.missionManager = new MissionManager(this)
        this.missionManager.drawText("CURRENT TASK: ")
        this.taskConfirm = new TaskConfirm(this,this.clock,this.cache.json.get('campusActivities'))

        
        //this.newScene()

        eventsCenter.on('shower',this.shower,this)
        eventsCenter.on('wash hands',this.washHands,this)
        eventsCenter.on('text',this.text,this)
        eventsCenter.on('call home',this.callHome,this)
        eventsCenter.on('make plans',this.makePlans,this)
        eventsCenter.on('plans submit',this.submitPlans,this)
        eventsCenter.on('class',this.class,this)
        eventsCenter.on('sleep',this.sleep,this)
        eventsCenter.on('study',this.study,this)
        eventsCenter.on('read books',this.read,this)

        eventsCenter.on('sunUp',this.sunUp,this)
        eventsCenter.on('sunDown',this.sunDown,this)
    }

    update() {
        // Update the clock
        this.clock.update();
    }

    newScene(nScene){
        this.activeScene = nScene
        this.missionManager.enteredMap(nScene)
    }
    shower(){
        if(!this.characterMovable){
            return
        }
        if(!this.daySchedule.hasShowered){
        this.narrator.startDialogg(0)
        this.missionManager.shower()
        this.daySchedule.hasShowered = true
        }
        else{
            this.narrator.startDialogText("You've already showered this morning")
        }
    }
    class(){
        this.narrator.startDialogg(3)
    }
    clickClassRoom(room){
        if(this.tutorialInProgress){
            this.missionManager.checkClassRoom(room)
            this.tutorialInProgress = false
            return
        }
        let index = this.daySchedule.findRoomOnSchedule(room)//currentDayItems.find(location == room) 
            if(index != null){ //found: store index
                var earlyTime = (this.daySchedule.currentDayItems[index].time *60) - 10 //minutes
                var startTime = (this.daySchedule.currentDayItems[index].time *60) //minutes
                var endTime = (this.daySchedule.currentDayItems[index].time *60) + 50// minutes

                var currentTime = (this.phone.clock.totalHours *60) + this.phone.clock.time.minute

                if( currentTime < earlyTime )
                    this.narrator.startDialogText("You have a class in this room later today. Doors will open at " + (Math.round(earlyTime/60)-1) + ":50")
                else if ((currentTime >= earlyTime) &&(currentTime <=(startTime+1))){
                    this.narrator.startDialogText("Welcome to class! You arrived on time and will receive attendance points!")
                    this.daySchedule.currentDayItems[index].completed = true
                    /*this.classScene.cameras.main.fadeOut(1000, 0, 0, 0)
                        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                            this.classScene.cameras.main.fadeIn(1000, 0, 0, 0)
                        })*/
                    this.daySchedule.completeItem[index]
                    this.clock.advanceTime(47)
                    this.phone.updateReminderList()
                    //fade to black & display how many academic focus points earned
                    //set global clock time to endTime
                }
                else if ((currentTime >(startTime+1))&& (currentTime < endTime)){
                    this.narrator.startDialogText("You are " + Math.round(currentTime-startTime) + " minutes late to class. You may attend the remaining portion of the class")
                    this.daySchedule.completeItem[index]
                    this.clock.advanceTime(47 - (currentTime-startTime))
                    /*
                    this.classScene.cameras.main.fadeOut(1000, 0, 0, 0)
                        this.classScene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                            this.classScene.cameras.main.fadeIn(1000, 0, 0, 0)
                        })*/
                    this.daySchedule.currentDayItems[index].completed = true
                    this.phone.updateReminderList()
                    //fade to black & display how many academic focus points earned
                    //set global clock time to endTime
                }
                else{
                    this.narrator.startDialogText("This class is already over")
                }
            }
            else{ //if not found 0-p in day array)
            this.narrator.startDialogText("You have no classes in this room today")}
        
    }
    sleep(){
        //popup box to select how many hours
        this.taskConfirm.action = "sleep"
        this.taskConfirm.display(true)
    }
    study(){
        this.taskConfirm.action = "study"
        this.taskConfirm.display(true)
    }
    washHands(){
        this.narrator.startDialogText("You washed your hands!")
        this.statsOverlay.updateFocus(5)
    }
    
    text(){
        this.taskConfirm.action = "text"
        this.taskConfirm.display(false)
    }
    read(){
        this.taskConfirm.action = "read"
        this.taskConfirm.display(false)
    }
    callHome(){
        this.taskConfirm.action = "call home"
        this.taskConfirm.display(false)
    }
    makePlans(){
        this.taskConfirm.action = "make plans"
        this.taskConfirm.display(true)
        
    }
    submitPlans(friend){
        //pick random number
        //corresponds to a number on the plan list
        // [ alice wants to go [thing from plan list] with you at [random time], does this work with your schedule? ]
        let num = Math.floor(Math.random() * 32)
        let time = Math.floor(Math.random() * 9) +1
        this.narrator.startDialogText(this.friendsList[friend] + " wants to go " + this.activitiesData.planList[num].prefix + ""+this.activitiesData.planList[num].name + " at " + time + "PM. Does this work with your schedule?")
        this.daySchedule.addItem(time,this.activitiesData.planList[num].name,this.activitiesData.planList[num].location)
    }
    newDay(day){
        this.daySchedule.newDay(day)
    }
    sunUp(){
        this.ambientColor = 0xF7F7F7
    }
    sunDown(){
        this.ambientColor = 0x5A5A59
    }

}
