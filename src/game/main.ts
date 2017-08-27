import * as TSE from '../lib';
import Level from './stage/level';

const WIDTH: number = 640;
const HEIGHT: number = 480;
const CANVAS: string = 'game';
const LOADER: TSE.AssetLoader = new TSE.AssetLoader();

function setupEngine(width: number, height: number, canvasId: string): TSE.Engine {
    const engine = new TSE.Engine(width, height, document.getElementById(canvasId));

    const preloadStage: TSE.PreloaderStage = new TSE.PreloaderStage(width, height);
    engine.setStage(preloadStage);

    engine.setStageTransition(() => {
        if (engine.currentStage instanceof TSE.PreloaderStage) {
            initLevelOne();
        }
    });

    return engine;
}

function initLevelOne(): void {
    const levelOne: Level = new Level(WIDTH, HEIGHT);
    ENGINE.setStage(levelOne);
}

const ENGINE: TSE.Engine = setupEngine(WIDTH, HEIGHT, CANVAS);
ENGINE.start();
