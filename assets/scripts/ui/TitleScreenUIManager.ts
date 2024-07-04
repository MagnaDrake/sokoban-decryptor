import { _decorator, Component, Label, Node, tween, UIOpacity } from "cc";
import { moveTo } from "../utils/anim";
import { SaveLoader } from "../objects/SaveLoader";
import { isMobile } from "../utils/device";
import { UserDataManager } from "../Managers/UserDataManager";
//import { BlackScreen } from "./BlackScreen";
//import { AudioKeys, AudioManager, getAudioKeyString } from "./AudioManager";
const { ccclass, property } = _decorator;

@ccclass("TitleScreenUIManager")
export class TitleScreenUIManager extends Component {
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

  fromGameplay = false;

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
    //   this.blackScreen.toggleVisibility(false);
  }

  openLevelSelector() {
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
  }

  onClickCredits() {
    // AudioManager.Instance.playOneShot(
    //   `${getAudioKeyString(AudioKeys.SFXUIClick)}`
    // );

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
    // AudioManager.Instance.playOneShot(
    //   `${getAudioKeyString(AudioKeys.SFXUIClick)}`
    // );
    // AudioManager.Instance.playOneShot(
    //   `${getAudioKeyString(AudioKeys.SFXSweep)}-1`
    // );
    moveTo(this.creditsLabels, this.levelSelectorHiddenAnchor.worldPosition, 1);
    this.showJellyMenu();
  }

  onStartGameClick() {
    this.openLevelSelector();
    // AudioManager.Instance.playOneShot(
    //   `${getAudioKeyString(AudioKeys.SFXUIClick)}`
    // );
  }

  onBackLevelSelectorClick() {
    this.closeLevelSelector();
    // AudioManager.Instance.playOneShot(
    //   `${getAudioKeyString(AudioKeys.SFXUIClick)}`
    // );
  }

  closeLevelSelector() {
    // AudioManager.Instance.playOneShot(
    //   `${getAudioKeyString(AudioKeys.SFXSweep)}-1`
    // );
    this.showJellyMenu();
    moveTo(this.levelSelector, this.levelSelectorHiddenAnchor.worldPosition, 1);
  }

  showLoadSave() {
    // AudioManager.Instance.playOneShot(
    //   `${getAudioKeyString(AudioKeys.SFXSweep)}-0`
    // );
    // AudioManager.Instance.playOneShot(
    //   `${getAudioKeyString(AudioKeys.SFXUIClick)}`
    // );
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
    // AudioManager.Instance.playOneShot(
    //   `${getAudioKeyString(AudioKeys.SFXUIClick)}`
    // );
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
    // AudioManager.Instance.playOneShot(
    //   `${getAudioKeyString(AudioKeys.SFXUIClick)}`
    // );

    this.hideJellyMenu();
    moveTo(
      this.settingsPanel,
      this.levelSelectorVisibleAnchor.worldPosition,
      1
    );
  }

  hideSettingsPanel() {
    // AudioManager.Instance.playOneShot(
    //   `${getAudioKeyString(AudioKeys.SFXUIClick)}`
    // );
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
  }

  update(deltaTime: number) {}
}
