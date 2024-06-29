import { _decorator, Component, Node } from "cc";
import { Tile } from "./Tile";
const { ccclass, property } = _decorator;

@ccclass("Wall")
export class Wall extends Tile {
	constructor() {
		super(false);
	}
}
