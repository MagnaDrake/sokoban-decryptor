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
const { ccclass, property } = _decorator;

@ccclass("InputManager")
export class InputManager extends Component {
	keyCooldown = false;

	onLoad() {
		input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
		input.on(Input.EventType.KEY_PRESSING, this.onKeyHold, this);
	}

	onKeyDown(event: EventKeyboard) {
		if (this.keyCooldown) return;
		this.triggerCooldown();
		let direction;

		switch (event.keyCode) {
			case KeyCode.ARROW_UP:
			case KeyCode.ARROW_DOWN:
			case KeyCode.ARROW_LEFT:
			case KeyCode.ARROW_RIGHT:
				GameManager.Instance.onMovementKeyInput(event.keyCode);
				return;
			case KeyCode.KEY_Q:
			case KeyCode.KEY_E:
				GameManager.Instance.onInteractInput(event.keyCode);
				return;
			case KeyCode.KEY_Z:
				GameManager.Instance.onUndoKeyInput();
				return;
			case KeyCode.KEY_R:
				GameManager.Instance.onRestartLevelKeyInput();
			default:
				return;
		}
	}

	onKeyHold(event: EventKeyboard) {
		//console.log(event.keyCode);
		switch (event.keyCode) {
			case KeyCode.ARROW_UP:
			case KeyCode.ARROW_DOWN:
			case KeyCode.ARROW_LEFT:
			case KeyCode.ARROW_RIGHT:
				GameManager.Instance.onMovementKeyInput(event.keyCode);
				return;
			case KeyCode.KEY_Q:
			case KeyCode.KEY_E:
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
		}, 0.016);
	}
}
