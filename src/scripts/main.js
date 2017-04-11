import Logo from './logo';
import formatDate from './utils/format-date';

const logo = new Logo(document.querySelector('.js-logo-path'));
const logoBackground = new Logo(document.querySelector('.js-logo-background'));

const presetList = document.querySelector('.js-preset-list');
const presetButtons = Array.from(presetList.querySelectorAll('.js-preset-button'));
const today = formatDate(new Date());

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

  logo.setData(date);
});

// Update logos
logo.setData(presetList.querySelector('button[data-date]').dataset.date);
logoBackground.setData('0000-00-00', false);
