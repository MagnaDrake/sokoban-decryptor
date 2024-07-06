import { _decorator, Component, director, Input, input, Node } from "cc";
import { IntroSceneController } from "./IntroSceneController";
import { UserDataManager } from "./UserDataManager";
import { ScreenSwipeController } from "./ScreenSwipeController";
const { ccclass, property } = _decorator;

@ccclass("EndingSceneController")
export class EndingSceneController extends IntroSceneController {
  goToTitle(delay?: number): void {
    const saveData = UserDataManager.Instance.getUserData();
    saveData.hasWatchedEnding = true;
    UserDataManager.Instance.saveUserData(saveData);
    super.goToTitle();
    //     this.skipButton.active = false;
    //     const ss = ScreenSwipeController.Instance;
    //     ss.enterTransition();
    //     input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    //     this.node.off(Input.EventType.TOUCH_START, this.onScreenTap, this);
    //     // this.comicPanels.forEach((panel) => {
    //     //   panel.getComponent(ComicPanel).stopTween();
    //     //   panel.getComponent(ComicPanel).fadeOut();
    //     // });
    //     this.scheduleOnce(() => {
    //       director.loadScene("title", () => {
    //         ss.exitTransition();
    //       });
    //     }, 1.5);
    //   }
  }
}
