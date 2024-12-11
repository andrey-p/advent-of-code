// probably a more mathematical way of doing this
// if there is, I'm not clever enough for it

type Letter = 'X' | 'M' | 'A' | 'S';
type Direction = -1 | 0 | 1;
type Coord = { x: number, y: number };
type DirectionCoord = { x: Direction, y: Direction };

// the 2 lines of the X to check
const directionsToCheck: DirectionCoord[][] = [
  [
    { x: -1, y: -1 },
    { x: 1, y: 1 }
  ],
  [
    { x: -1, y: 1 },
    { x: 1, y: -1 }
  ]
];

// the A will already be checked by the time we use this
// so we only need to worry about the 'M' and 'S'
const lettersToCheck: Letter[] = ['M', 'S'];

const run = (input: string) => {
  const lines = input.trim().split('\n');
  // get letters in a 2d array
  // (assuming that they're all the correct letters)
  const rows: Letter[][] = lines.map(line => line.split('')) as Letter[][];

  const checkForLetter = (targetCoord: Coord, letter: Letter): boolean => {
    const targetLetter = rows[targetCoord.y] &&
      rows[targetCoord.y][targetCoord.x];

    return targetLetter === letter;
  };

  let totalXmases = 0;

  // skip first and last rows / lines -
  // only searching for the middle As at first
  for (let i = 1; i < rows.length - 1; i++) {
    for (let j = 1; j < rows[i].length - 1; j++) {

      // look for 'A's to start searching at
      if (rows[i][j] !== 'A') {
        continue;
      }

      const found = directionsToCheck.every(directionCoords => {
        const lettersLeft = lettersToCheck.concat();
        let currentCoord = { x: j, y: i };

        while (lettersLeft.length) {
          // ! to silence Typescript
          // the check is right on top of the while, silly compiler
          const currentLetter = lettersLeft.shift()!;

          const found = directionCoords.some(directionCoord => {
            const targetCoord = {
              x: currentCoord.x + directionCoord.x,
              y: currentCoord.y + directionCoord.y
            };
            return checkForLetter(targetCoord, currentLetter);
          });

          // nothing found, give up on this direction
          if (!found) {
            return false;
          }
        }

        return true;
      });

      if (found) {
        totalXmases++;
      }
    }
  }

  return totalXmases;
};

export default run;
