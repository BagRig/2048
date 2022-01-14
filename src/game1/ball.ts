import { Graphics, utils } from "pixi.js";
import gameconfig from "./gameconfig.json";

export class Ball extends Graphics {
  public selected = false;
  public constructor() {
    super();
    this.beginFill(this.getRndClr());
    this.drawCircle(0, 0, gameconfig.ballWidth);
  }

  public getRndClr(): number {
    return utils.string2hex(gameconfig.arr[Math.floor(Math.random() * gameconfig.arr.length)]);
  }

  public select(): void {
    this.selected = true;
  }

  public deselect(): void {
    this.selected = false;
  }

  public isSelected(): boolean {
    return this.selected;
  }
}
