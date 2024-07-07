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
  Vec3,
} from "cc";
import { ScreenSwipeController } from "./ScreenSwipeController";
import { TitleScreenUIManager } from "../ui/TitleScreenUIManager";
import { Player, PlayerAnimKey } from "../objects/Player";
import { FRAME, moveToLocal } from "../utils/anim";
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
    AudioManager.Instance.playOneShot(
      `${getAudioKeyString(AudioKeys.SFXFanfare)}`
    );

    AudioManager.Instance.fadeBGM(0.2, 1);

    AudioManager.Instance.playOneShot(
      `${getAudioKeyString(AudioKeys.SFXLevelClear)}`
    );
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
          const ss = ScreenSwipeController.Instance;
          ss.flip = true;
          this.scheduleOnce(() => {
            if (sendToEnding) {
              AudioManager.Instance.playOneShot(
                `${getAudioKeyString(AudioKeys.SFXSweep)}-0`
              );
              AudioManager.Instance.resetVolumesToCache();
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
                AudioManager.Instance.resetVolumesToCache();

                AudioManager.Instance.playOneShot(
                  `${getAudioKeyString(AudioKeys.SFXSweep)}-0`
                );

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

          AudioManager.Instance.playOneShot(
            `${getAudioKeyString(AudioKeys.SFXSweep)}-1`
          );
          ss.enterTransition();
        }, 2.5);
      },
    };

    const winScreenTransform = this.winGameScreen.getComponent(UITransform);

    const tween1 = tween(winScreenTransform).to(
      FRAME * 60,
      { width: 0 },
      easingProps
    );

    const tween2 = tween(this.maskTransform).to(
      FRAME * 60,
      { width: 1800, height: 1800 },
      easingProps
    );

    tween1.start();
    tween2.start();
  }
}
