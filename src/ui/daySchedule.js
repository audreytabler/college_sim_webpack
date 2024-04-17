import Phaser from 'phaser';



export class DaySchedule extends Phaser.GameObjects.Graphics {
    constructor(scene,clock,phone) {
        super(scene, 'DaySchedule');
        this.scene = scene;
        this.clock = clock;
        this.phone = phone
        //js object: 24hr time, activity name, location
        this.mondayItems = [{time:10,name:"PYS",location:"107",completed:false},{time:11,name:"BIO",location:"102",completed:false},{time:13,name:"ENG",location:"105",completed:false}]
        this.tuesdayItems = [{time:11,name:"SCI",location:"107",completed:false}]
        this.wednesdayItems = []
        this.thursdayItems = []
        this.fridayItems =[]
        this.saturdayItems=[]
        this.sundayItems=[]

        this.currentDayItems = [{time:10,name:"PYS",location:"107",completed:false},{time:11,name:"BIO",location:"102",completed:false},{time:13,name:"ENG",location:"105",completed:false}]

        this.hasShowered = false
        this.recommendedStudy=1
        this.timeStudiedThisWeek
        //hadBreakfast
        //hadLunch
        //hadDinner

        //went to class
        //went to all classes
        //did all activities
        //completed set amount of studying
        //star rating for each day?

    }
    newDay(day){
        this.hasShowered=false
        this.currentDayItems =[]
        if(day =="sunday"){
            this.currentDayItems = this.sundayItems
        }
        if(day =="monday"){
            this.currentDayItems = this.mondayItems
        }
        if(day =="tuesday"){
            this.currentDayItems = this.tuesdayItems
        }
        if(day =="wednesday"){
            this.currentDayItems = this.wednesdayItems
        }
        if(day =="thursday"){
            this.currentDayItems = this.thursdayItems
        }
        if(day =="friday"){
            this.currentDayItems = this.fridayItems
        }
        if(day =="saturday"){
            this.currentDayItems = this.saturdayItems
        }
        this.scene.phone.updateReminderList()
        this.scene.phone.changeStudyHours(Math.floor(Math.random() * 5)+1)
    }
    newWeek(){

    }
    findRoomOnSchedule(room){
        let foundIndex = null
        for (let index = 0; index < this.currentDayItems.length; index++) {
          //  const element = array[index];
            if(this.currentDayItems[index].location === room)
                return index
        }
        /*this.currentDayItems.forEach(element => {
            if(element.location === room){
                return foundIndex
            }
        });*/
        return foundIndex
    }

    completeItem(index){
        this.currentDayItems[index].completed = true
        this.scene.phone.updateReminderList()
    }

    addItem(time,name,location){
        this.currentDayItems.push({
            time: time,
            name: name,
            location: location,
            completed: false
        })
        this.scene.phone.updateReminderList()
    }

}