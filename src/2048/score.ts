import { Container, Sprite } from "pixi.js";

export class Score extends Container {
  private _sprite: Sprite;

  public constructor() {
    super();
  }

  public rebuild(): void {
    console.warn("main view rebuild");
  }

  public build(): void {
    console.warn("main view build");
  }
}
