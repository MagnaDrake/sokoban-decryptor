import { _decorator, Component, Node } from "cc";
import { encodeSaveData, load, save } from "../utils/savedata";
const { ccclass, property } = _decorator;

export interface UserSaveData {
  completedLevels: number[];
  perfectLevels: number[];
}

@ccclass("UserDataManager")
export class UserDataManager {
  userData: UserSaveData;
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
        const loadedData = load(storedUserData);
        data = { completedLevels: loadedData, perfectLevels: [] };
      } else {
        data = { completedLevels: [], perfectLevels: [] };
        localStorage.setItem("userData", "");
      }
    } else {
      console.log(
        "localStorage is not available! Progress will be lost once the game is closed."
      );
      data = { completedLevels: [], perfectLevels: [] };
    }

    this.userData = data;
  }

  saveUserData(data: UserSaveData) {
    if (this.isLocalStorageAvailable()) {
      const encodedSave = save(data.completedLevels);
      localStorage.setItem("userData", encodedSave);
    } else {
      console.log(
        "localStorage is not available! Progress will be lost once the game is closed."
      );
    }

    this.userData = data;
  }

  getUserData() {
    if (this.isLocalStorageAvailable()) {
      const data = localStorage.getItem("userData");
      return JSON.parse(data as string) as UserSaveData;
    } else {
      console.log("localStorage is not available.");
      return this.userData;
    }
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
}
