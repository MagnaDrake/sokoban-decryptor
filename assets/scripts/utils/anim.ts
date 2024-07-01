import {
  Node,
  view,
  Vec3,
  director,
  tween,
  easing,
  randomRangeInt,
  ITweenOption,
  Quat,
} from "cc";

export const FRAME = 0.016;

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
  const moveTween = tween(object).to(duration, tweenProps, easingProps).start();

  return moveTween;
}

export function moveToLocal(
  object: Node,
  target: Vec3,
  duration: number,
  completeCallback?: any
) {
  const tweenProps = { position: target };
  let onComplete;
  if (completeCallback !== undefined) {
    onComplete = completeCallback;
  }
  const easingProps: ITweenOption = { easing: easing.circOut, onComplete };
  const moveTween = tween(object).to(duration, tweenProps, easingProps).start();

  return moveTween;
}

export function rotate(
  object: Node,
  target: Vec3,
  duration: number,
  completeCallback?: any
) {
  let quat = new Quat();
  console.log(target.z);
  quat = Quat.fromAngleZ(quat, target.z);
  console.log(quat);
  const tweenProps = { rotation: quat };
  let onComplete;
  if (completeCallback !== undefined) {
    onComplete = completeCallback;
  }
  const easingProps: ITweenOption = { easing: easing.circOut, onComplete };
  const moveTween = tween(object).to(duration, tweenProps, easingProps).start();

  return moveTween;
}

export function rotateEulerZ(
  object: Node,
  target: number,
  duration: number,
  completeCallback?: any
) {
  console.log("z target", target);
  let quat = new Quat();
  quat = Quat.fromAngleZ(quat, target);
  const tweenProps = { rotation: quat };
  let onComplete;
  if (completeCallback !== undefined) {
    onComplete = completeCallback;
  }
  const easingProps: ITweenOption = { easing: easing.circOut, onComplete };
  const moveTween = tween(object).to(duration, tweenProps, easingProps).start();

  return moveTween;
}
