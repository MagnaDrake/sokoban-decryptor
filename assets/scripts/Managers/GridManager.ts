import {
  _decorator,
  CCInteger,
  Component,
  instantiate,
  Node,
  Prefab,
} from "cc";
import { Grid } from "../objects/Grid";
import { Tile } from "../objects/Tile";
import { Entity } from "../objects/Entity";
import { Direction, getDirectionVector, IPoint } from "../interfaces/IPoint";
import { Panel } from "../objects/Panel";
import { ActivatePanelsCommand } from "../commands/ActivatePanelsCommand";
import { DeactivatePanelsCommand } from "../commands/DeactivatePanelsCommand";
import { CommandManager } from "./CommandManager";
import { CommandBatch } from "../commands/CommandBatch";
import { SyncPositionCommand } from "../commands/SyncPositionCommand";
const { ccclass, property } = _decorator;

@ccclass("GridManager")
export class GridManager extends Component {
  @property(Prefab)
  tilePrefab: Prefab;

  @property(Prefab)
  floorPrefab: Prefab;

  @property(Prefab)
  panelPrefab: Prefab;

  @property(Grid)
  grid: Grid;

  @property(CCInteger)
  tileSize = 64;

  static _instance: GridManager;

  lastActivePanels: Array<Panel>;

  activePanels: Array<Panel>;

  onLoad() {
    const instance = GridManager.Instance;

    if (instance?.isValid && instance !== this) {
      this.destroy();
      return;
    }

    if (!instance || !instance.isValid) {
      GridManager.Instance = this;
    }
  }

  start() {
    this.setupTiles();
  }

  public static get Instance(): GridManager | undefined {
    const instance = this._instance;
    if (instance?.isValid) return instance;
  }

  public static set Instance(value: GridManager) {
    this._instance = value;
  }

  setupTiles() {
    const { height, width } = this.grid;
    let tileCount = 0;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let tile;

        if (x > 0 && x < 6 && y > 0 && y < 6) {
          tile = instantiate(this.panelPrefab);
        } else {
          tile = instantiate(this.floorPrefab);
        }

        // const tile = instantiate(this.tilePrefab);
        tile.setParent(this.grid.node);
        const wPos = this.getTileWorldPosition(x, y, width, height);
        tile.setPosition(wPos.x, wPos.y);
        this.grid.setTile(x, y, tile.getComponent(Tile));

        tileCount++;
      }
    }
  }

  getXWorldPos(x: number, width: number) {
    const offset = this.tileSize / 2;

    if (width % 2 !== 0) {
      return (x - Math.floor(width / 2)) * this.tileSize;
    } else {
      return (x - width / 2) * this.tileSize + offset;
    }
  }

  getYWorldPos(y: number, height: number) {
    const offset = this.tileSize / 2;

    if (height % 2 !== 0) {
      return (Math.floor(height / 2) - y) * -this.tileSize;
    } else {
      return (height / 2 - y) * -this.tileSize + offset;
    }
  }

  getTileWorldPosition(x: number, y: number, width: number, height: number) {
    return { x: this.getXWorldPos(x, width), y: this.getYWorldPos(y, height) };
  }

  getTileInGrid(x: number, y: number) {
    return this.grid.getTile(x, y);
  }

  moveEntityTo(entity: Entity, x: number, y: number) {
    entity.position = { x, y };
    const targetWorldPos = this.getTileWorldPosition(
      x,
      y,
      this.grid.width,
      this.grid.height
    );
    //console.log("target world pos", targetWorldPos);
    //console.log("entity", entity);
    entity.moveToWorldPos(targetWorldPos.x, targetWorldPos.y);
  }

  removeEntityFromTile(entity: Entity, x: number, y: number) {
    const tile = this.getTileInGrid(x, y);
    if (!tile) return;
    const index = tile.entities.indexOf(entity, 0);
    if (index > -1) {
      tile.entities.splice(index, 1);
    }
  }

  addEntityToTile(entity: Entity, x: number, y: number) {
    const tile = this.getTileInGrid(x, y);

    if (!tile) return;
    if (!tile.entities.includes(entity)) tile.entities.push(entity);
  }

  getPanelsInDirection(source: IPoint, direction: Direction) {
    console.log(direction, source);
    const originTile = this.getTileInGrid(source.x, source.y);

    if (!(originTile instanceof Panel) || !originTile) {
      return [];
    } else {
      return this.getAdjacentPanelInDirectionRecursive(source, direction, [
        originTile,
      ]);
    }
  }

  getAdjacentPanelInDirectionRecursive(
    source: IPoint,
    direction: Direction,
    tail: Array<Panel>
  ): Array<Panel> {
    const dirVec = getDirectionVector(direction);
    const adjacentPoint = { x: source.x + dirVec.x, y: source.y + dirVec.y };

    const adjacentPanel = this.getTileInGrid(adjacentPoint.x, adjacentPoint.y);

    if (!(adjacentPanel instanceof Panel) || !adjacentPanel) {
      return tail;
    } else {
      tail.push(adjacentPanel);
      return this.getAdjacentPanelInDirectionRecursive(
        adjacentPoint,
        direction,
        tail
      );
    }
  }

  updateGridState() {
    console.log("update grid state");
    // jank inefficient code
    // i cant for the love of god figure out how to just disable the old panels and turn on new ones
    // because there are cases of overlapping emitters
    // will figure out later
    // for now brute forcing the entire grid works

    if (!this.activePanels) this.activePanels = new Array<Panel>();
    if (!this.lastActivePanels) this.lastActivePanels = new Array<Panel>();

    const emitters = this.grid.getEmitters();
    console.log(emitters);
    let hasChanged = false;
    emitters.forEach((emitter) => {
      console.log("loop emitters");
      console.log(emitter.direction, emitter.lastDirection);
      console.log(emitter.position !== emitter.lastPosition);
      console.log(emitter.direction !== emitter.lastDirection);
      if (
        emitter.position !== emitter.lastPosition ||
        emitter.direction !== emitter.lastDirection
      ) {
        console.log("got some change in position");
        hasChanged = true;
        emitter.lastPosition = emitter.position;
        emitter.lastDirection = emitter.direction;
      }
    });

    if (hasChanged) {
      console.log("update active panels");
      this.updateActivePanels();
    }
  }

  updateActivePanels() {
    const emitters = this.grid.getEmitters();

    console.log("masuk update grid state");
    const newActivePanels = new Array<Panel>();

    this.lastActivePanels = [...this.activePanels];

    this.lastActivePanels.forEach((panel) => {
      panel.active = false;
    });

    emitters.forEach((emitter) => {
      const outputDirections = emitter.outputDirections;

      outputDirections.forEach((direction) => {
        const panels = this.getPanelsInDirection(emitter.position, direction);
        newActivePanels.push(...panels);
      });
    });

    this.activePanels = [...newActivePanels];
    this.activePanels.forEach((panel) => {
      panel.active = true;
    });
  }
}
