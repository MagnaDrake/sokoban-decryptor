import { _decorator, Component, Node } from "cc";
import { Command } from "./Command";
import { Entity } from "../objects/Entity";
import { RotateDirection } from "../interfaces/IPoint";
const { ccclass, property } = _decorator;

@ccclass("StepRotationCommand")
export class StepRotationCommand implements Command {
	degrees: RotateDirection;
	entity: Entity;

	constructor(entity: Entity, degrees: RotateDirection) {
		this.degrees = degrees;
		this.entity = entity;
	}

	execute() {
		this.entity.rotate(this.degrees);
	}

	undo() {
		this.entity.rotate(-this.degrees);
	}
}
