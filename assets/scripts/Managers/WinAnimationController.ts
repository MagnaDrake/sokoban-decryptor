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

  triggerWin() {
    this.scheduleOnce(() => {
      this.player.anim.stop();
      this.player.unschedule(this.player.setToIdle);
      this.player.playAnim(PlayerAnimKey.VICTORY);
    }, FRAME * 15);
    this.animateMask();
  }

  // TODO
  // probably have to figure out callbacks instead of using schedule
  // definitely could refactor this in the future but its good enough for now

  // TODO a lot of overlapping methods in loading scenes
  // should have a helper function to do that instead
  // later

  animateMask() {
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
            director.loadScene("title", (e, scene) => {
              const uiManager =
                scene?.getComponentInChildren(TitleScreenUIManager);
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
