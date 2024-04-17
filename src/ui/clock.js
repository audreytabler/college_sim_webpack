import Phaser from 'phaser';
import eventsCenter from '../ui/eventCenter.js';


export class Clock extends Phaser.GameObjects.Graphics {
    constructor(scene, initialTime) {
        super(scene,'Clock');
        this.scene = scene;
        this.time = { hour: 7, minute: 30, period: 'AM' }; // Initial time is 7:30 AM
        this.sunUp = true
        this.timeScale = 0.001; // 0.7 real seconds per in-game minute
        this.clockText = null;
        this.deltaTime;
        this.start = initialTime;
        this.numDays =1
        this.dayOfWeek = "Monday"
        this.weekArray = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
        this.totalHours = 7;
        this.timeActive=false

        // Create a text object to display the clock
        this.clockText = this.scene.add.text(15, 800, this.getTimeString(), { font: '24px Arial', fill: '#000000' });
            const camera = this.scene.cameras.main;
            const x = camera.scrollX + 850; // Adjust as needed
            const y = camera.scrollY + 15; // Adjust as needed
            this.clockText.setPosition(x, y);
        this.dayWeekText = this.scene.add.text(95,265,this.dayOfWeek, { font: '18px Arial', fill: '#000000' })

    }

    
    // Function to update the clock time
    update() { 
        const deltaTime = (this.scene.time.now - this.start); // Convert deltaTime to seconds
        const minutesPassed = deltaTime * this.timeScale;
        if (this.timeActive){
        this.advanceTime(minutesPassed);}
        // Update the clock display
        this.clockText.setText(this.getTimeString());
        this.start = this.scene.time.now
        if(((this.totalHours > 6) && this.totalHours <19) && !(this.sunUp)){
            this.sunUp = true;
            eventsCenter.emit("sunUp")
        }
        if((this.totalHours >=19) && (this.sunUp)){
            console.log("total hours is " + this.totalHours)
            this.sunUp = false;
            eventsCenter.emit("sunDown")
        }
    }


    // Function to advance the time by a certain number of minutes
    advanceTime(minutes) {
        // Convert minutes to hours and minutes
        const totalMinutes = this.time.hour * 60 + this.time.minute + minutes;
        const totalHoursMins = this.totalHours * 60 + this.time.minute + minutes;
        this.totalHours = Math.floor(totalHoursMins / 60)
        this.time.hour = Math.floor(totalMinutes / 60) % 12 || 12; // Ensure hour is between 1 and 12
        this.time.minute = totalMinutes % 60;

        this.time.period = this.totalHours < 12 ? 'AM' : 'PM';

        if (this.totalHours >= 24 ) {
            this.numDays++; // Increment numDays
            /*
            this.totalHours =0
            this.time.hour=12
            this.time.minute=0*/
            this.totalHours = this.totalHours - 24
            this.time.hour = 12 + this.totalHours
            this.time.minute = (totalMinutes - (this.totalHours*60)) %60
            this.updateWeekDay()
        }
    }

    // Function to format the time as a string
    getTimeString() {
        const minuteRounded = Math.round(this.time.minute)
        const hourString = this.time.hour.toString().padStart(2, '0');
        const minuteString = minuteRounded.toString().padStart(2, '0');
        return `${hourString}:${minuteString} ${this.time.period}`;
    }
    updateWeekDay(){
        this.dayOfWeek = this.weekArray[(this.numDays - 1) % this.weekArray.length]
        this.dayWeekText.setText(this.dayOfWeek)
        this.scene.newDay(this.dayOfWeek)
    }
}

export default Clock;