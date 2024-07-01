import { _decorator, Component, director, Label, Node } from "cc";
import { GameManager } from "./GameManager";
import { TitleScreenUIManager } from "../ui/TitleScreenUIManager";
import { isMobile } from "../utils/device";
import { VirtualDpadController } from "../objects/VirtualDpad/VirtualDpadController";
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

  onLoad(): void {
    if (isMobile) {
      this.virtualDpadToggleLabel.string = "On";
      this.isVirtualDpadOn = true;
    } else {
      this.virtualDpadToggleLabel.string = "Off";
      this.isVirtualDpadOn = false;
    }
  }

  onPauseButtonClick() {
    console.log("onpause click");
    if (this.isPause) {
      this.reset();
    } else {
      this.openPause();
    }
  }

  openPause() {
    console.log("open pause");
    this.isPause = true;
    this.pauseMenuContainer.active = true;
    console.log(this.pauseMenuContainer);
    this.settingsContainer.active = false;
  }

  reset() {
    this.isPause = false;
    this.pauseMenuContainer.active = false;
    this.settingsContainer.active = false;
  }

  onRestartClick() {
    this.reset();
    GameManager.Instance.onRestartLevelKeyInput();
  }

  onBackClick() {
    this.scheduleOnce(() => {
      director.loadScene("title", (e, scene) => {
        const uiManager = scene?.getComponentInChildren(TitleScreenUIManager);
        uiManager!.fromGameplay = true;
        uiManager?.toggleLoadingScreen(false);
        uiManager?.openLevelSelector();
      });
    }, 0.25);
  }

  onSettingsClick() {
    this.pauseMenuContainer.active = false;
    this.settingsContainer.active = true;
  }

  onCloseSettingsClick() {
    this.pauseMenuContainer.active = true;
    this.settingsContainer.active = false;
  }

  onVirtualDpadToggle() {
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
