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
