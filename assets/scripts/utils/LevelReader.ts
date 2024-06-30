import { IPoint, Size } from "../interfaces/IPoint";
import { EmitterTypes } from "../objects/Emitter";

export enum TileTypeData {
  Floor = 12,
  Wall,
  Panel = 43,
}

export enum SplitterDataType {
  // todo
  // figure out a way to more cleanly separate obstacle types in the level editor
  // for some reason class and type from the tiled map editor doesnt work
  // simplest way is to have an enum that reads all individual GID
  // then map the GID into specific objects
  QUAD = 31,
}

export function getRotationOffset(rot: number) {
  switch (rot) {
    case 0:
      return { x: 0, y: 0 };
    case 90:
      return { x: 0, y: -1 };
    case 180:
      return { x: -1, y: -1 };
    case -90:
      return { x: -1, y: 0 };
  }
}

// probably dont need this?
// nanti dipikir ulang
// for now lump splitter into data class
// perhaps in the future if we want to have a fixed/static/heavy splitter we will handle in the future
export enum EmitterDataClass {
  Basic,
  Heavy,
  Static,
  Fixed,
  Splitter,
}

export interface EntityListData {
  player: PlayerData;
  emitters: EmitterData[];
}

export interface EntityData {
  position: IPoint;
  rotation: number;
}

export interface PlayerData extends EntityData {}

export interface EmitterData extends EntityData {
  outputType: string;
  subtype: string;
  movable: boolean;
  rotatable: boolean;
}

export interface TileData {
  position: IPoint;
  type: TileTypeData;
}

export interface LevelData {
  levelSize: Size;
  terrain: TileData[];
  entities: EntityListData;
}

export enum LayerGroupName {
  Terrain = "Terrain",
  Entities = "Entities",
}

export enum EntityLayerName {
  Player = "Player",
  Emitters = "Emitters",
}

export function readRawLevelData(json: any) {
  //definitly can optimize/abstract this even further
  // do it later

  //console.log(json);
  const { width, height, layers } = json;
  //console.log("reading width and height");
  //console.log(width, height);

  let terrainLayer;
  let entityLayer;

  layers.forEach((layer) => {
    const { name } = layer;
    if (name === LayerGroupName.Terrain) {
      terrainLayer = layer.layers[0].data;
    } else if (name === LayerGroupName.Entities) {
      entityLayer = layer.layers;
    }
  });

  //  console.log(terrainLayer);

  //console.log(entityLayer);

  let playerData;
  let emitterData;

  for (let i = 0; i < entityLayer.length; i++) {
    const layer = entityLayer[i];
    const { name } = layer;

    if (name === EntityLayerName.Player) {
      playerData = layer.objects[0];
    } else if (name === EntityLayerName.Emitters) {
      emitterData = layer.objects;
    }
  }
  //console.log(playerData);
  //console.log(emitterData);

  let tileData: TileData[] = [];
  let index = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const fixedY = Math.abs(y - 9);
      const pos = { x: x, y: fixedY };
      tileData.push({ position: pos, type: terrainLayer[index] });
      index++;
    }
  }

  let emitterParsedData = [];

  emitterData.forEach((emitter) => {
    // console.log(emitter.class);
    //console.log(emitter.x, emitter.y);
    const posRotOffset = getRotationOffset(emitter.rotation);

    const emitterPos: IPoint = {
      x: emitter.x / 64 + posRotOffset.x,
      y: Math.abs(emitter.y / 64 - 1 - (height - 1)) + posRotOffset.y,
    };

    console.log("read");
    const emitterProps = emitter.properties;

    const outputType = emitterProps[0].value;
    const emitterType = emitterProps[1].value;
    const movable = emitterProps[2].value;
    const rotatable = emitterProps[3].value;

    const fixRot =
      Math.abs(emitter.rotation) === 90 ? -emitter.rotation : emitter.rotation;

    const data: EmitterData = {
      outputType: outputType,
      position: emitterPos,
      rotation: fixRot,
      subtype: emitterType,
      movable: movable,
      rotatable: rotatable
    };

    emitterParsedData.push(data);
  });

  const posRotOffset = getRotationOffset(playerData.rotation);

  const playerDataFixRot =
    Math.abs(playerData.rotation) === 90
      ? -playerData.rotation
      : playerData.rotation;

  const entityListData: EntityListData = {
    player: {
      position: {
        x: playerData.x / 64 + posRotOffset.x,
        y: Math.abs(playerData.y / 64 - 1 - (height - 1)) + posRotOffset.y,
      },
      rotation: playerDataFixRot,
    },
    emitters: emitterParsedData,
  };

  const levelData: LevelData = {
    levelSize: { width, height },
    terrain: tileData,
    entities: entityListData,
  };

  return levelData;
}
