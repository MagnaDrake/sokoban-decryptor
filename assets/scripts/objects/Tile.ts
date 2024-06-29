import { _decorator, Component, Label, Node, Sprite, UITransform } from "cc";
import { Entity } from "./Entity";
import { IPoint } from "../interfaces/IPoint";
const { ccclass, property } = _decorator;

@ccclass("Tile")
export class Tile extends Component {
	traversable: boolean;
	entities: Array<Entity>;
	position: IPoint;

	@property(Label)
	debugLabel: Label;

	@property(Sprite)
	terrainSprite: Sprite;

	constructor(traversable = true) {
		super();
		this.entities = new Array<Entity>();
		this.traversable = traversable;
	}

	setTileTerrain(terrain: number) {
		// Tiled displays ID with 0-index but exports to 1-index
		const format = `${terrain - 1}`.slice(-3);

		const append = terrain - 1 < 10 ? "0" : "";
		const spriteKey = `${append}${format}`;
		console.log(spriteKey);
		this.terrainSprite.spriteFrame =
			this.terrainSprite.spriteAtlas.getSpriteFrame(spriteKey);
		this.terrainSprite.node
			.getComponent(UITransform)
			.setContentSize(64, 64);
		//todo set sprite using terrain code number
	}
}
