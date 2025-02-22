import { _decorator, Component, Node } from "cc";
import { encodeSaveData, load, save } from "../utils/savedata";
const { ccclass, property } = _decorator;

export enum SaveFlags {
  FinishedGame = "FG",
  Clear100P = "CA",
  HasWatchedEnding = "WE",
}

export interface UserSaveData {
  completedLevels: number[];
  perfectLevels: number[];
  hasWatchedEnding?: boolean;
  hasFinishedGame?: boolean;
  hasFullClear?: boolean;
}

export const FinishGameCheck = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
];

export const FullClearCheck = [...FinishGameCheck, 21, 22, 23, 24, 25];

@ccclass("UserDataManager")
export class UserDataManager {
  userData: UserSaveData;

  saveCode: string;

  private static _inst: UserDataManager;
  public static get Instance(): UserDataManager {
    if (!this._inst || this._inst == undefined || this._inst == null) {
      this._inst = new UserDataManager();
    }
    return this._inst;
  }

  constructor() {
    let data;

    if (this.isLocalStorageAvailable()) {
      const storedUserData = localStorage.getItem("userData");
      if (storedUserData) {
        // this code block is probably better as own function
        // later
        let code = storedUserData;
        let loadedData = load(storedUserData);

        let levels;
        let fc;
        let we;

        if (loadedData[0] === -1) {
          loadedData = [0];
          code = "";
        }

        levels = loadedData.filter((v) => {
          return typeof v === "number";
        });

        fc = loadedData.filter((v) => {
          return v === SaveFlags.FinishedGame;
        });

        we = loadedData.filter((v) => {
          return v === SaveFlags.HasWatchedEnding;
        });

        this.saveCode = code;
        data = {
          completedLevels: levels,
          perfectLevels: [],
          hasFinishedGame: fc[0] !== undefined ? true : false,
          hasWatchedEnding: we[0] !== undefined ? true : false,
        };
      } else {
        data = {
          completedLevels: [0],
          perfectLevels: [],
          hasFinishedGame: false,
          hasWatchedEnding: false,
        };

        localStorage.setItem("userData", save(data.completedLevels));
        this.saveCode = localStorage.getItem("userData");
      }

      const mVol = localStorage.getItem("mVol");
      const sVol = localStorage.getItem("sVol");

      if (!mVol) localStorage.setItem("mVol", "1");
      if (!sVol) localStorage.setItem("sVol", "1");
    } else {
      console.log(
        "localStorage is not available! Progress will be lost once the game is closed."
      );
      data = {
        completedLevels: [0],
        perfectLevels: [],
        hasFinishedGame: false,
        hasWatchedEnding: false,
      };
      this.saveCode = "";
    }

    this.userData = data;
    // console.log("load user data init", data);
  }

  saveUserData(data: UserSaveData) {
    const hasFinishedGame = this.checkFinishGame(data.completedLevels);

    data.hasFinishedGame = hasFinishedGame;

    const hasClear = this.checkFullClear(data.completedLevels);

    data.hasFullClear = hasClear;

    const saveDataArray = [...data.completedLevels] as any[];

    if (hasFinishedGame) {
      saveDataArray.push(SaveFlags.FinishedGame);
    }

    if (hasClear) {
      saveDataArray.push(SaveFlags.Clear100P);
    }

    if (data.hasWatchedEnding) {
      saveDataArray.push(SaveFlags.HasWatchedEnding);
    }

    const encodedSave = save(saveDataArray);
    this.saveCode = encodedSave;
    this.userData = data;

    if (this.isLocalStorageAvailable()) {
      localStorage.setItem("userData", encodedSave);
    } else {
      console.log(
        "localStorage is not available! Progress will be lost once the game is closed."
      );
    }
  }

  checkFullClear(data: (number | string)[]) {
    return FullClearCheck.every((lv) => data.includes(lv));
  }

  checkFinishGame(data: (number | string)[]) {
    return FinishGameCheck.every((lv) => data.includes(lv));
  }

  getUserData(fromCache = false) {
    if (fromCache) return this.userData;

    if (this.isLocalStorageAvailable()) {
      const storedUserData = localStorage.getItem("userData");
      let data;
      if (storedUserData !== undefined) {
        let loadedData = load(storedUserData);
        let levels;
        let fc;
        let we;

        if (loadedData[0] === -1) {
          loadedData = [0];
        }

        levels = loadedData.filter((v) => {
          return typeof v === "number";
        });

        fc = loadedData.filter((v) => {
          return v === SaveFlags.FinishedGame;
        });

        we = loadedData.filter((v) => {
          return v === SaveFlags.HasWatchedEnding;
        });

        data = {
          completedLevels: levels,
          perfectLevels: [],
          hasFinishedGame: fc[0] !== undefined ? true : false,
          hasWatchedEnding: we[0] !== undefined ? true : false,
        };
        return data as UserSaveData;
      }

      //  const data = localStorage.getItem("userData");
      // return JSON.parse(data as string) as UserSaveData;
    } else {
      console.log("localStorage is not available.");
      return this.userData;
    }
  }

  getSaveCode() {
    return this.saveCode;
  }

  isLocalStorageAvailable() {
    let storage;
    try {
      storage = window["localStorage"];
      const x = "__storage_test__";
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return (
        e instanceof DOMException &&
        // everything except Firefox
        (e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          e.name === "QuotaExceededError" ||
          // Firefox
          e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage &&
        storage.length !== 0
      );
    }
  }

  getVolumeSettings() {
    let mVol = parseFloat(localStorage.getItem("mVol"));
    let sVol = parseFloat(localStorage.getItem("sVol"));

    if (isNaN(mVol)) mVol = 1;
    if (isNaN(sVol)) mVol = 1;

    return { mVol, sVol };
  }

  setVolume(key: string, value: number) {
    localStorage.setItem(key, value.toString());
  }

  isVPadForceActive() {
    const prefs = localStorage.getItem("vPadOn");
    if (prefs !== undefined) {
      return prefs === "true";
    } else {
      return undefined;
    }
  }

  saveVpadSettings(value: boolean) {
    const item = value ? "true" : "false";
    localStorage.setItem("vPadOn", item);
  }
}
