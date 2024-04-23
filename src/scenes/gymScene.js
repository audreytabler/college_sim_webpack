import Phaser from 'phaser'


export class GymScene extends Phaser.Scene{
    constructor(){
        super({
            key: "GYM_SCENE"
        });
        this.cameras
        this.player
        this.playerSpeed = 400
        this.cursor
        this.popUp
        this.uiScene
        this.popUpBox;
        this.overlapArray

        this.playerEnteredTrigger = false
    }
    preload(){
        this.uiScene = this.scene.get("UI_SCENE")
        this.load.spritesheet('player', 'assets/CharacterSpritesheetBald'+this.uiScene.skinTone+'.png', { frameWidth: 85, frameHeight: 150 });
        this.load.spritesheet('hair', ('assets/CharacterSpriteHair'+this.uiScene.hairType+'.png'), { frameWidth: 85, frameHeight: 150 });
        this.load.spritesheet('shirt', 'assets/CharacterSpritesheetShirt.png', { frameWidth: 85, frameHeight: 150 });
        this.load.image("popUp", "/assets/enter.png")
        
        this.load.image("gymBg","/assets/campusGym.png")
        this.load.image("tiles","/assets/CollegeTileSet.png")
        this.load.tilemapTiledJSON("gymMap", "/assets/gymMap.tmj")
        //this.load.tilemapTiledJSON("classMap", "/assets/ClassMap.tmj")

    }
    create(){
        
        this.scene.get("UI_SCENE").newScene(this.sys.settings.key)
        this.uiScene = this.scene.get("UI_SCENE")

        this.physics.world.enable;
        this.physics.world.setBounds(0, 0, 9035, 6347);
        this.input.enabled = true;
        this.cursor = this.input.keyboard.createCursorKeys()

        this.physics.add.image(0,0,"gymBg").setOrigin(0,0)


        //TILEMAP STUFF
        let map = this.make.tilemap({key: 'gymMap'})
        let grassTileset = map.addTilesetImage("CollegeTileSet","tiles")

        //let groundlayer = map.createLayer("background",grassTileset)
        let wallLayer = map.createLayer("wallLayer",grassTileset)
        wallLayer.setAlpha(0)

        //COLLISION WITH WALLS STUFF
        this.loadPlayer()
        wallLayer.setCollisionByExclusion([-1]);
        this.physics.add.collider(this.player, wallLayer);
        this.physics.add.collider(this.hair, wallLayer);
        this.physics.add.collider(this.shirt, wallLayer);
        ////////////////////////////////////////
        const transportLayer = map.getObjectLayer("transportation_layer"); 
        this.overlapArray=[]

        transportLayer.objects.forEach(object => {
                const transportRect = this.add.rectangle(object.x, object.y, object.width, object.height);
                transportRect.setOrigin(0); // Make collisions based on top-left corner
                transportRect.setAlpha(0); // Keep it invisible
                this.physics.add.existing(transportRect, true);

                this.physics.add.overlap(this.player, transportRect, () => {
                    this.uiScene.playerSpawnX = object.properties.find(prop => prop.name === 'playerSpawnX').value
                    this.uiScene.playerSpawnY = object.properties.find(prop => prop.name === 'playerSpawnY').value
                    if(!this.playerEnteredTrigger){
                        this.cameras.main.fadeOut(1000, 0, 0, 0)
                        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                            this.scene.start(object.properties.find(prop => prop.name === 'toSceneKey').value); 
                        })
                    }
                    this.playerEnteredTrigger = true 
                    this.overlapArray.push(transportRect)
                });
        });
        //////////////////////////////////////////
         
        this.popUpBox = this.add.rectangle(8159+50, 5305+20, 75, 30,0x226184,0.5).setInteractive()
        this.popUpBox.setVisible(false)
        this.popUpBox.setInteractive()
        this.popUpBox.setInteractive()
        this.popUpText = this.add.text(8159, 5305, " " + (this.usableObject), { 
            fontFamily: 'sans-serif', 
            fontSize: '24px', 
            color: '#ffffff',
        });  
        this.popUpBox.on('pointerover',() => {
            this.popUpBox.setScale(1.3)
        });
        this.popUpBox.on('pointerout',() => {
            this.popUpBox.setScale(1)
        });
        this.popUpBox.on('pointerdown', () => {
            this.uiScene.clickClassRoom(this.usableObject)
        })
        
        this.input.on('pointerdown', (pointer) => {
            // Log the position of the cursor when clicked
            console.log('player position - X:', this.player.x, 'Y:', this.player.y);
        });

    }
    update(){
        if ((!this.physics.overlap(this.player, this.overlapArray)) && (this.playerEnteredTrigger == true)) {
            // Player left the trigger area, trigger the event
            this.playerEnteredTrigger = false;
            this.popUpBox.setVisible(false)
            this.popUpText.setVisible(false)
        }
        
        if(!this.uiScene.characterMovable){
            this.player.setVelocity(0,0)
            this.hair.setVelocity(0,0)
            this.shirt.setVelocity(0,0)
            this.player.play("idle",true)
            this.shirt.play("idles",true)
            this.hair.play("idleh",true)
            return;
        }
        const { left, right, up, down, } = this.cursor //would add up,down if overhead view
        const { W, A, S, D } = this.input.keyboard.addKeys('W,A,S,D');

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
       // 1842 Y: 2599
        let playerX=1842
        let playerY=2599
        this.player = this.physics.add.sprite(playerX, playerY, "player").setOrigin(0, 0)
        this.hair = this.physics.add.sprite(playerX, playerY, "hair").setOrigin(0, 0)
        this.shirt = this.physics.add.sprite(playerX, playerY, "shirt").setOrigin(0, 0)
    
        this.player.setBodySize(65,120)
        this.player.setMaxVelocity(this.playerSpeed)
        this.hair.setMaxVelocity(this.playerSpeed)
        this.hair.setBodySize(65,120)
        this.hair.setTint(this.uiScene.hairColor)
        this.shirt.setMaxVelocity(this.playerSpeed)
        this.shirt.setBodySize(65,120)
        this.shirt.setTint(this.uiScene.shirtColor) 
       // this.player.setPosition(1433, 2694)//this.player.setPosition(920, 2139)

        this.player.body.allowGravity = false;
        this.player.setBodySize(65,120)
        this.player.setCollideWorldBounds(true)

        this.cameras.main.startFollow(this.player, false, 0.2, 0.2);
        

    }
}