import { _decorator, Component, Node, tween, UIOpacity } from "cc";
import { moveTo } from "../utils/anim";
//import { BlackScreen } from "./BlackScreen";
//import { AudioKeys, AudioManager, getAudioKeyString } from "./AudioManager";
const { ccclass, property } = _decorator;

@ccclass("TitleScreenUIManager")
export class TitleScreenUIManager extends Component {
	@property(Node)
	jellyHiddenAnchor!: Node;

	@property(Node)
	jellyVisibleAnchor!: Node;

	@property(Node)
	titleHiddenAnchor!: Node;

	@property(Node)
	titleVisibleAnchor!: Node;

	@property(Node)
	levelSelectorVisibleAnchor!: Node;

	@property(Node)
	levelSelectorHiddenAnchor!: Node;

	@property(Node)
	jellySprite!: Node;

	@property(Node)
	menuObjects!: Node;

	@property(Node)
	levelSelector!: Node;

	@property(Node)
	creditsLabels!: Node;

	@property(Node)
	howToPlay!: Node;

	@property(Node)
	volumeControl!: Node;
	fromGameplay = false;

	//   @property(BlackScreen)
	//   blackScreen!: BlackScreen;

	protected onLoad(): void {
		this.jellySprite.setWorldPosition(this.jellyHiddenAnchor.worldPosition);
		this.levelSelector.setWorldPosition(
			this.levelSelectorHiddenAnchor.worldPosition
		);
		this.menuObjects.setWorldPosition(this.titleHiddenAnchor.worldPosition);
		this.creditsLabels.setWorldPosition(
			this.levelSelectorHiddenAnchor.worldPosition
		);
		//  this.blackScreen.toggleVisibility(true);
		this.howToPlay.setWorldPosition(
			this.levelSelectorHiddenAnchor.worldPosition
		);

		this.volumeControl.setWorldPosition(
			this.levelSelectorHiddenAnchor.worldPosition
		);
	}
	start() {
		// AudioManager.Instance.play(
		//   `${getAudioKeyString(AudioKeys.BGMTitle)}`,
		//   0.6,
		//   true
		// );

		if (!this.fromGameplay) {
			this.showJellyMenu();
		}
		//   this.blackScreen.toggleVisibility(false);
	}

	openLevelSelector() {
		// AudioManager.Instance.playOneShot(
		//   `${getAudioKeyString(AudioKeys.SFXSweep)}-0`
		// );
		moveTo(this.jellySprite, this.jellyHiddenAnchor.worldPosition, 1);
		this.hideJellyMenu();
		moveTo(
			this.levelSelector,
			this.levelSelectorVisibleAnchor.worldPosition,
			1
		);
	}

	onClickCredits() {
		// AudioManager.Instance.playOneShot(
		//   `${getAudioKeyString(AudioKeys.SFXUIClick)}`
		// );

		// AudioManager.Instance.playOneShot(
		//   `${getAudioKeyString(AudioKeys.SFXSweep)}-0`
		// );
		moveTo(
			this.creditsLabels,
			this.levelSelectorVisibleAnchor.worldPosition,
			1
		);
		this.hideJellyMenu();
	}

	onHideCredits() {
		// AudioManager.Instance.playOneShot(
		//   `${getAudioKeyString(AudioKeys.SFXUIClick)}`
		// );
		// AudioManager.Instance.playOneShot(
		//   `${getAudioKeyString(AudioKeys.SFXSweep)}-1`
		// );
		moveTo(
			this.creditsLabels,
			this.levelSelectorHiddenAnchor.worldPosition,
			1
		);
		this.showJellyMenu();
	}

	onStartGameClick() {
		this.openLevelSelector();
		// AudioManager.Instance.playOneShot(
		//   `${getAudioKeyString(AudioKeys.SFXUIClick)}`
		// );
	}

	onBackLevelSelectorClick() {
		this.closeLevelSelector();
		// AudioManager.Instance.playOneShot(
		//   `${getAudioKeyString(AudioKeys.SFXUIClick)}`
		// );
	}

	closeLevelSelector() {
		// AudioManager.Instance.playOneShot(
		//   `${getAudioKeyString(AudioKeys.SFXSweep)}-1`
		// );
		this.showJellyMenu();
		moveTo(
			this.levelSelector,
			this.levelSelectorHiddenAnchor.worldPosition,
			1
		);
	}

	showHowToPlay() {
		// AudioManager.Instance.playOneShot(
		//   `${getAudioKeyString(AudioKeys.SFXSweep)}-0`
		// );
		// AudioManager.Instance.playOneShot(
		//   `${getAudioKeyString(AudioKeys.SFXUIClick)}`
		// );
		this.hideJellyMenu();
		moveTo(
			this.howToPlay,
			this.levelSelectorVisibleAnchor.worldPosition,
			1
		);
	}

	hideJellyMenu() {
		moveTo(this.jellySprite, this.jellyHiddenAnchor.worldPosition, 1);
		moveTo(this.menuObjects, this.titleHiddenAnchor.worldPosition, 1);
	}

	showJellyMenu() {
		moveTo(this.jellySprite, this.jellyVisibleAnchor.worldPosition, 1);
		moveTo(this.menuObjects, this.titleVisibleAnchor.worldPosition, 1);
	}

	hideHowToPlay() {
		// AudioManager.Instance.playOneShot(
		//   `${getAudioKeyString(AudioKeys.SFXUIClick)}`
		// );
		// AudioManager.Instance.playOneShot(
		//   `${getAudioKeyString(AudioKeys.SFXSweep)}-1`
		// );
		this.showJellyMenu();
		moveTo(this.howToPlay, this.levelSelectorHiddenAnchor.worldPosition, 1);
	}

	toggleLoadingScreen(value: boolean) {
		// this.blackScreen.toggleVisibility(value);
	}

	showVolumeControl() {
		// AudioManager.Instance.playOneShot(
		//   `${getAudioKeyString(AudioKeys.SFXSweep)}-0`
		// );
		// AudioManager.Instance.playOneShot(
		//   `${getAudioKeyString(AudioKeys.SFXUIClick)}`
		// );

		this.hideJellyMenu();
		moveTo(
			this.volumeControl,
			this.levelSelectorVisibleAnchor.worldPosition,
			1
		);
	}

	hideVolumeControl() {
		// AudioManager.Instance.playOneShot(
		//   `${getAudioKeyString(AudioKeys.SFXUIClick)}`
		// );
		// AudioManager.Instance.playOneShot(
		//   `${getAudioKeyString(AudioKeys.SFXSweep)}-1`
		// );
		this.showJellyMenu();
		moveTo(
			this.volumeControl,
			this.levelSelectorHiddenAnchor.worldPosition,
			1
		);
	}

	update(deltaTime: number) {}
}
