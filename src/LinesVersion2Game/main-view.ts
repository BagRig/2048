import { Container, Graphics, Rectangle } from "pixi.js";
import { Board } from "./board";
import gameconfig from "./gameconfig.json";
import { Queue } from "./queue";
import { Score } from "./score";
import { store } from "./store";

export class MainView extends Container {
  private _builded: boolean;
  private _gr: Graphics;
  private _board: Board;
  private _queue: Queue;
  private _score: Score;

  public getBounds(): Rectangle {
    const { x, y, width, height } = this._gr;

    return new Rectangle(x, y, width, height);
  }

  public setScale(scale: number): void {
    this.scale.set(scale);
    this.rebuild();
  }

  public rebuild(): void {
    if (!this._builded) {
      return;
    }

    this._board.rebuild();
    this._queue.rebuild();
    this._score.rebuild();

    this._repositionBoard();
    this._repositionQueue();
    this._repositionScore();

    if (this._gr) {
      this._gr.clear();
      this._gr = null;
    }
    this._buildArea();
  }

  public build(): void {
    this._buildQueue();
    this._buildScore();
    this._buildBoard();

    this._builded = true;
    this._buildArea();
    this.rebuild();
  }

  private _buildBoard(): void {
    this._board = new Board();
    this._board.queue = this._queue;
    this._board.score = this._score;
    this.addChild(this._board);
  }

  private _buildQueue(): void {
    this._queue = new Queue();
    this.addChild(this._queue);
  }

  private _buildScore(): void {
    this._score = new Score();
    this.addChild(this._score);
  }

  private _repositionBoard(): void {
    this._centralize(this._board, { x: gameconfig.cellWidth / 2, y: gameconfig.cellWidth / 2 });
  }

  private _repositionQueue(): void {
    this._centralize(this._queue, { x: 32.5, y: -this._board.height / 2 - 100 });
  }

  private _repositionScore(): void {
    this._centralize(this._score, { x: 32.5, y: this._board.height / 2 + 100 });
  }

  private _centralize(target: Container, offset: { x: number; y: number }): void {
    const { width, height } = store.app.viewBounds;

    target.position.set((width - target.width) / 2 + offset.x, (height - target.height) / 2 + offset.y);
  }

  private _buildArea(): void {
    const { cellWidth, ballWidth } = gameconfig;

    const x = this._board.x - cellWidth / 2;
    const y = this._queue.y - ballWidth;
    const width = this._board.width;
    const height = this._score.y + this._score.height - y;

    const gr = new Graphics();
    gr.beginFill(0x11aa11, 0.5);
    gr.drawRect(x, y, width, height);
    gr.endFill();
    this.addChild((this._gr = gr));
  }
}
