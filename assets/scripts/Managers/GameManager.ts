import {
  _decorator,
  Component,
  Game,
  instantiate,
  KeyCode,
  Node,
  Prefab,
} from "cc";
import {
  Direction,
  getDirection,
  getRotationFromDirection,
  IPoint,
  RotateDirection,
  VECTOR_DOWN,
  VECTOR_LEFT,
  VECTOR_RIGHT,
  VECTOR_UP,
} from "../interfaces/IPoint";
import { GridManager } from "./GridManager";
import { Player } from "../objects/Player";
import { MoveCommand } from "../commands/MoveCommand";
import { Entity } from "../objects/Entity";
import { CommandManager } from "./CommandManager";
import { CommandBatch } from "../commands/CommandBatch";
import { RotateCommand } from "../commands/RotateCommand";
import { Emitter, EmitterTypes } from "../objects/Emitter";
import { StepRotationCommand } from "../commands/StepRotationCommand";
import { LevelManager } from "./LevelManager";
const { ccclass, property } = _decorator;

@ccclass("GameManager")
export class GameManager extends Component {
  static _instance: GameManager;

  public static get Instance(): GameManager | undefined {
    const instance = this._instance;
    if (instance?.isValid) return instance;
  }

  public static set Instance(value: GameManager) {
    this._instance = value;
  }

  protected onLoad(): void {
    const instance = GameManager.Instance;

    if (instance?.isValid && instance !== this) {
      this.destroy();
      return;
    }

    if (!instance || !instance.isValid) {
      GameManager.Instance = this;
    }
  }

  @property(Prefab)
  playerPrefab: Prefab;

  @property(Prefab)
  emitterPrefab: Prefab;

  player: Player;

  start() {
    this.scheduleOnce(() => {
      // this.setupDummyGrid();
      this.loadLevelData(0);
    }, 0.2);
  }

  setupDummyGrid() {
    this.player = instantiate(this.playerPrefab).getComponent(Player);
    this.player.node.setParent(GridManager.Instance.grid.node);
    GridManager.Instance.moveEntityTo(this.player, 0, 0);
    this.player.node.setRotationFromEuler(
      0,
      0,
      getRotationFromDirection(Direction.RIGHT)
    );
    GridManager.Instance.addEntityToTile(this.player, 0, 0);

    const emitter = instantiate(this.emitterPrefab);
    emitter.getComponent(Emitter).setOutputDirections(EmitterTypes.SINGLE);
    emitter.setParent(GridManager.Instance.grid.node);
    GridManager.Instance.moveEntityTo(emitter.getComponent(Entity), 1, 1);
    emitter.getComponent(Emitter).changeDirection(0, 1);
    // todo create a level reader/editor for this
    GridManager.Instance.addEntityToTile(emitter.getComponent(Entity), 1, 1);
    GridManager.Instance.grid.addEmitter(emitter.getComponent(Emitter));

    const emitterDouble = instantiate(this.emitterPrefab);
    emitterDouble
      .getComponent(Emitter)
      .setOutputDirections(EmitterTypes.DOUBLE);
    emitterDouble.setParent(GridManager.Instance.grid.node);
    GridManager.Instance.moveEntityTo(emitterDouble.getComponent(Entity), 5, 2);
    emitterDouble.getComponent(Emitter).changeDirection(0, 1);
    // todo create a level reader/editor for this
    GridManager.Instance.addEntityToTile(
      emitterDouble.getComponent(Entity),
      5,
      2
    );
    GridManager.Instance.grid.addEmitter(emitterDouble.getComponent(Emitter));

    const emitterT = instantiate(this.emitterPrefab);
    emitterT.getComponent(Emitter).setOutputDirections(EmitterTypes.T_JUNCTION);
    emitterT.setParent(GridManager.Instance.grid.node);
    GridManager.Instance.moveEntityTo(emitterT.getComponent(Entity), 1, 2);
    emitterT.getComponent(Emitter).changeDirection(0, 1);
    // todo create a level reader/editor for this
    GridManager.Instance.addEntityToTile(emitterT.getComponent(Entity), 1, 2);
    GridManager.Instance.grid.addEmitter(emitterT.getComponent(Emitter));

    const emitterL = instantiate(this.emitterPrefab);
    emitterL.getComponent(Emitter).setOutputDirections(EmitterTypes.L_CURVE);
    emitterL.setParent(GridManager.Instance.grid.node);
    GridManager.Instance.moveEntityTo(emitterL.getComponent(Entity), 1, 4);
    emitterL.getComponent(Emitter).changeDirection(0, 1);
    // todo create a level reader/editor for this
    GridManager.Instance.addEntityToTile(emitterL.getComponent(Entity), 1, 4);
    GridManager.Instance.grid.addEmitter(emitterL.getComponent(Emitter));

    const emitterJ = instantiate(this.emitterPrefab);
    emitterJ.getComponent(Emitter).setOutputDirections(EmitterTypes.J_CURVE);
    emitterJ.setParent(GridManager.Instance.grid.node);
    GridManager.Instance.moveEntityTo(emitterJ.getComponent(Entity), 3, 4);
    emitterJ.getComponent(Emitter).changeDirection(0, 1);
    // todo create a level reader/editor for this
    GridManager.Instance.addEntityToTile(emitterJ.getComponent(Entity), 3, 4);
    GridManager.Instance.grid.addEmitter(emitterJ.getComponent(Emitter));

    const emitterQuad = instantiate(this.emitterPrefab);
    emitterQuad.getComponent(Emitter).setOutputDirections(EmitterTypes.QUAD);
    emitterQuad.setParent(GridManager.Instance.grid.node);
    GridManager.Instance.moveEntityTo(emitterQuad.getComponent(Entity), 4, 4);
    emitterQuad.getComponent(Emitter).changeDirection(0, 1);
    // todo create a level reader/editor for this
    GridManager.Instance.addEntityToTile(
      emitterQuad.getComponent(Entity),
      4,
      4
    );
    GridManager.Instance.grid.addEmitter(emitterQuad.getComponent(Emitter));

    GridManager.Instance.updateGridState();
  }

  onUndoKeyInput() {
    CommandManager.Instance.undoCommandBatch();
    GridManager.Instance.updateGridState();
  }

  onInteractInput(keyCode: KeyCode) {
    switch (keyCode) {
      case KeyCode.KEY_Q:
        this.rotateEntityOnGrid(RotateDirection.COUNTER_CLOCKWISE);
        return;
      case KeyCode.KEY_R:
        this.rotateEntityOnGrid(RotateDirection.CLOCKWISE);
        return;
    }
  }

  rotateEntityOnGrid(rot: RotateDirection) {
    const targetPos = this.player.getPosInFront();
    const targetTile = GridManager.Instance.getTileInGrid(
      targetPos.x,
      targetPos.y
    );

    if (!targetTile) return;

    // currently assuming a tile can only have 1 entity
    const batch = new CommandBatch();
    const entityToRotate = targetTile.entities[0];
    if (!entityToRotate) return;
    const rotateEntityCommand = new StepRotationCommand(entityToRotate, rot);
    batch.add(rotateEntityCommand);
    this.executeCommand(batch);
  }

  onMovementKeyInput(keyCode: KeyCode) {
    let direction;
    switch (keyCode) {
      case KeyCode.ARROW_UP:
        direction = VECTOR_UP;
        break;
      case KeyCode.ARROW_DOWN:
        direction = VECTOR_DOWN;
        break;
      case KeyCode.ARROW_LEFT:
        direction = VECTOR_LEFT;
        break;
      case KeyCode.ARROW_RIGHT:
        direction = VECTOR_RIGHT;
        break;
    }
    // jank
    // surely there is a better way to handle movement logic
    // will change later if needed.

    // movement rules
    // attempt to move towards a direction
    // if player is currently does not face the input direction, rotate towards it
    // check if tile if traversable or not. if not, do not progress further
    // check if traversable alreacy contains an entity
    // if the player initially does not face the entity, stop
    //

    let changeDirection = false;
    const targetPosition: IPoint = {
      x: this.player.position.x + direction.x,
      y: this.player.position.y + direction.y,
    };

    // check if tile exist
    const tile = GridManager.Instance.getTileInGrid(
      targetPosition.x,
      targetPosition.y
    );

    const batch = new CommandBatch();

    const targetDirection = getDirection(direction.x, direction.y);
    if (this.player.direction !== targetDirection) {
      const rotatePlayerCommand = new RotateCommand(
        this.player,
        targetDirection
      );
      batch.add(rotatePlayerCommand);
      changeDirection = true;
    }

    if (tile) {
      // also check if tile has any existing entity
      // if another entity exist, check if pushing it to the same direction results a vali move
      // for now assume tiles can only have one entity
      console.log("check for entities on this tile");
      //   console.log(tile.position);
      //  console.log(tile.entities);

      if (tile.entities.length > 0 && tile.entities[0] !== undefined) {
        // console.log(tile.entities[0]);

        if (changeDirection) {
          // console.log("only attempt to face the entity but not move towards");
          this.executeCommand(batch);
          return;
        }

        const nextTile = GridManager.Instance.getTileInGrid(
          targetPosition.x + direction.x,
          targetPosition.y + direction.y
        );

        if (nextTile && nextTile.entities.length < 1) {
          const moveEntityCommand = new MoveCommand(
            tile.entities[0],
            targetPosition.x + direction.x,
            targetPosition.y + direction.y,
            tile.entities[0].position.x,
            tile.entities[0].position.y
          );
          batch.add(moveEntityCommand);
          //console.log("will attempt to move entities");
        } else {
          //console.log("expected to hit a wall because of emitter cannot move");
          this.executeCommand(batch);
          return;
        }
      }

      const movePlayerCommand = new MoveCommand(
        this.player,
        targetPosition.x,
        targetPosition.y,
        this.player.position.x,
        this.player.position.y
      );

      batch.add(movePlayerCommand);
    }
    this.executeCommand(batch);
  }

  executeCommand(batch: CommandBatch) {
    CommandManager.Instance.executeCommandBatch(batch);
    // todo
    // i dont really like this approach because this makes the command batch execution segmented
    GridManager.Instance.updateGridState();
  }

  loadLevelData(id: number) {
    const levelData = LevelManager.Instance.levelData[id];
    if (levelData) {
      GridManager.Instance.createLevel(levelData);
    }
  }
}
