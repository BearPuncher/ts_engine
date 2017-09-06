/**
 * Simple point structure.
 */
export interface IPoint {
    readonly x: number;
    readonly y: number;
}

export const ORIGIN: IPoint = {x: 0, y: 0};

export function dist(pointA: IPoint, pointB: IPoint): number {
    return Math.sqrt((Math.pow((pointB.x - pointA.x), 2) + Math.pow(pointB.y - pointA.y, 2)));
}

export function rotatePoint(origin: IPoint, angle: number, point: IPoint): IPoint {
    const radians: number = angle * Math.PI / 180.0;
    // Reverse rotation to normal
    const newX: number = origin.x + (Math.cos(radians) * (point.x - origin.x) + Math.sin(radians) * (point.y - origin.y));
    const newY: number = origin.y + (- Math.sin(radians) * (point.x - origin.x) + Math.cos(radians) * (point.y - origin.y));
    // negative is clockwise
    //const newX: number = origin.x + (point.x - origin.x) * Math.cos(radians) - (point.y - origin.y) * Math.sin(radians);
    //const newY: number = origin.y + (point.x - origin.x) * Math.sin(radians) + (point.y - origin.y) * Math.cos(radians);
    console.log(origin, radians, point, newX, newY);
    return {x: newX, y: newY};
}