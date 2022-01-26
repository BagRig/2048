import { Application, Rectangle } from "pixi.js";
import { Orientation } from "./constants";
import { MainView } from "./main-view";
import manifest from "./manifest.json";
import { store } from "./store";
import { centerRect, clamp, fitRect, lp } from "./utils";

export class App extends Application {
  private _orientation: Orientation;
  private _gameDiv: HTMLDivElement;
  private _mainView: MainView;

  private _designBounds: Rectangle;
  private _viewBounds: Rectangle;
  private _viewScale: number;

  public constructor() {
    super({
      sharedTicker: true,
      sharedLoader: true,
      backgroundAlpha: 1,
      backgroundColor: 0x9bc97f,
      view: <HTMLCanvasElement>document.querySelector("#game_canvas"),
    });

    this._gameDiv = <HTMLDivElement>document.querySelector("#game_div");
    window.addEventListener("orientationchange", this.onResize);
    window.addEventListener("resize", this.onResize);

    this._mainView = new MainView();
    this.stage.addChild(this._mainView);

    this._startLoad();
    this.onResize();
  }

  public get designBounds(): Rectangle {
    return this._designBounds;
  }

  public get viewBounds(): Rectangle {
    return this._viewBounds;
  }

  public get viewScale(): number {
    return this._viewScale;
  }

  public onResize = (): void => {
    this._updateOrientation();
    this._resizeCanvas();
    this._resizeRenderer();
    this._calculateTransform();

    window.scroll(0, 0);

    this._mainView.scale.set(this._viewScale);
    this._mainView.rebuild();
  };

  private _startLoad(): void {
    this.loader.add("parrot", "assets/images/penguin.png");
    this.loader.onComplete.once(this._onLoadComplete, this);
    this.loader.load();
  }

  private _onLoadComplete(): void {
    this._mainView.build();
  }

  private _updateOrientation(): void {
    this._orientation = lp(Orientation.landscape, Orientation.portrait);
  }

  private _resizeCanvas(): void {
    const { innerWidth: W, innerHeight: H } = window;
    const { min: minRatio, max: maxRatio } = manifest.size.ratio;

    const currentRatio = Math.min(W / H, H / W);
    const clampedRatio = clamp(currentRatio, minRatio, maxRatio);
    const ratio = currentRatio / clampedRatio;

    const rect1 = new Rectangle(0, 0, W, H);
    const rect2 = {
      landscape: new Rectangle(0, 0, W * ratio, H),
      portrait: new Rectangle(0, 0, W, H * ratio),
    }[this._orientation];

    const rect = fitRect(rect2, rect1);
    const pos = centerRect(rect, rect1);

    this._gameDiv.style.width = rect.width + "px";
    this._gameDiv.style.height = rect.height + "px";
    this._gameDiv.style.left = pos.x + "px";
    this._gameDiv.style.top = pos.y + "px";
  }

  private _resizeRenderer(): void {
    const rect = this._gameDiv.getBoundingClientRect();

    this.renderer.resolution = window.devicePixelRatio;
    this.renderer.resize(rect.width, rect.height);
  }

  private _calculateTransform(): void {
    this._designBounds = this._getDesignBounds();
    this._viewScale = this._getViewScale();
    this._viewBounds = this._getViewBounds();
  }

  private _getDesignBounds(): Rectangle {
    const { size } = manifest;
    const { width, height } = lp(size.landscape, size.portrait);
    return new Rectangle(0, 0, width, height);
  }

  private _getViewScale(): number {
    const { width: baseWidth, height: baseHeight } = this._designBounds;
    const { width: rendererWidth, height: rendererHeight } = this.renderer.screen;
    return Math.min(rendererWidth / baseWidth, rendererHeight / baseHeight);
  }

  private _getViewBounds(): Rectangle {
    const { x, y, width, height } = this.renderer.screen;
    return new Rectangle(x, y, width / this._viewScale, height / this._viewScale);
  }
}

store.app = new App();
