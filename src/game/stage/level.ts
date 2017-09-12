import * as TSE from '../../lib';
import Maze from '../actors/maze';
import {MazePart, MazePartFactory, MazePartType} from '../actors/maze_part';
import Player from '../actors/player';
import Treasure from '../actors/treasure';
import * as TinyMusic from '../../../node_modules/tinymusic';

interface IMazePartData {
    t: MazePartType;
    r: number;
    cr: boolean;
}

export interface IScore {
    foundTreasure: number,
    treasure: number,
    time: string,
}

const MAP_LAYOUTS = [
    [
        [[MazePartType.CO, 1, false], [MazePartType.DE, 3, false], [MazePartType.DE, 2, false], [MazePartType.EX, 2, false]],
        [[MazePartType.TB, 0, true], [MazePartType.ST, 1, false], [MazePartType.CO, 3, false], [MazePartType.ST, 1, true]],
        [[MazePartType.ST, 0, false], [MazePartType.DE, 2, false], [MazePartType.CO, 1, false], [MazePartType.TB, 3, false]],
        [[MazePartType.CO, 0, false], [MazePartType.TB, 3, true], [MazePartType.CO, 3, false], [MazePartType.DE, 0, false]],
    ],
    [
        [[MazePartType.CO, 1, false], [MazePartType.CO, 2, false], [MazePartType.CO, 1, false], [MazePartType.ST, 1, false], [MazePartType.CO, 2, false]],
        [[MazePartType.DE, 0, false], [MazePartType.TB, 0, true], [MazePartType.TB, 0, false], [MazePartType.CO, 2, false], [MazePartType.DE, 0, false]],
        [[MazePartType.CO, 1, false], [MazePartType.CR, 0, false], [MazePartType.ST, 1, false], [MazePartType.TB, 0, true], [MazePartType.EX, 2, false]],
        [[MazePartType.CO, 0, false], [MazePartType.TB, 3, true], [MazePartType.DE, 3, false], [MazePartType.CO, 0, false], [MazePartType.CO, 3, false]],
    ],
    [
        [[MazePartType.DE, 2, false], [MazePartType.CO, 1, false], [MazePartType.EX, 3, false], [MazePartType.CO, 1, false], [MazePartType.CO, 2, false]],
        [[MazePartType.ST, 0, false], [MazePartType.TB, 2, true], [MazePartType.CO, 2, false], [MazePartType.DE, 0, false], [MazePartType.ST, 1, true]],
        [[MazePartType.CO, 0, false], [MazePartType.CO, 3, false], [MazePartType.TB, 0, true], [MazePartType.ST, 1, false], [MazePartType.CO, 3, false]],
        [[MazePartType.DE, 2, false], [MazePartType.DE, 1, false], [MazePartType.TB, 3, false], [MazePartType.CO, 1, false], [MazePartType.CO, 2, false]],
        [[MazePartType.CO, 0, false], [MazePartType.ST, 1, false], [MazePartType.TB, 1, true], [MazePartType.CO, 3, false], [MazePartType.DE, 0, false]],
    ],
    [
        [[MazePartType.CO, 1, false], [MazePartType.ST, 1, false], [MazePartType.DE, 3, false], [MazePartType.CO, 3, true], [MazePartType.DE, 3, false]],
        [[MazePartType.TB, 1, false], [MazePartType.CO, 0, true], [MazePartType.DE, 2, false], [MazePartType.ST, 0, false], [MazePartType.DE, 2, false]],
        [[MazePartType.DE, 0, false], [MazePartType.TB, 1, false], [MazePartType.TB, 0, false], [MazePartType.CR, 0, false], [MazePartType.CO, 3, false]],
        [[MazePartType.CO, 1, false], [MazePartType.ST, 1, true], [MazePartType.CO, 2, false], [MazePartType.CO, 0, false], [MazePartType.CO, 3, true]],
        [[MazePartType.CO, 0, false], [MazePartType.CO, 3, false], [MazePartType.CO, 0, false], [MazePartType.DE, 3, false], [MazePartType.EX, 0, false]],
    ],
];

// TODO: move maze data to actual levels
export abstract class Level extends TSE.Stage {

    public playTime: number;
    public numTreasures: number;
    public treasures: Treasure[];

    private ac: AudioContext;
    private turnSequence: any;
    private treasureSequence: any;
    private winSequence: any;

    /**
     * Maze.
     */
    protected m: Maze;
    /**
     * Player 1.
     */
    protected p1: Player;
    protected camera: TSE.Math.IPoint = {x: 0, y: 0};
    protected cameraClamp: boolean = false;

    protected mapMode: boolean;

    public constructor(width: number, height: number, ac: AudioContext) {
        super(width, height);
        this.playTime = 0;
        this.numTreasures = 0;
        this.treasures = [];
        this.ac = ac;

        this.initPlayWinSound();
        this.initPlayTreasureSound();
        this.initPlayMazePartRotate();
    }

    /**
     * Override.
     */
    public abstract init(): void;

    /**
     * Override.
     */
    public update(step: number): void {
        this.m.resetState();
        let cursor: string = 'no-drop';
        const pos: TSE.Math.IPoint = this.getMousePosition();

        if (this.p1.p) {
            // Set adjacent m parts to be actionable
            const adjacent: MazePart[] = this.m.getAdjacentMazeParts(this.p1.p);
            for (let i = 0; i < adjacent.length; i++) {
                if (adjacent[i]) {
                    adjacent[i].actionable = true;
                }
            }
        }

        if (pos && !this.p1.mapMode) {
            // TODO: This is hacky
            const selected: MazePart = this.m.getMazePartAtPosition(pos);
            const standing: MazePart = this.m.getMazePartAtPosition({x: this.p1.p.x + this.p1.w / 2,
                y: this.p1.p.y + this.p1.h / 2});

            // TODO: Get standing mazeTile center

            const msCol: number = Math.floor(pos.x / this.m.mpS);
            const msRow: number = Math.floor(pos.y / this.m.mpS);

            // Check if player min position
            const col: number = Math.floor(this.p1.p.x / this.m.mpS);
            const row: number = Math.floor(this.p1.p.y / this.m.mpS);

            const dX: number = Math.abs(msCol - col);
            const dY: number = Math.abs(msRow - row);

            const adjacent: boolean = (dX === 0 && dY === 1) || (dX === 1 && dY === 0);

            // Check if player max position
            const col2: number = Math.floor((this.p1.p.x + this.p1.w) / this.m.mpS);
            const row2: number = Math.floor((this.p1.p.y + this.p1.h) / this.m.mpS);

            const dX2: number = Math.abs(msCol - col2);
            const dY2: number = Math.abs(msRow - row2);

            const adjacent2: boolean = (dX2 === 0 && dY2 === 1) || (dX2 === 1 && dY2 === 0);
            //const adjacent: boolean = (dX >= 0 && dY <= 1) || (dX >= 1 && dY <= 0);

            if (selected && standing && adjacent && adjacent2) {
                standing.actionable = true;

                if (selected.rotates) {
                    cursor = 'pointer';
                    if (this.p1.ms) {

                        /*const tileCenter: IPoint = {
                            x: col * this.m.mpS + this.m.mpS / 2,
                            y: row + this.m.mpS + this.m.mpS / 2
                        };*/

                        if (this.p1.ms.l) {
                            this.m.needsUpdate = true;
                            selected.rotateLeft();
                            let when: number = this.ac.currentTime;
                            this.turnSequence.play(when);
                            // Rotate if standing on
                            /*if (selected === standing) {
                                this.p1.p = TSE.Math.rotatePoint(tileCenter, 90, this.p1.p);
                            }*/
                        }
                        if (this.p1.ms.r) {
                            this.m.needsUpdate = true;
                            selected.rotateRight();
                            let when: number = this.ac.currentTime;
                            this.turnSequence.play(when);
                            // Rotate if standing on
                            /*if (selected === standing) {
                                this.p1.p = TSE.Math.rotatePoint(tileCenter, -90, this.p1.p);
                            }*/
                        }
                    }
                }
                selected.hovered = true;
            }
            if (standing.rotates) {
                if (standing === selected) {
                    cursor = 'not-allowed';
                }
            }
            standing.standing = true;
        }
        this.ctx.canvas.style.cursor = cursor;

        // Check if p1 picked up treasure
        // yuck
        for (let t of this.treasures) {
            if (!t.remove && t.isColliding(this.p1)) {
                t.remove = true;
                this.numTreasures++;
                let when: number = this.ac.currentTime;
                this.treasureSequence.play(when);
            }
        }

        this.playTime += step;
        super.update(step);

        if (this.finished) {
            this.playWinSound();
        }
    }

    /**
     * Override.
     */
    public render(): void {
        const ctx: CanvasRenderingContext2D = this.ctx;

        ctx.save();
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, this.w, this.h);

        if (this.p1.mapMode) {
            this.ctx.canvas.style.cursor = 'no-drop';
            this.drawMap();
            ctx.restore();
        } else {
            this.drawGame();
            ctx.restore();

            // Show treasure count
            ctx.font = '30px Blippo, fantasy';
            ctx.fillStyle = 'white';
            ctx.fillText("Treasure Found " + this.numTreasures + "/" + this.treasures.length, 30, this.h - 30);

            const timeString: string = this.getTimeString();
            ctx.fillStyle = 'white';
            ctx.fillText(timeString, this.w - ctx.measureText(timeString).width - 30, this.h - 30);
        }
    }

    public getTimeString(): string {
        const time: number  = 1000 * Math.round(this.playTime / 1000); // round to nearest second
        const d = new Date(time);

        return d.getUTCMinutes()
                .toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
            + ':' + d.getUTCSeconds()
                .toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
    }

    public playWinSound() {
        let when: number = this.ac.currentTime;
        this.winSequence.play(when);
    }

    public getScore(): IScore {
        return {treasure: this.treasures.length, foundTreasure: this.numTreasures, time: this.getTimeString()};
    }

    protected createTreasure(point: TSE.Math.IPoint) {
        const treasure = new Treasure(point);
        this.treasures.push(treasure);
        super.addActor(treasure);
    }

    protected setMapPartsFromLevel(level: number): void {
        const mazeParts: MazePart[][] = [];

        let row: number = 0;
        for (let array of MAP_LAYOUTS[level]) {
            mazeParts[row] = [];
            for (let col = 0; col < array.length; col++) {
                const data = array[col];
                mazeParts[row][col] = MazePartFactory.create(Number(data[0]), Number(data[1]), Boolean(data[2]));
            }
            row++;
        }
        this.m.setMazeParts(mazeParts);
    }

    private drawGame(): void {
        const ctx: CanvasRenderingContext2D = this.ctx;

        let cX: number = - this.p1.p.x + this.w / 2;
        let cY: number = - this.p1.p.y + this.h / 2;

        if (this.cameraClamp) {
            // Clamp camera to puzzle area
            cX = Math.min(0, cX);
            cY = Math.min(0, cY);
            cX = Math.max(cX, - this.m.w + this.w);
            cY = Math.max(cY, - this.m.h + this.h);
        }

        ctx.translate(cX, cY);
        this.camera = {x: cX, y: cY};
        super.render();
        this.m.drawShadows(this.p1.lantern.p, this.p1.lantern.r + 32);
        this.m.drawMazePostEffects();
    }

    private drawMap(): void {
        const ctx: CanvasRenderingContext2D = this.ctx;

        const map: string = 'Map';
        const headerHeight: number = 60;

        ctx.font = '30px Chalkduster, fantasy';
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'white';
        const mapHalfTextWidth: number = this.ctx.measureText(map).width / 2;
        this.ctx.fillText(map, this.w / 2 - mapHalfTextWidth, 30);

        ctx.font = '20px Chalkduster, fantasy';

        ctx.fillStyle = 'yellow';
        const treasureString: string = 'Treasure';
        const treasureHalfTextWidth: number = this.ctx.measureText(treasureString).width / 2;
        this.ctx.fillText(treasureString, this.w / 2 - treasureHalfTextWidth, headerHeight);

        ctx.fillStyle = 'green';
        const exitString: string = 'Exit';
        const exitTextWidth: number = this.ctx.measureText(exitString).width;
        this.ctx.fillText(exitString, this.w / 2 + treasureHalfTextWidth + exitTextWidth, headerHeight);

        const playerString: string = 'Player';
        ctx.fillStyle = 'orange';
        const playerTextWidth: number = this.ctx.measureText(playerString).width;
        this.ctx.fillText(playerString, this.w / 2 - treasureHalfTextWidth - playerTextWidth - exitTextWidth, headerHeight);

        const maxScale: number = Math.min(this.w / this.m.w, (this.h - headerHeight) / this.m.h);
        const offset: number = (this.w - (this.m.w * maxScale)) / 2;

        ctx.translate(offset, headerHeight);
        ctx.scale(maxScale, maxScale);

        this.m.drawAsMap();
        this.p1.render();

        for (let t of this.treasures) {
            if (!t.remove) {
                t.render();
            }
        }
    }

    private getMousePosition(): TSE.Math.IPoint {
        if (!this.p1.ms.p) {
            return null;
        }
        return {x: this.p1.ms.p.x - this.camera.x,
            y: this.p1.ms.p.y - this.camera.y};
    }

    private initPlayMazePartRotate() {
        const tempo: number = 264;
        const lead = [
            'A2  s',
            'Bb2 s'
        ];

        const sequence: any = new TinyMusic.Sequence(this.ac, tempo, lead);
        sequence.staccato = 0.2;
        sequence.gain.gain.value = 0.25;
        sequence.mid.frequency.value = 800;
        sequence.mid.gain.value = 3;
        sequence.loop = false;
        this.turnSequence = sequence;
    }

    private initPlayTreasureSound() {
        const tempo: number = 132;
        const lead = [
            'Bb4 s',
            'Ab4 s',
            'Bb4 s',
            'C5  eq'

        ];

        const sequence: any = new TinyMusic.Sequence(this.ac, tempo, lead);
        sequence.staccato = 0.2;
        sequence.gain.gain.value = 0.25;
        sequence.mid.frequency.value = 800;
        sequence.mid.gain.value = 3;
        sequence.loop = false;
        this.treasureSequence = sequence;
    }

    private initPlayWinSound(): void {
        const tempo: number = 132;
        const lead = [
            'Ab4 s',
            'A4  s',
            '- s',
            'Ab4 s',
            'A4  s',
            'C5  q'
        ];

        const sequence: any = new TinyMusic.Sequence(this.ac, tempo, lead);
        sequence.staccato = 0.2;
        sequence.gain.gain.value = 0.25;
        sequence.mid.frequency.value = 800;
        sequence.mid.gain.value = 3;
        sequence.loop = false;
        this.winSequence = sequence;
    }
}
