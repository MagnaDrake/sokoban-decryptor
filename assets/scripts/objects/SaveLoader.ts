import { _decorator, Component, EditBox, Label, Node } from "cc";
import { UserDataManager } from "../Managers/UserDataManager";
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

  loadLevel() {
    const levelCode = this.textBox.string;
    const loadedData = load(levelCode);
    if (loadedData[0] === -1) {
      this.successNotif.string = "Invalid save code!";
    } else {
      this.successNotif.string = "Save data loaded!";
      UserDataManager.Instance.saveUserData({
        completedLevels: loadedData,
        perfectLevels: [],
      });
      this.levelSelector.updateLevelData();
    }
  }
}
