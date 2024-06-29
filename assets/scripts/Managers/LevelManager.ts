import { _decorator, Component, JsonAsset, Node } from "cc";
import { LevelData, readRawLevelData } from "../utils/LevelReader";
const { ccclass, property } = _decorator;

@ccclass("LevelManager")
export class LevelManager extends Component {
	@property([JsonAsset])
	levels: JsonAsset[] = [];

	levelData: Array<LevelData>;

	static _instance: LevelManager;

	public static get Instance(): LevelManager | undefined {
		const instance = this._instance;
		if (instance?.isValid) return instance;
	}

	public static set Instance(value: LevelManager) {
		this._instance = value;
	}

	protected onLoad(): void {
		const instance = LevelManager.Instance;

		if (instance?.isValid && instance !== this) {
			this.destroy();
			return;
		}

		if (!instance || !instance.isValid) {
			LevelManager.Instance = this;
		}

		this.levelData = new Array<LevelData>();

		this.readLevels();
	}

	readLevels() {
		this.levels.forEach((levelJson) => {
			if (levelJson !== undefined && levelJson !== null) {
				//this.levelData.push(readRawLevelData(levelJson.json));
				this.levelData.push(readRawLevelData(levelJson.json));
			}
		});
	}
}
