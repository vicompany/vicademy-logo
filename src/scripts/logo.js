import { default as getLogoPath, valuesFromDate } from './logo-path';
import hexagon from './shapes/hexagon';

export default class Logo {
  constructor(element, fillElement = null, imageElement = null) {
    this.element = element;
    this.fillElement = fillElement;
    this.imageElement = imageElement;
  }

  setData(date, image = null, pad = true) {
    const values = valuesFromDate(date);
    const path = getLogoPath(hexagon, values, pad);

    if (this.fillElement) {
      this.fillElement.classList.toggle('is-hidden', !!image);
    }

    if (this.imageElement) {
      this.imageElement.setAttribute('xlink:href', image || '#');
      this.imageElement.classList.toggle('is-hidden', !image);
    }

    this.element.setAttribute('d', path);
  }
}
