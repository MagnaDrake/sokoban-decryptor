import { _decorator, Component, Node } from "cc";
import { Command } from "./Command";
import { Entity } from "../objects/Entity";
import { GridManager } from "../Managers/GridManager";
const { ccclass, property } = _decorator;

@ccclass("MoveCommand")
export class MoveCommand implements Command {
  entity: Entity;
  lastX = 0;
  lastY = 0;
  x: number;
  y: number;
  originX: number;
  originY: number;

  constructor(
    entity: Entity,
    x: number,
    y: number,
    originX: number,
    originY: number
  ) {
    this.x = x;
    this.y = y;
    this.entity = entity;
    this.originX = originX;
    this.originY = originY;
  }

  execute() {
    this.lastX = this.entity.position.x;
    this.lastY = this.entity.position.y;

    GridManager.Instance.moveEntityTo(this.entity, this.x, this.y);
    GridManager.Instance.addEntityToTile(this.entity, this.x, this.y);
    GridManager.Instance.removeEntityFromTile(
      this.entity,
      this.originX,
      this.originY
    );
  }

  undo() {
    GridManager.Instance.moveEntityTo(this.entity, this.lastX, this.lastY);
    GridManager.Instance.addEntityToTile(this.entity, this.lastX, this.lastY);
    GridManager.Instance.removeEntityFromTile(this.entity, this.x, this.y);
  }
}
