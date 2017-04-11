import hexagon from './hexagon';
import { default as getLogoPath, valuesFromDate } from './logo';

const path = hexagon;
const values = valuesFromDate('2007-03-14');

document.querySelector('.js-path')
  .setAttribute('d', getLogoPath(path, values));
