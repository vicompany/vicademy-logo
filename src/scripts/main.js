import hexagon from './shapes/hexagon';
import { default as getLogoPath, valuesFromDate } from './logo';

import formatDate from './utils/format-date';

/**
 * Set logo path to given SVG path element.
 *
 * @param {SVGPathElement} path - The path element to apply the path to.
 * @param {String} date - The date to apply.
 */
const updatePath = (path, date) => {
  const values = valuesFromDate(date);

  path.setAttribute('d', getLogoPath(hexagon, values));
};

const presetList = document.querySelector('.js-preset-list');
const logoPath = document.querySelector('.js-logo-path');

// Set logo background
const logoPathBackground = document.querySelector('.js-logo-background');
logoPathBackground.setAttribute('d', getLogoPath(hexagon, [0, 0, 0, 0, 0, 0], false));

// Update today preset
document.querySelector('.js-preset-today').dataset.date = formatDate(new Date());

// Add interactivity for preset list
presetList.addEventListener('click', (e) => {
  if (e.target.tagName !== 'BUTTON') return;

  const button = e.target;
  const date = button.dataset.date;

  updatePath(logoPath, date);
});

// Select first item from list
updatePath(logoPath, presetList.querySelector('button[data-date]').dataset.date);
