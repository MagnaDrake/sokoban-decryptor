import { _decorator, Component, Input, Label, Node } from "cc";
import { LevelSelector } from "./LevelSelector";
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

  levelSelector!: LevelSelector;

  setLabel(value: string) {
    this.levelLabel.string = value;
  }

  toggleLocked(value: boolean) {
    this.lockedSprite.active = value;
    if (value) {
      this.node.on(Input.EventType.TOUCH_START, () => {
        this.levelSelector.loadLevel(parseInt(this.levelLabel.string) - 1);
      });
    } else {
      this.node.off(Input.EventType.TOUCH_START);
    }
  }

  toggleClear(value: boolean) {
    this.clearSprite.active = value;
  }

  togglePerfect(value: boolean) {
    this.perfectSprite.active = value;
  }

  setListener(levelSelector: LevelSelector) {
    this.levelSelector = levelSelector;
    this.node.on(Input.EventType.TOUCH_START, () => {
    //   AudioManager.Instance.playOneShot(
    //     `${getAudioKeyString(AudioKeys.SFXUIClick)}`
    //   );
      levelSelector.loadLevel(parseInt(this.levelLabel.string) - 1);
    });
  }

  start() {}

  update(deltaTime: number) {}
}
