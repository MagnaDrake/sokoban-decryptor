import { _decorator, CCInteger, Component, Node } from "cc";
import { Tile } from "./Tile";
import { IPoint } from "../interfaces/IPoint";
import { Emitter } from "./Emitter";
import { Panel } from "./Panel";
const { ccclass, property } = _decorator;

@ccclass("Grid")
export class Grid extends Component {
  @property(CCInteger)
  width = 1;

  @property(CCInteger)
  height = 1;

  public tiles: Tile[][] = [[]];

  public emitters: Array<Emitter>;

  onLoad() {
    this.tiles = [...Array(this.height)].map((e) => Array(this.width));
    this.emitters = new Array<Emitter>();
  }

  getTile(x: number, y: number) {
    // console.log(`${x},${y}`);
    if (!(y in this.tiles && x in this.tiles[y])) {
      return false;
    } else {
      return this.tiles[y][x];
    }
  }

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.tiles = [...Array(this.height)].map((e) => Array(this.width));
  }

  setTile(x: number, y: number, tile: Tile) {
    // console.log(`${x},${y}`);
    this.tiles[y][x] = tile;

    tile.position = { x, y };
    tile.debugLabel.string = `${x}, ${y}`;
  }

  addEmitter(emitter: Emitter) {
    this.emitters.push(emitter);
  }

  getEmitters() {
    return this.emitters;
  }

  getPanels(): Panel[] {
    let panels = [];
    for (let y = 0; y < this.tiles.length; y++) {
      for (let x = 0; x < this.tiles[y].length; x++) {
        if (this.tiles[y][x] instanceof Panel) panels.push(this.tiles[y][x]);
      }
    }
    return panels;
  }

  getTilePosition(tile: Tile): IPoint {
    for (let y = 0; y < this.tiles.length; y++) {
      for (let x = 0; x < this.tiles[y].length; x++) {
        if (this.tiles[y][x] === tile) {
          return { x, y };
        }
      }
    }
  }

  clear() {
    this.emitters.forEach((emitter) => {
      emitter.node.destroy();
    });
    this.emitters.length = 0;

    this.tiles.forEach((column) => {
      column.forEach((tile) => {
        tile.node.destroy();
      });
    });
  }
}
