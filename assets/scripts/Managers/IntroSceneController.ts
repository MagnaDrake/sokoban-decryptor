import {
  _decorator,
  Component,
  director,
  EventKeyboard,
  Input,
  input,
  KeyCode,
  Node,
  Prefab,
} from "cc";
import { ComicPanel } from "../objects/ComicPanel";
import { ScreenSwipeController } from "./ScreenSwipeController";
import { FRAME } from "../utils/anim";
const { ccclass, property } = _decorator;

@ccclass("IntroSceneController")
export class IntroSceneController extends Component {
  @property([Node])
  comicPanels: Node[] = [];

  @property(ComicPanel)
  tapNotice: ComicPanel;

  @property(Node)
  skipButton: Node;

  panelOrder = 0;

  lastPanel: ComicPanel;

  finish = false;

  onLoad() {
    input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);

    this.node.off(Input.EventType.TOUCH_START, this.onScreenTap, this);
    this.node.on(Input.EventType.TOUCH_START, this.onScreenTap, this);
  }

  start() {
    this.scheduleOnce(this.showNextPanel, 1);
  }

  onKeyDown(event: EventKeyboard) {
    if (event.keyCode === KeyCode.ESCAPE) {
      this.goToTitle(0);
    } else if (event.keyCode === KeyCode.SPACE) {
      this.showNextPanel();
    }
  }

  showNextPanel() {
    if (this.panelOrder > 14) {
      if (!this.finish) {
        this.finish = true;
        this.goToTitle();
      }
    } else {
      if (this.panelOrder === 0) {
        this.tapNotice.fadeIn();
      } else {
        this.tapNotice.fadeOut();
      }

      if (this.lastPanel?.isValid) {
        this.lastPanel.stopTween();
        this.lastPanel.uiOpacity.opacity = 255;
        this.tapNotice.uiOpacity.opacity = 0;
      }
      this.lastPanel =
        this.comicPanels[this.panelOrder].getComponent(ComicPanel);
      this.lastPanel.fadeIn();
      this.panelOrder++;

      if (this.panelOrder === 5) {
        this.lastPanel =
          this.comicPanels[this.panelOrder].getComponent(ComicPanel);
        this.lastPanel.fadeIn();
        this.panelOrder++;
      }
    }
  }

  goToTitle(delay = 1) {
    this.skipButton.active = false;
    input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    this.node.off(Input.EventType.TOUCH_START, this.onScreenTap, this);

    // this.comicPanels.forEach((panel) => {
    //   panel.getComponent(ComicPanel).stopTween();
    //   panel.getComponent(ComicPanel).fadeOut();
    // });
    const ss = ScreenSwipeController.Instance;
    ss.enterTransition();

    this.scheduleOnce(() => {
      this.scheduleOnce(() => {
        director.loadScene("title", () => {});
        ss.exitTransition();
      }, delay);
    }, delay);
  }

  onScreenTap() {
    this.showNextPanel();
  }
}
