import { _decorator, Component, Node } from "cc";
import { Command } from "./Command";
import { Direction, IPoint } from "../interfaces/IPoint";
import { Emitter } from "../objects/Emitter";
const { ccclass, property } = _decorator;

@ccclass("SyncPositionCommand")
export class SyncPositionCommand implements Command {
	lastLastPosition: IPoint;
	lastlastDirection: Direction;

	updatePosition: IPoint;
	updateDirection: Direction;

	emitter: Emitter;

	constructor(emitter: Emitter) {
		this.updatePosition = emitter.position;
		this.updateDirection = emitter.direction;

		this.emitter = emitter;
	}

	execute() {
		this.lastLastPosition = this.emitter.lastPosition;
		this.lastlastDirection = this.emitter.lastDirection;
		this.emitter.lastPosition = this.updatePosition;
		this.emitter.lastDirection = this.updateDirection;
	}

	undo() {
		this.emitter.lastPosition = this.lastLastPosition;
		this.emitter.lastDirection = this.lastlastDirection;
	}
}
