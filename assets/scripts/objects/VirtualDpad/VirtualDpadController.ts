import { _decorator, Component, KeyCode, Node } from "cc";
import { DPadType, VirtualDpad, VirtualDPadEvents } from "./VirtualDpad";
import { GameManager } from "../../Managers/GameManager";
import { isMobile } from "../../utils/device";
import { FRAME } from "../../utils/anim";
import { UserDataManager } from "../../Managers/UserDataManager";
const { ccclass, property } = _decorator;

@ccclass("VirtualDpadController")
export class VirtualDpadController extends Component {
  @property([VirtualDpad])
  dpads: VirtualDpad[] = [];

  _isActive = false;

  currentPressedPad: DPadType = DPadType.NONE;

  set active(value: boolean) {
    this._isActive = value;
    this.node.active = value;
    UserDataManager.Instance.saveVpadSettings(this.active);
  }

  get active() {
    return this._isActive;
  }

  protected onLoad(): void {
    this.dpads.forEach((pad) => {
      this.setupPads(pad.node);
    });
  }

  keyCooldown = false;

  setupPads(pad: Node) {
    pad.off(VirtualDPadEvents.DPAD_PRESS, this.onPadPress, this);
    pad.on(VirtualDPadEvents.DPAD_PRESS, this.onPadPress, this);
    pad.on(VirtualDPadEvents.DPAD_LIFT, this.onPadLift, this);
    pad.on(VirtualDPadEvents.DPAD_LIFT, this.onPadLift, this);
  }

  canHold(type: DPadType) {
    return (
      this.currentPressedPad === type ||
      this.currentPressedPad === DPadType.NONE
    );
  }

  onPadPress(type: DPadType) {
    const gm = GameManager.Instance;
    if (!this.active || gm.pm.isPause || !this.canHold(type)) return;
    this.currentPressedPad = type;
    switch (type) {
      case DPadType.UP:
        gm.onMovementKeyInput(KeyCode.ARROW_UP);
        break;
      case DPadType.DOWN:
        gm.onMovementKeyInput(KeyCode.ARROW_DOWN);
        break;
      case DPadType.LEFT:
        gm.onMovementKeyInput(KeyCode.ARROW_LEFT);
        break;
      case DPadType.RIGHT:
        gm.onMovementKeyInput(KeyCode.ARROW_RIGHT);
        break;
      case DPadType.Q:
        gm.onInteractInput(KeyCode.KEY_A);
        break;
      case DPadType.E:
        gm.onInteractInput(KeyCode.KEY_S);
        break;
      case DPadType.R:
        gm.onRestartLevelKeyInput();
        break;
      case DPadType.Z:
        gm.onUndoKeyInput();
    }
  }

  onPadLift(type: DPadType) {
    this.currentPressedPad = DPadType.NONE;
    switch (type) {
      case DPadType.UP:
      case DPadType.DOWN:
      case DPadType.LEFT:
      case DPadType.RIGHT:
      case DPadType.Q:
      case DPadType.E:
      case DPadType.R:
        return;
    }
  }
}
