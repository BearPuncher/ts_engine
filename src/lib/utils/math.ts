/**
 * Simple point structure.
 */
export interface IPoint {
    readonly x: number;
    readonly y: number;
}

export const ORIGIN: IPoint = {x: 0, y: 0};

export function dist(pointA: IPoint, pointB: IPoint) {
    return Math.sqrt((Math.pow((pointB.x - pointA.x), 2) + Math.pow(pointB.y - pointA.y, 2)));
}
