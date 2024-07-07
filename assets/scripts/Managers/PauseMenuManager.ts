import { _decorator, Component, director, Label, Node, Vec3 } from "cc";
import { GameManager } from "./GameManager";
import { TitleScreenUIManager } from "../ui/TitleScreenUIManager";
import { isMobile } from "../utils/device";
import { VirtualDpadController } from "../objects/VirtualDpad/VirtualDpadController";
import { ScreenSwipeController } from "./ScreenSwipeController";
import { FRAME, moveTo, moveToLocal } from "../utils/anim";
import { AudioKeys, AudioManager, getAudioKeyString } from "./AudioManager";
import { UserDataManager } from "./UserDataManager";
const { ccclass, property } = _decorator;

@ccclass("PauseMenuManager")
export class PauseMenuManager extends Component {
  @property(Node)
  pauseMenuButton: Node;

  @property(Node)
  pauseMenuContainer: Node;

  @property(Node)
  settingsContainer: Node;

  @property(Label)
  virtualDpadToggleLabel: Label;

  @property(VirtualDpadController)
  vdp: VirtualDpadController;

  isPause = false;

  isVirtualDpadOn = false;

  // TODO
  // pause menu managers should not immediately handle virtual dpad
  // but technically it can if its called GAMEPLAY SETTINGS manager.
  // we'll think about it later.
  onLoad(): void {
    const userPrefs = UserDataManager.Instance.isVPadForceActive();

    if (userPrefs === undefined) {
      if (isMobile) {
        this.vdp.active = true;
        this.virtualDpadToggleLabel.string = "On";
        this.isVirtualDpadOn = true;
      } else {
        this.vdp.active = false;
        this.virtualDpadToggleLabel.string = "Off";
        this.isVirtualDpadOn = false;
      }
    } else {
      this.vdp.active = userPrefs;
      this.virtualDpadToggleLabel.string = userPrefs ? "On" : "Off";
      this.isVirtualDpadOn = userPrefs;
    }
    this.pauseMenuContainer.active = true;
  }

  onPauseButtonClick() {
    AudioManager.Instance.playOneShot(
      `${getAudioKeyString(AudioKeys.SFXUIClick)}`
    );
    if (this.isPause) {
      this.reset();
    } else {
      this.openPause();
    }
  }

  openPause() {
    this.isPause = true;
    moveToLocal(this.pauseMenuContainer, new Vec3(0, 0, 0), FRAME * 30);
    this.settingsContainer.active = false;
  }

  reset() {
    this.isPause = false;
    moveToLocal(this.pauseMenuContainer, new Vec3(0, 800, 0), FRAME * 30);
    this.settingsContainer.active = false;
  }

  onRestartClick() {
    this.reset();
    GameManager.Instance.onRestartLevelKeyInput();
  }

  // TODO a lot of overlapping methods in loading scenes
  // should have a helper function to do that instead
  // later
  onBackClick() {
    AudioManager.Instance.playOneShot(
      `${getAudioKeyString(AudioKeys.SFXUIClick)}`
    );
    const ss = ScreenSwipeController.Instance;
    ss.flip = true;
    ss.enterTransition();
    AudioManager.Instance.playOneShot(
      `${getAudioKeyString(AudioKeys.SFXSweep)}-1`
    );
    this.scheduleOnce(() => {
      director.loadScene("title", (e, scene) => {
        const uiManager = scene?.getComponentInChildren(TitleScreenUIManager);
        uiManager!.fromGameplay = true;
        uiManager?.toggleLoadingScreen(false);
        uiManager?.openLevelSelector();
        AudioManager.Instance.stop();
        AudioManager.Instance.play(
          getAudioKeyString(AudioKeys.BGMTitle),
          1,
          true
        );
      });
      ss.exitTransition();
      AudioManager.Instance.playOneShot(
        `${getAudioKeyString(AudioKeys.SFXSweep)}-0`
      );
    }, FRAME * 60);
  }

  onSettingsClick() {
    AudioManager.Instance.playOneShot(
      `${getAudioKeyString(AudioKeys.SFXUIClick)}`
    );
    this.pauseMenuContainer.active = false;
    this.settingsContainer.active = true;
  }

  onCloseSettingsClick() {
    AudioManager.Instance.playOneShot(
      `${getAudioKeyString(AudioKeys.SFXUIClick)}`
    );
    this.pauseMenuContainer.active = true;
    this.settingsContainer.active = false;
  }

  onVirtualDpadToggle() {
    AudioManager.Instance.playOneShot(
      `${getAudioKeyString(AudioKeys.SFXUIClick)}`
    );
    if (this.isVirtualDpadOn) {
      this.vdp.active = false;
      this.virtualDpadToggleLabel.string = "Off";
      this.isVirtualDpadOn = false;
    } else {
      this.vdp.active = true;
      this.virtualDpadToggleLabel.string = "On";
      this.isVirtualDpadOn = true;
    }
  }
}
