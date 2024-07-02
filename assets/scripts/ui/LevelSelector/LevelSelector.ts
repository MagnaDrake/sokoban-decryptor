import { _decorator, Component, director, instantiate, Node, Prefab } from "cc";
import { LevelItem } from "./LevelItem";
import { TitleScreenUIManager } from "../TitleScreenUIManager";
import { GameManager } from "../../Managers/GameManager";
import { ScreenSwipeController } from "../../Managers/ScreenSwipeController";
import { FRAME } from "../../utils/anim";
//import { GameManager } from "./GameManager";
//import { TitleScreenUIManager } from "./TitleScreenUIManager";
//import { AudioKeys, AudioManager, getAudioKeyString } from "./AudioManager";
//import { UserDataManager } from "./UserDataManager";
const { ccclass, property } = _decorator;

export interface UserSaveData {
  completedLevels: number[];
  perfectLevels: number[];
}

@ccclass("LevelSelector")
export class LevelSelector extends Component {
  @property(Node)
  levelsContainer!: Node;

  @property(Prefab)
  levelItem!: Prefab;

  @property(TitleScreenUIManager)
  tsm!: TitleScreenUIManager;

  saveData!: UserSaveData;

  protected onLoad(): void {
    this.generateLevelGrid();
  }

  generateLevelGrid() {
    //   this.saveData = UserDataManager.Instance.getUserData();

    this.createLevelItems(50);
  }

  createLevelItems(amount: number) {
    for (let i = 0; i < amount; i++) {
      const levelItem = instantiate(this.levelItem);
      levelItem.setParent(this.levelsContainer);
      levelItem.active = true;

      const clearLevels = this.saveData?.completedLevels?.length || 0;
      const threshold = (Math.floor(clearLevels / 3) + 1) * 5;

      if (i < threshold) {
        levelItem.getComponent(LevelItem)?.toggleLocked(false);
        levelItem.getComponent(LevelItem)?.setLabel((i + 1).toString());
        levelItem.getComponent(LevelItem)?.setListener(this);
        if (this.saveData?.completedLevels?.includes(i)) {
          levelItem.getComponent(LevelItem)?.toggleClear(true);
          if (this.saveData?.perfectLevels?.includes(i)) {
            levelItem.getComponent(LevelItem)?.togglePerfect(true);
          }
        }
      } else {
        levelItem.getComponent(LevelItem)?.toggleLocked(true);
      }
    }
  }

  loadLevel(level: number) {
    //this.tsm!.toggleLoadingScreen(true);
    // AudioManager.Instance.playOneShot(
    //   `${getAudioKeyString(AudioKeys.SFXSweep)}-1`
    // );

    // AudioManager.Instance.stop();
    const ss = ScreenSwipeController.Instance;
    ss.enterTransition();
    this.scheduleOnce(() => {
      director.loadScene("gameplay", (e, scene) => {
        const gm = GameManager.Instance.loadLevelData(level);
        ss.exitTransition();
      });
    }, FRAME * 60);
  }

  loadLevelGenerator() {
    // AudioManager.Instance.stop();
    director.loadScene("levelGen", (e, scene) => {});
  }
  start() {}

  update(deltaTime: number) {}
}
