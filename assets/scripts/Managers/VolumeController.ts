import { _decorator, Component, Label, Node, Slider } from "cc";
import { AudioManager } from "./AudioManager";
const { ccclass, property } = _decorator;

@ccclass("VolumeController")
export class VolumeController extends Component {
  @property(Slider)
  bgmSlider!: Slider;
  @property(Slider)
  sfxSlider!: Slider;

  @property(Label)
  BGMVolumeLabel!: Label;

  @property(Label)
  SFXVolumeLabel!: Label;

  masterVolume = 1;
  sfxVolume = 1;

  protected onLoad(): void {
    this.masterVolume = AudioManager.Instance.masterVolume;
    this.sfxVolume = AudioManager.Instance.sfxVolumeRatio;

    this.bgmSlider.progress = this.masterVolume;
    this.sfxSlider.progress = this.sfxVolume;

    this.BGMVolumeLabel.string = parseInt(
      (this.masterVolume * 100).toFixed(2)
    ).toString();
    this.SFXVolumeLabel.string = parseInt(
      (this.sfxVolume * 100).toFixed(2)
    ).toString();
  }

  onSliderChange(slider: Slider, id?: string) {
    if (id === "bgm") {
      this.adjustMusicVolume(slider.progress);
    } else {
      this.adjustSFXVolume(slider.progress);
    }
  }

  adjustMusicVolume(value: number) {
    this.masterVolume = value;

    // what the fuck is this?
    this.BGMVolumeLabel.string = parseInt((value * 100).toFixed(2)).toString();

    AudioManager.Instance.adjustMusicVolume(value);
  }

  adjustSFXVolume(value: number) {
    this.sfxVolume = value;
    this.SFXVolumeLabel.string = parseInt((value * 100).toFixed(2)).toString();

    AudioManager.Instance.adjustSFXVolume(value);
  }
}
