import { _decorator, Component, Node } from "cc";
import { Emitter } from "./Emitter";
const { ccclass, property } = _decorator;

@ccclass("Splitter")
export class Splitter extends Emitter {
  _active = false;

  constructor(blocksPanel = true) {
    super(blocksPanel);
  }

  set active(value: boolean) {
    this._active = value;
    console.log("set splitter active", value);
  }

  get active() {
    return this._active;
  }

  onMove() {
    this.active = false;
    console.log("disable splitter on move");
  }
}
