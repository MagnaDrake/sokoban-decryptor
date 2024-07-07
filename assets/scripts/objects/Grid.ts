import { _decorator, CCInteger, Component, Node } from "cc";
import { Tile } from "./Tile";
import { IPoint } from "../interfaces/IPoint";
import { Emitter } from "./Emitter";
import { Panel } from "./Panel";
import { Splitter } from "./Splitter";
const { ccclass, property } = _decorator;

@ccclass("Grid")
export class Grid extends Component {
  @property(CCInteger)
  width = 1;

  @property(CCInteger)
  height = 1;

  public tiles: Tile[][] = [[]];

  public emitters: Array<Emitter>;

  public splitters: Array<Splitter>;

  onLoad() {
    const rows = new Array(this.height).fill(undefined);
    this.tiles = rows.map((e) => new Array(this.width));
    this.emitters = new Array<Emitter>();
    this.splitters = new Array<Splitter>();
  }

  getTile(x: number, y: number) {
    if (!(y in this.tiles && x in this.tiles[y])) {
      return false;
    } else {
      return this.tiles[y][x];
    }
  }

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
    const rows = new Array(this.height).fill(undefined);
    this.tiles = rows.map((e) => new Array(this.width));
  }

  setTile(x: number, y: number, tile: Tile) {
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

  getSplitters() {
    return this.splitters;
  }

  addSplitter(splitter: Splitter) {
    this.splitters.push(splitter);
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
