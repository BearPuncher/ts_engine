import Stage from '../src/lib/stage';
import {Actor} from "../src/lib/actors/abstract_actor";

const WIDTH = 20, HEIGHT = 30, UPDATE_DT = 16;

// Setup mocks
const ActorMock = jest.fn<Actor>();
const ACTOR_1: Actor = new ActorMock();
ACTOR_1.init = jest.fn();
ACTOR_1.update = jest.fn();
ACTOR_1.render = jest.fn();
ACTOR_1.layer = 2;

const ACTOR_2: Actor = new ActorMock();
ACTOR_2.init = jest.fn();
ACTOR_2.update = jest.fn();
ACTOR_2.layer = 1;

describe("Default Stage", () => {
    let defaultStage = new Stage(WIDTH, HEIGHT);

    test('is initialised correctly', () => {
        expect(defaultStage.width).toBe(WIDTH);
        expect(defaultStage.height).toBe(HEIGHT);
        expect(defaultStage.ctx).toBe(null);
        expect(defaultStage.finished).toBe(false);
        expect(defaultStage.init()).toBeUndefined();
        expect(defaultStage.update(UPDATE_DT)).toBeUndefined();
        expect(defaultStage.render()).toBeUndefined();
    });

    test('add an actor', () => {
        expect(defaultStage.addActor(ACTOR_1)).toBeUndefined();
        // Verify mock
        expect(ACTOR_1.stage).toBe(defaultStage);
        expect(ACTOR_1.init.mock.calls.length).toBe(1);
    });

    test('update', () => {
        expect(defaultStage.update(10)).toBeUndefined();
        // Verify mock
        expect(ACTOR_1.update).toHaveBeenCalledTimes(1);
    });

    test('render', () => {
        expect(defaultStage.render()).toBeUndefined();
        // Verify mock
        expect(ACTOR_1.render).toHaveBeenCalledTimes(1);
    });

    test('sortActorsByLayer', () => {
        expect(defaultStage.addActor(ACTOR_2)).toBeUndefined();
        expect(defaultStage.update(UPDATE_DT)).toBeUndefined();

        expect(defaultStage.actors[0]).toBe(ACTOR_2);
        expect(defaultStage.actors[1]).toBe(ACTOR_1);
    });

});
