import {
  _decorator,
  Component,
  director,
  easing,
  Input,
  input,
  ITweenOption,
  KeyCode,
  Node,
  tween,
  UITransform,
} from "cc";
import { ScreenSwipeController } from "./ScreenSwipeController";
import { TitleScreenUIManager } from "../ui/TitleScreenUIManager";
import { Player, PlayerAnimKey } from "../objects/Player";
import { FRAME } from "../utils/anim";
import { AudioKeys, AudioManager, getAudioKeyString } from "./AudioManager";
const { ccclass, property } = _decorator;

@ccclass("WinAnimationController")
export class WinAnimationController extends Component {
  @property(UITransform)
  maskTransform: UITransform;

  @property(Node)
  winGameScreen: Node;

  player: Player;

  triggerWin(sendToEnding = false, page = 0) {
    this.scheduleOnce(() => {
      this.player.anim.stop();
      this.player.unschedule(this.player.setToIdle);
      this.player.playAnim(PlayerAnimKey.VICTORY);
    }, FRAME * 15);
    this.animateMask(sendToEnding, page);
  }

  // TODO
  // probably have to figure out callbacks instead of using schedule
  // definitely could refactor this in the future but its good enough for now

  // TODO a lot of overlapping methods in loading scenes
  // should have a helper function to do that instead
  // later

  animateMask(sendToEnding: boolean, page: number) {
    const easingProps: ITweenOption = {
      easing: easing.linear,
      onComplete: () => {
        this.scheduleOnce(() => {
          this.winGameScreen.active = true;
        }, 1.5);

        this.scheduleOnce(() => {
          const ss = ScreenSwipeController.Instance;
          ss.flip = true;
          this.scheduleOnce(() => {
            if (sendToEnding) {
              console.log("send to ending", sendToEnding);
              director.loadScene("ending", (e, scene) => {
                AudioManager.Instance.stop();
                AudioManager.Instance.play(
                  getAudioKeyString(AudioKeys.BGMTitle),
                  1,
                  true
                );
              });
            } else {
              director.loadScene("title", (e, scene) => {
                const uiManager =
                  scene?.getComponentInChildren(TitleScreenUIManager);
                uiManager!.fromGameplay = true;
                uiManager?.toggleLoadingScreen(false);
                uiManager?.openLevelSelector(page);

                AudioManager.Instance.stop();
                AudioManager.Instance.play(
                  getAudioKeyString(AudioKeys.BGMTitle),
                  1,
                  true
                );
              });
            }

            ss.exitTransition();
          }, 1);

          ss.enterTransition();
        }, 3.5);
      },
    };

    tween(this.maskTransform)
      .to(FRAME * 60, { width: 1800, height: 1800 }, easingProps)
      .start();
  }
}
