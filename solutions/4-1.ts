// probably a more mathematical way of doing this
// if there is, I'm not clever enough for it

type Letter = 'X' | 'M' | 'A' | 'S';
type Direction = -1 | 0 | 1;
type Coord = { x: number, y: number };
type DirectionCoord = { x: Direction, y: Direction };

const allDirectionCoords: DirectionCoord[] = [];
const directionValues: Direction[] = [-1, 0, 1];

// generate list of directions to search in
// e.g. { x: -1, y: -1 } is top left
directionValues.forEach(x => {
  directionValues.forEach(y => {
    if (x || y) {
      allDirectionCoords.push({ x, y });
    }
  });
});

const lettersInOrder: Letter[] = ['X', 'M', 'A', 'S'];

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

  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < rows[i].length; j++) {

      // search for 'X's to start searching at
      if (rows[i][j] != lettersInOrder[0]) {
        continue;
      }

      allDirectionCoords.forEach(directionCoord => {
        const lettersLeft = lettersInOrder.concat();
        // found the X, skip that
        lettersLeft.shift();
        let currentCoord = { x: j, y: i };

        // check all the other letters in that direction
        while (lettersLeft.length) {
          const targetCoord: Coord = {
            x: currentCoord.x + directionCoord.x,
            y: currentCoord.y + directionCoord.y
          };

          // ! to silence Typescript
          // the check is right on top of the while, silly compiler
          const currentLetter = lettersLeft.shift()!;
          const found = checkForLetter(targetCoord, currentLetter);

          // nothing found, give up on this direction
          if (!found) {
            return;
          }

          currentCoord = targetCoord;
        }

        // if we got this far, we've got an XMAS
        totalXmases++;
      });
    }
  }

  return totalXmases;
};

export default run;
