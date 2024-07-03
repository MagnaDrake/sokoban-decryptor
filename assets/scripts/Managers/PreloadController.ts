import { _decorator, Component, director, Node } from "cc";
import { ScreenSwipeController } from "./ScreenSwipeController";
import { FRAME } from "../utils/anim";
const { ccclass, property } = _decorator;

@ccclass("PreloadController")
export class PreloadController extends Component {
  start() {
    console.log("start preload");
    const ss = ScreenSwipeController.Instance;

    director.preloadScene("title");

    director.preloadScene("intro", () => {
      ss.enterTransition();

      this.scheduleOnce(() => {
        director.loadScene("intro", () => {
          ss.exitTransition();
        });
      }, 1 * FRAME * 60);
    });
  }
}
