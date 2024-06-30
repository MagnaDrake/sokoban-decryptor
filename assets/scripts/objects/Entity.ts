import { _decorator, Component, Node, Vec2, Vec3 } from "cc";
import {
	Direction,
	getDirection,
	getDirectionFromRotation,
	getRotationFromDirection,
	IPoint,
	RotateDirection,
} from "../interfaces/IPoint";
const { ccclass, property } = _decorator;

@ccclass("Entity")
export class Entity extends Component {
	position: IPoint;
	direction: Direction;
	moveable: boolean;
	rotatetable: boolean;
	blocksPanel: boolean;

	constructor(
		direction = Direction.RIGHT,
		moveable = true,
		rotatable = true,
		blocksPanel = false
	) {
		super();
		this.direction = direction;
		this.moveable = moveable;
		this.rotatetable = rotatable;
		this.blocksPanel = blocksPanel;
	}

	moveToWorldPos(x: number, y: number) {
		this.node.setPosition(new Vec3(x, y, 0));
		this.onMove();
	}

	changeDirection(x: number, y: number) {
		this.direction = getDirection(x, y);
		this.node.setRotationFromEuler(
			0,
			0,
			getRotationFromDirection(this.direction)
		);
		this.onRotate();
	}

	setMovableAndRotatable(movable: boolean, rotatable: boolean) {
		this.moveable = movable;
		this.rotatetable = rotatable;
		console.log("meow " + this.moveable + " " + this.rotatetable);
	}

	rotate(degrees: RotateDirection) {
		const zRot = this.node.eulerAngles.z;
		const newRot = (zRot + degrees + 360) % 360;
		this.node.setRotationFromEuler(0, 0, newRot);
		this.direction = getDirectionFromRotation(newRot);
		this.onRotate();
	}

	onMove() {}

	onRotate() {}
}
