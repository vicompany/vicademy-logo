import { default as getLogoPath, valuesFromDate } from './logo-path';
import hexagon from './shapes/hexagon';

export default class Logo {
  constructor(element) {
    this.element = element;
  }

  setData(date, pad) {
    const values = valuesFromDate(date);
    const path = getLogoPath(hexagon, values, pad);

    this.element.setAttribute('d', path);
  }
}
