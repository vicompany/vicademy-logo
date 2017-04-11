import { coordinate } from './logo';

const PI_TWO = Math.PI * 2;
const path = new Array(6);
const angleBase = Math.PI * -0.5;

for (let i = 0; i < path.length; i++) {
  const angleDelta = (PI_TWO / path.length) * i;
  const angle = angleBase + angleDelta;
  const x = Math.cos(angle);
  const y = Math.sin(angle);

  path[i] = coordinate(x, y);
}

export default path;
