import { Container } from "pixi.js";

export class Score extends Container {
  public constructor() {
    super();
    this.build();
  }

  public rebuild(): void {
    console.log("score rebuild");
  }

  public build(): void {
    //
  }
}
