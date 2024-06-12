import { _decorator, Component, Node, Vec2, Vec3 } from "cc";
import {
  Direction,
  getDirection,
  getDirectionFromRotation,
  getRotationFromDirection,
  IPoint,
  RotateDirection,
  VECTOR_RIGHT,
} from "../interfaces/IPoint";
const { ccclass, property } = _decorator;

@ccclass("Entity")
export class Entity extends Component {
  position: IPoint;
  direction: Direction;

  constructor(direction = Direction.RIGHT) {
    super();
    this.direction = direction;
  }

  moveToWorldPos(x: number, y: number) {
    this.node.setPosition(new Vec3(x, y, 0));
  }

  changeDirection(x: number, y: number) {
    this.direction = getDirection(x, y);
    this.node.setRotationFromEuler(
      0,
      0,
      getRotationFromDirection(this.direction)
    );
  }

  rotate(degrees: RotateDirection) {
    const zRot = this.node.eulerAngles.z;
    this.node.setRotationFromEuler(0, 0, zRot + degrees);
    this.direction = getDirectionFromRotation(degrees + zRot);
  }
}
