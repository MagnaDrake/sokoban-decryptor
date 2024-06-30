import { _decorator, Component, Node } from "cc";
import { Command } from "./Command";
import { Entity } from "../objects/Entity";
import { Direction, getDirectionVector } from "../interfaces/IPoint";
const { ccclass, property } = _decorator;

@ccclass("RotateCommand")
export class RotateCommand implements Command {
  direction: Direction;
  lastDirection: Direction;
  entity: Entity;

  constructor(entity: Entity, direction: Direction) {
    this.entity = entity;
    this.direction = direction;
  }

  execute() {
    this.lastDirection = this.entity.direction;
    const vec = getDirectionVector(this.direction);
    //console.log("execute rotation", vec);

    this.entity.changeDirection(vec.x, vec.y);
  }

  undo() {
    const vec = getDirectionVector(this.lastDirection);
    //console.log("undo rotation", vec);
    this.entity.changeDirection(vec.x, vec.y);
  }
}
