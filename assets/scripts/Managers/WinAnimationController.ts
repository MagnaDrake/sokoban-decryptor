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
const { ccclass, property } = _decorator;

@ccclass("WinAnimationController")
export class WinAnimationController extends Component {
  @property(UITransform)
  maskTransform: UITransform;

  @property(Node)
  winGameScreen: Node;

  player: Player;

  triggerWin() {
    console.log(this.player);
    this.player.anim.stop();
    this.player.playAnim(PlayerAnimKey.VICTORY);
    this.animateMask();
  }

  animateMask() {
    const easingProps: ITweenOption = {
      easing: easing.circOut,
      onComplete: () => {
        this.winGameScreen.active = true;
        this.scheduleOnce(() => {
          const ss = ScreenSwipeController.Instance;
          ss.flip = true;
          ss.enterTransition();

          this.scheduleOnce(() => {
            director.loadScene("title", (e, scene) => {
              const uiManager =
                scene?.getComponentInChildren(TitleScreenUIManager);
              uiManager!.fromGameplay = true;
              uiManager?.toggleLoadingScreen(false);
              uiManager?.openLevelSelector();
            });
            ss.exitTransition();
          }, 1);
        }, 2);
      },
    };

    tween(this.maskTransform)
      .to(3.5, { width: 1800, height: 1800 }, easingProps)
      .start();
  }
}
