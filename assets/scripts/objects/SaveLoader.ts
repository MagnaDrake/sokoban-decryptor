import { _decorator, Component, EditBox, Label, Node } from "cc";
import { SaveFlags, UserDataManager } from "../Managers/UserDataManager";
import { load } from "../utils/savedata";
import { LevelSelector } from "../ui/LevelSelector/LevelSelector";
const { ccclass, property } = _decorator;

@ccclass("SaveLoader")
export class SaveLoader extends Component {
  @property(EditBox)
  textBox: EditBox;

  @property(Label)
  successNotif: Label;

  @property(LevelSelector)
  levelSelector: LevelSelector;

  resetBox() {
    this.textBox.string = "";
    this.successNotif.string = "";
  }

  protected onLoad(): void {
    this.resetBox();
  }

  async exportCode() {
    const levelCode = UserDataManager.Instance.getSaveCode();
    this.textBox.string = levelCode;
    this.successNotif.string =
      levelCode.length > 1 ? "Copied to clipboard!" : "No save data available.";

    try {
      await navigator.clipboard.writeText(levelCode);
    } catch (error) {
      console.error(error.message);
    }
  }

  loadSaveCode() {
    const levelCode = this.textBox.string;
    if (this.textBox.string.length < 1) {
      this.successNotif.string = "Invalid save code!";
      return;
    }

    const loadedData = load(levelCode);
    console.log(loadedData);
    if (loadedData[0] === -1) {
      this.successNotif.string = "Invalid save code!";
    } else {
      this.successNotif.string = "Save data loaded!";
      const levels = loadedData.filter((v) => {
        return typeof v === "number";
      });

      const fc = loadedData.filter((v) => {
        return v === SaveFlags.FinishedGame;
      });

      const we = loadedData.filter((v) => {
        return v === SaveFlags.HasWatchedEnding;
      });

      console.log(levels, fc, we);
      UserDataManager.Instance.saveUserData({
        completedLevels: levels,
        perfectLevels: [],
        hasFinishedGame: fc[0] !== undefined ? true : false,
        hasWatchedEnding: we[0] !== undefined ? true : false,
      });
      this.levelSelector.updateLevelData();
    }
  }
}
