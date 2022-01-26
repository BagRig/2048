import { Container, Graphics, Rectangle } from "pixi.js";
import { Ball } from "./ball";
import gameconfig from "./gameconfig.json";

export class Queue extends Container {
  public theball: Ball;
  public queueballs: Ball[];
  private _gr: Graphics;
  public constructor() {
    super();

    this.build();
  }

  public getBounds(): Rectangle {
    const { queuesize, ballWidth } = gameconfig;
    const x = -ballWidth;
    const y = -ballWidth;
    const width = queuesize * ballWidth * 2 + (queuesize - 1) * 6;
    const height = ballWidth * 2;

    return new Rectangle(x, y, width, height);
  }

  public rebuild(): void {
    if (this._gr) {
      this._gr.clear();
      this._gr = null;
    }
    const { x, y, width, height } = this.getBounds();
    const gr = new Graphics();
    gr.beginFill(0xaa1111, 0.5);
    gr.drawRect(x, y, width, height);
    gr.endFill();
    this.addChild((this._gr = gr));
  }

  public build(): void {
    this.queueballs = [];
    for (let i = 0; i < gameconfig.queuesize; i++) {
      const ball = new Ball();

      ball.position.set(i * (ball.width + 6), 0);

      this.theball = ball;
      this.queueballs[i] = ball;

      this.addChild(this.theball);
    }
  }
  public genNewQueue(): void {
    this.removeChildren();
    this.build();
  }
}
