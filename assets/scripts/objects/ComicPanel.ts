import {
  _decorator,
  Component,
  easing,
  ITweenOption,
  Node,
  Tween,
  tween,
  UIOpacity,
} from "cc";
import { FRAME } from "../utils/anim";
const { ccclass, property } = _decorator;

@ccclass("ComicPanel")
export class ComicPanel extends Component {
  uiOpacity: UIOpacity;
  tween: Tween<any>;

  protected onLoad(): void {
    this.uiOpacity = this.node.getComponent(UIOpacity);
    this.uiOpacity.opacity = 0;
  }

  fadeIn() {
    const tweenProps = { opacity: 255 };
    const easingProps: ITweenOption = { easing: easing.linear };
    this.tween = tween(this.uiOpacity)
      .to(FRAME * 30, tweenProps, easingProps)
      .start();
  }

  fadeOut() {
    const tweenProps = { opacity: 0 };
    const easingProps: ITweenOption = { easing: easing.linear };
    this.tween = tween(this.uiOpacity)
      .to(FRAME * 30, tweenProps, easingProps)
      .start();
  }

  stopTween() {
    if (this.tween) {
      this.tween.stop();
    }
  }
}
