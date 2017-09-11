import * as TSE from '../../lib';
import * as TinyMusic from '../../../node_modules/tinymusic';

export class StartScreen extends TSE.Stage {

    private gameName: string = 'TWISTED TUNNELS';
    private leadSequence: any;

    public init():void {
        super.init();
        let ac: AudioContext = new AudioContext;
        // get the current Web Audio timestamp (this is when playback should begin)
        let tempo: number = 132;
        let lead = [
                'C3  e',
                'C3  e',
                'Db3 e',
                'C3  e',
                'Db3 e',
                'C3  e',
                'Eb3 e',
                'D3  e',

                'C3  e',
                'C3  e',
                'B2  e',
                'Bb2 e',
                'A2  h',

                'C3  e',
                'C3  e',
                'Db3 e',
                'C3  e',
                'Db3 e',
                'C3  e',
                'Eb3 e',
                'D3  e',

                'C3  e',
                'Db3 e',
                'D3  e',
                'Db3 e',
                'C3  h',

                'D3  e',
                'F3  q',
                'D3  e',
                'G3  q',
                'D3  e',
                'F3  q',
                'D3  e',
                'G3  q',

                'D3  q',
                'F3  q',
            ];
        this.leadSequence = new TinyMusic.Sequence(ac, tempo, lead);
        this.leadSequence.staccato = 0.55;
        this.leadSequence.gain.gain.value = 1.0 / 2;
        this.leadSequence.mid.frequency.value = 800;
        this.leadSequence.mid.gain.value = 3;
        let when: number = ac.currentTime;
        this.leadSequence.play(when);
    }

    public update(step: number): void {
        super.update(step);
        const controls: TSE.Controller = new TSE.Controller();

        // Toggle map mode
        if (controls.isPressed(TSE.Controller.keys.ENTER)) {
            this.finished = true;
            this.leadSequence.stop();
        }
    }

    public render(): void {
        super.render();
        this.ctx.save();
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.w, this.h);
        this.ctx.font = '64px Arial';
        this.ctx.fillStyle = 'white';
        const halfTextWidth: number = this.ctx.measureText(this.gameName).width / 2;
        this.ctx.fillText(
            this.gameName, this.w / 2 - halfTextWidth,
            this.h / 2);
        this.ctx.restore();
    }
}