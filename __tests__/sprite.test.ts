import Sprite from '../src/lib/sprite';
import {IPoint} from '../src/lib/utils/math';

const WIDTH = 20, HEIGHT = 40, INTERVAL = 20, CYCLE: [[number, number]] = [[0,0],[0,1]], POINT: IPoint = {x: 5, y: 10};

const ImageMock = jest.fn<HTMLImageElement>();
const IMAGE: HTMLImageElement = new ImageMock();
// Mock draw image.
const CtxMock = jest.fn<CanvasRenderingContext2D>();
const CTX: CanvasRenderingContext2D = new CtxMock();
CTX.save = jest.fn();
CTX.translate = jest.fn();
CTX.scale = jest.fn();
CTX.drawImage = jest.fn();
CTX.restore = jest.fn();

describe("Sprite", () => {

    let sprite = new Sprite(IMAGE, WIDTH, HEIGHT);
    let sprite2 = new Sprite(IMAGE, WIDTH);

    test('is initialised correctly', () => {
        expect(sprite.image).toBe(IMAGE);
        expect(sprite.width).toBe(WIDTH);
        expect(sprite.height).toBe(HEIGHT);
    });

    test('is initialised correctly with just width', () => {
        expect(sprite2.image).toBe(IMAGE);
        expect(sprite2.width).toBe(WIDTH);
        expect(sprite2.height).toBe(WIDTH);
    });

    test('setScale', () => {
        let scaleX = 2, scaleY = 3, original = 1;

        expect(sprite.setScale(scaleX, scaleY)).toBeUndefined();
        expect(sprite.scale.x).toBe(scaleX);
        expect(sprite.scale.y).toBe(scaleY);
        expect(sprite.setScale(original)).toBeUndefined();
        expect(sprite.scale.x).toBe(original);
        expect(sprite.scale.y).toBe(original);
    });

    test('cycle setter', () => {
        expect(sprite2.setCycle(CYCLE, INTERVAL)).toBeUndefined();
        expect(sprite2.setScale(1)).toBeUndefined();
        expect(sprite2.updateFrame(0)).toBeUndefined();
    });

    test('update & draw', () => {
        expect(sprite2.updateFrame(INTERVAL)).toBeUndefined();
        expect(sprite2.draw(POINT, CTX, 1)).toBeUndefined();
        expect(CTX.save).toHaveBeenCalledTimes(1);
        expect(CTX.translate).toHaveBeenCalledTimes(1);
        expect(CTX.scale).toHaveBeenCalledTimes(1);
        expect(CTX.drawImage).toHaveBeenCalledTimes(1);
        expect(CTX.restore).toHaveBeenCalledTimes(1);
        expect(sprite2.draw(POINT, CTX)).toBeUndefined();
    });
});