import Logo from './logo';
import formatDate from './utils/format-date';

const logo = new Logo(
  document.querySelector('.js-logo-path'),
  document.querySelector('.js-logo-fill'),
  document.querySelector('.js-logo-image'),
);

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

  presetButtons.forEach(b => b.classList.remove('is-active'));
  button.classList.add('is-active');

  logo.setData(button.dataset.date, button.dataset.image);
});

// Update logos
logo.setData(presetList.querySelector('button[data-date]').dataset.date);
logoBackground.setData('0000-00-00', null, false);

// Add background toggle
Array.from(document.querySelectorAll('.js-toggle-background')).forEach((radio) => {
  radio.addEventListener('change', () => {
    const isVisible = radio.value === 'on';

    logoBackground.element.classList.toggle('is-hidden', !isVisible);
  });
});
