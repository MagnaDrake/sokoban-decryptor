import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

export interface Command {
	execute();
	undo();
}
