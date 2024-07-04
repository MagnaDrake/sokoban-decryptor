import {
  _decorator,
  Animation,
  Component,
  EventTouch,
  Input,
  Node,
  Vec3,
} from "cc";
import { Entity } from "./Entity";
import {
  Direction,
  getDirection,
  getDirectionFromRotation,
  getDirectionVector,
  getRotationFromDirection,
  RotateDirection,
} from "../interfaces/IPoint";
import {
  AudioKeys,
  AudioManager,
  getAudioKeyString,
} from "../Managers/AudioManager";
import { GameManager, GameState } from "../Managers/GameManager";
const { ccclass, property } = _decorator;

export enum PlayerAnimKey {
  IDLE_DOWN = "idle_down",
  IDLE_LEFT = "idle_left",
  IDLE_RIGHT = "idle_right",
  IDLE_UP = "idle_up",
  MOVE_LEFT_L = "jelly_left_move_2",
  MOVE_LEFT_R = "jelly_left_move_1",
  MOVE_RIGHT_L = "jelly_right_move_1",
  MOVE_RIGHT_R = "jelly_right_move_2",
  MOVE_UP_L = "jelly_up_move_1",
  MOVE_UP_R = "jelly_up_move_2",
  MOVE_DOWN_L = "jelly_down_move_2",
  MOVE_DOWN_R = "jelly_down_move_1",
  VICTORY = "awawa",
}

@ccclass("Player")
export class Player extends Entity {
  @property(Animation)
  anim!: Animation;

  rightLegActive = false;

  expression = PlayerAnimKey.IDLE_DOWN;

  lastIdleExpression = PlayerAnimKey.IDLE_DOWN;

  protected onLoad(): void {
    this.node.off(Input.EventType.TOUCH_START);
    this.node.on(Input.EventType.TOUCH_START, () => {
      if (this.expression !== PlayerAnimKey.VICTORY) {
        this.anim.stop();
        this.playAnim(PlayerAnimKey.VICTORY);
        AudioManager.Instance.playOneShot(
          getAudioKeyString(AudioKeys.awawawawa)
        );
        this.scheduleOnce(() => {
          if (this.expression === PlayerAnimKey.VICTORY) {
            this.playAnim(this.lastIdleExpression);
          }
        }, 2);
      }
    });
  }

  getPosInFront() {
    const dirVec = getDirectionVector(this.direction);
    return { x: this.position.x + dirVec.x, y: this.position.y + dirVec.y };
  }

  changeDirection(x: number, y: number): void {
    this.direction = getDirection(x, y);
    this.onRotate();
  }

  rotate(degrees: RotateDirection): void {
    const zRot = this.node.eulerAngles.z;
    const newRot = (zRot + degrees + 360) % 360;
    this.direction = getDirectionFromRotation(newRot);
    this.onRotate();
  }

  onMove(): void {
    if (GameManager.Instance.gameState === GameState.READY) {
      AudioManager.Instance.playOneShotRandom(AudioKeys.SFXWalk);
    }
    this.anim.stop();
    this.unschedule(this.setToIdle);
    let key;
    if (this.rightLegActive) {
      switch (this.direction) {
        case Direction.UP:
          key = PlayerAnimKey.MOVE_UP_L;
          break;
        case Direction.DOWN:
          key = PlayerAnimKey.MOVE_DOWN_L;
          break;
        case Direction.RIGHT:
          key = PlayerAnimKey.MOVE_RIGHT_L;
          break;
        case Direction.LEFT:
          key = PlayerAnimKey.MOVE_LEFT_L;
          break;
      }
      this.rightLegActive = false;
    } else {
      switch (this.direction) {
        case Direction.UP:
          key = PlayerAnimKey.MOVE_UP_R;
          break;
        case Direction.DOWN:
          key = PlayerAnimKey.MOVE_DOWN_R;
          break;
        case Direction.RIGHT:
          key = PlayerAnimKey.MOVE_RIGHT_R;
          break;
        case Direction.LEFT:
          key = PlayerAnimKey.MOVE_LEFT_R;
          break;
      }
      this.rightLegActive = true;
    }

    this.entitySprite.spriteFrame =
      this.entitySprite.spriteAtlas.getSpriteFrame(key);

    this.expression = key;

    this.scheduleOnce(this.setToIdle, 0.25);
  }

  onRotate(): void {
    this.anim.stop();
    this.setToIdle();
  }

  setToIdle() {
    let key;
    switch (this.direction) {
      case Direction.UP:
        key = PlayerAnimKey.IDLE_UP;
        break;
      case Direction.DOWN:
        key = PlayerAnimKey.IDLE_DOWN;
        break;
      case Direction.RIGHT:
        key = PlayerAnimKey.IDLE_RIGHT;
        break;
      case Direction.LEFT:
        key = PlayerAnimKey.IDLE_LEFT;
        break;
    }
    this.playAnim(key);
  }

  playAnim(key: PlayerAnimKey) {
    this.expression = key;
    switch (key) {
      case PlayerAnimKey.IDLE_DOWN:
      case PlayerAnimKey.IDLE_LEFT:
      case PlayerAnimKey.IDLE_RIGHT:
      case PlayerAnimKey.IDLE_UP:
        this.lastIdleExpression = key;
        break;
    }
    this.anim.play(key);
  }
}
