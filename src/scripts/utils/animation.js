const getNow = () => Date.now() / 1000;
const noop = () => {};

const animation = (duration, onUpdate, onCompleteCallback = null) => {
  let onComplete = onCompleteCallback;
  let animationStart;
  let animationFrame;

  const cancel = () => {
    if (!animationFrame) return;
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  };

  const update = () => {
    const now = getNow();
    const progress = Math.min(1, (now - animationStart) / duration);

    onUpdate(progress);

    if (progress < 1) {
      animationFrame = requestAnimationFrame(update);
    } else if (onComplete) {
      cancel();
      onComplete();
    }
  };

  return {
    start() {
      animationStart = getNow();
      animationFrame = requestAnimationFrame(update);
    },

    setNext(callback) {
      onComplete = callback;
    },

    cancel,
  };
};

const animationChain = (animations) => {
  const animationFirst = animations[0];

  animations.forEach((a, i) => {
    if (i === animations.length - 1) return;

    const nextAnimation = animations[i + 1];
    a.setNext(() => nextAnimation.start());
  });

  return {
    start() {
      animationFirst.start();
    },

    cancel() {
      animations.forEach((a) => {
        a.setNext(null);
        a.cancel();
      });
    },
  };
};

const fakeAnimation = (execute, onCompleteCallback) => {
  let onComplete = onCompleteCallback;

  return {
    start() {
      if (onComplete) execute(onComplete);
      else execute(noop);
    },

    setNext(callback) {
      onComplete = callback;
    },

    cancel() {},
  };
};

export {
  animation,
  animationChain,
  fakeAnimation,
};
