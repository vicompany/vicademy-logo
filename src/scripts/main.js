import hexagon from './hexagon';
import { default as getLogoPath, valuesFromDate } from './logo';

const path = hexagon;
const values = valuesFromDate('14-03-2007');

document.querySelector('.js-path')
  .setAttribute('d', getLogoPath(path, values));
