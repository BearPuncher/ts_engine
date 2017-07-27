"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Controller singleton.
 * Singleton pattern;  http://www.adam-bien.com/roller/abien/entry/singleton_pattern_in_es6_and
 */
var Controller = (function () {
    /**
     * Constructor.
     * @returns {Controller} instance if already initialized
     */
    function Controller() {
        if (Controller.instance) {
            return Controller.instance;
        }
        this.pressed = {};
        document.addEventListener('keyup', function (event) {
            Controller.instance.pressed[event.keyCode] = false;
        }, true);
        document.addEventListener('keydown', function (event) {
            Controller.instance.pressed[event.keyCode] = true;
        }, true);
        Controller.keys = {
            ENTER: 13,
            LEFT: 37,
            RIGHT: 39,
            UP: 38,
            DOWN: 40,
            A: 65,
            D: 68,
            W: 87,
            S: 83,
        };
        Controller.instance = this;
    }
    /**
     * Check if key is pressed.
     * @param keyCode the keycode for the key
     * @returns true if button is pressed
     */
    Controller.prototype.isPressed = function (keyCode) {
        var press = this.pressed[keyCode];
        if (typeof (press) === "boolean") {
            return press;
        }
        return false;
    };
    return Controller;
}());
exports.default = Controller;
