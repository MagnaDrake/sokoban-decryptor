import { _decorator, CCBoolean, Component, director, Node } from "cc";
import { FRAME, moveToLocal } from "../utils/anim";
const { ccclass, property } = _decorator;

@ccclass("ScreenSwipeController")
export class ScreenSwipeController extends Component {
  @property(Node)
  transitionObject: Node;

  @property(Node)
  startAnchor: Node;

  @property(Node)
  midAnchor: Node;

  @property(Node)
  endAnchor: Node;

  @property(Node)
  inputBlocker: Node;

  static _instance: ScreenSwipeController;

  public static get Instance(): ScreenSwipeController | undefined {
    const instance = this._instance;
    if (instance?.isValid) return instance;
  }

  public static set Instance(value: ScreenSwipeController) {
    this._instance = value;
  }

  onLoad() {
    const instance = ScreenSwipeController.Instance;

    if (instance?.isValid && instance !== this) {
      this.destroy();
      return;
    }

    if (!instance || !instance.isValid) {
      ScreenSwipeController.Instance = this;
      director.addPersistRootNode(this.node);
    }
  }

  _flip = false;

  set flip(value: boolean) {
    this._flip = value;
    this.transitionObject.setScale(value ? -1 : 1, 1, 0);
  }

  get flip() {
    return this._flip;
  }

  enterTransition() {
    //console.log("start enter transition");
    this.inputBlocker.active = true;
    const start = !this.flip ? this.startAnchor : this.endAnchor;
    this.transitionObject.setPosition(start.position);

    moveToLocal(
      this.transitionObject,
      this.midAnchor.position,
      FRAME * 60,
      () => {
        //console.log("complete enter");
        this.inputBlocker.active = false;
      }
    );
  }

  exitTransition() {
    this.scheduleOnce(() => {
      // console.log("start exit transition");
      this.inputBlocker.active = true;
      const end = this.flip ? this.startAnchor : this.endAnchor;
      this.transitionObject.setPosition(this.midAnchor.position);

      moveToLocal(this.transitionObject, end.position, FRAME * 60, () => {
        // console.log("complete end");
        this.inputBlocker.active = false;
        this.flip = false;
      });
    }, FRAME * 15);
  }

  setMiddle() {
    this.inputBlocker.active = true;
    this.transitionObject.setPosition(this.midAnchor.position);
  }
}
