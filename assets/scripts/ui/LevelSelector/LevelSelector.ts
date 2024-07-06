import {
  _decorator,
  Component,
  director,
  instantiate,
  Node,
  Prefab,
  CCBoolean,
  CCString,
  Layout,
} from "cc";
import { LevelItem } from "./LevelItem";
import { GameManager } from "../../Managers/GameManager";
import { ScreenSwipeController } from "../../Managers/ScreenSwipeController";
import { FRAME } from "../../utils/anim";
import { UserDataManager } from "../../Managers/UserDataManager";
import { WorldInfo } from "../../WorldInfo";
import { LevelWorldContainer } from "../../objects/LevelWorldContainer";
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
  worldsContainer!: Node;

  @property(Prefab)
  levelItem!: Prefab;

  @property(Prefab)
  levelWorldContainer!: Prefab;

  @property(CCBoolean)
  unlockAllLevels!: boolean;

  @property([WorldInfo])
  worldTitles: WorldInfo[] = [];

  @property([Node])
  pages: Node[] = [];

  saveData!: UserSaveData;

  levelItems = [];

  worldsDisplays = [];

  currentPage = 0;

  protected onLoad(): void {
    this.generateLevelGrid();
  }

  generateLevelGrid() {
    this.saveData = UserDataManager.Instance.getUserData();

    this.createWorldDisplays();

    this.createLevelItems();

    // read world amount
    // read total level
    // create level item total
    // creat world items
    // assign level item to world
    // put world items to display layout

    // for extra world, instead create a separate level selector
    // then title ui manager switches between normal and extra
  }

  createWorldDisplays() {
    this.worldTitles.forEach((world, index) => {
      const worldDisplay = instantiate(this.levelWorldContainer);
      const worldItem = worldDisplay.getComponent(LevelWorldContainer);
      worldItem.setLineGraphicColor(world.color);
      worldItem.setLevelTitle(world.title);

      // TODO
      // should be a way to set which world goes to what page
      if (index < 3) {
        worldDisplay.setParent(this.pages[0]);
      } else {
        worldDisplay.setParent(this.pages[1]);
      }

      this.worldsDisplays.push(worldDisplay);
    });
  }
  // todo
  // think about how to scale these dynamically

  createLevelItems() {
    let amount = 0;
    let levelPerWorld = [];

    this.worldTitles.forEach((world) => {
      amount += world.levelAmount;
      const lv = amount + 0; //im not sure if i need to do this. i forgot if js numbers are referential or primitive
      levelPerWorld.push(lv);
    });

    let worldCounter = 0;

    for (let i = 0; i < amount; i++) {
      if (i >= levelPerWorld[worldCounter]) worldCounter++;

      // hardcoded that the 4th world are extra levels
      // in the future should be a way to define which world goes to what page

      const levelWorld =
        this.worldsDisplays[worldCounter].getComponent(LevelWorldContainer);

      const levelItem = instantiate(this.levelItem);

      levelWorld.addLevelItem(levelItem.getComponent(LevelItem));
      // levelItem.setParent(this.worldsContainer);
      levelItem.active = true;

      const clearLevels = this.saveData?.completedLevels?.length || 0;
      const threshold = this.unlockAllLevels
        ? 1000
        : (Math.floor(clearLevels / 3) + 1) * 5;

      if (i < threshold) {
        levelItem.getComponent(LevelItem)?.toggleLocked(false);
        levelItem.getComponent(LevelItem)?.setLabel((i + 1).toString());
        levelItem.getComponent(LevelItem)?.setListener(this);
        if (this.saveData?.completedLevels?.includes(i + 1)) {
          levelItem.getComponent(LevelItem)?.toggleClear(true);
          // if (this.saveData?.perfectLevels?.includes(i)) {
          //   levelItem.getComponent(LevelItem)?.togglePerfect(true);
          // }
        }
      } else {
        levelItem.getComponent(LevelItem)?.toggleLocked(true);
      }

      this.levelItems.push(levelItem);
    }
  }

  // definitely could combine these two methods
  // will optimize later
  //TODO

  updateLevelData() {
    this.saveData = UserDataManager.Instance.getUserData();

    for (let i = 0; i < this.levelItems.length; i++) {
      const item = this.levelItems[i];
      const clearLevels = this.saveData?.completedLevels?.length || 0;
      const threshold = (Math.floor(clearLevels / 3) + 1) * 5;

      if (i < threshold) {
        item.getComponent(LevelItem)?.toggleLocked(false);
        item.getComponent(LevelItem)?.setLabel((i + 1).toString());
        item.getComponent(LevelItem)?.setListener(this);
        if (this.saveData?.completedLevels?.includes(i + 1)) {
          item.getComponent(LevelItem)?.toggleClear(true);
          // if (this.saveData?.perfectLevels?.includes(i)) {
          //   levelItem.getComponent(LevelItem)?.togglePerfect(true);
          // }
        }
      } else {
        item.getComponent(LevelItem)?.toggleLocked(true);
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

  showPage(page: number) {
    this.pages[this.currentPage].active = false;
    this.currentPage = page;
    this.pages[this.currentPage].active = true;
  }

  update(deltaTime: number) {}
}
