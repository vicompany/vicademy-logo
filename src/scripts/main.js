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
const presetButtons = Array.from(presetList.querySelectorAll('.js-preset-button'));
const logoPath = document.querySelector('.js-logo-path');
const today = formatDate(new Date());

// Set logo background
const logoPathBackground = document.querySelector('.js-logo-background');
logoPathBackground.setAttribute('d', getLogoPath(hexagon, [0, 0, 0, 0, 0, 0], false));

// Update today preset
document.querySelector('.js-preset-today').dataset.date = today;
document.querySelector('.js-preset-today-display').innerHTML = today;

// Add interactivity for preset list
presetList.addEventListener('click', (e) => {
  if (e.target.tagName !== 'BUTTON') return;

  const button = e.target;
  const date = button.dataset.date;

  presetButtons.forEach(b => b.classList.remove('is-active'));
  button.classList.add('is-active');

  updatePath(logoPath, date);
});

// Select first item from list
updatePath(logoPath, presetList.querySelector('button[data-date]').dataset.date);
