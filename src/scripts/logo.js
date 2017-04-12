import { default as getLogoPath, valuesFromDate } from './logo-path';
import hexagon from './shapes/hexagon';
import {
  animation,
  animationChain,
  fakeAnimation,
} from './utils/animation';

const animationDuration = 0.4;
const animationDurationHalf = 0.2;

const ease = n => Math.sin(n * Math.PI * 0.5);

export default class Logo {
  constructor(element, fillElement = null, imageElement = null) {
    this.element = element;
    this.fillElement = fillElement;
    this.imageElement = imageElement;

    this.isAnimating = false;
    this.previousDate = null;
    this.previousImage = null;
  }

  setData(date, image = null, pad = true) {
    if (this.isAnimating) return false;

    const setImage = fakeAnimation((done) => {
      this.imageElement.setAttribute('xlink:href', image);
      done();
    });

    const fillShow = fakeAnimation((done) => {
      this.fillElement.classList.remove('is-hidden');
      done();
    });

    const fillHide = fakeAnimation((done) => {
      this.fillElement.classList.add('is-hidden');
      done();
    });

    const fadeIn = animation(animationDurationHalf, (progress) => {
      this.imageElement.style.opacity = progress;
    });

    const fadeOut = animation(animationDurationHalf, (progress) => {
      this.imageElement.style.opacity = 1 - progress;
    });

    const finishAnimation = fakeAnimation((done) => {
      this.isAnimating = false;
      done();
    });

    const valuesStart = valuesFromDate(this.previousDate);
    const valuesTarget = valuesFromDate(date);

    this.previousDate = date;
    this.animatePath(valuesStart, valuesTarget, pad);

    if (this.imageElement) {
      this.isAnimating = true;

      if (!this.previousImage && image) {
        animationChain([setImage, fadeIn, fillHide, finishAnimation]).start();
      } else if (this.previousImage && image) {
        animationChain([fadeOut, setImage, fadeIn, finishAnimation]).start();
      } else if (this.previousImage && !image) {
        animationChain([fillShow, fadeOut, finishAnimation]).start();
      } else {
        animationChain([fillShow, finishAnimation]).start();
      }
    }

    this.previousImage = image;
    return true;
  }

  animatePath(valuesStart, valuesTarget, pad = true) {
    animation(animationDuration, (progress) => {
      const values = valuesStart.map((valueStart, i) => {
        const valueTarget = valuesTarget[i];
        const diff = valueTarget - valueStart;

        return valueStart + (ease(progress) * diff);
      });

      const path = getLogoPath(hexagon, values, pad);

      this.element.setAttribute('d', path);
    }).start();
  }
}
