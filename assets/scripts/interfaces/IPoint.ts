export interface IPoint {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

export const VECTOR_UP: IPoint = {
  x: 0,
  y: 1,
};

export const VECTOR_DOWN: IPoint = {
  x: 0,
  y: -1,
};

export const VECTOR_LEFT: IPoint = {
  x: -1,
  y: 0,
};

export const VECTOR_RIGHT: IPoint = {
  x: 1,
  y: 0,
};

export function getDirection(x: number, y: number) {
  if (x === 0) {
    return y < 0 ? Direction.DOWN : Direction.UP;
  } else {
    return x < 0 ? Direction.LEFT : Direction.RIGHT;
  }
}

export function getDirectionVector(dir: Direction) {
  switch (dir) {
    case Direction.UP:
      return VECTOR_UP;
    case Direction.DOWN:
      return VECTOR_DOWN;
    case Direction.LEFT:
      return VECTOR_LEFT;
    case Direction.RIGHT:
      return VECTOR_RIGHT;
  }
}

export function getRotationFromDirection(dir: Direction) {
  switch (dir) {
    case Direction.UP:
      return 360;
    case Direction.DOWN:
      return 180;
    case Direction.LEFT:
      return 90;
    case Direction.RIGHT:
      return 270;
  }
}

export function getDirectionFromRotation(rot: number) {
  // console.log("get dir from rot", rot);
  if (rot < 0) rot += 360;
  switch ((rot / 90) % 4) {
    case 0:
      return Direction.UP;
    case 2:
      return Direction.DOWN;
    case 1:
      return Direction.LEFT;
    case 3:
      return Direction.RIGHT;
  }
}

export enum RotateDirection {
  CLOCKWISE = -90,
  COUNTER_CLOCKWISE = 90,
}
