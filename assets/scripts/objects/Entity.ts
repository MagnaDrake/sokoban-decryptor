import { _decorator, Component, Node, Sprite, Vec2, Vec3 } from "cc";
import {
  Direction,
  getDirection,
  getDirectionFromRotation,
  getRotationFromDirection,
  IPoint,
  RotateDirection,
} from "../interfaces/IPoint";
import { FRAME, moveToLocal, rotate, rotateEulerZ } from "../utils/anim";
const { ccclass, property } = _decorator;

@ccclass("Entity")
export class Entity extends Component {
  position: IPoint;
  direction: Direction;
  moveable: boolean;
  rotatable: boolean;
  blocksPanel: boolean;

  @property(Sprite)
  entitySprite: Sprite;

  constructor(
    direction = Direction.RIGHT,
    moveable = true,
    rotatable = true,
    blocksPanel = false
  ) {
    super();
    this.direction = direction;
    this.moveable = moveable;
    this.rotatable = rotatable;
    this.blocksPanel = blocksPanel;
  }

  moveToWorldPos(x: number, y: number) {
    moveToLocal(this.node, new Vec3(x, y, 0), 4 * FRAME, () => {
      this.onMove();
    });
    //this.node.setPosition(new Vec3(x, y, 0));
  }

  changeDirection(x: number, y: number) {
    this.direction = getDirection(x, y);
    const vec = new Vec3(0, 0, getRotationFromDirection(this.direction));
    rotate(this.node, vec, FRAME * 2, () => {
      this.node.setRotationFromEuler(vec);
      this.onRotate();
    });

    // this.node.setRotationFromEuler(
    //   0,
    //   0,
    //   getRotationFromDirection(this.direction)
    // );
  }

  setMovableAndRotatable(movable: boolean, rotatable: boolean) {
    this.moveable = movable;
    this.rotatable = rotatable;
  }

  rotate(degrees: RotateDirection) {
    const zRot = this.node.eulerAngles.z;
    console.log("old zrot", zRot);
    const newRot = (zRot + degrees + 360) % 360;
    console.log("new zrot", newRot);
    rotateEulerZ(this.node, newRot, FRAME * 2, () => {
      this.direction = getDirectionFromRotation(newRot);
      this.node.setRotationFromEuler(0, 0, newRot);
      this.onRotate();
    });
    // this.node.setRotationFromEuler(0, 0, newRot);
    // this.direction = getDirectionFromRotation(newRot);
    // this.onRotate();
  }

  // rotate(degrees: RotateDirection) {
  //   const zRot = this.node.eulerAngles.z;
  //   const newRot = (zRot + degrees + 360) % 360;
  //   console.log("newrot", newRot);
  //   // jank
  //   const oldEuler = new Vec3(this.node.eulerAngles);
  //   this.node.setRotationFromEuler(0, 0, newRot);
  //   const newEuler = new Vec3(this.node.eulerAngles);
  //   this.node.setRotationFromEuler(oldEuler);

  //   rotate(this.node, newEuler, FRAME * 5, () => {
  //     this.direction = getDirectionFromRotation(newRot);
  //     this.onRotate();
  //   });
  //   //  this.direction = getDirectionFromRotation(newRot);
  //   //this.onRotate();
  // }

  onMove() {}

  onRotate() {}
}
