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

const STAGE: Stage = jest.genMockFromModule('../src/lib/st');
STAGE.ctx = CTX;

const SPRITE: Sprite = jest.genMockFromModule('../src/lib/s');
SPRITE.updateFrame = jest.fn();
SPRITE.draw = jest.fn();

describe("RectActor", () => {
    const WIDTH = 60, HEIGHT = 25;
    let rectActor = new RectActor(ORIGIN, WIDTH, HEIGHT);

    test('is initialised correctly', () => {
        expect(rectActor.p.x).toBe(ORIGIN.x);
        expect(rectActor.p.y).toBe(ORIGIN.y);
        expect(rectActor.w).toBe(WIDTH);
        expect(rectActor.h).toBe(HEIGHT);
        expect(rectActor.st).toBe(null);

        // Verify defaults
        expect(rectActor.spriteOffset.x).toBe(0);
        expect(rectActor.spriteOffset.y).toBe(0);
        expect(rectActor.opacity).toBe(1);
    });

    test('drawMazeParts without s', () => {
        rectActor.st = STAGE;

        expect(rectActor.update(STEP)).toBeUndefined();
        expect(rectActor.render()).toBeUndefined();
    });

    test('adding s with additional options', () => {

        expect(rectActor.setSprite({sp: SPRITE, spriteOffset: ORIGIN, opacity: OPACITY})).toBeUndefined();
        expect(rectActor.sp).toBe(SPRITE);
        expect(rectActor.spriteOffset.x).toBe(ORIGIN.x);
        expect(rectActor.spriteOffset.y).toBe(ORIGIN.y);
        expect(rectActor.opacity).toBe(OPACITY);

        expect(rectActor.update(STEP)).toBeUndefined();
        expect(rectActor.sp.updateFrame).toHaveBeenCalled();
        expect(rectActor.render()).toBeUndefined();
        expect(rectActor.sp.draw).toHaveBeenCalled();
    });

    test('is initialised correctly with options', () => {
        let rectActorWithOptions = new RectActor(ORIGIN, WIDTH, HEIGHT, {layer: LAYER, stage: STAGE});

        // Try init with defaults
        expect(rectActorWithOptions.setSprite({sp: SPRITE})).toBeUndefined();
        expect(rectActorWithOptions.sp).toBe(SPRITE);
        expect(rectActorWithOptions.spriteOffset.x).toBe(0);
        expect(rectActorWithOptions.spriteOffset.y).toBe(0);
        expect(rectActorWithOptions.opacity).toBe(1);

        expect(rectActorWithOptions.p.x).toBe(ORIGIN.x);
        expect(rectActorWithOptions.p.y).toBe(ORIGIN.y);
        expect(rectActorWithOptions.l).toBe(LAYER);
        expect(rectActorWithOptions.st).toBe(STAGE);

        expect(rectActorWithOptions.update(STEP)).toBeUndefined();
        expect(rectActorWithOptions.sp.updateFrame).toHaveBeenCalled();
        expect(rectActorWithOptions.render()).toBeUndefined();
        expect(rectActorWithOptions.sp.draw).toHaveBeenCalled();
    });
});

describe("CircleActor", () => {
    const RADIUS = 66;
    let circleActor = new CircleActor(ORIGIN, RADIUS);
    circleActor.st = STAGE;

    test('is initialised correctly', () => {
        expect(circleActor.p.x).toBe(ORIGIN.x);
        expect(circleActor.p.y).toBe(ORIGIN.y);
        expect(circleActor.r).toBe(RADIUS);
        expect(circleActor.st).toBe(STAGE);

        // Verify defaults
        expect(circleActor.spriteOffset.x).toBe(0);
        expect(circleActor.spriteOffset.y).toBe(0);
        expect(circleActor.opacity).toBe(1);
    });

    test('adding s with additional options', () => {
        circleActor.st = STAGE;

        expect(circleActor.setSprite({sp: SPRITE, spriteOffset: ORIGIN, opacity: OPACITY})).toBeUndefined();
        expect(circleActor.sp).toBe(SPRITE);
        expect(circleActor.spriteOffset.x).toBe(ORIGIN.x);
        expect(circleActor.spriteOffset.y).toBe(ORIGIN.y);
        expect(circleActor.opacity).toBe(OPACITY);

        expect(circleActor.update(STEP)).toBeUndefined();
        expect(circleActor.sp.updateFrame).toHaveBeenCalled();
        expect(circleActor.render()).toBeUndefined();
        expect(circleActor.sp.draw).toHaveBeenCalled();
    });

    test('is initialised correctly with options', () => {
        let circleActorWithOptions = new CircleActor(ORIGIN, RADIUS, {layer: LAYER, stage: STAGE});

        expect(circleActorWithOptions.p.x).toBe(ORIGIN.x);
        expect(circleActorWithOptions.p.y).toBe(ORIGIN.y);
        expect(circleActorWithOptions.l).toBe(LAYER);
        expect(circleActorWithOptions.st).toBe(STAGE);
    });
});