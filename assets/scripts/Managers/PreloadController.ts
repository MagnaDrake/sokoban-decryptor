import { _decorator, Component, director, Node } from "cc";
import { ScreenSwipeController } from "./ScreenSwipeController";
import { FRAME } from "../utils/anim";
import { AudioKeys, AudioManager, getAudioKeyString } from "./AudioManager";
const { ccclass, property } = _decorator;

@ccclass("PreloadController")
export class PreloadController extends Component {
  start() {
    const ss = ScreenSwipeController.Instance;

    director.preloadScene("title");

    director.preloadScene("intro", () => {
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
    });

    director.preloadScene("ending");
  }
}
