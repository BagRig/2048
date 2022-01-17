import { Graphics, utils } from "pixi.js";
import gameconfig from "./gameconfig.json";

export class Ball extends Graphics {
  public color: number;
  public selected = false;
  public row: number;
  public column: number;
  public constructor() {
    super();
    this.color = this.getRndClr();
    this.beginFill(this.color);
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
