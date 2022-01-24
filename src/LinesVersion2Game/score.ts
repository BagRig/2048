import { Container, Text } from "pixi.js";

export class Score extends Container {
  public bestscore = JSON.parse(localStorage.getItem("bestScore"));
  public bestscoretxt: Text;
  public scoretxt: Text;
  public score = 0;
  public constructor() {
    super();
    this.build();
  }

  public rebuild(): void {
    console.log("score rebuild");
  }

  public build(): void {
    this.scoretxt = new Text(`Your score is ${this.score}`);
    this.bestscoretxt = new Text(`Your best score is ${this.bestscore}`);
    this.addChild(this.scoretxt);
    this.addChild(this.bestscoretxt);
    this.bestscoretxt.position.y = this.scoretxt.y + 50;
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
