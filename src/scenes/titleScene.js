import Phaser from 'phaser'



export class TitleScene extends Phaser.Scene{
    constructor(){
        super({
            key: "TITLE_SCENE"
        });
        this.cameras
        this.player
        this.cursor
        this.startButton
        this.startText
        this.background
        this.base
        this.shirt
        this.hair

        this.uiScene
    }
    preload(){
        this.load.image("base1","/assets/CharacterSpritesheetBald1.png")
        this.load.image("base2","/assets/CharacterSpritesheetBald2.png")
        this.load.image("base3","/assets/CharacterSpritesheetBald3.png")
        this.load.image("base4","/assets/CharacterSpritesheetBald4.png")

        this.load.image("hair1","/assets/CharacterSpriteHair1.png")
        this.load.image("hair2","/assets/CharacterSpriteHair2.png")
        this.load.image("hair3","/assets/CharacterSpriteHair2.png") //long hair
        this.load.image("hair4","/assets/CharacterSpriteHair4.png") // bald

        this.load.image("shirtt","/assets/CharacterSpritesheetShirt.png")
    }

    create(){

        this.uiScene = this.scene.get("UI_SCENE")

        this.add.rectangle(0,0,1109,756,0x598186).setOrigin(0,0)
        this.add.rectangle(60,0,900,756,0x48676B).setOrigin(0,0)
        this.add.rectangle(157,220,650,130,0x6B9499).setOrigin(0,0)
        this.startButton = this.add.rectangle(800,500,180,70,0xFFFFFF).setInteractive()
        this.startText = this.add.text(735, 480, "START", { fontFamily: 'sans-serif',fontStyle: 'bold', fontSize: '40px', color: '#48676B'});
        this.add.text(230, 30, "College Simulator", { fontFamily: 'courier new',fontStyle: 'bold', fontSize: '50px', color: '#FFFFFF'});
        this.add.text(300, 80, "customize character", { fontFamily: 'courier new',fontStyle: 'bold', fontSize: '30px', color: '#FFFFFF'});
        this.add.text(320,235,"skin tone  : ",{ fontFamily: 'courier new',fontStyle: 'bold', fontSize: '20px', color: '#FFFFFF'})

        const skinData=[
            { x: 480, color: 0xe5c0af, num:1},
            { x: 500, color: 0xb0896f, num:2},
            { x: 520, color: 0x886b58, num:2}, 
            { x: 540, color: 0x47352b, num:4},
        ]

        skinData.forEach(skinData => {
            const circle = this.add.circle(skinData.x, 245, 8, skinData.color)
                .setInteractive()
                .setStrokeStyle(2, 0x48676B);
            // Add click event listener
            circle.on('pointerdown', () => {
                this.base.setTexture("base"+skinData.num)
                this.uiScene.skinTone = skinData.num
            });
        });

        this.add.text(320,265,"hair style : ",{ fontFamily: 'courier new',fontStyle: 'bold', fontSize: '20px', color: '#FFFFFF'})
        const styleData=[
            { x: 480, color: 0xe5c0af, num:1},
            { x: 500, color: 0xb0896f, num:2},
            { x: 520, color: 0x886b58, num:3},
            { x: 540, color: 0x886b58, num:4}
        ]
        styleData.forEach(styleData => {
            const circle = this.add.text(styleData.x,265,styleData.num,{ fontFamily: 'courier new',fontStyle: 'bold', fontSize: '20px', color: '#FFFFFF'})
                .setInteractive()

            // Add click event listener
            circle.on('pointerdown', () => {
                this.hair.setTexture("hair"+styleData.num).setCrop(0,0,90,150)
                this.uiScene.hairType = styleData.num
            });
        });
        this.add.text(320,295,"hair color : ",{ fontFamily: 'courier new',fontStyle: 'bold', fontSize: '20px', color: '#FFFFFF'})
    
        
        const hairData = [
            { x: 480, color: 0xFFFFFF },
            { x: 500, color: 0xCCC6B0},
            { x: 520, color: 0xA1887F }, 
            { x: 540, color: 0xDE964D },
            { x: 560, color: 0x9A663B },
            { x: 580, color: 0x6D4C41 },
            { x: 600, color: 0x544542 },
            { x: 620, color: 0x2B2119 },
            { x: 640, color: 0x880E4F },
            { x: 660, color: 0xFFAB91 }, 
            { x: 680, color: 0xAED581 },
            { x: 700, color: 0x77C9D3 },
            { x: 720, color: 0x5ea5c5 }, 
            { x: 740, color: 0x1976D2 },
            { x: 760, color: 0xA494BF }
        ];
        hairData.forEach(hairData => {
            const circle = this.add.circle(hairData.x, 305, 8, hairData.color)
                .setInteractive()
                .setStrokeStyle(2, 0x48676B);
            // Add click event listener
            circle.on('pointerdown', () => {
                this.hair.setTint(circle.fillColor)
                this.uiScene.hairColor = (circle.fillColor)
            });
        });

        const shirtData = [
            { x: 480, color: 0x722A2A },
            { x: 500, color: 0xDD5F44},
            { x: 520, color: 0xE7A8C5 }, 
            { x: 540, color: 0xE9A232 },
            { x: 560, color: 0x7D6454 },
            { x: 580, color: 0x7F9167 },
            { x: 600, color: 0x4B6A21 },
            { x: 620, color: 0x668387 }, 
            { x: 640, color: 0x529E96 },
            { x: 660, color: 0x6999B4 }, 
            { x: 680, color: 0x3E7A9D },
            { x: 700, color: 0x335FBA },
            { x: 720, color: 0x9985D7 }, 
            { x: 740, color: 0x654CB5 },
            { x: 760, color: 0x2E2D33 },
            { x: 780, color: 0xffffff }
        ];
        shirtData.forEach(shirtData => {
            const circle = this.add.circle(shirtData.x, 335, 8, shirtData.color)
                .setInteractive()
                .setStrokeStyle(2, 0x48676B);
            // Add click event listener
            circle.on('pointerdown', () => {
                this.shirt.setTint(circle.fillColor)
                this.uiScene.shirtColor = (circle.fillColor)
                
            });
        });

        this.add.text(320,325,"shirt color: ",{ fontFamily: 'courier new',fontStyle: 'bold', fontSize: '20px', color: '#FFFFFF'})
        this.startButton.on('pointerover',() => {
            this.startButton.setScale(1.3)
            this.startText.setFontSize('50px')
            this.startText.setPosition(715,474)
        });
        this.startButton.on('pointerout',() => {
            this.startButton.setScale(1)
            this.startText.setFontSize('40px')
            this.startText.setPosition(735,480)
        });
        this.startButton.on('pointerdown', () => {
            // Toggle between home screen and app screen
            this.loadSpriteSheets()
            this.cameras.main.fadeOut(500, 0, 0, 0)
                    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                        this.scene.start("DORM_SCENE"); 
                    })
    });

        this.base = this.add.image(200,240,"base1").setOrigin(0,0).setCrop(0,0,90,150)
       // this.base.setTexture("base3") // use set texture
        this.hair = this.add.image(200,240,"hair1").setOrigin(0,0).setCrop(0,0,90,150)
        this.shirt = this.add.image(200,240,"shirtt").setOrigin(0,0).setCrop(0,0,90,150)
    }

    loadSpriteSheets(){
        this.load.spritesheet('player', 'assets/CharacterSpritesheetBald'+this.uiScene.skinTone+'.png', { frameWidth: 85, frameHeight: 150 });
        this.load.spritesheet('hair', ('assets/CharacterSpriteHair'+this.uiScene.hairType+'.png'), { frameWidth: 85, frameHeight: 150 });
        this.load.spritesheet('shirt', 'assets/CharacterSpritesheetShirt.png', { frameWidth: 85, frameHeight: 150 });
    }
}