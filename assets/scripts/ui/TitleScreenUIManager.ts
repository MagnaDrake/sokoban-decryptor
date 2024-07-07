import {
  _decorator,
  Component,
  director,
  Label,
  Node,
  Sprite,
  SpriteFrame,
  tween,
  UIOpacity,
  Vec3,
} from "cc";
import { FRAME, moveTo } from "../utils/anim";
import { SaveLoader } from "../objects/SaveLoader";
import { isMobile } from "../utils/device";
import { UserDataManager } from "../Managers/UserDataManager";
import { ScreenSwipeController } from "../Managers/ScreenSwipeController";
import { LevelSelector } from "./LevelSelector/LevelSelector";
import {
  AudioKeys,
  AudioKeyStrings,
  AudioManager,
  getAudioKeyString,
} from "../Managers/AudioManager";
//import { BlackScreen } from "./BlackScreen";
//import { AudioKeys, AudioManager, getAudioKeyString } from "./AudioManager";
const { ccclass, property } = _decorator;

@ccclass("TitleScreenUIManager")
export class TitleScreenUIManager extends Component {
  @property(Sprite)
  titleBG: Sprite;

  @property([SpriteFrame])
  bgs: SpriteFrame[] = [];

  @property(Node)
  jellyHiddenAnchor!: Node;

  @property(Node)
  jellyVisibleAnchor!: Node;

  @property(Node)
  titleHiddenAnchor!: Node;

  @property(Node)
  titleVisibleAnchor!: Node;

  @property(Node)
  levelSelectorVisibleAnchor!: Node;

  @property(Node)
  levelSelectorHiddenAnchor!: Node;

  @property(Node)
  jellySprite!: Node;

  @property(Node)
  menuObjects!: Node;

  @property(Node)
  levelSelector!: Node;

  @property(Node)
  creditsLabels!: Node;

  @property(Node)
  loadSave!: Node;

  @property(Node)
  settingsPanel!: Node;

  @property(Label)
  vpadLabel: Label;

  @property(Node)
  replayContainerNode: Node;

  @property(Node)
  replayEndingNode: Node;

  @property(Node)
  nextPageButton: Node;

  @property(Node)
  exPopup: Node;

  fromGameplay = false;

  activeLevelPage = 0;

  protected onLoad(): void {
    this.jellySprite.setWorldPosition(this.jellyHiddenAnchor.worldPosition);
    this.levelSelector.setWorldPosition(
      this.levelSelectorHiddenAnchor.worldPosition
    );
    this.menuObjects.setWorldPosition(this.titleHiddenAnchor.worldPosition);
    this.creditsLabels.setWorldPosition(
      this.levelSelectorHiddenAnchor.worldPosition
    );
    this.loadSave.setWorldPosition(
      this.levelSelectorHiddenAnchor.worldPosition
    );

    this.settingsPanel.setWorldPosition(
      this.levelSelectorHiddenAnchor.worldPosition
    );

    UserDataManager.Instance.saveVpadSettings(isMobile);
  }
  start() {
    // AudioManager.Instance.play(
    //   `${getAudioKeyString(AudioKeys.BGMTitle)}`,
    //   0.6,
    //   true
    // );

    if (!this.fromGameplay) {
      this.showJellyMenu();
    }

    this.vpadLabel.string = UserDataManager.Instance.isVPadForceActive()
      ? "On"
      : "Off";

    this.updateLevelDisplay();

    //   this.blackScreen.toggleVisibility(false);
  }

  openLevelSelector(page = 0) {
    // AudioManager.Instance.playOneShot(
    //   `${getAudioKeyString(AudioKeys.SFXSweep)}-0`
    // );
    moveTo(this.jellySprite, this.jellyHiddenAnchor.worldPosition, 1);
    this.hideJellyMenu();
    moveTo(
      this.levelSelector,
      this.levelSelectorVisibleAnchor.worldPosition,
      1
    );

    this.levelSelector.getComponent(LevelSelector).showPage(page);

    this.activeLevelPage = page;
  }

  onClickCredits() {
    AudioManager.Instance.playOneShot(
      `${getAudioKeyString(AudioKeys.SFXUIClick)}`
    );

    // AudioManager.Instance.playOneShot(
    //   `${getAudioKeyString(AudioKeys.SFXSweep)}-0`
    // );
    moveTo(
      this.creditsLabels,
      this.levelSelectorVisibleAnchor.worldPosition,
      1
    );
    this.hideJellyMenu();
  }

  onHideCredits() {
    AudioManager.Instance.playOneShot(
      `${getAudioKeyString(AudioKeys.SFXUIClick)}`
    );
    // AudioManager.Instance.playOneShot(
    //   `${getAudioKeyString(AudioKeys.SFXSweep)}-1`
    // );
    moveTo(this.creditsLabels, this.levelSelectorHiddenAnchor.worldPosition, 1);
    this.showJellyMenu();
  }

  onStartGameClick() {
    this.openLevelSelector();
    AudioManager.Instance.playOneShot(
      `${getAudioKeyString(AudioKeys.SFXUIClick)}`
    );
  }

  onBackLevelSelectorClick() {
    this.closeLevelSelector();
  }

  closeLevelSelector() {
    AudioManager.Instance.playOneShot(
      `${getAudioKeyString(AudioKeys.SFXUIClick)}`
    );
    this.showJellyMenu();
    moveTo(this.levelSelector, this.levelSelectorHiddenAnchor.worldPosition, 1);
  }

  showLoadSave() {
    // AudioManager.Instance.playOneShot(
    //   `${getAudioKeyString(AudioKeys.SFXSweep)}-0`
    // );
    AudioManager.Instance.playOneShot(
      `${getAudioKeyString(AudioKeys.SFXUIClick)}`
    );
    // this.hideJellyMenu();
    this.hideJellyMenu();
    moveTo(this.loadSave, this.levelSelectorVisibleAnchor.worldPosition, 1);
  }

  hideJellyMenu() {
    moveTo(this.jellySprite, this.jellyHiddenAnchor.worldPosition, 1);
    moveTo(this.menuObjects, this.titleHiddenAnchor.worldPosition, 1);
  }

  showJellyMenu() {
    moveTo(this.jellySprite, this.jellyVisibleAnchor.worldPosition, 1);
    moveTo(this.menuObjects, this.titleVisibleAnchor.worldPosition, 1);
  }

  hideLoadSave() {
    AudioManager.Instance.playOneShot(
      `${getAudioKeyString(AudioKeys.SFXUIClick)}`
    );
    // AudioManager.Instance.playOneShot(
    //   `${getAudioKeyString(AudioKeys.SFXSweep)}-1`
    // );
    //  this.showJellyMenu();
    this.showJellyMenu();
    moveTo(this.loadSave, this.levelSelectorHiddenAnchor.worldPosition, 1);
    this.loadSave.getComponent(SaveLoader).resetBox();
  }

  toggleLoadingScreen(value: boolean) {
    // this.blackScreen.toggleVisibility(value);
  }

  showSettingsPanel() {
    // AudioManager.Instance.playOneShot(
    //   `${getAudioKeyString(AudioKeys.SFXSweep)}-0`
    // );
    AudioManager.Instance.playOneShot(
      `${getAudioKeyString(AudioKeys.SFXUIClick)}`
    );

    this.hideJellyMenu();
    moveTo(
      this.settingsPanel,
      this.levelSelectorVisibleAnchor.worldPosition,
      1
    );
  }

  hideSettingsPanel() {
    AudioManager.Instance.playOneShot(
      `${getAudioKeyString(AudioKeys.SFXUIClick)}`
    );
    // AudioManager.Instance.playOneShot(
    //   `${getAudioKeyString(AudioKeys.SFXSweep)}-1`
    // );
    this.showJellyMenu();
    moveTo(this.settingsPanel, this.levelSelectorHiddenAnchor.worldPosition, 1);
  }

  toggleVpad() {
    if (UserDataManager.Instance.isVPadForceActive()) {
      this.vpadLabel.string = "Off";
      UserDataManager.Instance.saveVpadSettings(false);
    } else {
      this.vpadLabel.string = "On";
      UserDataManager.Instance.saveVpadSettings(true);
    }

    AudioManager.Instance.playOneShot(
      `${getAudioKeyString(AudioKeys.SFXUIClick)}`
    );
  }

  toggleReplayEndingButtonVisibility(value: boolean) {
    if (value) {
      this.replayEndingNode.active = true;
      this.replayContainerNode.setPosition(
        new Vec3(-300, this.replayContainerNode.position.y, 0)
      );
    } else {
      this.replayEndingNode.active = false;
      this.replayContainerNode.setPosition(
        new Vec3(-128, this.replayContainerNode.position.y, 0)
      );
    }
  }

  toggleNextPageButtonVisibility(value: boolean) {
    if (value) {
      this.nextPageButton.active = true;
    } else {
      this.nextPageButton.active = false;
    }
  }

  onReplayIntro() {
    AudioManager.Instance.playOneShot(
      `${getAudioKeyString(AudioKeys.SFXUIClick)}`
    );

    const ss = ScreenSwipeController.Instance;

    ss.enterTransition();

    AudioManager.Instance.playOneShot(
      `${getAudioKeyString(AudioKeys.SFXSweep)}-1`
    );

    this.scheduleOnce(() => {
      director.loadScene("intro", () => {
        AudioManager.Instance.playOneShot(
          `${getAudioKeyString(AudioKeys.SFXSweep)}-0`
        );
        ss.exitTransition();
      });
    }, 1 * FRAME * 60);
  }

  onReplayEnding() {
    AudioManager.Instance.playOneShot(
      `${getAudioKeyString(AudioKeys.SFXUIClick)}`
    );
    const ss = ScreenSwipeController.Instance;

    ss.enterTransition();

    AudioManager.Instance.playOneShot(
      `${getAudioKeyString(AudioKeys.SFXSweep)}-1`
    );

    this.scheduleOnce(() => {
      director.loadScene("ending", () => {
        AudioManager.Instance.playOneShot(
          `${getAudioKeyString(AudioKeys.SFXSweep)}-0`
        );
        ss.exitTransition();
      });
    }, 1 * FRAME * 60);
  }

  onNextPage() {
    // todo read how many pages they are
    AudioManager.Instance.playOneShot(
      `${getAudioKeyString(AudioKeys.SFXUIClick)}`
    );
    this.activeLevelPage++;
    if (this.activeLevelPage > 1) this.activeLevelPage = 0;
    this.levelSelector
      .getComponent(LevelSelector)
      .showPage(this.activeLevelPage);
  }

  toggleBackgroundChange(value: boolean) {
    if (!value) {
      this.titleBG.spriteFrame = this.bgs[0];
    } else {
      this.titleBG.spriteFrame = this.bgs[1];
    }
  }

  showExPopup() {
    moveTo(this.exPopup, this.levelSelectorVisibleAnchor.worldPosition, 1);
    localStorage.setItem("expopup", "true");
  }

  closeExPopup() {
    AudioManager.Instance.playOneShot(
      `${getAudioKeyString(AudioKeys.SFXUIClick)}`
    );
    this.exPopup.active = false;
  }

  updateLevelDisplay() {
    this.scheduleOnce(() => {
      const hasFinishedGame =
        UserDataManager.Instance.getUserData().hasFinishedGame;

      const hasWatchedEnding =
        UserDataManager.Instance.getUserData().hasWatchedEnding;

      this.toggleNextPageButtonVisibility(hasFinishedGame);
      this.toggleReplayEndingButtonVisibility(hasFinishedGame);
      this.toggleBackgroundChange(hasFinishedGame && hasWatchedEnding);

      const hasShownEXPopup = localStorage.getItem("expopup");
      if (hasWatchedEnding && !hasShownEXPopup) {
        this.showExPopup();
      }
    }, FRAME);
  }
}
