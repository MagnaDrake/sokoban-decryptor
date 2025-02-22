import { _decorator, Component, Enum, Input, Node } from "cc";
import { FRAME } from "../../utils/anim";
const { ccclass, property } = _decorator;

export enum DPadType {
  UP,
  DOWN,
  LEFT,
  RIGHT,
  Q,
  E,
  R,
  Z,
  NONE,
}

export enum VirtualDPadEvents {
  DPAD_PRESS = "dpad-press",
  DPAD_LIFT = "dpad-lift",
}

Enum(DPadType);

@ccclass("VirtualDpad")
export class VirtualDpad extends Component {
  @property({ type: DPadType })
  type: DPadType;

  @property(Node)
  activeSprite: Node;

  @property(Node)
  inactiveSprite: Node;

  isHeld = false;

  holdCounter = 0;

  holdThreshold = 0.5;

  tickCounter = 0;

  tickThreshold = FRAME * 3.5;

  protected onLoad(): void {
    this.node.off(Input.EventType.TOUCH_START, this.onVirtualTouch, this);
    this.node.on(Input.EventType.TOUCH_START, this.onVirtualTouch, this);

    this.node.off(Input.EventType.TOUCH_CANCEL, this.onVirtualEnd, this);
    this.node.on(Input.EventType.TOUCH_CANCEL, this.onVirtualEnd, this);

    this.node.off(Input.EventType.TOUCH_END, this.onVirtualEnd, this);
    this.node.on(Input.EventType.TOUCH_END, this.onVirtualEnd, this);
    this.activeSprite.active = false;
    this.inactiveSprite.active = true;
  }

  onVirtualEnd() {
    this.activeSprite.active = false;
    this.inactiveSprite.active = true;
    this.node.emit(VirtualDPadEvents.DPAD_LIFT, this.type);
    this.holdCounter = 0;
    this.tickCounter = 0;
    this.isHeld = false;
  }

  onVirtualTouch() {
    this.activeSprite.active = true;
    this.inactiveSprite.active = false;
    this.node.emit(VirtualDPadEvents.DPAD_PRESS, this.type);
    this.holdCounter = 0;
    this.isHeld = true;
  }

  update(delta: number) {
    if (this.isHeld) {
      this.holdCounter += delta;
      if (this.holdCounter >= this.holdThreshold) {
        this.tickCounter += delta;
        if (this.tickCounter >= this.tickThreshold) {
          // console.log("masuk ke update delta");
          this.node.emit(VirtualDPadEvents.DPAD_PRESS, this.type);
          this.tickCounter = 0;
        }
      }
    }
  }
}
