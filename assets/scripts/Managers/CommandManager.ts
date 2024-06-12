import { _decorator, Component, Node } from "cc";
import { CommandBatch } from "../commands/CommandBatch";
const { ccclass, property } = _decorator;

@ccclass("CommandManager")
export class CommandManager extends Component {
  static _instance: CommandManager;

  commandMemory: Array<CommandBatch>;

  public static get Instance(): CommandManager | undefined {
    const instance = this._instance;
    if (instance?.isValid) return instance;
  }

  public static set Instance(value: CommandManager) {
    this._instance = value;
  }

  onLoad() {
    const instance = CommandManager.Instance;

    if (instance?.isValid && instance !== this) {
      this.destroy();
      return;
    }

    if (!instance || !instance.isValid) {
      CommandManager.Instance = this;
    }
  }

  start() {
    this.commandMemory = new Array<CommandBatch>();
  }

  storeCommandBatch(batch: CommandBatch) {
    this.commandMemory.push(batch);
  }

  executeCommandBatch(batch: CommandBatch) {
    if (batch.length < 1) return;
    this.storeCommandBatch(batch);
    batch.getCommands().forEach((command) => {
      command.execute();
    });
  }

  undoCommandBatch() {
    const lastBatch = this.commandMemory.pop()?.getCommands();
    if (!lastBatch) return;
    lastBatch.reverse();
    lastBatch.forEach((command) => {
      command.undo();
    });
  }

  appendAndExecuteCommandBatch(batch: CommandBatch) {
    if (batch.length < 1) return;

    batch.getCommands().forEach((command) => {
      command.execute();
    });

    this.appendToLastBatch(batch);
  }

  appendToLastBatch(batch: CommandBatch) {
    const lastBatch =
      this.commandMemory[this.commandMemory.length - 1].getCommands();
    lastBatch.push(...batch.getCommands());
  }
}
