import { Container, Graphics, Rectangle, Text } from "pixi.js";

export class Score extends Container {
  public bestscore = JSON.parse(localStorage.getItem("bestScore"));
  public bestscoretxt: Text;
  public scoretxt: Text;
  public score = 0;
  private _gr: Graphics;
  public constructor() {
    super();
    this.build();
  }

  public getBounds(): Rectangle {
    const x = -40;
    const y = 0;

    const width = 265;
    const height = 90;

    return new Rectangle(x, y, width, height);
  }

  public rebuild(): void {
    if (this._gr) {
      this._gr.clear();
      this._gr = null;
    }
    const { x, y, width, height } = this.getBounds();
    const gr = new Graphics();
    gr.beginFill(0xff00ff, 0.5);
    gr.drawRect(x, y, width, height);
    gr.endFill();
    this.addChild((this._gr = gr));
  }

  public build(): void {
    this.scoretxt = new Text(`Your score is ${this.score}`);
    this.bestscoretxt = new Text(`Your best score is ${this.bestscore}`);
    this.addChild(this.scoretxt);
    this.bestscoretxt.position.y = this.scoretxt.y + 50;
    this.bestscoretxt.position.x = this.bestscoretxt.x - 30;
    this.addChild(this.bestscoretxt);
  }

  public changeScore(number: number): number {
    this.score = this.score + number;
    this.scoretxt.text = `Your score is ${this.score}`;
    return this.score;
  }

  public changeBestScore(score: number): void {
    if (this.bestscore === null || score >= this.bestscore) {
      this.bestscore = score;
    }
    localStorage.setItem("bestScore", JSON.stringify(this.bestscore));
  }
}
