import { Container, Graphics, Text } from "pixi.js";
import gameconfig from "./gameconfig.json";

export class Cell extends Container {
  public rect = new Graphics();
  public numbertxt: Text;
  public row: number;
  public column: number;

  public constructor(row: number, column: number) {
    super();
    this.row = row;
    this.column = column;
    this.numbertxt = new Text("");
    this.build();
  }

  public rebuild(): void {
    //
  }

  public build(): void {
    this.createCell();
  }

  public createCell(): void {
    this.rect.beginFill(0xffffff);
    this.rect.drawRoundedRect(
      -gameconfig.cellWidth / 2 + 4,
      -gameconfig.cellWidth / 2 + 4,
      gameconfig.cellWidth,
      gameconfig.cellWidth,
      0
    );
    this.addChild(this.rect);
    if (parseInt(this.numbertxt.text) >= 99999) {
      this.numbertxt.scale.set(0.7, 0.7);
    }
    this.numbertxt.position.set(
      -(this.numbertxt.width - gameconfig.celloffset) / 2,
      -(this.numbertxt.height - gameconfig.celloffset) / 2
    );
    this.addChild(this.numbertxt);
  }

  public replaceText(text: string): void {
    this.numbertxt.text = text;
    if (parseInt(this.numbertxt.text) >= 99999) {
      this.numbertxt.scale.set(0.7, 0.7);
    }
    this.numbertxt.position.set(
      -(this.numbertxt.width - gameconfig.celloffset) / 2,
      -(this.numbertxt.height - gameconfig.celloffset) / 2
    );
  }

  public removeText(): void {
    this.numbertxt.text = "";
  }
}
