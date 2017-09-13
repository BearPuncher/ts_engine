import * as TSE from '../../lib';
import {IScore} from "./level";

export class EndScreen extends TSE.Stage {

    private gameOver: string = 'YOU ESCAPED!';
    public scores: IScore[];

    private totalTreasures: number = 0;
    private totalTreasureFound: number = 0;
    private time: number = 0;

    public update(step: number): void {
        super.update(step);
        const controls: TSE.Controller = new TSE.Controller();

        let totalTreasures: number = 0;
        let totalTreasureFound: number = 0;
        let time: number = 0;

        for (const score of this.scores) {
            // totals
            totalTreasureFound += score.foundTreasure;
            totalTreasures += score.treasure;
            time += score.time;
        }

        this.totalTreasures = totalTreasures;
        this.totalTreasureFound = totalTreasureFound;
        this.time = time;

        const d = new Date(1000 * Math.round(this.time / 1000));
        const timeString: string = d.getUTCMinutes()
                .toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
            + ':' + d.getUTCSeconds()
                .toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});

        let url: string = 'https://twitter.com/intent/tweet?text=';
        url +=  'I found ' + this.totalTreasureFound + ' of '+ this.totalTreasures + 'treasures in ' + timeString + '! #TwistedTunnels #js13kgames';

        if (controls.isPressed(TSE.Controller.keys.R)) {
            this.finished = true;
        }
    }

    public render(): void {
        super.render();
        this.ctx.save();
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.w, this.h);
        this.ctx.font = '40px Blippo, fantasy';
        this.ctx.fillStyle = 'white';
        let textHeighjtStart = 50;
        const halfTextWidth: number = this.ctx.measureText(this.gameOver).width / 2;
        this.ctx.fillText(
            this.gameOver, this.w / 2 - halfTextWidth,
            textHeighjtStart);
        textHeighjtStart += 50;

        let level = 1;

        for (const score of this.scores) {
            this.ctx.font = '20px Blippo, fantasy';
            const scoreString: string = 'Level ' + level + ':  ' + score.foundTreasure + '/' + score.treasure + ' treasures   Time:  ' + score.timeString;
            const halfScoreWidth: number = this.ctx.measureText(scoreString).width / 2;
            this.ctx.fillText(
                scoreString, this.w / 2 - halfScoreWidth,
                textHeighjtStart);
            textHeighjtStart += 30;

            level++;
        }

        const d = new Date(1000 * Math.round(this.time / 1000));
        const timeString: string = d.getUTCMinutes()
                .toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
            + ':' + d.getUTCSeconds()
                .toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});

        textHeighjtStart += 30;
        this.ctx.font = '30px Blippo, fantasy';
        const finalScoreString: string = 'Final Score:  ' + this.totalTreasureFound + '/' + this.totalTreasures + ' treasures   ';
        const finalScoreWidth: number = this.ctx.measureText(finalScoreString).width / 2;
        this.ctx.fillText(
            finalScoreString, this.w / 2 - finalScoreWidth,
            textHeighjtStart);

        textHeighjtStart += 40;
        const finalTimeString: string = 'Total Time:  ' + timeString;
        const finalTimeWidth: number = this.ctx.measureText(finalTimeString).width / 2;
        this.ctx.fillText(
            finalTimeString, this.w / 2 - finalTimeWidth,
            textHeighjtStart);

        textHeighjtStart += 60;
        const restartString: string = 'R to Restart';
        const restartStringWidth: number = this.ctx.measureText(restartString).width / 2;
        this.ctx.fillText(
            restartString, this.w / 2 - restartStringWidth,
            textHeighjtStart);

        this.ctx.restore();
    }
}