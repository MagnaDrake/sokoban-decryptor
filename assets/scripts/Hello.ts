import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Hello")
export class Hello extends Component {
  start() {
    console.log("Save the Con, Jelly!");
  }

  update(deltaTime: number) {}
}
