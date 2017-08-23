import * as TSE from '../../lib';

/**
 * Controllable actor.
 */
export default class Player extends TSE.CircleActor {

    /**
     * Ovveride.
     */
    public init(): void {
        this.debugColour = 'red';
    }

    /**
     *
     * @param step
     */
    public update(step: number) {
        super.update(step);
        const controls: TSE.Controller = new TSE.Controller();

        const fraction: number = (step / 100);
        const speed: number = fraction * 15;
        let newX = this.position.x;
        let newY = this.position.y;

        if (controls.isPressed(TSE.Controller.keys.W) || controls.isPressed(TSE.Controller.keys.UP)) {
            newY -= speed;
        }

        if (controls.isPressed(TSE.Controller.keys.S) || controls.isPressed(TSE.Controller.keys.DOWN)) {
            newY += speed;
        }

        if (controls.isPressed(TSE.Controller.keys.A) || controls.isPressed(TSE.Controller.keys.LEFT)) {
            newX -= speed;
        }

        if (controls.isPressed(TSE.Controller.keys.D) || controls.isPressed(TSE.Controller.keys.RIGHT)) {
            newX += speed;
        }

        this.position = {x: newX, y: newY};
    }
}
