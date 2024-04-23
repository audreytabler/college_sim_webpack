import Phaser from 'phaser'
import eventsCenter from '../ui/eventCenter.js';
import { NPC } from '../ui/NPC.js';



export class DormScene extends Phaser.Scene{
    constructor(){
        super({
            key: "DORM_SCENE"
        });
        this.cameras
        this.player
        this.hair
        this.shirt
        this.playerSpeed = 400
        this.cursor

        this.popUpText;
        this.popUpBox;
        this.emitter;

        this.uiScene//=this.scene.get("UI_SCENE")

        this.playerEnteredTrigger = false
        this.testLight;
        this.roommate
        //////

    }
    preload(){
        //this.load.image("back", "/assets/dormBG.png")
        //character creation.. get variables for the end of the filepath for skin & hair files loaded in
        this.uiScene = this.scene.get("UI_SCENE")
        this.load.spritesheet('player', 'assets/CharacterSpritesheetBald'+this.uiScene.skinTone+'.png', { frameWidth: 85, frameHeight: 150 });
        this.load.spritesheet('shirt', 'assets/CharacterSpritesheetShirt.png', { frameWidth: 85, frameHeight: 150 });
        this.load.spritesheet('hair', ('assets/CharacterSpriteHair'+this.uiScene.hairType+'.png'), { frameWidth: 85, frameHeight: 150 });
        
        //tilemap
        this.load.image("tiles","/assets/CollegeTileSet.png")
        this.load.tilemapTiledJSON("dormMap", "/assets/dormMap2.tmj")
        this.load.image("fog","./assets/fog.png")
        //this.load.spritesheet('npcSpritesheet', "./assets/CharacterSpritesheet2.png", { frameWidth: 85, frameHeight: 150 })
        this.load.image("npc1","assets/npc1.png") 
        this.load.image("npc2","assets/npc2.png") 
        this.load.image("npc3","assets/npc3.png") 
        this.load.image("npc4","assets/npc4.png") 
        this.load.image("npc5","assets/npc5.png")
        this.load.image("npc6","assets/npc6.png")  

        this.load.audio("inside", "assets/Inside_Flute2.wav")
    }
    
    create(){
        this.sound.stopAll();
        var music = this.sound.add('inside');
        music.setVolume(0.6)
        music.play();
        music.loop = true;

        eventsCenter.on('sunUp',this.fadeToDay,this)
        eventsCenter.on('sunDown',this.fadeToNight,this)
        this.scene.get("UI_SCENE").newScene(this.sys.settings.key)
        this.uiScene = this.scene.get("UI_SCENE")

        this.physics.world.enable;
        this.physics.world.setBounds(0, 0, 9035, 6347);
        this.input.enabled = true;
        this.cursor = this.input.keyboard.createCursorKeys()
        this.usableObject = " "

        //LIGHTING STUFF
        var deskLight  = this.lights.addLight(8373, 5480, 700);

        // var light  = this.lights.addLight(500, 250, 200);
        //this.lights.enable().setAmbientColor(0x555555);

        //CHANGE AMBIENT COLOR TO MAKE IT NIGHT white is day,, 0x555555
        this.lights.enable().setAmbientColor(this.uiScene.ambientColor);

        //TILEMAP STUFF
        let map = this.make.tilemap({key: 'dormMap'})
        let dormTileset = map.addTilesetImage("MainTileset","tiles")

        let groundlayer = map.createLayer("grass",dormTileset)
        groundlayer.setScrollFactor(0.8)
        groundlayer.setPipeline('Light2D')
        let subfloorlayer = map.createLayer("subfloor",dormTileset).setPipeline('Light2D')
        let floorlayer = map.createLayer("floor",dormTileset).setPipeline('Light2D')
        let wallLayer = map.createLayer("walls",dormTileset).setPipeline('Light2D')

        //COLLISION WITH WALLS STUFF
        
        this.loadPlayer()
        //dormScene.js:176 player position - X: 7525.666666666638  7542 Y: 3832.999999999988  6720.666666666664 Y: 2150.599999999974
        this.roommate = new NPC(this,7525,5840,"Alex",0,'npc2')
        this.suitemate = new NPC(this,7542,3832,"Alex",0,'npc1')
        this.npc3 = new NPC(this,6720,2150,"Alex",0,'npc6')
        
        this.physics.add.collider(this.player,this.roommate.body)
        let chairLayer = map.createLayer("chairBacks",dormTileset).setPipeline('Light2D')
        wallLayer.setCollisionByExclusion([-1]);
        this.physics.add.collider(this.player, wallLayer);
        this.physics.add.collider(this.hair, wallLayer);
        this.physics.add.collider(this.shirt, wallLayer);
        this.physics.add.collider(this.roommate.sprite, wallLayer);
        this.physics.add.collider(this.suitemate.sprite, wallLayer);
        this.physics.add.collider(this.npc3.sprite, wallLayer);
        ////////////////////////////////////////
        this.transportLayer = map.getObjectLayer("interactions"); 
        this.popUpBox = this.add.rectangle(8159+50, 5305+20, 75, 30,0x226184,0.5).setInteractive()
        this.popUpBox.setVisible(false)
        this.popUpText = this.add.text(8159, 5305, " " + (this.usableObject), { 
            fontFamily: 'sans-serif', 
            fontSize: '24px', 
            color: '#ffffff',
        });
        this.overlapArray=[]
        
        this.transportLayer.objects.forEach(object => {
            const transportRect = this.add.rectangle(object.x, object.y, object.width, object.height);
            
            transportRect.setOrigin(0); // Make collisions based on top-left corner
            transportRect.setAlpha(0); // Keep it invisible
            this.physics.add.existing(transportRect, true);
            let hello = null;
            if (object.properties && Array.isArray(object.properties)) {
                const nameProperty = object.properties.find(prop => prop.name === 'name');
                hello = nameProperty ? nameProperty.value : null; // Use null if name property is not found
            } 
            if(hello === "transport"){

                //console.log("transport log, x is " + this.uiScene.playerSpawnX + " y is " + this.uiScene.playerSpawnY)
                this.physics.add.overlap(this.player, transportRect, () => {
                    this.uiScene.playerSpawnX = object.properties.find(prop => prop.name === 'playerSpawnX').value
                    this.uiScene.playerSpawnY = object.properties.find(prop => prop.name === 'playerSpawnY').value
                    if(!this.playerEnteredTrigger){
                    this.cameras.main.fadeOut(500, 0, 0, 0)
                    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                        this.scene.start(object.properties.find(prop => prop.name === 'toSceneKey').value); 
                    })
                }
                    this.playerEnteredTrigger = true
                    
                });
            }
            else{
                this.physics.add.overlap(this.player, transportRect, () => {
                    this.usableObject = hello
                    this.playerEnteredTrigger = true
                    //this.popUpBox = this.add.rectangle(transportRect.x+50,transportRect.y+20, 100, 30,0x226184).setDepth(this.popUpText.depth - 1);;
                    this.popUpText.setVisible(true)
                    this.popUpBox.setVisible(true)
                    this.popUpBox.width=(this.usableObject.toString().length * 15)
                    this.popUpText.setText(this.usableObject)
                    this.popUpText.setPosition(transportRect.x+30,transportRect.y+55)
                    this.popUpBox.setPosition(transportRect.x+60,transportRect.y+70)
                    if(hello === "wash hands"){
                        this.popUpText.setPosition(transportRect.x+10,transportRect.y+60)
                        this.popUpBox.setPosition(transportRect.x+40,transportRect.y+75)  
                    }
                    
                });
            }
            this.overlapArray.push(transportRect)
        });
        
        this.popUpBox.on('pointerover',() => {
            this.popUpBox.setScale(1.3)
            //this.popUpText.setFontSize('30px')
            //this.popUpText.setPosition(this.popUpText.x-20,this.popUpText.y-20)
        });
        this.popUpBox.on('pointerout',() => {
            this.popUpBox.setScale(1)
            //this.popUpText.setFontSize('24px')
            //this.popUpText.setPosition(this.popUpText.x+20,this.popUpText.y+20)
        });
        
        this.popUpBox.on('pointerdown', () => {
            if(this.uiScene.daySchedule.hasShowered){
                eventsCenter.emit(this.usableObject)
                return
            }
            eventsCenter.emit(this.usableObject)
            if(this.usableObject ==="shower"){
                this.emitter =this.add.particles(7640,4500,"fog",{
                    //this holds everything for emitter
                    speed:60,
                    gravityY:400,
                    scale:1,
                    duration: 500,
                    emitting:false
                })
                this.emitter.start()
            }

        });
        
        this.input.on('pointerdown', (pointer) => {
            // Log the position of the cursor when clicked
            console.log('player position - X:', this.player.x, 'Y:', this.player.y);
           // this.fadeToNight()
        });
       // this.setTheAmbient(0x555555)
        //this.fadeToDay()

    }
    update(){
    
        if ((!this.physics.overlap(this.player, this.overlapArray)) && (this.playerEnteredTrigger == true)) {
            // Player left the trigger area, trigger the event
            this.playerEnteredTrigger = false; // Set the flag to false
            this.popUpBox.setVisible(false)
            this.popUpText.setVisible(false)
        }
        const { left, right, up, down, } = this.cursor //would add up,down if overhead view
        const { W, A, S, D } = this.input.keyboard.addKeys('W,A,S,D');
        if(!this.uiScene.characterMovable){
            this.player.setVelocity(0,0)
            this.hair.setVelocity(0,0)
            this.shirt.setVelocity(0,0)
            this.player.play("idle",true)
            this.shirt.play("idles",true)
            this.hair.play("idleh",true)
            return;
        }

        if (left.isDown || A.isDown){
            this.player.setVelocityX(-this.playerSpeed);
            this.player.play("left",true)

            this.hair.setVelocityX(-this.playerSpeed);
            this.hair.play("lefth",true)

            this.shirt.setVelocityX(-this.playerSpeed);
            this.shirt.play("lefts",true)
        }
        else if (right.isDown || D.isDown){
            this.player.setVelocityX(this.playerSpeed);
            this.player.play("right",true)

            this.hair.setVelocityX(this.playerSpeed);
            this.hair.play("righth",true)
            this.shirt.setVelocityX(this.playerSpeed);
            this.shirt.play("rights",true)
        }
        else if (up.isDown || W.isDown){
            this.player.setVelocityY(-this.playerSpeed)
            this.player.play("back",true)

            this.hair.setVelocityY(-this.playerSpeed)
            this.hair.play("backh",true)

            this.shirt.setVelocityY(-this.playerSpeed)
            this.shirt.play("backs",true)

        }
        else if (down.isDown || S.isDown){
        
            this.player.setVelocityY(this.playerSpeed)
            this.player.play("forward",true)

            this.hair.setVelocityY(this.playerSpeed)
            this.hair.play("forwardh",true)

            this.shirt.setVelocityY(this.playerSpeed)
            this.shirt.play("forwards",true)
        }
        else {
            this.hair.setPosition(this.player.x,this.player.y)
        this.shirt.setPosition(this.player.x,this.player.y)
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);
            this.hair.setVelocityX(0);
            this.hair.setVelocityY(0)
            this.shirt.setVelocityX(0);
            this.shirt.setVelocityY(0)
            this.player.play("idle",true)
            this.hair.play("idleh",true)
            this.shirt.play("idles",true)
        }
    }

    loadPlayer(){
        const playerX = this.uiScene.playerSpawnX
        const playerY = this.uiScene.playerSpawnY
        
        this.player = this.physics.add.sprite(playerX, playerY, "player").setOrigin(0, 0)
        this.shirt = this.physics.add.sprite(playerX, playerY, "shirt").setOrigin(0, 0)
        this.hair = this.physics.add.sprite(playerX, playerY, "hair").setOrigin(0, 0)
    
        this.player.setBodySize(65,120)
        this.player.setMaxVelocity(this.playerSpeed)
        this.player.setPipeline('Light2D')
        this.player.setBounce(0.2)
        //this.player.setPushable(false)
        this.hair.setMaxVelocity(this.playerSpeed)
        this.hair.setBodySize(65,120)
        this.hair.setTint(this.uiScene.hairColor)
        this.hair.setPipeline('Light2D')
        this.hair.setBounce(0.2)
        //this.hair.setPushable(false)
        this.shirt.setMaxVelocity(this.playerSpeed)
        this.shirt.setBodySize(65,120)
        this.shirt.setTint(this.uiScene.shirtColor)
        this.shirt.setBounce(0.2)
        //this.shirt.setPushable(false)
        this.shirt.setPipeline('Light2D') 
        

        this.cameras.main.startFollow(this.player, false, 0.2, 0.2);
        this.cameras.main.setPostPipeline('Light2D')
        if (this.anims.get('righth') == undefined) {
        
        this.anims.create({
            key: "idle",
            frameRate: 10,
            frames: this.anims.generateFrameNumbers("player", { start: 0, end: 0 }),
            repeat: -1
        });
        this.anims.create({
            key: "forward",
            frameRate: 10,
            frames: this.anims.generateFrameNumbers("player", { start: 10, end: 14 }),
            repeat: -1
        });
        this.anims.create({
            key: "left",
            frameRate: 7,
            frames: this.anims.generateFrameNumbers("player", { start: 15, end: 17 }),
            repeat: -1
        });
        this.anims.create({
            key: "right",
            frameRate: 7,
            frames: this.anims.generateFrameNumbers("player", { start: 20, end: 22 }),
            repeat: -1
        });
        this.anims.create({
            key: "back",
            frameRate: 7,
            frames: this.anims.generateFrameNumbers("player", { start: 25, end: 28 }),
            repeat: -1
        });

        ///////
        this.anims.create({
            key: "idleh",
            frameRate: 10,
            frames: this.anims.generateFrameNumbers("hair", { start: 0, end: 0 }),
            repeat: -1
        });
        this.anims.create({
            key: "forwardh",
            frameRate: 10,
            frames: this.anims.generateFrameNumbers("hair", { start: 10, end: 14 }),
            repeat: -1
        });
        this.anims.create({
            key: "lefth",
            frameRate: 7,
            frames: this.anims.generateFrameNumbers("hair", { start: 15, end: 17 }),
            repeat: -1
        });
        this.anims.create({
            key: "righth",
            frameRate: 7,
            frames: this.anims.generateFrameNumbers("hair", { start: 20, end: 22 }),
            repeat: -1
        });
        this.anims.create({
            key: "backh",
            frameRate: 7,
            frames: this.anims.generateFrameNumbers("hair", { start: 25, end: 28 }),
            repeat: -1
        });
        //////

        this.anims.create({
            key: "idles",
            frameRate: 10,
            frames: this.anims.generateFrameNumbers("shirt", { start: 0, end: 0 }),
            repeat: -1
        });
        this.anims.create({
            key: "forwards",
            frameRate: 10,
            frames: this.anims.generateFrameNumbers("shirt", { start: 10, end: 14 }),
            repeat: -1
        });
        this.anims.create({
            key: "lefts",
            frameRate: 7,
            frames: this.anims.generateFrameNumbers("shirt", { start: 15, end: 17 }),
            repeat: -1
        });
        this.anims.create({
            key: "rights",
            frameRate: 7,
            frames: this.anims.generateFrameNumbers("shirt", { start: 20, end: 22 }),
            repeat: -1
        });
        this.anims.create({
            key: "backs",
            frameRate: 7,
            frames: this.anims.generateFrameNumbers("shirt", { start: 25, end: 28 }),
            repeat: -1
        });
        }

    }

    fadeToNight(){
        const initialAmbientColor = Phaser.Display.Color.ValueToColor(0xF7F7F7);
        const targetAmbientColor = Phaser.Display.Color.ValueToColor(0x5A5A59);
        var lightTween = this.tweens.add({
            targets: this.lights,
            x: 1,
            ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 2000,
            onUpdate: (tween) => {
                // Called on every tween update
                const colorObject = Phaser.Display.Color.Interpolate.ColorWithColor(initialAmbientColor,targetAmbientColor,2000,tween.elapsed)
                const ambientColor = Phaser.Display.Color.GetColor(colorObject.r,colorObject.g,colorObject.b)
    
                this.lights.setAmbientColor(ambientColor)
            }            
            
        });

        lightTween.play()
        
    }

    fadeToDay(){
        const initialAmbientColor = Phaser.Display.Color.ValueToColor(0x5A5A59);
        const targetAmbientColor = Phaser.Display.Color.ValueToColor(0xF7F7F7);
        var lightTween = this.tweens.add({
            targets: this.lights,
            x: 1,
            ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 2000,
            onUpdate: (tween) => {
                // Called on every tween update
                const colorObject = Phaser.Display.Color.Interpolate.ColorWithColor(initialAmbientColor,targetAmbientColor,2000,tween.elapsed)
                const ambientColor = Phaser.Display.Color.GetColor(colorObject.r,colorObject.g,colorObject.b)
    
                this.lights.setAmbientColor(ambientColor)
            }            
            
        });

        lightTween.play()
        
    }

}