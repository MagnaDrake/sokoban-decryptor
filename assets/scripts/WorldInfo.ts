import {
  _decorator,
  Component,
  director,
  instantiate,
  Node,
  Prefab,
  CCBoolean,
  CCString,
  CCInteger,
  Color,
} from "cc";

const { ccclass, property } = _decorator;

@ccclass("WorldInfo")
export class WorldInfo {
  @property(CCString)
  title: string;

  @property(CCInteger)
  levelAmount: number;

  @property(Color)
  color: Color = new Color(0, 0, 0);
}
