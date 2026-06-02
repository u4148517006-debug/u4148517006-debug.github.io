export const keySize = 41;
export const waterSize = 20;

export const stay = { x: 0, y: 0 };
export const moveUp = { x: keySize * -0.23, y: keySize * 2.2 };
export const moveDown = { x: keySize * 0.23, y: keySize * -2.2 };
export const moveLeft = { x: keySize * -2.14, y: 0 };

const threeKeys = [stay, moveUp, moveDown, { x: moveUp.x * 2, y: moveUp.y * 2 }];

export const keysPositions = [
  [stay, moveUp, moveDown, moveLeft, { x: moveLeft.x + moveUp.x, y: moveLeft.y + moveUp.y }, { x: moveLeft.x + moveDown.x, y: moveLeft.y + moveDown.y }, { x: moveUp.x * 2, y: moveUp.y * 2 }],
  threeKeys, threeKeys, threeKeys
];

export const keysNames = [
  ["J", "U", "M", "H", "Y", "N", "Offset"],
  ["K", "I", ",", "Offset"],
  ["L", "O", ".", "Offset"],
  [";", "P", "?", "Offset"]
];

export const centerAdjust = [
  { x: keySize * -3.7, y: keySize * -0.2 },
  { x: keySize * -1.3, y: keySize * -1.3 },
  { x: keySize * 1.3,  y: keySize * -1.3 },
  { x: keySize * 3.5,  y: keySize * -0.2 }
];
