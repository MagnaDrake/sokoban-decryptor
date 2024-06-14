import { _decorator, Component, KeyCode, Node } from "cc";
import { DPadType, VirtualDpad, VirtualDPadEvents } from "./VirtualDpad";
import { GameManager } from "../../Managers/GameManager";
const { ccclass, property } = _decorator;

@ccclass("VirtualDpadController")
export class VirtualDpadController extends Component {
  @property([VirtualDpad])
  dpads: VirtualDpad[] = [];

  protected onLoad(): void {
    this.dpads.forEach((pad) => {
      this.setupPads(pad.node);
    });
  }

  setupPads(pad: Node) {
    pad.off(VirtualDPadEvents.DPAD_PRESS, this.onPadPress, this);
    pad.on(VirtualDPadEvents.DPAD_PRESS, this.onPadPress, this);
    pad.on(VirtualDPadEvents.DPAD_LIFT, this.onPadLift, this);
    pad.on(VirtualDPadEvents.DPAD_LIFT, this.onPadLift, this);
  }

  onPadPress(type: DPadType) {
    const gm = GameManager.Instance;
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
        gm.onInteractInput(KeyCode.KEY_Q);
        break;
      case DPadType.E:
        gm.onInteractInput(KeyCode.KEY_E);
        break;
      case DPadType.R:
        gm.onRestartLevelKeyInput();
        break;
      case DPadType.Z:
        gm.onUndoKeyInput();
    }
  }

  onPadLift(type: DPadType) {
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
