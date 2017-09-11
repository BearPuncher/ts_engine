import * as TSE from '../lib';
import {EndScreen} from './stage/end_screen';
import Level1 from './stage/level_1';
import Level2 from './stage/level_2';
import {StartScreen} from "./stage/start_screen";
import * as TinyMusic from '../../node_modules/tinymusic';
import Level3 from "./stage/level_3";

const WIDTH: number = 640;
const HEIGHT: number = 480;
const CANVAS: string = 'game';
const LOADER: TSE.AssetLoader = new TSE.AssetLoader();

function setupEngine(width: number, height: number, canvasId: string): TSE.Engine {
    const engine = new TSE.Engine(width, height, document.getElementById(canvasId));
    LOADER.loadImage('mazetilemap',  'assets/images/mazetiles.png');

    const preloadStage: TSE.PreloaderStage = new TSE.PreloaderStage(width, height);
    engine.setStage(preloadStage);

    engine.setStageTransition(() => {
        if (engine.currentStage instanceof TSE.PreloaderStage) {
            initStartScreen();
        } else if (engine.currentStage instanceof StartScreen) {
            initLevelOne();
        } else if (engine.currentStage instanceof Level1) {
            initLevelTwo();
        } else if (engine.currentStage instanceof Level2) {
            initLevelThree();
        } else if (engine.currentStage instanceof Level3) {
            initGameOver();
        }
    });

    return engine;
}

function initStartScreen(): void {
    ENGINE.setStage(new StartScreen(WIDTH, HEIGHT));
}

function initLevelOne(): void {
    ENGINE.setStage(new Level1(WIDTH, HEIGHT));
}

function initLevelTwo(): void {
    ENGINE.setStage(new Level2(WIDTH, HEIGHT));
}

function initLevelThree(): void {
    ENGINE.setStage(new Level3(WIDTH, HEIGHT));
}

function initGameOver(): void {
    ENGINE.setStage(new EndScreen(WIDTH, HEIGHT));
}
// TODO: write score keeper and track timing

const ENGINE: TSE.Engine = setupEngine(WIDTH, HEIGHT, CANVAS);
ENGINE.start();
