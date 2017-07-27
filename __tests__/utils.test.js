"use strict";
/**
 * @jest-environment jsdom
 */
Object.defineProperty(exports, "__esModule", { value: true });
var asset_loader_1 = require("../src/lib/utils/asset_loader");
describe("AssetLoader", function () {
    var assetLoader = new asset_loader_1.default();
    var imageName = 'image';
    test('new returns singleton instance', function () {
        expect(new asset_loader_1.default()).toBe(assetLoader);
    });
    test('load image', function () {
        expect(assetLoader.loadImage(imageName, '../assets/images/garota.png')).toBeUndefined();
        expect(assetLoader.getProgress()).toBe(1);
        expect(assetLoader.loadingIsCompleted()).toBe(true);
        expect(assetLoader.getImage(imageName)).toBeDefined();
    });
    test('load invalid image', function () {
        expect(function () {
            assetLoader.getImage('invalid-image');
        }).toThrow();
    });
});
var controller_1 = require("../src/lib/utils/controller");
describe("Controller", function () {
    var controller = new controller_1.default();
    test('new returns singleton instance', function () {
        expect(new controller_1.default()).toBe(controller);
    });
    test('returns false when undefined', function () {
        expect(controller.isPressed(controller_1.default.keys.ENTER)).toBe(false);
    });
    test('keydown registered correctly', function () {
        var event = new KeyboardEvent('keydown', { 'keyCode': controller_1.default.keys.ENTER });
        document.dispatchEvent(event);
        expect(controller.isPressed(controller_1.default.keys.ENTER)).toBe(true);
    });
    test('keyup registered correctly', function () {
        var event = new KeyboardEvent('keyup', { 'keyCode': controller_1.default.keys.ENTER });
        document.dispatchEvent(event);
        expect(controller.isPressed(controller_1.default.keys.ENTER)).toBe(false);
    });
});
var timer_1 = require("../src/lib/utils/timer");
describe("Timer", function () {
    var TIMEOUT = 10, TICK = 5;
    var timer = new timer_1.default(TIMEOUT);
    test('is initialised correctly', function () {
        expect(timer.hasEnded()).toBe(false);
    });
    test('test tick', function () {
        expect(timer.tick(TICK)).toBeUndefined();
        expect(timer.hasEnded()).toBe(false);
    });
    test('test timeout', function () {
        expect(timer.tick(TIMEOUT)).toBeUndefined();
        expect(timer.hasEnded()).toBe(true);
    });
    test('reset timer', function () {
        expect(timer.reset()).toBeUndefined();
        expect(timer.hasEnded()).toBe(false);
    });
});
