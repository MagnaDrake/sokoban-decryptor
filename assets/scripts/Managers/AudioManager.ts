export enum AudioKeys {
  awawawawa,
  SFXVialClink,
  SFXSweep,
  BGMMain,
  BGMTitle,
  SFXPour,
  SFXUIClick,
  SFXVialComplete,
  SFXLevelClear,
  SFXLevelFail,
  SFXFanfare,
  BGMGameplay,
  SFXWalk,
  SFXRotate,
  SFXUndo,
  SFXReset,
  SFXBookTurn,
}

export const AudioKeyStrings = [
  "awawawa",
  "clink",
  "sweep",
  "bgm-main",
  "bgm-title",
  "pour",
  "click",
  "vial-complete",
  "level-clear",
  "levelfail",
  "fanfare",
  "bgm-gameplay",
  "walk",
  "rotate",
  "undo",
  "reset",
  "bookturn",
];

export function getAudioKeyString(key: AudioKeys) {
  return AudioKeyStrings[key];
}

import {
  Node,
  AudioSource,
  AudioClip,
  director,
  game,
  Enum,
  randomRangeInt,
  random,
  tween,
} from "cc";
import { UserDataManager } from "./UserDataManager";

/**
 * @en
 * this is a sington class for audio play, can be easily called from anywhere in you project.
 * @zh
 * 这是一个用于播放音频的单件类，可以很方便地在项目的任何地方调用。
 */

export class AudioManager {
  masterVolume = 1;
  sfxVolume = 1;
  sfxVolumeRatio = 1;

  private static _inst: AudioManager;
  public static get Instance(): AudioManager {
    if (this._inst == null) {
      this._inst = new AudioManager();
    }
    return this._inst;
  }

  private _audioSource: AudioSource;

  audioClips: Map<string, AudioClip>;

  audioSampleVariations: Map<string, number>;

  node: Node;

  constructor() {
    //@en create a node as audioMgr
    //@zh 创建一个节点作为 audioMgr
    let audioMgr = new Node();
    audioMgr.name = "__audioMgr__";
    this.node = audioMgr;

    //@en add to the scene.
    //@zh 添加节点到场景
    director.getScene()!.addChild(audioMgr);

    this.audioClips = new Map<string, AudioClip>();

    this.audioSampleVariations = new Map<string, number>();

    //@en make it as a persistent node, so it won't be destroied when scene change.
    //@zh 标记为常驻节点，这样场景切换的时候就不会被销毁了
    director.addPersistRootNode(audioMgr);

    //@en add AudioSource componrnt to play audios.
    //@zh 添加 AudioSource 组件，用于播放音频。
    this._audioSource = audioMgr.addComponent(AudioSource);

    const volSettings = UserDataManager.Instance.getVolumeSettings();

    this.adjustMusicVolume(volSettings.mVol);
    this.adjustSFXVolume(volSettings.sVol);
  }

  public get audioSource() {
    return this._audioSource;
  }

  /**
   * @en
   * play short audio, such as strikes,explosions
   * @zh
   * 播放短音频,比如 打击音效，爆炸音效等
   * @param sound clip or url for the audio
   * @param volume
   */
  playOneShot(sound: AudioClip | string, volume: number = 1.0) {
    if (sound instanceof AudioClip) {
      this._audioSource.playOneShot(sound, this.sfxVolume);
    } else {
      const clip = this.audioClips.get(sound);
      if (clip) {
        this.audioSource.playOneShot(clip, this.sfxVolume);
      } else {
        console.warn(`Audio Clip of key ${sound} not found`);
      }
      //   resources.load(sound, (err, clip: AudioClip) => {
      //     if (err) {
      //       console.log(err);
      //     } else {
      //       this._audioSource.playOneShot(clip, volume);
      //     }
      //   });
    }
  }

  /**
   * Driver method to play audio with multiple variations
   * For playing specific audio sample use playOneShot instead
   * @param key
   * @param volume
   */
  playOneShotRandom(key: AudioKeys, volume: number = 1.0) {
    const stringKey = getAudioKeyString(key);
    const vars = this.audioSampleVariations.get(stringKey);
    const randomKey = `${stringKey}-${randomRangeInt(0, vars)}`;

    this.playOneShot(randomKey, volume);
  }

  /**
   * @en
   * play long audio, such as the bg music
   * @zh
   * 播放长音频，比如 背景音乐
   * @param sound clip or url for the sound
   * @param volume
   */
  play(sound: AudioClip | string, volume: number = 1.0, loop = false) {
    if (sound instanceof AudioClip) {
      this._audioSource.clip = sound;
      this._audioSource.play();
      this.audioSource.volume = this.masterVolume;
    } else {
      const clip = this.audioClips.get(sound);
      if (clip) {
        this._audioSource.clip = clip;
        this.audioSource.play();
        this.audioSource.loop = loop;
        this.audioSource.volume = this.masterVolume;
      } else {
        console.warn(`Audio Clip of key ${sound} not found`);
      }

      //   resources.load(sound, (err, clip: AudioClip) => {
      //     if (err) {
      //       console.log(err);
      //     } else {
      //       this._audioSource.clip = clip;
      //       this._audioSource.play();
      //       this.audioSource.volume = volume;
      //     }
      //   });
    }
  }

  /**
   * stop the audio play
   */
  stop() {
    this._audioSource.stop();
    this._audioSource.clip = null;
  }

  /**
   * pause the audio play
   */
  pause() {
    this._audioSource.pause();
  }

  /**
   * resume the audio play
   */
  resume() {
    this._audioSource.play();
  }

  setSamples(key: string, variations: number) {
    this.audioSampleVariations.set(key, variations);
  }

  addAudioClip(key: string, clip: AudioClip) {
    if (this.audioClips.has(key)) return;
    this.audioClips.set(key, clip);
  }

  getPersistentNode() {
    return this.node;
  }

  adjustMusicVolume(value: number) {
    if (value <= 0.1) {
      value = 0.001;
    }
    this.masterVolume = value;
    this.sfxVolume = this.sfxVolumeRatio / this.masterVolume;
    this._audioSource.volume = this.masterVolume;
    UserDataManager.Instance.setVolume("mVol", this.masterVolume);
  }

  adjustSFXVolume(value: number) {
    this.sfxVolumeRatio = value;
    this.sfxVolume = this.sfxVolumeRatio / this.masterVolume;
    UserDataManager.Instance.setVolume("sVol", this.sfxVolumeRatio);
  }

  fadeBGM(target: number, duration: number, onComplete?: any) {
    if (this.masterVolume < target) return;
    tween(this._audioSource)
      .to(duration, { volume: target }, { onComplete })
      .start();
  }

  resetVolumesToCache() {
    const { mVol } = UserDataManager.Instance.getVolumeSettings();
    this.fadeBGM(mVol, 1, () => {
      this.adjustMusicVolume(mVol);
    });
  }
}
