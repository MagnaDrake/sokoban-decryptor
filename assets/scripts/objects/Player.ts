import { _decorator, Component, Node } from "cc";
import { Entity } from "./Entity";
import { getDirectionVector } from "../interfaces/IPoint";
const { ccclass, property } = _decorator;

@ccclass("Player")
export class Player extends Entity {
  getPosInFront() {
    const dirVec = getDirectionVector(this.direction);
    return { x: this.position.x + dirVec.x, y: this.position.y + dirVec.y };
  }
}
