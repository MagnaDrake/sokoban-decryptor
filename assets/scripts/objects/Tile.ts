import { _decorator, Component, Label, Node } from "cc";
import { Entity } from "./Entity";
import { IPoint } from "../interfaces/IPoint";
const { ccclass, property } = _decorator;

@ccclass("Tile")
export class Tile extends Component {
  traversable: boolean;
  entities: Array<Entity>;
  position: IPoint;

  @property(Label)
  debugLabel: Label;

  constructor(traversable = true) {
    super();
    this.entities = new Array<Entity>();
    this.traversable = traversable;
  }
}
