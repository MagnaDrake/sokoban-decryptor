import { _decorator, Component, director, Node } from "cc";
import { ScreenSwipeController } from "./ScreenSwipeController";
import { FRAME } from "../utils/anim";
import { AudioKeys, AudioManager, getAudioKeyString } from "./AudioManager";
const { ccclass, property } = _decorator;

@ccclass("PreloadController")
export class PreloadController extends Component {
  start() {
    const ss = ScreenSwipeController.Instance;

    director.preloadScene("title", () => {
      //    console.log("title loaded");
    });

    director.preloadScene("gameplay", () => {
      //  console.log("gameplay loaded");
    });

    director.preloadScene("intro", () => {
      //  console.log("intro loaded");
      this.scheduleOnce(() => {
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
      }, FRAME * 30);
    });

    director.preloadScene("ending", () => {
      // console.log("ending loaded");
    });
  }
}
