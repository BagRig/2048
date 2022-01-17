import sampleSize from "lodash.samplesize";
import { Container } from "pixi.js";
import { Ball } from "./ball";
import { Cell } from "./cell";
import gameconfig from "./gameconfig.json";
import { Queue } from "./queue";

export class Board extends Container {
  public matrix: number[][];
  public queue: Queue;
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
    this.createBoard();
    this.placeInitialBalls();
    this.createBoardMatrix();
    console.warn(this.matrix);
  }

  public createBoardMatrix(): void {
    const matrix = [];
    for (let i = 0; i < gameconfig.boardsize; i++) {
      const row = [];
      for (let j = 0; j < gameconfig.boardsize; j++) {
        if (this.cells[j][i].cellsball) {
          switch (this.cells[j][i].cellsball.color) {
            case 0xe59866: {
              row[j] = 1;
              break;
            }
            case 0xf4d03f: {
              row[j] = 2;
              break;
            }
            case 0x3498db: {
              row[j] = 3;
              break;
            }
            case 0x0074ff: {
              row[j] = 4;
              break;
            }
            case 0xc0392b: {
              row[j] = 5;
              break;
            }
            case 0x8e44ad: {
              row[j] = 6;
              break;
            }
          }
        } else {
          row[j] = 0;
        }
      }
      matrix.push(row);
    }
    this.matrix = matrix;
  }

  public updateMatrix(matrix: number[][]): void {
    for (let i = 0; i < gameconfig.boardsize; i++) {
      for (let j = 0; j < gameconfig.boardsize; j++) {
        if (this.cells[j][i].cellsball) {
          switch (this.cells[j][i].cellsball.color) {
            case 0xe59866: {
              matrix[i][j] = 1;
              break;
            }
            case 0xf4d03f: {
              matrix[i][j] = 2;
              break;
            }
            case 0x3498db: {
              matrix[i][j] = 3;
              break;
            }
            case 0x0074ff: {
              matrix[i][j] = 4;
              break;
            }
            case 0xc0392b: {
              matrix[i][j] = 5;
              break;
            }
            case 0x8e44ad: {
              matrix[i][j] = 6;
              break;
            }
          }
        } else {
          matrix[i][j] = 0;
        }
      }
    }
  }

  public createBoard(): void {
    this.cells = [];

    for (let i = 0; i < gameconfig.boardsize; i++) {
      this.cells[i] = [];

      for (let j = 0; j < gameconfig.boardsize; j++) {
        const cell = new Cell(i, j);
        cell.position.set(i * (cell.width + gameconfig.celloffset), j * (cell.height + gameconfig.celloffset));
        this.cells[i][j] = cell;
        cell.interactive = true;
        cell.on("pointerdown", () => {
          this.onClickLogic(cell);
          this.updateMatrix(this.matrix);
          console.warn(this.matrix);
        });
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

  public placingBallsFromQueue(): void {
    let count = 0;
    const arr = this.getEmptyCells();
    const arrIJ = sampleSize(arr, gameconfig.queuesize);
    arrIJ.forEach((el) => {
      console.log(el);
      const ball = this.queue.queueballs[count];
      ball.x = 0;
      count++;
      this.cells[el.row][el.column].placeBall(ball);
    });
    this.queue.genNewQueue();
  } // places ball from queue

  public onClickLogic(cell: Cell): void {
    if (this.savedball && cell.cellsball) {
      this.savedball = cell.cellsball;
    } else if (!this.savedball && cell.cellsball) {
      this.savedball = cell.cellsball;
    } else if (!this.savedball && !cell.cellsball) {
    } else {
      this.cells[this.savedball.row][this.savedball.column].removeBall();
      cell.placeBall(this.savedball);
      this.placingBallsFromQueue();
      this.savedball = null;
    }
  } //on click logic of cells
} // end of class
