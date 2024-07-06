import { _decorator, Component, Node } from "cc";
import { encodeSaveData, load, save } from "../utils/savedata";
const { ccclass, property } = _decorator;

export enum SaveFlags {
  ClearFirst = "CF",
  Clear100P = "CA",
  HasWatchedEnding = "EW",
}

export interface UserSaveData {
  completedLevels: number[];
  perfectLevels: number[];
}

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
        let code = storedUserData;
        let loadedData = load(storedUserData);
        if (loadedData[0] === -1) {
          loadedData = [0];
          code = "";
        }
        this.saveCode = code;
        data = { completedLevels: loadedData, perfectLevels: [] };
      } else {
        data = { completedLevels: [0], perfectLevels: [] };
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
      data = { completedLevels: [0], perfectLevels: [] };
      this.saveCode = "";
    }

    this.userData = data;
  }

  saveUserData(data: UserSaveData) {
    const encodedSave = save(data.completedLevels);
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem("userData", encodedSave);
    } else {
      console.log(
        "localStorage is not available! Progress will be lost once the game is closed."
      );
    }
    this.saveCode = encodedSave;
    this.userData = data;
  }

  getUserData() {
    if (this.isLocalStorageAvailable()) {
      const storedUserData = localStorage.getItem("userData");
      let data;
      if (storedUserData !== undefined) {
        const loadedData = load(storedUserData);
        data = { completedLevels: loadedData, perfectLevels: [] };
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
    let mVol = parseInt(localStorage.getItem("mVol"));
    let sVol = parseInt(localStorage.getItem("sVol"));

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
