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
import {
  Direction,
  getDirectionFromRotation,
  getDirectionVector,
  getRotationFromDirection,
  IPoint,
} from "../interfaces/IPoint";
import { Panel } from "../objects/Panel";
import { ActivatePanelsCommand } from "../commands/ActivatePanelsCommand";
import { DeactivatePanelsCommand } from "../commands/DeactivatePanelsCommand";
import { CommandManager } from "./CommandManager";
import { CommandBatch } from "../commands/CommandBatch";
import { SyncPositionCommand } from "../commands/SyncPositionCommand";
import {
  EmitterData,
  EmitterDataClass,
  EntityListData,
  LevelData,
  PlayerData,
  TileData,
  TileTypeData,
} from "../utils/LevelReader";
import { GameManager } from "./GameManager";
import { Player } from "../objects/Player";
import { Emitter, EmitterTypes } from "../objects/Emitter";
import { Splitter } from "../objects/Splitter";
const { ccclass, property } = _decorator;

@ccclass("GridManager")
export class GridManager extends Component {
  @property(Prefab)
  tilePrefab: Prefab;

  @property(Prefab)
  floorPrefab: Prefab;

  @property(Prefab)
  panelPrefab: Prefab;

  @property(Prefab)
  playerPrefab: Prefab;

  @property(Prefab)
  emitterPrefab: Prefab;

  @property(Prefab)
  splitterPrefab: Prefab;

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

  start() {}

  public static get Instance(): GridManager | undefined {
    const instance = this._instance;
    if (instance?.isValid) return instance;
  }

  public static set Instance(value: GridManager) {
    this._instance = value;
  }

  createGrid(width: number, height: number) {
    this.grid.setSize(width, height);
  }

  createLevel(levelData: LevelData) {
    this.createGrid(levelData.levelSize.width, levelData.levelSize.height);
    this.createTiles(levelData.terrain);
    this.createEntities(levelData.entities);
  }

  createTiles(data: TileData[]) {
    data.forEach((tileData) => {
      let tileObject;

      if (tileData.type === TileTypeData.Floor) {
        tileObject = instantiate(this.floorPrefab);
      } else if (tileData.type === TileTypeData.Panel) {
        tileObject = instantiate(this.panelPrefab);
      }

      tileObject.setParent(this.grid.node);
      const wPos = this.getTileWorldPosition(
        tileData.position.x,
        tileData.position.y,
        this.grid.width,
        this.grid.height
      );
      tileObject.setPosition(wPos.x, wPos.y);
      this.grid.setTile(
        tileData.position.x,
        tileData.position.y,
        tileObject.getComponent(Tile)
      );
    });
  }

  createEntities(data: EntityListData) {
    this.createPlayer(data.player);
    this.createEmitters(data.emitters);
    //this.createObstacles();
  }

  createPlayer(data: PlayerData) {
    //console.log("create player");
    //console.log("init pos", data.position.x, data.position.y);
    const player = instantiate(this.playerPrefab);
    const playerEntity = player.getComponent(Player);
    GameManager.Instance.player = playerEntity;
    player.setParent(this.grid.node);
    this.initEntityToGrid(playerEntity, data.position.x, data.position.y);
    const dir = getDirectionFromRotation(data.rotation);
    const dirVec = getDirectionVector(dir);
    playerEntity.changeDirection(dirVec.x, dirVec.y);
  }

  createEmitters(data: EmitterData[]) {
    data.forEach((emitter) => {
      let emitterObject;
      let emitterEntity;
      //console.log(emitter);
      //console.log(EmitterDataClass[emitter.subtype]);
      if (EmitterDataClass[emitter.subtype] === EmitterDataClass.Basic) {
        emitterObject = instantiate(this.emitterPrefab);
        emitterEntity = emitterObject.getComponent(Emitter);
        this.grid.addEmitter(emitterEntity);
      } else if (
        EmitterDataClass[emitter.subtype] === EmitterDataClass.Splitter
      ) {
        emitterObject = instantiate(this.splitterPrefab);
        emitterEntity = emitterObject.getComponent(Splitter);
        this.grid.addSplitter(emitterEntity);
      }

      emitterObject.setParent(this.grid.node);
      emitterEntity.setOutputDirections(EmitterTypes[emitter.outputType]);
      this.initEntityToGrid(
        emitterEntity,
        emitter.position.x,
        emitter.position.y
      );
      //console.log("emitter position");
      //console.log(emitter.position.x, emitter.position.y);
      const dir = getDirectionFromRotation(emitter.rotation);
      const dirVec = getDirectionVector(dir);
      emitterEntity.changeDirection(dirVec.x, dirVec.y);
    });
  }

  initEntityToGrid(entity: Entity, x: number, y: number) {
    this.moveEntityTo(entity, x, y);
    this.addEntityToTile(entity, x, y);
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
      // seems weird
      const entityOnPanel =
        adjacentPanel.entities.length > 0
          ? adjacentPanel.entities[0]
          : undefined;

      tail.push(adjacentPanel);

      if (entityOnPanel?.blocksPanel) {
        return tail;
      } else {
        return this.getAdjacentPanelInDirectionRecursive(
          adjacentPoint,
          direction,
          tail
        );
      }
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

    // why do i have to do this?
    this.lastActivePanels = [...this.activePanels];

    this.lastActivePanels.forEach((panel) => {
      panel.active = false;
    });

    const splitters = this.grid.getSplitters();

    splitters.forEach((splitter) => {
      console.log("deactivate splitter");
      splitter.active = false;
    });

    this.updateActivePanels();

    // this is not working
    this.updateSplitters();

    // jank implementation due to splitters turning on in a grid state update but not included in the active panel state check
    // definitely need to rework the panel turning on system
    // but this should be fine for a game jam
    // but why do i have to do this?

    // const emitters = this.grid.getEmitters();
    // // console.log(emitters);
    // let hasChanged = false;
    // emitters.forEach((emitter) => {
    //   //   console.log("loop emitters");
    //   //   console.log(emitter.direction, emitter.lastDirection);
    //   //   console.log(emitter.position !== emitter.lastPosition);
    //   //   console.log(emitter.direction !== emitter.lastDirection);
    //   if (
    //     emitter.position !== emitter.lastPosition ||
    //     emitter.direction !== emitter.lastDirection
    //   ) {
    //     //console.log("got some change in position");
    //     hasChanged = true;
    //     emitter.lastPosition = emitter.position;
    //     emitter.lastDirection = emitter.direction;
    //   }
    // });

    // if (hasChanged) {
    //   // console.log("update active panels");
    //   this.updateActivePanels();
    // }

    return this.checkWin();
  }

  checkWin() {
    let hasWon = true;

    this.grid.getPanels().forEach((panel) => {
      // console.log(panel.active);
      console.log("panel status", panel.position, panel.active);
      if (!panel.active) hasWon = false;
    });

    return hasWon;
  }

  updateSplitters() {
    const splitters = this.grid.getSplitters();
    const newActivePanels = new Array<Panel>();

    splitters.forEach((emitter) => {
      // if (emitter instanceof Splitter && !emitter.active) {
      //   console.log("emitter is not active");
      //   return;
      // }
      if (!emitter.active) return;

      const outputDirections = emitter.outputDirections;

      outputDirections.forEach((direction) => {
        const panels = this.getPanelsInDirection(emitter.position, direction);
        console.log("new splitter panels", panels);
        newActivePanels.push(...panels);
      });
    });

    const updatedSplitters = [];

    newActivePanels.forEach((panel) => {
      if (panel.entities.length > 0) {
        const entity = panel.entities[0];
        if (entity instanceof Splitter) {
          panel.active = true;
          updatedSplitters.push(entity);
        } else if (entity instanceof Emitter) {
          panel.active = true;
        }
      } else {
        panel.active = true;
      }
    });

    const splitterPanels = this.updateSplittersRecursive(updatedSplitters, []);

    this.activePanels = [...newActivePanels, ...splitterPanels];
  }

  updateSplittersRecursive(splitters: Splitter[], panels: Panel[]) {
    let newActiveSplitters = [];
    if (splitters.length <= 0) {
      return panels;
    } else {
      splitters.forEach((emitter) => {
        // if (emitter instanceof Splitter && !emitter.active) {
        //   console.log("emitter is not active");
        //   return;
        // }
        if (!emitter.active) return;

        const outputDirections = emitter.outputDirections;

        outputDirections.forEach((direction) => {
          const splitterPanels = this.getPanelsInDirection(
            emitter.position,
            direction
          );
          console.log("new splitter panels", panels);
          panels.push(...splitterPanels);
        });
      });

      panels.forEach((panel) => {
        if (panel.entities.length > 0) {
          const entity = panel.entities[0];
          if (entity instanceof Splitter) {
            panel.active = true;
            newActiveSplitters.push(entity);
          } else if (entity instanceof Emitter) {
            panel.active = true;
          }
        } else {
          panel.active = true;
        }
      });

      return this.updateSplittersRecursive(newActiveSplitters, panels);
    }
  }

  // the entire active panel checking has turn to shit due to splitters
  // i will refrain in adding more features for now
  updateActivePanels() {
    console.log("update active panels");
    const emitters = this.grid.getEmitters();

    //    console.log("masuk update grid state");
    const newActivePanels = new Array<Panel>();

    emitters.forEach((emitter) => {
      // if (emitter instanceof Splitter && !emitter.active) {
      //   console.log("emitter is not active");
      //   return;
      // }

      const outputDirections = emitter.outputDirections;
      console.log("emitter position", emitter.position);

      outputDirections.forEach((direction) => {
        const panels = this.getPanelsInDirection(emitter.position, direction);
        console.log("emitter panels", panels);
        newActivePanels.push(...panels);
      });
    });

    // jank double checking

    this.activePanels = [...newActivePanels];
    // why do i have to do this?
    this.activePanels.forEach((panel) => {
      if (panel.entities.length > 0) {
        const entity = panel.entities[0];
        console.log("update active check entity");
        console.log(entity);
        console.log("panel position", panel.position);
        if (entity instanceof Splitter) {
          console.log("activate emitter");
          panel.active = true;
          console.log("will run secondary update");
        } else if (entity instanceof Emitter) {
          panel.active = true;
        }
        // intended purpose is to skip walls and other entity blocking events
      } else {
        panel.active = true;
      }
    });
  }

  clearGrid() {
    this.grid.clear();
    this.activePanels = undefined;
    this.lastActivePanels = undefined;
  }
}
