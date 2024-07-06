import { SaveFlags } from "../Managers/UserDataManager";
import { decodeBWT, encodeBWT } from "./bwt";
import { decodeRLE, encodeRLE } from "./rle";

const char = "abcdefghijklmnopqrstuvwxyz";
const delimiter = "Z";

const specialSaveChar = ["E", "F", "G", "W"];

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
  if (irle === -1) return -1;
  const ibwt = decodeBWT(irle);
  return ibwt;
}

export function convertStringToLevel(input) {
  if (!input) return [-1];
  const save = input.split(delimiter);

  for (let i = 0; i < save.length; i++) {
    let entry = save[i];
    //console.log("decode entry", entry);
    let num = entry.split("");
    let id = "";
    for (let j = 0; j < num.length; j++) {
      let conv;
      //console.log(num[j]);
      // console.log(specialSaveChar.includes(num[j]));
      if (specialSaveChar.includes(num[j])) {
        id = id.concat(num[j]);
      } else {
        conv = num[j].charCodeAt(0) - 97;
        id = id.concat(conv.toString());
      }
    }

    //console.log("decyphered level id", id);

    // jank
    switch (id) {
      case SaveFlags.Clear100P:
      case SaveFlags.FinishedGame:
      case SaveFlags.HasWatchedEnding:
        //console.log("gottem");
        save[i] = id;
        break;
      default:
        let level = parseInt(id);
        save[i] = Number.isNaN(level) ? 0 : level;
        if (level > 1000) return [-1];
        break;
    }
  }
  return save;
}

export function convertLevelToString(input) {
  // console.log(input);
  const save = input.toString().split(",");

  //console.log("attempt save level", save);
  for (let i = 0; i < save.length; i++) {
    let entry = save[i];
    // console.log("entry", entry);
    let num = entry.split("");
    let id = "";
    for (let j = 0; j < num.length; j++) {
      //   console.log("split string", num[j]);
      if (specialSaveChar.includes(num[j])) {
        //  console.log(num[j]);
        id = id.concat(num[j]);
      } else {
        id = id.concat(char.charAt(parseInt(num[j])));
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
  if (decoded === -1) return [-1];
  return convertStringToLevel(decoded);
}
