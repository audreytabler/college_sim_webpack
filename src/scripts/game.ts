//import '../assets/style.css'
import Phaser from 'phaser'
import {TitleScene} from '../scenes/titleScene.js'
import { CampusScene } from '../scenes/campusScene.js';
import {DormScene} from '../scenes/dormScene.js'
import {UIScene} from '../scenes/uiScene.js'
import {ClassScene} from '../scenes/classScene.js'
import { GymScene } from '../scenes/gymScene.js';

const gameCanvas: HTMLCanvasElement | null = document.getElementById('gameCanvas') as HTMLCanvasElement;

const game = new Phaser.Game({
    type: Phaser.WEBGL,
    canvas: gameCanvas,
    pixelArt: false,
    scale: {
        parent: 'game-container',
        width: 1024,
        height: 576,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: {
            // gravity: { y: 50 },
            debug: false,
        },
    },
    });
    
game.scene.add("CAMPUS_SCENE", CampusScene);
game.scene.add("CLASS_SCENE", ClassScene);
game.scene.add("DORM_SCENE", DormScene);
game.scene.add("GYM_SCENE", GymScene);
game.scene.add("UI_SCENE", UIScene);
game.scene.add("TITLE_SCENE", TitleScene);
//game.scene.start("CAMPUS_SCENE")
game.scene.start("TITLE_SCENE")
//game.scene.start("DORM_SCENE")
//game.scene.start("GYM_SCENE")
//game.scene.start("CLASS_SCENE")
