import { _decorator, Component, Node } from "cc";
import { Emitter } from "./Emitter";
const { ccclass, property } = _decorator;

@ccclass("Splitter")
export class Splitter extends Emitter {
  _active = false;

  constructor(blocksPanel: boolean) {
    super(blocksPanel);
  }

  set active(value: boolean) {
    this._active = value;
    this.blocksPanel = value;
  }

  get active() {
    return this._active;
  }
}
