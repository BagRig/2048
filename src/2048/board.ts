import sampleSize from "lodash.samplesize";
import { Container, Graphics } from "pixi.js";
import { Cell } from "./cell";
import gameconfig from "./gameconfig.json";

export class Board extends Container {
  public tiles: Cell[][];
  public constructor() {
    super();
    this.build();
  }

  public rebuild(): void {
    console.warn("main view rebuild");
  }

  public build(): void {
    console.warn("main view build");
    this.makeBoard();
    const arr = this.getEmptyTilesArr();
    this.addInitialText(arr);
    this.onclickLogic();
  }

  public makeBoard(): void {
    this.tiles = [];
    for (let i = 0; i < gameconfig.boardsize; i++) {
      this.tiles[i] = [];
      for (let j = 0; j < gameconfig.boardsize; j++) {
        const cell = new Cell(i, j);
        const background = new Graphics();
        background.beginFill(0x000000);
        background.drawRoundedRect(
          -gameconfig.cellWidth / 2,
          -gameconfig.cellWidth / 2,
          gameconfig.cellWidth + 8,
          gameconfig.cellWidth + 8,
          0
        );
        background.position.set(
          j * (background.width + gameconfig.celloffset),
          i * (background.height + gameconfig.celloffset)
        );

        this.addChild(background);
        cell.position.set(
          j * (background.width + gameconfig.celloffset),
          i * (background.height + gameconfig.celloffset)
        );
        this.tiles[i][j] = cell;
        this.addChild(cell);
      }
    }
  }

  public convtoDM(tiles: Cell[][]): number[][] {
    return tiles.map((row) => row.map((cell) => +cell.numbertxt.text));
  }

  public onclickLogic(): void {
    let dm = this.convtoDM(this.tiles);
    addEventListener(
      "keyup",
      (event) => {
        if (event.defaultPrevented) {
          return;
        }
        if (event.code === "ArrowDown") {
          dm = this.merge(dm, "Down");
          this.applyToTiles(dm);
          this.addNewTextToBoard(this.getEmptyTilesArr(), dm);
        } else if (event.code === "ArrowUp") {
          dm = this.merge(dm, "Up");
          this.applyToTiles(dm);
          this.addNewTextToBoard(this.getEmptyTilesArr(), dm);
        } else if (event.code === "ArrowLeft") {
          dm = this.merge(dm, "Left");
          this.applyToTiles(dm);
          this.addNewTextToBoard(this.getEmptyTilesArr(), dm);
        } else if (event.code === "ArrowRight") {
          dm = this.merge(dm, "Right");
          this.applyToTiles(dm);
          this.addNewTextToBoard(this.getEmptyTilesArr(), dm);
        }
        event.preventDefault();
      },
      true
    );
    // apply dm matrix to tiles matrix
  }

  public getEmptyTilesArr(): number[][] {
    const arr = [];
    for (let i = 0; i < gameconfig.boardsize; i++) {
      for (let j = 0; j < gameconfig.boardsize; j++) {
        if (this.tiles[i][j].numbertxt.text == "") {
          arr.push([i, j]);
        }
      }
    }
    return arr;
  }

  public addInitialText(arr: number[][]): void {
    const arrIJ = sampleSize(arr, gameconfig.initialText);
    arrIJ.forEach((el) => {
      this.tiles[el[0]][el[1]].replaceText("2");
    });
  }

  public addNewTextToBoard(arr: number[][], dm: number[][]): void {
    const arrIJ = sampleSize(arr, 1);
    arrIJ.forEach((el) => {
      dm[el[0]][el[1]] = 2;
      this.applyToTiles(dm);
    });
  }

  public makeNoZero(arr: number[]): number[] {
    const nozero = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] !== 0) {
        nozero.push(arr[i]);
      }
    }
    return nozero;
  }

  public plusing(arr: number[]): number[] {
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1] || arr[i] === 0) {
        arr[i] = arr[i] + arr[i + 1];
        arr[i + 1] = 0;
        i++;
      }
    }
    arr = this.makeNoZero(arr);
    return arr;
  }

  public mergeLeft(dm: number[][]): number[][] {
    for (let i = 0; i < dm.length; i++) {
      const nz = this.makeNoZero(dm[i]);
      const m = this.plusing(nz);
      for (let i = 0; i < gameconfig.boardsize; i++) {
        if (i >= m.length) {
          m.push(0);
        }
      }
      dm[i] = m;
    }
    return dm;
  }

  public merge(dm: number[][], vector: string): number[][] {
    if (vector == "Right") {
      for (let i = 0; i < dm.length; i++) {
        dm[i].reverse();
      }
      this.mergeLeft(dm);
      for (let i = 0; i < dm.length; i++) {
        dm[i].reverse();
      }
    } else if (vector == "Up") {
      dm = this.rotateMat90b(dm);
      this.mergeLeft(dm);
      dm = this.rotateMat90(dm);
    } else if (vector == "Down") {
      dm = this.rotateMat90(dm);
      this.mergeLeft(dm);
      dm = this.rotateMat90b(dm);
    } else {
      this.mergeLeft(dm);
    }
    return dm;
  }

  public rotateMat90(dm: number[][]): number[][] {
    const destination = new Array(dm.length);
    for (let i = 0; i < dm.length; i++) {
      destination[i] = new Array(dm.length);
    }

    // start copying from source into destination
    for (let i = 0; i < dm.length; i++) {
      for (let j = 0; j < dm.length; j++) {
        destination[i][j] = dm[dm.length - j - 1][i];
      }
    }

    // return the destination matrix
    return destination;
  }

  public rotateMat90b(dm: number[][]): number[][] {
    const destination = new Array(dm.length);
    for (let i = 0; i < dm.length; i++) {
      destination[i] = new Array(dm.length);
    }

    // start copying from source into destination
    for (let i = 0; i < dm.length; i++) {
      for (let j = 0; j < dm.length; j++) {
        destination[i][j] = dm[j][dm.length - i - 1];
      }
    }

    // return the destination matrix
    return destination;
  }

  public applyToTiles(dm: number[][]): void {
    for (let i = 0; i < dm.length; i++) {
      for (let j = 0; j < dm[i].length; j++) {
        if (dm[i][j] !== 0) {
          this.tiles[i][j].numbertxt.text = dm[i][j].toString();
          this.tiles[i][j].numbertxt.position.set(
            -(this.tiles[i][j].numbertxt.width - gameconfig.celloffset) / 2,
            -(this.tiles[i][j].numbertxt.height - gameconfig.celloffset) / 2
          );
        } else {
          this.tiles[i][j].numbertxt.text = "";
        }
      }
    }
  }
}
