/**
 * Basic timer class.
 */
export default class Timer {
    private timeout: number;
    private elapsed: number;

    /**
     * Constructor with a given timeout.
     * @param timeout value in milliseconds
     */
    constructor(timeout: number) {
        this.timeout = timeout;
        this.elapsed = 0;
    }

    /**
     * Reset the timer.
     */
    public reset() {
        this.elapsed = 0;
    }

    /**
     * Record tick of 'step'.
     * @param step the number steps to tick
     */
    public tick(step: number) {
        this.elapsed += step;
    }

    /**
     * Check if timer has ended.
     * @returns true if elapsed time is greater than timeout
     */
    public hasEnded(): boolean {
        return this.elapsed >= this.timeout;
    }
}
