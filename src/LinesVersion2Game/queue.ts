import { Container } from "pixi.js";
import { Ball } from "./ball";
import gameconfig from "./gameconfig.json";

export class Queue extends Container {
  public theball: Ball;
  public queueballs: Ball[];
  public constructor() {
    super();

    this.build();
  }

  public rebuild(): void {
    console.log("queue rebuild");
  }

  public build(): void {
    console.log("queue build");
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
