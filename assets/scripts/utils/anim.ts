import {
	Node,
	view,
	Vec3,
	director,
	tween,
	easing,
	randomRangeInt,
	ITweenOption,
} from "cc";

export function moveTo(
	object: Node,
	target: Vec3,
	duration: number,
	completeCallback?: any
) {
	const tweenProps = { worldPosition: target };
	let onComplete;
	if (completeCallback !== undefined) {
		onComplete = completeCallback;
	}
	const easingProps: ITweenOption = { easing: easing.circOut, onComplete };
	const moveTween = tween(object)
		.to(duration, tweenProps, easingProps)
		.start();

	return moveTween;
}
