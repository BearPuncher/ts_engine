import * as TSE from '../lib';
import {EndScreen} from './stage/end_screen';
import Level1 from './stage/level_1';
import Level2 from './stage/level_2';
import {StartScreen} from "./stage/start_screen";
import * as TinyMusic from '../../node_modules/tinymusic';
import Level3 from "./stage/level_3";
import {IScore} from "./stage/level";
import Level4 from "./stage/level_4";
import Level5 from "./stage/level_5";
import Level6 from "./stage/level_6";

const WIDTH: number = 640;
const HEIGHT: number = 480;
const CANVAS: string = 'game';
const LOADER: TSE.AssetLoader = new TSE.AssetLoader();
const ac: AudioContext = new AudioContext;
const SCORES: IScore[] = [];

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
            SCORES.push((engine.currentStage as any).getScore());
            initLevelTwo();
        } else if (engine.currentStage instanceof Level2) {
            SCORES.push((engine.currentStage as any).getScore());
            initLevelThree();
        } else if (engine.currentStage instanceof Level3) {
            SCORES.push((engine.currentStage as any).getScore());
            initLevelFour();
        } else if (engine.currentStage instanceof Level4) {
            SCORES.push((engine.currentStage as any).getScore());
            initLevelFive();
        } else if (engine.currentStage instanceof Level5) {
            SCORES.push((engine.currentStage as any).getScore());
            initLevelSix();
        } else if (engine.currentStage instanceof Level6) {
            SCORES.push((engine.currentStage as any).getScore());
            initGameOver();
        }
    });

    return engine;
}

function initStartScreen(): void {
    const stage = new StartScreen(WIDTH, HEIGHT);
    stage.ac = ac;
    ENGINE.setStage(stage);
}

function initLevelOne(): void {
    const level1 = new Level1(WIDTH, HEIGHT, ac);
    level1.playWinSound();
    ENGINE.setStage(level1);
}

function initLevelTwo(): void {
    ENGINE.setStage(new Level2(WIDTH, HEIGHT, ac));
}

function initLevelThree(): void {
    ENGINE.setStage(new Level3(WIDTH, HEIGHT, ac));
}

function initLevelFour(): void {
    ENGINE.setStage(new Level4(WIDTH, HEIGHT, ac));
}

function initLevelFive(): void {
    ENGINE.setStage(new Level5(WIDTH, HEIGHT, ac));
}

function initLevelSix(): void {
    ENGINE.setStage(new Level6(WIDTH, HEIGHT, ac));
}

function initGameOver(): void {
    const end = new EndScreen(WIDTH, HEIGHT);
    end.scores = SCORES;
    ENGINE.setStage(end);
}
// TODO: write score keeper and track timing

const ENGINE: TSE.Engine = setupEngine(WIDTH, HEIGHT, CANVAS);
ENGINE.start();
