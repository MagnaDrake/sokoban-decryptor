import { decodeBWT, encodeBWT } from "./bwt";
import { decodeRLE, encodeRLE } from "./rle";

const char = "abcdefghijklmnopqrstuvwxyz";
const delimiter = "Z";

export interface UserSaveData {
  completedLevels: number[];
  perfectLevels: number[];
}

export function encodeSaveData(data: string) {
  const bwt = encodeBWT(data);
  const rle = encodeRLE(bwt);
  return rle;
}

export function decodeSaveData(save: string) {
  const irle = decodeRLE(save);
  const ibwt = decodeBWT(irle);
  return ibwt;
}

export function convertStringToLevel(input) {
  const save = input.split(delimiter);

  for (let i = 0; i < save.length; i++) {
    let entry = save[i];
    let num = entry.split("");
    let id = "";
    for (let j = 0; j < num.length; j++) {
      const conv = num[j].charCodeAt(0) - 96;
      id = id.concat(conv.toString());
    }
    let level = parseInt(id);
    save[i] = Number.isNaN(level) ? 0 : level;
    console.log(save[i]);
  }
  console.log(save);
  return save;
}

export function convertLevelToString(input) {
  const save = input.toString().split(",");
  console.log(save);
  console.log(save.length);
  for (let i = 0; i < save.length; i++) {
    let entry = save[i];
    let num = entry.split("");
    let id = "";
    for (let j = 0; j < num.length; j++) {
      const conv = parseInt(num[j]);
      console.log(conv);
      if (conv < 1) {
        id = "";
      } else {
        id = id.concat(char.charAt(parseInt(num[j]) - 1));
      }
    }
    save[i] = id;
  }

  const regex = /,/g;

  let res = save.toString().replace(regex, delimiter);

  return res;
}

export function save(data: any[]) {
  const encdata = convertLevelToString(data);
  return encodeSaveData(encdata);
}

export function load(data: string) {
  const decoded = decodeSaveData(data);
  return convertStringToLevel(decoded);
}
