/**
 * @jest-environment jsdom
 */

import AssetLoader from '../src/lib/utils/asset_loader';

describe("AssetLoader", () => {

    let assetLoader = new AssetLoader();
    const imageName = 'img';

    test('new returns singleton instance', () => {
        expect(new AssetLoader()).toBe(assetLoader);
    });

    test('load img', () => {
        expect(assetLoader.loadImage(imageName, '../assets/images/garota.png')).toBeUndefined();
        expect(assetLoader.getProgress()).toBe(1);
        expect(assetLoader.loadingIsCompleted()).toBe(true);
        expect(assetLoader.getImage(imageName)).toBeDefined();
    });

    test('load invalid img', () => {
        expect(() => {
            assetLoader.getImage('invalid-img')
        }).toThrow()
    });
});

import Controller from '../src/lib/utils/controller';


describe("Controller", () => {

    let controller = new Controller();

    test('new returns singleton instance', () => {
        expect(new Controller()).toBe(controller);
    });

    test('returns false when undefined', () => {
        expect(controller.isPressed(Controller.keys.ENTER)).toBe(false);
    });

    test('keydown registered correctly', () => {
        let event = new KeyboardEvent('keydown', {'keyCode': Controller.keys.ENTER} as any);
        document.dispatchEvent(event);

        expect(controller.isPressed(Controller.keys.ENTER)).toBe(true);
    });

    test('keyup registered correctly', () => {
        let event = new KeyboardEvent('keyup', {'keyCode': Controller.keys.ENTER} as any);
        document.dispatchEvent(event);

        expect(controller.isPressed(Controller.keys.ENTER)).toBe(false);
    });
});

import Timer from '../src/lib/utils/timer';

describe("Timer", () => {
    const TIMEOUT = 10, TICK = 5;
    let timer = new Timer(TIMEOUT);

    test('is initialised correctly', () => {
        expect(timer.hasEnded()).toBe(false);
    });

    test('test tick', () => {
        expect(timer.tick(TICK)).toBeUndefined();
        expect(timer.hasEnded()).toBe(false);
    });

    test('test timeout', () => {
        expect(timer.tick(TIMEOUT)).toBeUndefined();
        expect(timer.hasEnded()).toBe(true);
    });

    test('reset timer', () => {
        expect(timer.reset()).toBeUndefined();
        expect(timer.hasEnded()).toBe(false);
    })
});