import { _decorator, Component, Node } from "cc";
import { Entity } from "./Entity";
import {
  Direction,
  getDirection,
  getDirectionFromRotation,
  getRotationFromDirection,
  IPoint,
  RotateDirection,
} from "../interfaces/IPoint";
const { ccclass, property } = _decorator;

@ccclass("Emitter")
export class Emitter extends Entity {
  outputDirections: Array<Direction>;
  lastOutputDirections: Array<Direction>;
  lastDirection: Direction;
  lastPosition: IPoint;

  constructor() {
    super(Direction.UP);
    this.lastDirection = this.direction;
    this.lastPosition = this.position;
    this.outputDirections = [Direction.UP];
    this.lastOutputDirections = [...this.outputDirections];
  }

  rotate(degrees: RotateDirection) {
    console.log("current dir", this.direction);
    console.log("last dir old", this.lastDirection);
    this.lastDirection = this.direction;
    this.lastOutputDirections = [...this.outputDirections];
    super.rotate(degrees);
    console.log("new dir", this.direction);
    console.log("last dir new", this.lastDirection);
    for (let i = 0; i < this.outputDirections.length; i++) {
      const oldRot = getRotationFromDirection(this.outputDirections[i]);
      console.log("old dir", i, this.outputDirections[i]);
      this.outputDirections[i] = getDirectionFromRotation(oldRot + degrees);
      console.log("new rot", i, this.outputDirections[i]);
    }
    console.log("update last output directions", this.lastOutputDirections);
  }
}
