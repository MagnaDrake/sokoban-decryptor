import {
  _decorator,
  Color,
  Component,
  Label,
  Layout,
  Node,
  Size,
  Sprite,
  UITransform,
} from "cc";
import { LevelItem } from "../ui/LevelSelector/LevelItem";
const { ccclass, property } = _decorator;

@ccclass("LevelWorldContainer")
export class LevelWorldContainer extends Component {
  @property(UITransform)
  containerUITransform: UITransform;

  @property(Layout)
  worldContainerLayout: Layout;

  @property(Node)
  levelTitle: Node;

  @property(Label)
  titleLabel: Label;

  @property(Sprite)
  lineGraphics: Sprite;

  levelItems: LevelItem[] = [];

  protected onLoad(): void {
    this.containerUITransform = this.node.getComponent(UITransform);
  }

  start() {}

  addLevelItem(levelItem: LevelItem) {
    this.levelItems.push(levelItem);
    levelItem.node.setParent(this.worldContainerLayout.node);

    this.updateContainerSize();
  }

  setLevelTitle(title: string) {
    this.titleLabel.string = title;
  }

  toggleTitleVisible(value: boolean) {
    this.levelTitle.active = value;
  }

  updateContainerSize() {
    const width = this.levelItems.length * 110;
    const height = 175 + Math.floor((this.levelItems.length - 1) / 10) * 110;

    const layoutUITransform =
      this.worldContainerLayout.node.getComponent(UITransform);

    this.containerUITransform.setContentSize(new Size(width, height));
    const lineTransform = this.lineGraphics.node.getComponent(UITransform);
    lineTransform.setContentSize(new Size(width - 110, lineTransform.height));
    layoutUITransform.setContentSize(new Size(width, height));

    this.worldContainerLayout.updateLayout();
  }

  setLineGraphicColor(color: Color) {
    this.lineGraphics.color = color;
  }
}
