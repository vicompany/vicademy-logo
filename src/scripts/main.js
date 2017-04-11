import hexagon from './hexagon';
import { default as getLogoPath, valuesFromDate } from './logo';

const formatDate = date => `${date.getFullYear()}-0${date.getMonth() + 1}-${date.getDate()}`;
const updatePath = (date) => {
  const values = valuesFromDate(date);

  document.querySelector('.js-path')
    .setAttribute('d', getLogoPath(hexagon, values));
};

document.querySelector('.js-hexagon')
    .setAttribute('d', getLogoPath(hexagon, [0, 0, 0, 0, 0, 0], false));

document.querySelector('.js-preset-today').dataset.date = formatDate(new Date());

document.querySelector('.js-preset-list').addEventListener('click', (e) => {
  if (e.target.tagName !== 'BUTTON') {
    return;
  }

  const button = e.target;
  const date = button.dataset.date;

  updatePath(date);
});

updatePath('2007-03-14');
