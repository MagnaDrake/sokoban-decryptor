import { _decorator, Button, Component, Input, Label, Node } from "cc";
import { LevelSelector } from "./LevelSelector";
import {
  AudioKeys,
  AudioManager,
  getAudioKeyString,
} from "../../Managers/AudioManager";
//import { AudioKeys, AudioManager, getAudioKeyString } from "./AudioManager";
const { ccclass, property } = _decorator;

@ccclass("LevelItem")
export class LevelItem extends Component {
  @property(Label)
  levelLabel!: Label;

  @property(Node)
  lockedSprite!: Node;

  @property(Node)
  perfectSprite!: Node;

  @property(Node)
  clearSprite!: Node;

  @property(Button)
  button: Button;

  levelSelector!: LevelSelector;

  setLabel(value: string) {
    this.levelLabel.string = value;
  }

  toggleLocked(value: boolean) {
    this.lockedSprite.active = value;
    this.button.interactable = !value;
    // if (value) {
    //   // this.node.on(Input.EventType.TOUCH_START, () => {
    //   //   this.levelSelector.loadLevel(parseInt(this.levelLabel.string) - 1);
    //   // });
    //   this.button.interactable = true;
    // } else {
    //   //this.node.off(Input.EventType.TOUCH_START);
    //   this.button.interactable = false;
    // }
  }

  loadLevel() {
    this.levelSelector.loadLevel(parseInt(this.levelLabel.string) - 1);
    AudioManager.Instance.playOneShot(
      `${getAudioKeyString(AudioKeys.SFXUIClick)}`
    );
  }

  toggleClear(value: boolean) {
    this.clearSprite.active = value;
  }

  togglePerfect(value: boolean) {
    this.perfectSprite.active = value;
  }

  setListener(levelSelector: LevelSelector) {
    this.levelSelector = levelSelector;
  }

  start() {}

  update(deltaTime: number) {}
}
