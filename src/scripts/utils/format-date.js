const PADDING = '0';

export default (date) => {
  const month = (date.getMonth() + 1).toString().padStart(2, PADDING);
  const day = date.getDate().toString().padStart(2, PADDING);

  return `${date.getFullYear()}-${month}-${day}`;
};
