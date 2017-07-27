"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Basic timer class.
 */
var Timer = (function () {
    /**
     * Constructor with a given timeout.
     * @param timeout value in milliseconds
     */
    function Timer(timeout) {
        this.timeout = timeout;
        this.elapsed = 0;
    }
    /**
     * Reset the timer.
     */
    Timer.prototype.reset = function () {
        this.elapsed = 0;
    };
    /**
     * Record tick of 'step'.
     * @param step the number steps to tick
     */
    Timer.prototype.tick = function (step) {
        this.elapsed += step;
    };
    /**
     * Check if timer has ended.
     * @returns true if elapsed time is greater than timeout
     */
    Timer.prototype.hasEnded = function () {
        return this.elapsed >= this.timeout;
    };
    return Timer;
}());
exports.default = Timer;
