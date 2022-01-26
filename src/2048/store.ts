import { App } from "./app";

class Store {
  private _app: App;

  public get app(): App {
    return this._app;
  }

  public set app(value: App) {
    this._app = value;
  }
}

export const store = new Store();
