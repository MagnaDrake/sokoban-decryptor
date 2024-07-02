import { _decorator, Component, director, Node } from "cc";
import { ScreenSwipeController } from "./ScreenSwipeController";
import { FRAME } from "../utils/anim";
const { ccclass, property } = _decorator;

@ccclass("PreloadController")
export class PreloadController extends Component {
  start() {
    console.log("start preload");
    const ss = ScreenSwipeController.Instance;

    director.preloadScene("title", () => {
      ss.enterTransition();

      this.scheduleOnce(() => {
        director.loadScene("title", () => {});
        ss.exitTransition();
      }, FRAME * 60);
    });
  }
}
