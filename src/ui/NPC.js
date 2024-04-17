import Phaser from "phaser";

export class NPC extends Phaser.GameObjects.Graphics {
    constructor(scene,x,y,name,skin,textureKey,) {
        super(scene, 'NPC');
        this.scene = scene
        this.uiScene = this.scene.uiScene
        this.data = this.uiScene.npcDialog
        this.numberArray = this.uiScene.numberArray
        this.dialogBox = this.uiScene.narrator
        this.name = name
        this.player = this.scene.player
        this.playerhair = this.scene.hair
        this.playershirt = this.scene.shirt
        this.wall = this.scene.wallLayer
        //this.socialScore = socialScore

        this.sprite = this.scene.physics.add.sprite(x, y, textureKey,skin).setOrigin(0,0); //where skin is number corresponding on spritesheet
        
        this.scene.physics.world.enable(this.sprite);
       // this.sprite.setMaxVelocity(this.playerSpeed)
        this.sprite.setPipeline('Light2D')
        this.sprite.setBodySize(65,120)
        this.sprite.setBounce(0.2)
        
        //this.sprite.setPushable(true)
        this.sprite.setDrag(1000)
        //this.wall.setCollisionByExclusion([-1]);
        this.scene.physics.add.collider(this.sprite, this.player, this.handleCollision, null, this);
        this.scene.physics.add.collider(this.sprite, this.playerhair)
        this.scene.physics.add.collider(this.sprite, this.playershirt)
        
        this.scene.physics.add.collider(this.sprite, this.wall);
        //this.scene.physics.add.collider(this.sprite, this.scene.physics.world.dynamicBodies, this.handleCollision, null, this);
       // this.sprite.setVelocityX(10)

        this.sprite.body.moves=true;
        //console.log("sprite collision category is " + this.sprite.body.collisionCategory)
        //console.log("sprite scene is " + this.scene)

        

        this.sprite.setInteractive()
        this.sprite.on('pointerdown', (pointer) => {
            // Log the position of the cursor when clicked
            console.log('sprite clicked');
            let num = Math.floor(Math.random() * 22)
            this.tryDialog(num)
        });
    }
    preload(){
        //this.load.json('dialog', "./assets/npcDialog.json")
        //this.load.image('npcSpritesheet',"./assets/CharacterSpritesheet2.png")
        //this.load.spritesheet('npcSpritesheet', "./assets/CharacterSpritesheet2.png", { frameWidth: 85, frameHeight: 150 })
    }
    tryDialog(num){
        if(this.numberArray.length < this.data.studentTips.length){
            if(this.numberArray.includes(num)){
                num = Math.floor(Math.random() * 22)
                this.tryDialog(num)
            }
            else{
                this.numberArray.push(num)
                this.uiScene.statsOverlay.updateEnergy(-5)
                this.uiScene.statsOverlay.updateSocial(+8)
                this.dialogBox.startDialogText(this.data.studentTips[num].text)
                return;
            }

        }
        else{
            console.log("numberArray is full! restarting dialog options...")
            this.numberArray = []
        }
    }

// Handle collision between the NPC sprite and any other object
handleCollision(npc, object) {
    console.log('Collision detected:', npc, object);
    // Apply collision handling logic here
    // Example: Apply a force or velocity to the NPC sprite
    //const forceMagnitude = 100; // Adjust as needed
    npc.setVelocity(0, 0); // Stop the NPC sprite upon collision
}


}