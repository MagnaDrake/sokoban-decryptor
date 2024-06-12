import { _decorator, Component, Node } from "cc";
import { Command } from "./Command";
import { Emitter } from "../objects/Emitter";
import { Direction, IPoint } from "../interfaces/IPoint";
import { Panel } from "../objects/Panel";
import { GridManager } from "../Managers/GridManager";
const { ccclass, property } = _decorator;

@ccclass("DeactivatePanelsCommand")
export class DeactivatePanelsCommand implements Command {
  emitter: Emitter;
  position: IPoint;
  outputDirections: Array<Direction>;
  lastOutputDirections: Array<Direction>;
  activatedPanels: Array<Panel>;

  constructor(emitter: Emitter) {
    this.emitter = emitter;
    this.outputDirections = emitter.outputDirections;
    this.position = emitter.lastPosition;
  }

  execute() {
    this.activatedPanels = new Array<Panel>();
    const gridManager = GridManager.Instance;
    this.outputDirections.forEach((direction) => {
      const panels = gridManager.getPanelsInDirection(this.position, direction);
      this.activatedPanels.push(...panels);
    });
    this.activatedPanels.forEach((panel) => {
      console.log(panel.position);
    });

    this.activatedPanels.forEach((panel) => {
      panel.active = false;
    });
  }

  undo() {
    console.log("undo deactivate");
    this.activatedPanels.forEach((panel) => {
      panel.active = true;
    });
  }
}
