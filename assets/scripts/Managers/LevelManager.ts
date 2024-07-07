import { _decorator, Component, director, JsonAsset, Node } from "cc";
import { LevelData, readRawLevelData } from "../utils/LevelReader";
import { TutorialDialogue } from "../objects/TutorialDialogue";
const { ccclass, property } = _decorator;

@ccclass("LevelManager")
export class LevelManager extends Component {
  @property([JsonAsset])
  levels: JsonAsset[] = [];

  @property([TutorialDialogue])
  tutorialDialogues: TutorialDialogue[] = [];

  tutorialMap: Map<number, string>;

  levelData: Array<LevelData>;

  static _instance: LevelManager;

  public static get Instance(): LevelManager | undefined {
    const instance = this._instance;
    if (instance?.isValid) return instance;
  }

  public static set Instance(value: LevelManager) {
    this._instance = value;
  }

  protected onLoad(): void {
    const instance = LevelManager.Instance;

    if (instance?.isValid && instance !== this) {
      this.destroy();
      return;
    }

    if (!instance || !instance.isValid) {
      LevelManager.Instance = this;
      director.addPersistRootNode(this.node);
    }

    this.levelData = new Array<LevelData>();

    this.readLevels();
    this.tutorialMap = new Map();

    this.tutorialDialogues.map((item) => {
      this.tutorialMap.set(item.level, item.tutorialString);
    });
  }

  getTutorial(level: number) {
    console.log(this.tutorialMap);
    return this.tutorialMap.get(level);
  }

  readLevels() {
    this.levels.forEach((levelJson) => {
      if (levelJson !== undefined && levelJson !== null) {
        this.levelData.push(readRawLevelData(levelJson.json));
      }
    });
  }
}
