import { Command } from "./Command";

export class CommandBatch {
	batch: Array<Command>;

	constructor() {
		this.batch = new Array<Command>();
	}

	get length() {
		return this.batch.length;
	}

	add(command: Command) {
		this.batch.push(command);
	}

	getCommands() {
		return this.batch;
	}
}
