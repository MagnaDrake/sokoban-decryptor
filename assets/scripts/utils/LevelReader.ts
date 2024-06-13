import { IPoint, Size } from "../interfaces/IPoint";
import { EmitterTypes } from "../objects/Emitter";

export enum TileTypeData {
  Floor = 12,
  Wall,
  Panel = 43,
}

export enum EmitterDataType {
  SINGLE = 25,
  J_CURVE = 20,
  T_JUNCTION = 30,
  L_CURVE = 52,
  DOUBLE = 40,
  QUAD = 33,
}

export function convertEmitterDataTypeToRealData(type: EmitterDataType) {
  switch (type) {
    case EmitterDataType.SINGLE:
      return EmitterTypes.SINGLE;
    case EmitterDataType.J_CURVE:
      return EmitterTypes.J_CURVE;
    case EmitterDataType.T_JUNCTION:
      return EmitterTypes.T_JUNCTION;
    case EmitterDataType.L_CURVE:
      return EmitterTypes.L_CURVE;
    case EmitterDataType.DOUBLE:
      return EmitterTypes.DOUBLE;
    case EmitterDataType.QUAD:
      return EmitterTypes.QUAD;
  }
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
export enum EmitterDataClass {
  NORMAL,
  HEAVY,
  STATIC,
  FIXED,
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
  type: EmitterDataType;
  class: EmitterDataClass;
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

  console.log(json);
  const { width, height, layers } = json;
  console.log("reading width and height");
  console.log(width, height);

  let terrainLayer;
  let entityLayer;

  layers.forEach((layer) => {
    const { name } = layer;
    if (name === LayerGroupName.Terrain) {
      console.log(layer);
      terrainLayer = layer.layers[0].data;
    } else if (name === LayerGroupName.Entities) {
      entityLayer = layer.layers;
    }
  });

  console.log(terrainLayer);

  console.log(entityLayer);

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
  console.log(playerData);
  console.log(emitterData);

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
    console.log(emitter.class);
    console.log(emitter.x, emitter.y);
    const posRotOffset = getRotationOffset(emitter.rotation);

    const emitterPos: IPoint = {
      x: emitter.x / 64 + posRotOffset.x,
      y: Math.abs(emitter.y / 64 - 1 - 9) + posRotOffset.y,
    };

    const fixRot =
      Math.abs(emitter.rotation) === 90 ? -emitter.rotation : emitter.rotation;

    const data: EmitterData = {
      type: emitter.gid,
      position: emitterPos,
      rotation: fixRot,
      class: EmitterDataClass.NORMAL,
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
        y: Math.abs(playerData.y / 64 - 1) - 9 + posRotOffset.y,
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
