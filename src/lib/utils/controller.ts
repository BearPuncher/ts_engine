/**
 * Controller singleton.
 * Singleton pattern;  http://www.adam-bien.com/roller/abien/entry/singleton_pattern_in_es6_and
 */
export default class Controller {

    /**
     * Key map.
     */
    public static keys: { [key:string]: number } ;

    /**
     * The singleton instance.
     */
    private static instance: Controller;

    private pressed: { [key:number]: boolean };

    /**
     * Constructor.
     * @returns {Controller} instance if already initialized
     */
    constructor() {
        if (Controller.instance) {
            return Controller.instance;
        }

        this.pressed = {};

        document.addEventListener('keyup', function (event: KeyboardEvent){
            Controller.instance.pressed[event.keyCode] = false;
        }, true);

        document.addEventListener('keydown', function (event: KeyboardEvent){
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
    isPressed(keyCode: number): boolean {
        let press = this.pressed[keyCode];

        if (typeof(press) === "boolean") {
            return press;
        }
        return false;
    }
}
