import { _decorator, Component, Node } from "cc";
import { Tile } from "./Tile";
import { Direction } from "../interfaces/IPoint";
import { Splitter } from "./Splitter";
const { ccclass, property } = _decorator;

@ccclass("Panel")
export class Panel extends Tile {
	gateways: Array<Direction>;
	_active = false;

	@property(Node)
	onSignal: Node;

	set active(value: boolean) {
		// console.log("set panel", this.position, value);
		this._active = value;
		if (this.onSignal.isValid) this.onSignal.active = value;

		const entity = this.entities[0];
		if (entity instanceof Splitter) entity.active = value;
	}

	get active() {
		return this._active;
	}

	constructor() {
		super();
		this.gateways = new Array<Direction>();
	}
}
