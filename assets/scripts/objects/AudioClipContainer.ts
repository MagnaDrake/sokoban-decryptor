import { _decorator, AudioClip, Component, Enum, Node } from "cc";
import {
  AudioKeys,
  AudioKeyStrings,
  AudioManager,
  getAudioKeyString,
} from "../Managers/AudioManager";
const { ccclass, property } = _decorator;

@ccclass("AudioClipContainer")
export class AudioClipContainer extends Component {
  @property({ type: Enum(AudioKeys) })
  key: AudioKeys = AudioKeys.awawawawa;

  @property([AudioClip])
  clips: AudioClip[] = [];

  onLoad() {
    AudioManager.Instance;
    if (this.clips.length <= 0) return;
    if (this.clips.length > 1) {
      AudioManager.Instance.setSamples(
        getAudioKeyString(this.key),
        this.clips.length
      );
      this.clips.forEach((clip, index) => {
        AudioManager.Instance.addAudioClip(
          `${getAudioKeyString(this.key)}-${index}`,
          clip
        );
      });
    } else {
      AudioManager.Instance.addAudioClip(
        AudioKeyStrings[this.key],
        this.clips[0]
      );
    }

    this.node.setParent(AudioManager.Instance.getPersistentNode());
  }
}
