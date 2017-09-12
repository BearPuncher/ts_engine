import * as TSE from '../../lib';
import {IScore} from "./level";

export class EndScreen extends TSE.Stage {

    private gameOver: string = 'YOU ESCAPED!';
    public scores: IScore[];

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

        this.ctx.font = '30px Blippo, fantasy';
        const scoreTitleString: string = 'Scores';
        const halfScoreTitleWidth: number = this.ctx.measureText(scoreTitleString).width / 2;
        this.ctx.fillText(
            scoreTitleString, this.w / 2 - halfScoreTitleWidth,
            textHeighjtStart);

        textHeighjtStart += 40;

        let level = 1;

        for (const score of this.scores) {
            this.ctx.font = '20px Blippo, fantasy';
            const scoreString: string = 'Level ' + level + ': ' + score.foundTreasure + '/' + score.treasure + ' treasures   Time: ' + score.time;
            const halfScoreWidth: number = this.ctx.measureText(scoreString).width / 2;
            this.ctx.fillText(
                scoreString, this.w / 2 - halfScoreWidth,
                textHeighjtStart);
            textHeighjtStart += 30;
            level++;
        }

        this.ctx.restore();
    }
}