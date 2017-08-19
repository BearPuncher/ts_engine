import RectActor from '../lib/actors/rect_actor';
import Controller from '../lib/utils/controller';

/**
 * Controllable actor.
 */
export default class Player extends RectActor {

    public update(step: number) {
        super.update(step);
        const controls: Controller = new Controller();

        const fraction: number = (step / 100);
        const speed: number = fraction * 15;
        let newX = this.position.x;
        let newY = this.position.y;

        if (controls.isPressed(Controller.keys.W) || controls.isPressed(Controller.keys.UP)) {
            newY -= speed;
        }

        if (controls.isPressed(Controller.keys.S) || controls.isPressed(Controller.keys.DOWN)) {
            newY += speed;
        }

        if (controls.isPressed(Controller.keys.A) || controls.isPressed(Controller.keys.LEFT)) {
            newX -= speed;
        }

        if (controls.isPressed(Controller.keys.D) || controls.isPressed(Controller.keys.RIGHT)) {
            newX += speed;
        }

        this.position  = {x: newX, y: newY};
    }
}
