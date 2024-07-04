import { _decorator, Component, Enum, Node, UITransform } from "cc";
import { Entity } from "./Entity";
import {
  Direction,
  getDirection,
  getDirectionFromRotation,
  getRotationFromDirection,
  IPoint,
  RotateDirection,
} from "../interfaces/IPoint";
import { getEmitterSpriteFromAttributes } from "../utils/LevelReader";
import { AudioKeys, AudioManager } from "../Managers/AudioManager";
const { ccclass, property } = _decorator;

export enum EmitterTypes {
  SINGLE,
  L_CURVE,
  J_CURVE,
  T_JUNCTION,
  QUAD,
  DOUBLE,
  ZERO,
}

Enum(EmitterTypes);

@ccclass("Emitter")
export class Emitter extends Entity {
  outputDirections: Array<Direction>;
  lastOutputDirections: Array<Direction>;
  lastDirection: Direction;
  lastPosition: IPoint;

  @property({ type: EmitterTypes })
  type: EmitterTypes;

  @property([Node])
  emitterProngs: Node[] = [];

  constructor(blocksPanel = false) {
    super(Direction.UP, true, true, blocksPanel);
    this.lastDirection = undefined;
    this.lastPosition = undefined;
    this.outputDirections = [Direction.UP];
    this.lastOutputDirections = [];
  }

  setEmitterSprite(isSplitter = false) {
    const key = getEmitterSpriteFromAttributes(
      isSplitter,
      this.moveable,
      this.rotatable
    );

    this.entitySprite.spriteFrame =
      this.entitySprite.spriteAtlas.getSpriteFrame(`${key}`);
    this.entitySprite.node.getComponent(UITransform).setContentSize(48, 48);
  }

  setOutputDirections(type: EmitterTypes) {
    this.type = type;
    switch (type) {
      case EmitterTypes.SINGLE:
        this.outputDirections = [Direction.UP];
        break;
      case EmitterTypes.L_CURVE:
        this.outputDirections = [Direction.UP, Direction.RIGHT];
        break;
      case EmitterTypes.J_CURVE:
        this.outputDirections = [Direction.UP, Direction.LEFT];
        break;
      case EmitterTypes.T_JUNCTION:
        this.outputDirections = [Direction.UP, Direction.RIGHT, Direction.LEFT];
        break;
      case EmitterTypes.QUAD:
        this.outputDirections = [
          Direction.UP,
          Direction.RIGHT,
          Direction.DOWN,
          Direction.LEFT,
        ];
        break;
      case EmitterTypes.DOUBLE:
        this.outputDirections = [Direction.UP, Direction.DOWN];
        break;
      case EmitterTypes.ZERO:
        this.outputDirections = [];
        break;
    }
    this.outputDirections.forEach((dir) => {
      this.emitterProngs[dir].active = true;
    });
  }

  changeDirection(x: number, y: number): void {
    super.changeDirection(x, y);
    const degrees = getRotationFromDirection(this.direction);
    for (let i = 0; i < this.outputDirections.length; i++) {
      const oldRot = getRotationFromDirection(this.outputDirections[i]);
      //console.log("old dir", i, this.outputDirections[i]);
      this.outputDirections[i] = getDirectionFromRotation(oldRot + degrees);
      // console.log("new rot", i, this.outputDirections[i]);
    }
  }

  rotate(degrees: RotateDirection) {
    // console.log("current dir", this.direction);
    // console.log("last dir old", this.lastDirection);
    this.lastDirection = this.direction;
    this.lastOutputDirections = [...this.outputDirections];
    super.rotate(degrees);
    // console.log("new dir", this.direction);
    // console.log("last dir new", this.lastDirection);
    for (let i = 0; i < this.outputDirections.length; i++) {
      const oldRot = getRotationFromDirection(this.outputDirections[i]);
      //console.log("old dir", i, this.outputDirections[i]);
      this.outputDirections[i] = getDirectionFromRotation(oldRot + degrees);
      // console.log("new rot", i, this.outputDirections[i]);
    }
    // console.log("update last output directions", this.lastOutputDirections);
  }

  onRotate(): void {
    AudioManager.Instance.playOneShotRandom(AudioKeys.SFXRotate);
  }
}
