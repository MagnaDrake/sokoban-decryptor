import { _decorator, Component, Node } from "cc";
import { Command } from "../Command";
import { ComicPanel } from "../../objects/ComicPanel";
const { ccclass, property } = _decorator;

@ccclass("ShowComicPanelCommand")
export class ShowComicPanelCommand implements Command {
  comicPanel: ComicPanel;

  constructor(comicPanel: ComicPanel) {
    this.comicPanel = comicPanel;
  }

  execute() {
    this.comicPanel.fadeIn();
  }

  undo() {}
}
