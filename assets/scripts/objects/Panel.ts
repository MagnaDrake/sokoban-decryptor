import { _decorator, Component, Node, Sprite, UITransform } from "cc";
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

	offset = 32;

	setTileTerrain(id: number): void {
		console.log(this.position);
		super.setTileTerrain(id);

		const onSprite = this.onSignal.getComponent(Sprite);

		const offsetedId = id - this.offset;

		const append = offsetedId < 10 ? "0" : "";
		const spriteKey = `${append}${offsetedId}`;
		console.log(spriteKey);
		onSprite.spriteFrame = onSprite.spriteAtlas.getSpriteFrame(spriteKey);
		this.onSignal.getComponent(UITransform).setContentSize(64, 64);
	}

	set active(value: boolean) {
		// console.log("set panel", this.position, value);
		this._active = value;
		if (this.onSignal.isValid) this.onSignal.active = value;

		// const entity = this.entities[0];
		// if (entity instanceof Splitter) entity.active = value;
	}

	get active() {
		return this._active;
	}

	constructor() {
		super();
		this.gateways = new Array<Direction>();
	}
}
