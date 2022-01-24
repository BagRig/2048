import sampleSize from "lodash.samplesize";
import PF from "pathfinding";
import { Container } from "pixi.js";
import { Ball } from "./ball";
import { Cell } from "./cell";
import gameconfig from "./gameconfig.json";
import { Queue } from "./queue";
import { Score } from "./score";

export class Board extends Container {
  public matrix: number[][];
  public queue: Queue;
  public score: Score;
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
  }

  public createBoardMatrix(): void {
    const matrix = [];
    for (let i = 0; i < gameconfig.boardsize; i++) {
      const row = [];
      for (let j = 0; j < gameconfig.boardsize; j++) {
        if (this.cells[i][j].cellsball) {
          switch (this.cells[i][j].cellsball.color) {
            case 0xb24040: {
              row[j] = 1;
              break;
            }
            case 0x4fa436: {
              row[j] = 2;
              break;
            }
            case 0xa847be: {
              row[j] = 3;
              break;
            }
            case 0x4c61cf: {
              row[j] = 4;
              break;
            }
            case 0x46accd: {
              row[j] = 5;
              break;
            }
            case 0xb88a41: {
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
        if (this.cells[i][j].cellsball) {
          switch (this.cells[i][j].cellsball.color) {
            case 0xb24040: {
              matrix[i][j] = 1;
              break;
            }
            case 0x4fa436: {
              matrix[i][j] = 2;
              break;
            }
            case 0xa847be: {
              matrix[i][j] = 3;
              break;
            }
            case 0x4c61cf: {
              matrix[i][j] = 4;
              break;
            }
            case 0x46accd: {
              matrix[i][j] = 5;
              break;
            }
            case 0xb88a41: {
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

  public getBoolMatrix(): number[][] {
    const arr = [];
    for (let i = 0; i < gameconfig.boardsize; i++) {
      const row = [];
      for (let j = 0; j < gameconfig.boardsize; j++) {
        if (this.cells[i][j].cellsball) {
          row.push(1);
        } else {
          row.push(0);
        }
      }
      arr.push(row);
    }
    return arr;
  }

  public findPathFromXtoY(matrix: number[][], i1: number, i2: number, j1: number, j2: number): number[][] {
    const grid = new PF.Grid(matrix);
    const finder = new PF.AStarFinder();
    const path = finder.findPath(j1, i1, j2, i2, grid);
    return path;
  }

  public createBoard(): void {
    this.cells = [];

    for (let i = 0; i < gameconfig.boardsize; i++) {
      this.cells[i] = [];

      for (let j = 0; j < gameconfig.boardsize; j++) {
        const cell = new Cell(i, j);
        cell.position.set(j * (cell.width + gameconfig.celloffset), i * (cell.height + gameconfig.celloffset));
        this.cells[i][j] = cell;
        cell.interactive = true;
        cell.on("pointerdown", () => {
          this.onClickLogic(cell);
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
      const ball = this.queue.queueballs[count];
      ball.x = 0;
      count++;
      this.cells[el.row][el.column].placeBall(ball);
    });
    this.queue.genNewQueue();
  }
  // places ball from queue

  public onClickLogic(cell: Cell): void {
    if (this.savedball && cell.cellsball) {
      //
      this.savedball.lineStyle(5, 0x000000);
      this.savedball.drawCircle(0, 0, gameconfig.ballWidth);
      // unpaint stroke
      this.savedball = cell.cellsball; //save new ball
      //
      this.savedball.lineStyle(5, 0xffffff);
      this.savedball.drawCircle(0, 0, gameconfig.ballWidth);
      // paint new stroke
    } else if (!this.savedball && cell.cellsball) {
      //
      this.savedball = cell.cellsball;
      // save the ball
      //
      this.savedball.lineStyle(5, 0xffffff);
      this.savedball.drawCircle(0, 0, gameconfig.ballWidth);
      // paint stroke
    } else if (!this.savedball && !cell.cellsball) {
      // do nothing
    } else {
      const arr = this.getBoolMatrix();
      const path = this.findPathFromXtoY(arr, this.savedball.row, cell.row, this.savedball.column, cell.column);
      this.moveBall(path, cell);
    }
  } //on click logic of cells

  public getHorizontalCombo(row: number, column: number): number[][] {
    const combo = [];
    for (let i = column; i < gameconfig.boardsize - 1; i++) {
      if (this.matrix[row][i] === this.matrix[row][i + 1] && this.matrix[row][i] != 0) {
        combo.push([row, i + 1]);
      } else {
        break;
      }
    }
    for (let i = column; i > 0; i--) {
      if (this.matrix[row][i] === this.matrix[row][i - 1] && this.matrix[row][i] != 0) {
        combo.push([row, i - 1]);
      } else {
        break;
      }
    }
    combo.push([row, column]);
    return combo;
  }

  public getVerticalCombo(row: number, column: number): number[][] {
    const combo = [];
    for (let i = row; i < gameconfig.boardsize - 1; i++) {
      if (this.matrix[i][column] === this.matrix[i + 1][column] && this.matrix[i][column] != 0) {
        combo.push([i + 1, column]);
      } else {
        break;
      }
    }
    for (let i = row; i > 0; i--) {
      if (this.matrix[i][column] === this.matrix[i - 1][column] && this.matrix[i][column] != 0) {
        combo.push([i - 1, column]);
      } else {
        break;
      }
    }
    combo.push([row, column]);
    return combo;
  }

  public checkCombos(row: number, column: number, path: number[][]): void {
    const arr1 = this.getHorizontalCombo(row, column);
    const arr2 = this.getVerticalCombo(row, column);
    let counter = 0;
    if (arr1.length >= gameconfig.combosize && arr2.length >= gameconfig.combosize) {
      console.log("delete all");
      arr1.forEach((el) => {
        if (this.cells[el[0]][el[1]].cellsball) {
          this.cells[el[0]][el[1]].cellsball.destroy();
          this.cells[el[0]][el[1]].removeBall();
          counter++;
        }
      });
      arr2.forEach((el) => {
        if (this.cells[el[0]][el[1]].cellsball) {
          this.cells[el[0]][el[1]].cellsball.destroy();
          this.cells[el[0]][el[1]].removeBall();
          counter++;
        }
      });
    } else if (arr1.length >= gameconfig.combosize && arr2.length < gameconfig.combosize) {
      console.log("delete horizontal");
      arr1.forEach((el) => {
        if (this.cells[el[0]][el[1]].cellsball) {
          this.cells[el[0]][el[1]].cellsball.destroy();
          this.cells[el[0]][el[1]].removeBall();
          counter++;
        }
      });
    } else if (arr1.length < gameconfig.combosize && arr2.length >= gameconfig.combosize) {
      console.log("delete vertical");
      arr2.forEach((el) => {
        if (this.cells[el[0]][el[1]].cellsball) {
          this.cells[el[0]][el[1]].cellsball.destroy();
          this.cells[el[0]][el[1]].removeBall();
          counter++;
        }
      });
    } else {
      console.log("no valid combos");
      if (path.length !== 0) {
        this.placingBallsFromQueue();
      }
    }

    this.score.changeBestScore(this.score.changeScore(counter));
  }

  public async moveBall(path: number[][], cell: Cell): Promise<void> {
    for await (const entry of path) {
      this.cells.forEach((element) => {
        element.forEach((el) => {
          el.interactive = false;
        });
      });
      await this.moveSingleBall(entry);
    }
    this.cells.forEach((element) => {
      element.forEach((el) => {
        el.interactive = true;
      });
    });
    for (let i = 0; i < path.length - 1; i++) {
      this.cells[path[i][1]][path[i][0]].removeBall();
    }
    this.balling(cell, path);
  }

  public moveSingleBall(entry: number[]): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.cells[entry[1]][entry[0]].placeBall(this.savedball);
        resolve();
      }, 100);
    });
  }
  public balling(cell: Cell, path: number[][]): void {
    this.savedball.lineStyle(5, 0x000000);
    this.savedball.drawCircle(0, 0, gameconfig.ballWidth);
    this.updateMatrix(this.matrix);
    this.checkCombos(cell.row, cell.column, path);
    if (this.getEmptyCells().length === 0) {
      console.log("Game Over");
      this.cells.forEach((element) => {
        element.forEach((el) => {
          el.interactive = false;
        });
      });
    }
    this.savedball = null;
  }
} // end of class
