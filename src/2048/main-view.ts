import { Container } from "pixi.js";
import { Board } from "./board";
import gameconfig from "./gameconfig.json";
import { Score } from "./score";
import { store } from "./store";

export class MainView extends Container {
  private _builded: boolean;
  private _board: Board;
  private _score: Score;

  public rebuild(): void {
    if (!this._builded) {
      return;
    }

    this._repositionBoard();
    this._repositionScore();

    this._board.rebuild();
    this._score.rebuild();
  }

  public build(): void {
    this._buildScore();
    this._buildBoard();

    this._builded = true;
    this.rebuild();
  }

  private _buildBoard(): void {
    this._board = new Board();
    this.addChild(this._board);
  }

  private _buildScore(): void {
    this._score = new Score();
    this.addChild(this._score);
  }

  private _repositionBoard(): void {
    this._centralize(this._board, {
      x: gameconfig.cellWidth / 2,
      y: gameconfig.cellWidth / 2,
    });
  }

  private _repositionScore(): void {
    this._centralize(this._score, { x: 0, y: this._board.height / 2 + 100 });
  }

  private _centralize(target: Container, offset: { x: number; y: number }): void {
    const { width, height } = store.app.viewBounds;

    target.position.set((width - target.width) / 2 + offset.x, (height - target.height) / 2 + offset.y);
  }
}
