import { _decorator, CCInteger, CCString, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("TutorialDialogue")
export class TutorialDialogue {
  @property(CCInteger)
  level: number;

  @property(CCString)
  tutorialString: string;
}
