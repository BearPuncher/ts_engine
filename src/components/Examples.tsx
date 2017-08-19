import * as React from 'react';
import {Button, ButtonGroup} from 'react-bootstrap';
import Player from '../example/player';
import {Actor, AssetLoader, Controller, Engine, PreloaderStage, Sprite, Stage} from '../lib';

const CANVAS_ID: string = 'canvas';
const WIDTH: number = 640;
const HEIGHT: number = 480;

// Header
function Header(props: {title: string}) {
    return <h1>{props.title}</h1>;
}

// Canvas to use for all examples
function Canvas() {
    const canvasStyle = {
        border: '1px black solid',
        height: HEIGHT + 'px',
        width: WIDTH + 'px',
    };

    return <canvas id={CANVAS_ID} style={canvasStyle}/>;
}

export interface IGameProps { title: string; }

// Root application
export default class Game extends React.Component<IGameProps, undefined> {
    public render() {
        return <div>
            <Header title={this.props.title}/>
            <Canvas/>
            <Button onClick={initExamples} bsSize="large">Example</Button>
        </div>;
    }
}

// Initialize examples
function initExamples() {
    const assetLoader: AssetLoader = new AssetLoader();
    assetLoader.loadImage('sprite', 'assets/images/garota.png');

    // Setup preloader
    const preloadStage: PreloaderStage = new PreloaderStage(WIDTH, HEIGHT);
    const engine: Engine = new Engine(WIDTH, HEIGHT, document.getElementById(CANVAS_ID));
    engine.setStage(preloadStage);
    engine.start();

    const spriteTest: Stage = new Stage(WIDTH, HEIGHT);
    const ACTOR_WIDTH = 32;
    const ACTOR_HEIGHT = 45;
    const SCALE = 2;
    const actor: Player = new Player({x: 0, y: 0}, ACTOR_WIDTH * 2, ACTOR_HEIGHT * 2);
    const sprite: Sprite = new Sprite(assetLoader.getImage('sprite'), ACTOR_WIDTH, ACTOR_HEIGHT);

    sprite.setScale(SCALE);
    sprite.setCycle([[0, 0], [1, 0], [2, 0], [1, 0]], 400);
    actor.setSprite({sprite});
    spriteTest.addActor(actor);
    engine.setStage(spriteTest);
}
