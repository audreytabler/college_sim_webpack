import Phaser from 'phaser';
import Clock from '../ui/clock.js'
import eventsCenter from '../ui/eventCenter.js';


export class Phone extends Phaser.GameObjects.Graphics {
    constructor(scene) {
        super(scene, 'Phone');
        this.scene = scene;
        this.clock;
        this.isPhoneFocused = false;
        this.currentStudyHours=5;
        //this.reminderArray = ["\n\n• 10 AM PYS | room 107","\n\n• 11 AM BIO | room 102","\n\n• 1 PM ENG | room 105"] //TODO: make reminder object that sorts by time, exports text object? completeable
                                                            // maybe make method to initialize reminderbutton each day
        // Create phone components
        this.createPhoneComponents();
        this.setupInteractivity();
        
    }

    createPhoneComponents() {
        this.phoneEdge = this.scene.add.rectangle(130,400,190,310,0x808080).setInteractive()
        this.phoneScreen = this.scene.add.rectangle(130,390,160,260,0xffffff).setInteractive();

        this.homeButton =  this.scene.add.rectangle(130,537,25,25,0x000000).setInteractive();
        this.reminderButton = this.scene.add.rectangle(100,350,35,35,0x226184).setInteractive();
        this.socialButton = this.scene.add.rectangle(150,350,35,35,0x36B540).setInteractive();
        this.videoButton = this.scene.add.rectangle(100,400,35,35,0xDD7C53).setInteractive();
        this.studyButton = this.scene.add.rectangle(150,400,35,35,0xA686B7).setInteractive();

        this.appIcons = this.scene.add.text(86,325,'✔   ☺',{ fontSize: '35px',fontFamily:'fantasy', fill:'white'})
        this.appIcons2 = this.scene.add.text(88,377,'▶    ≡',{ fontSize: '36px',fontFamily:'fantasy', fill:'white'})
        this.homeContainer = this.scene.add.container(0,0)
        this.homeContainer.add([this.reminderButton,this.socialButton,this.videoButton,this.studyButton,this.appIcons,this.appIcons2])

        //this.homeContainer.setVisible(true)

        this.reminderText = this.scene.add.text(53,315,("\n》ACTIVITIES TODAY《\n\n" +this.getReminderArray()),{ fontSize: '14px', fill:'black',fontFamily:'sans-serif',});
        this.reminderContainer = this.scene.add.container(0,0)
        this.reminderContainer.add(this.reminderText)


        //social containers
        this.textingButton = this.scene.add.rectangle(130,350,130,35,0x36B540).setInteractive().on('pointerdown', () => {eventsCenter.emit("text")})
        this.textLabel = this.scene.add.text(70,340,'text friend',{ fontSize: '18px', fill:'black'});
        this.hangoutButton = this.scene.add.rectangle(130,400,130,35,0x226184).setInteractive().on('pointerdown', () => {eventsCenter.emit("make plans")})
        this.hangoutLabel = this.scene.add.text(70,390,'make plans',{ fontSize: '16px', fill:'black'});
        this.callButton = this.scene.add.rectangle(130,450,130,35,0x226184).setInteractive();
        this.callLabel = this.scene.add.text(70,440,'call home',{ fontSize: '18px', fill:'black'});
        this.socialContainer = this.scene.add.container(0,0)
        this.socialContainer.add([this.textingButton,this.textLabel,this.hangoutButton,this.hangoutLabel,this.callButton,this.callLabel])

        //video container

        this.funVideos = this.scene.add.rectangle(130,350,120,50,0xE68E7B).setInteractive();
        this.educationVideos = this.scene.add.rectangle(130,410,120,50,0x686971).setInteractive();
        this.newsVideos = this.scene.add.rectangle(130,470,120,50,0x749F9A).setInteractive();

        this.videoContainer = this.scene.add.container(0,0)
        this.videoContainer.add([this.funVideos,this.educationVideos,this.newsVideos])

        //study container
        this.rectangleDecor = this.scene.add.rectangle(130,369,130,85,0x749F9A)
        this.hoursToStudyLabel = this.scene.add.text(70,327,'  Amount of\ntime to study',{ fontFamily: 'arial',fontSize: '20px', fill:'black',fontWeight: 'bold'});
        this.hoursToStudy = this.scene.add.text(90,375,(this.currentStudyHours + ' hrs'),{ fontFamily: 'arial',fontSize: '27px', fill:'black',fontWeight: 'bold'});
        this.currentGPALabel = this.scene.add.text(70,415,'Current GPA',{ fontFamily: 'arial',fontSize: '20px', fill:'black',fontWeight: 'bold'});
        this.currentGPAText = this.scene.add.text(93,437,'3.85',{ fontFamily: 'arial',fontSize: '27px', fill:'black',fontWeight: 'bold'});

        this.studyContainer = this.scene.add.container(0,0)
        this.studyContainer.add([this.rectangleDecor, this.hoursToStudyLabel,this.hoursToStudy,this.currentGPALabel,this.currentGPAText])


        // // // // // // //
        this.clock = new Clock(this.scene,this.scene.time.now);
        this.clock.clockText.setPosition(75,285)
        this.clock.dayWeekText.setPosition(95,265)


        // Initially unfocus the phone
        this.hideAllContainers()
        this.homeContainer.setVisible(true)
        this.unfocusPhone();
    }

    setupInteractivity() {
        this.scene.input.on('pointerdown', (pointer, gameObject) => {
            //console.log(gameObject.constructor.name)
           // let hi = gameObject.rectangle.getData('name')
            //console.log(hi)
            if ((gameObject.toString() == "[object Object]")) {
                if (!this.isPhoneFocused) 
                    this.focusPhone();
            } 
            else {
                if(this.isPhoneFocused)
                    this.unfocusPhone();
            }
        });

        // Add click handler for the phone's home button
        this.homeButton.on('pointerdown', () => {
                // Toggle between home screen and app screen
                this.hideAllContainers()
                this.homeContainer.setVisible(true)
        });
        this.reminderButton.on('pointerdown', () => {
            this.hideAllContainers();
            this.reminderContainer.setVisible(true)
        });
        this.socialButton.on('pointerdown', () => {
            this.hideAllContainers()
            this.socialContainer.setVisible(true)
        });
        this.videoButton.on('pointerdown', () => {
            this.hideAllContainers()
            this.videoContainer.setVisible(true)

        });
        this.studyButton.on('pointerdown', () => {
            this.hideAllContainers()
            this.studyContainer.setVisible(true)

        });
    }

    focusPhone() {
        console.log(this.phoneEdge.y)
        // Animate the phone to focus position
        this.scene.tweens.add({
            targets: [this.phoneEdge, this.phoneScreen,this.homeButton,this.clock.clockText,this.clock.dayWeekText,this.homeContainer,this.reminderContainer,this.socialContainer,this.videoContainer,this.studyContainer],
            y: '-=250',
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
                this.isPhoneFocused = true;
            }
        });
    }

    unfocusPhone() {
        // Animate the phone to unfocus position
        this.isPhoneFocused = false;
        //if(this.phoneEdge.y >640)
          //  return
        this.scene.tweens.add({
            targets: [this.phoneEdge, this.phoneScreen,this.homeButton,this.clock.clockText,this.clock.dayWeekText,this.homeContainer, this.reminderContainer,this.socialContainer,this.videoContainer,this.studyContainer],
            y: '+=250',
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
                this.isPhoneFocused = false;
            }
        });
    }

    hideAllContainers(){
        this.homeContainer.setVisible(false)
        this.reminderContainer.setVisible(false)
        this.socialContainer.setVisible(false)
        this.videoContainer.setVisible(false)
        this.studyContainer.setVisible(false)
    }

    newDay(){

        //reminderArray based on currentDayArray in daySchedule
        const currentDayItems = this.scene.daySchedule.currentDayItems
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
        }
    }

    updateReminderList(){ //TODO: When a new reminder is added, sort by time
        //let visible = this.reminderContainer
        this.reminderText.setText(("\n》ACTIVITIES TODAY《\n\n" +this.getReminderArray()))
       // this.reminderText = this.scene.add.text(this.reminderText.x,this.reminderText.y,("\n》ACTIVITIES TODAY《\n\n" +this.getReminderArray()),{ fontSize: '14px', fill:'black',fontFamily:'sans-serif',});
       // this.reminderContainer.add(this.reminderText)
    }
    getReminderArray(){
        let array = this.scene.daySchedule.currentDayItems
        let newArray = []
        let stringInput=""
        for (let i = 0; i < array.length; i++) {
            stringInput=""
            if (!array[i].completed)
                stringInput = (stringInput + "☐ ")
            else
                stringInput = stringInput +"☑ "
            if(array[i].time >12)
                stringInput = stringInput +(array[i].time - 12) + "PM "
            else if(array[i].time ==12)
                stringInput = stringInput +12 + "PM "
            else
                stringInput = stringInput +array[i].time + "AM "
            stringInput = stringInput +array[i].name + " | "
            stringInput = stringInput +array[i].location + "\n"
            newArray.push(stringInput)
        }
        return newArray.join("")
    }
    changeStudyHours(num){
        this.currentStudyHours+=num
        if(this.currentStudyHours <= 0)
            this.currentStudyHours = 0
        
        this.hoursToStudy.setText(this.currentStudyHours + " hrs")
    }
    

}
export default Phone;