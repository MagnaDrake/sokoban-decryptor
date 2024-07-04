import { _decorator, Component, Node, Sprite, SpriteFrame } from "cc";
const { ccclass, property } = _decorator;

export enum GameWorld {
  EXHIBIT,
  ARTIST_ALLEY,
  ATRIUM,
}
export enum BGKey {
  EXHIBIT = "1_exhibit",
  ARTIST_ALLEY = "2_artist",
  ATRIUM = "3_atrium",
}

@ccclass("GameplayBackground")
export class GameplayBackground extends Component {
  @property(Sprite)
  display: Sprite;

  @property([SpriteFrame])
  bgs: SpriteFrame[] = [];

  updateBackground(world: number) {
    this.display.spriteFrame = this.bgs[world];
  }
}
