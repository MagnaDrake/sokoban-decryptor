import { _decorator, Component, Node } from "cc";
import { Tile } from "./Tile";
const { ccclass, property } = _decorator;

@ccclass("Floor")
export class Floor extends Tile {
	constructor() {
		super();
	}
}
