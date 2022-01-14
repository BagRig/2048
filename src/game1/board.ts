import sampleSize from "lodash.samplesize";
import { Container } from "pixi.js";
import { Ball } from "./ball";
import { Cell } from "./cell";
import gameconfig from "./gameconfig.json";

export class Board extends Container {
  public matrix: number[][];
  public savedball: Ball;
  public cells: Cell[][];
  public constructor() {
    super();
    this.build();
  }

  public rebuild(): void {
    //
  }

  public build(): void {
    //this.createBoardMatrix();
    this.createBoard();
    this.placeInitialBalls();
  }

  // public createBoardMatrix(): void {
  //   const matrix = [];
  //   for (let i = 0; i < gameconfig.boardsize; i++) {
  //     const row = [];
  //     for (let j = 0; j < gameconfig.boardsize; j++) {
  //       row.push(0);
  //     }
  //     matrix.push(row);
  //   }
  //   this.matrix = matrix;
  // }

  public createBoard(): void {
    this.cells = [];

    for (let i = 0; i < gameconfig.boardsize; i++) {
      this.cells[i] = [];

      for (let j = 0; j < gameconfig.boardsize; j++) {
        const cell = new Cell(i, j);
        cell.position.set(i * (cell.width + gameconfig.celloffset), j * (cell.height + gameconfig.celloffset));
        this.cells[i][j] = cell;
        cell.interactive = true;
        this.addChild(cell);
      }
    }
  } // creates board

  public placeInitialBalls(): void {
    const { boardsize, initailballs } = gameconfig;

    const arr = Array.from(Array(Math.pow(boardsize, 2)).keys());

    const arrIJ = sampleSize(arr, initailballs);

    arrIJ.forEach((el) => {
      const j = Math.floor(el / boardsize);
      const i = el % boardsize;

      const ball = new Ball();
      this.cells[i][j].placeBall(ball);
    });
  } // places initial balls

  public getOneDimensionalArrCells(): Cell[] {
    const arr: Cell[] = [];

    this.cells.forEach((row) => {
      row.forEach((cell) => {
        arr.push(cell);
      });
    });

    return arr;
  } // return cells matrix as one demensional array of cells

  public getEmptyCells(): Cell[] {
    return this.getOneDimensionalArrCells().filter((cell) => cell.isEmpty());
  } // returns array of cells that dont have a ball in them

  // public clickcontrol(cell: Cell): void {
  //   if (cell.cellsball) {
  //     cell.cellsball.scale.set(0.5, 0.5);
  //     this.afterclickplace();
  //   }
  // }

  // public afterclickplace(): void {
  //   const { boardsize } = gameconfig;

  //   const arr = Array.from(Array(Math.pow(boardsize, 2)).keys());

  //   const arrIJ = sampleSize(arr, 3);

  //   arrIJ.forEach((el) => {
  //     const j = Math.floor(el / boardsize);
  //     const i = el % boardsize;
  //     if (!this.cells[i][j].cellsball) {
  //       const ball = new Ball();
  //       this.cells[i][j].placeBall(ball);
  //     }
  //   });
  //}
} // end of class
