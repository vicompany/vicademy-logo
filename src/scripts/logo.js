const coordinate = (x, y) => ({ x, y });

/**
 * Linear interpolate a point on a path between a and b.
 *
 * @param {Object} a - The start coordinate to lerp from.
 * @param {Object} b - The end coordinate to lerp to.
 * @param {Number} t - The progress along the path. Should be a number between 0 and 1
 */
const lerp = (a, b, t) => coordinate(
  a.x + ((b.x - a.x) * t),
  a.y + ((b.y - a.y) * t),
);

/**
 * Get an array of values from a date string.
 *
 * @param {String} date - The input date as dd-mm-yyyy
 * @return {Array} The values
 */
const valuesFromDate = (date) => {
  const radix = 10;
  const [year, month, day] = date.split(/-/g);

  return [
    Number.parseInt(day.substr(0, 1), radix),
    Number.parseInt(day.substr(1, 1), radix),
    Number.parseInt(month.substr(0, 1), radix),
    Number.parseInt(month.substr(1, 1), radix),
    Number.parseInt(year.substr(2, 1), radix),
    Number.parseInt(year.substr(3, 1), radix),
  ];
};

/**
 * Get the generated logo SVG path.
 * @param {Array} path - A multidimensional array of points in a 2D space.
 * @param {Array} values - An array, each defining the linear "progress" per line.
 * @return {String} The SVG path.
 */
export default (path, values) => {
  let pathSvg = '';

  values.forEach((value, i) => {
    const start = path[i];
    const end = path[(i + 1) % path.length];
    const position = lerp(start, end, value / 9);
    const operation = i === 0 ? 'M' : 'L';

    pathSvg += `${operation} ${position.x} ${position.y}`;
  });

  return `${pathSvg} Z`;
};

export {
  coordinate,
  lerp,
  valuesFromDate,
};
