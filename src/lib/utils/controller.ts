/**
 * Controller singleton.
 * Singleton pattern;  http://www.adam-bien.com/roller/abien/entry/singleton_pattern_in_es6_and
 */
export default class Controller {

    /**
     * Key map.
     */
    public static keys: { [key: string]: number } ;

    /**
     * The singleton instance.
     */
    private static instance: Controller;

    private pressed: { [key: number]: boolean };

    /**
     * Constructor.
     * @returns {Controller} instance if already initialized
     */
    constructor() {
        if (Controller.instance) {
            return Controller.instance;
        }

        this.pressed = {};

        document.addEventListener('keyup', (event: KeyboardEvent) => {
            Controller.instance.pressed[event.keyCode] = false;
        }, true);

        document.addEventListener('keydown', (event: KeyboardEvent) => {
            Controller.instance.pressed[event.keyCode] = true;
        }, true);

        Controller.keys = {
            A: 65,
            D: 68,
            DOWN: 40,
            ENTER: 13,
            LEFT: 37,
            RIGHT: 39,
            S: 83,
            UP: 38,
            W: 87,
            SPACE: 32,
            M: 77,
            ESC: 27,
        };
        Controller.instance = this;
    }

    /**
     * Check if key is pressed.
     * @param keyCode the keycode for the key
     * @returns true if button is pressed
     */
    public isPressed(keyCode: number): boolean {
        const press = this.pressed[keyCode];

        if (typeof(press) === 'boolean') {
            return press;
        }
        return false;
    }
}
