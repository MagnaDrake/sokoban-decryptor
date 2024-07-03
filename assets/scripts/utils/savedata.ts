import { decodeBWT, encodeBWT } from "./bwt";
import { decodeRLE, encodeRLE } from "./rle";

export interface UserSaveData {
  completedLevels: number[];
  perfectLevels: number[];
}

export function encodeSaveData(data: string) {
  const bwt = encodeBWT(data);
  const rle = encodeRLE(bwt);

  console.log(rle);
  return rle;
}

export function decodeSaveData(save: string) {
  const irle = decodeRLE(save);
  const ibwt = decodeBWT(irle);
  console.log(ibwt);
  return ibwt;
}
