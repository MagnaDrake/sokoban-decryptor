import {
  _decorator,
  Component,
  Event,
  EventKeyboard,
  Input,
  input,
  KeyCode,
  Node,
} from "cc";
import {
  IPoint,
  VECTOR_DOWN,
  VECTOR_LEFT,
  VECTOR_RIGHT,
  VECTOR_UP,
} from "../interfaces/IPoint";
import { GameManager } from "./GameManager";
import { FRAME } from "../utils/anim";
const { ccclass, property } = _decorator;

@ccclass("InputManager")
export class InputManager extends Component {
  keyCooldown = false;

  onLoad() {
    input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    input.off(Input.EventType.KEY_PRESSING, this.onKeyHold, this);
    input.on(Input.EventType.KEY_PRESSING, this.onKeyHold, this);
  }

  onKeyDown(event: EventKeyboard) {
    // priority key
    // probably these needs to be refactored in the future
    if (event.keyCode === KeyCode.ESCAPE) {
      GameManager.Instance.onPauseKeyInput();
      return;
    }

    const isPaused = GameManager.Instance.pm.isPause;
    if (this.keyCooldown || isPaused) return;
    this.triggerCooldown();
    let direction;

    switch (event.keyCode) {
      case KeyCode.ARROW_UP:
      case KeyCode.ARROW_DOWN:
      case KeyCode.ARROW_LEFT:
      case KeyCode.ARROW_RIGHT:
        GameManager.Instance.onMovementKeyInput(event.keyCode);
        return;
      case KeyCode.KEY_A:
      case KeyCode.KEY_S:
        GameManager.Instance.onInteractInput(event.keyCode);
        return;
      case KeyCode.KEY_Z:
        GameManager.Instance.onUndoKeyInput();
        return;
      case KeyCode.KEY_R:
        GameManager.Instance.onRestartLevelKeyInput();
        return;
      default:
        return;
    }
  }

  onKeyHold(event: EventKeyboard) {
    //console.log(event.keyCode);
    const isPaused = GameManager.Instance.pm.isPause;

    if (this.keyCooldown || isPaused) return;
    this.triggerHoldCooldown();
    switch (event.keyCode) {
      case KeyCode.ARROW_UP:
      case KeyCode.ARROW_DOWN:
      case KeyCode.ARROW_LEFT:
      case KeyCode.ARROW_RIGHT:
        GameManager.Instance.onMovementKeyInput(event.keyCode);
        return;
      case KeyCode.KEY_A:
      case KeyCode.KEY_S:
        GameManager.Instance.onInteractInput(event.keyCode);
        return;
      case KeyCode.KEY_Z:
        GameManager.Instance.onUndoKeyInput();
        return;
      case KeyCode.KEY_R:
      // GameManager.Instance.onRestartLevelKeyInput();
      default:
        return;
    }
  }

  triggerCooldown() {
    this.keyCooldown = true;
    this.scheduleOnce(() => {
      this.keyCooldown = false;
    }, FRAME * 3.5);
  }

  triggerHoldCooldown() {
    this.keyCooldown = true;
    this.scheduleOnce(() => {
      this.keyCooldown = false;
    }, FRAME * 3);
  }
}
