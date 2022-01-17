export const lp = <L, P>(l: L, p: P): L | P => {
  if (window.matchMedia("(orientation: portrait)").matches) {
    // you're in PORTRAIT mode
    return p;
  }
  if (window.matchMedia("(orientation: landscape)").matches) {
    // you're in LANDSCAPE mode
    return l;
  }
};

export const fitRect = (source: Rectangle, destination: Rectangle): Rectangle => {
  const { x: x1, y: y1, width: w1, height: h1 } = source;
  const { width: w2, height: h2 } = destination;

  const s = Math.min(w2 / w1, h2 / h1);

  return new Rectangle(x1, y1, Math.ceil(w1 * s), Math.ceil(h1 * s));
};

export const centerRect = (source: Rectangle, destination: Rectangle): Point => {
  const { width: w1, height: h1 } = source;
  const { width: w2, height: h2 } = destination;

  return new Point((w2 - w1) / 2, (h2 - h1) / 2);
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export class Point {
  public constructor(public x = 0, public y = 0) {}
}

export class Rectangle {
  public constructor(public x = 0, public y = 0, public width = 0, public height = 0) {}
}
