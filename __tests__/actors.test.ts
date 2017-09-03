/**
 * @jest-environment jsdom
 */

import RectActor from '../src/lib/actors/rect_actor';
import CircleActor from '../src/lib/actors/circle_actor';
import {IPoint} from "../src/lib/utils/math";
import Stage from "../src/lib/stage";
import Sprite from "../src/lib/sprite";

const ORIGIN: IPoint = {x: 10, y: 5}, LAYER = 15, OPACITY = 0.4, STEP = 16;

// Mocks
const CtxMock = jest.fn<CanvasRenderingContext2D>();
const CTX: CanvasRenderingContext2D = new CtxMock();
CTX.strokeRect = jest.fn();
CTX.fillRect = jest.fn();
CTX.beginPath = jest.fn();
CTX.arc = jest.fn();
CTX.fill = jest.fn();

const CanvasMock = jest.fn<HTMLCanvasElement>();
const CANVAS: HTMLCanvasElement = new CanvasMock();
CANVAS.getContext = jest.fn(() => {
    return CTX;
});

const STAGE: Stage = jest.genMockFromModule('../src/lib/stage');
STAGE.ctx = CTX;

const SPRITE: Sprite = jest.genMockFromModule('../src/lib/sprite');
SPRITE.updateFrame = jest.fn();
SPRITE.draw = jest.fn();

describe("RectActor", () => {
    const WIDTH = 60, HEIGHT = 25;
    let rectActor = new RectActor(ORIGIN, WIDTH, HEIGHT);

    test('is initialised correctly', () => {
        expect(rectActor.pos.x).toBe(ORIGIN.x);
        expect(rectActor.pos.y).toBe(ORIGIN.y);
        expect(rectActor.width).toBe(WIDTH);
        expect(rectActor.height).toBe(HEIGHT);
        expect(rectActor.stage).toBe(null);

        // Verify defaults
        expect(rectActor.spriteOffset.x).toBe(0);
        expect(rectActor.spriteOffset.y).toBe(0);
        expect(rectActor.opacity).toBe(1);
    });

    test('drawMazeParts without sprite', () => {
        rectActor.stage = STAGE;

        expect(rectActor.update(STEP)).toBeUndefined();
        expect(rectActor.render()).toBeUndefined();
    });

    test('adding sprite with additional options', () => {

        expect(rectActor.setSprite({sprite: SPRITE, spriteOffset: ORIGIN, opacity: OPACITY})).toBeUndefined();
        expect(rectActor.sprite).toBe(SPRITE);
        expect(rectActor.spriteOffset.x).toBe(ORIGIN.x);
        expect(rectActor.spriteOffset.y).toBe(ORIGIN.y);
        expect(rectActor.opacity).toBe(OPACITY);

        expect(rectActor.update(STEP)).toBeUndefined();
        expect(rectActor.sprite.updateFrame).toHaveBeenCalled();
        expect(rectActor.render()).toBeUndefined();
        expect(rectActor.sprite.draw).toHaveBeenCalled();
    });

    test('is initialised correctly with options', () => {
        let rectActorWithOptions = new RectActor(ORIGIN, WIDTH, HEIGHT, {layer: LAYER, stage: STAGE});

        // Try init with defaults
        expect(rectActorWithOptions.setSprite({sprite: SPRITE})).toBeUndefined();
        expect(rectActorWithOptions.sprite).toBe(SPRITE);
        expect(rectActorWithOptions.spriteOffset.x).toBe(0);
        expect(rectActorWithOptions.spriteOffset.y).toBe(0);
        expect(rectActorWithOptions.opacity).toBe(1);

        expect(rectActorWithOptions.pos.x).toBe(ORIGIN.x);
        expect(rectActorWithOptions.pos.y).toBe(ORIGIN.y);
        expect(rectActorWithOptions.layer).toBe(LAYER);
        expect(rectActorWithOptions.stage).toBe(STAGE);

        expect(rectActorWithOptions.update(STEP)).toBeUndefined();
        expect(rectActorWithOptions.sprite.updateFrame).toHaveBeenCalled();
        expect(rectActorWithOptions.render()).toBeUndefined();
        expect(rectActorWithOptions.sprite.draw).toHaveBeenCalled();
    });
});

describe("CircleActor", () => {
    const RADIUS = 66;
    let circleActor = new CircleActor(ORIGIN, RADIUS);
    circleActor.stage = STAGE;

    test('is initialised correctly', () => {
        expect(circleActor.pos.x).toBe(ORIGIN.x);
        expect(circleActor.pos.y).toBe(ORIGIN.y);
        expect(circleActor.radius).toBe(RADIUS);
        expect(circleActor.stage).toBe(STAGE);

        // Verify defaults
        expect(circleActor.spriteOffset.x).toBe(0);
        expect(circleActor.spriteOffset.y).toBe(0);
        expect(circleActor.opacity).toBe(1);
    });

    test('adding sprite with additional options', () => {
        circleActor.stage = STAGE;

        expect(circleActor.setSprite({sprite: SPRITE, spriteOffset: ORIGIN, opacity: OPACITY})).toBeUndefined();
        expect(circleActor.sprite).toBe(SPRITE);
        expect(circleActor.spriteOffset.x).toBe(ORIGIN.x);
        expect(circleActor.spriteOffset.y).toBe(ORIGIN.y);
        expect(circleActor.opacity).toBe(OPACITY);

        expect(circleActor.update(STEP)).toBeUndefined();
        expect(circleActor.sprite.updateFrame).toHaveBeenCalled();
        expect(circleActor.render()).toBeUndefined();
        expect(circleActor.sprite.draw).toHaveBeenCalled();
    });

    test('is initialised correctly with options', () => {
        let circleActorWithOptions = new CircleActor(ORIGIN, RADIUS, {layer: LAYER, stage: STAGE});

        expect(circleActorWithOptions.pos.x).toBe(ORIGIN.x);
        expect(circleActorWithOptions.pos.y).toBe(ORIGIN.y);
        expect(circleActorWithOptions.layer).toBe(LAYER);
        expect(circleActorWithOptions.stage).toBe(STAGE);
    });
});