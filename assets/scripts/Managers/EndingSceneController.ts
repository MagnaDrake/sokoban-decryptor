import { _decorator, Component, director, Input, input, Node } from "cc";
import { IntroSceneController } from "./IntroSceneController";
import { UserDataManager } from "./UserDataManager";
import { ScreenSwipeController } from "./ScreenSwipeController";
import { ComicPanel } from "../objects/ComicPanel";
const { ccclass, property } = _decorator;

@ccclass("EndingSceneController")
export class EndingSceneController extends IntroSceneController {
  start() {
    const saveData = UserDataManager.Instance.getUserData();
    saveData.hasWatchedEnding = true;
    UserDataManager.Instance.saveUserData(saveData);
  }

  // JANK
  // ending and intro scene should be controlled by the same class
  // but the intro scene has a very specific panel that needs to show two panels at once
  // but ending doesnt
  // we'll figure it out later

  showNextPanel() {
    if (this.panelOrder > 14) {
      if (!this.finish) {
        this.finish = true;
        this.goToTitle();
      }
    } else {
      if (this.panelOrder === 0) {
        this.tapNotice.fadeIn();
      } else {
        this.tapNotice.fadeOut();
      }

      if (this.lastPanel?.isValid) {
        this.lastPanel.stopTween();
        this.lastPanel.uiOpacity.opacity = 255;
        this.tapNotice.uiOpacity.opacity = 0;
      }
      this.lastPanel =
        this.comicPanels[this.panelOrder].getComponent(ComicPanel);
      this.lastPanel.fadeIn();
      this.panelOrder++;
    }
  }
}
