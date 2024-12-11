type Point = { x: number, y: number };
type Direction = {
  x: -1 | 0 | 1,
  y: -1 | 0 | 1
};

enum Tile {
  Space = '.',
  Wall = '#',
  Start = '^'
};

// find the starting position
const findStartingPoint = (grid: Tile[][]): Point => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === Tile.Start) {
        return {
          x: j,
          y: i
        };
      }
    }
  }

  throw new Error('no starting point?');
};

// probably a more mathematical way of doing this
const directionsInOrder: Direction[] = [
  { x: 0, y: -1 }, // top
  { x: 1, y: 0 }, // right
  { x: 0, y: 1 }, // bottom
  { x: -1, y: 0 }, // left
];
const turnDirectionClockWise = (direction: Direction): Direction => {
  const currentIndex = directionsInOrder.findIndex(dir => {
    return dir.x === direction.x && dir.y === direction.y;
  });

  const targetIndex = currentIndex === 3 ? 0 : currentIndex + 1;

  return directionsInOrder[targetIndex];
};

class Guard {
  position: Point;
  direction: Direction;
  outOfBounds: boolean;

  constructor(startingPos: Point) {
    this.position = startingPos;
    this.outOfBounds = false;

    // assume guard starts pointing upwards
    this.direction = { x: 0, y: -1 };
  }

  move(grid: Tile[][]) {
    // get the next possible place to go
    const targetPoint: Point = {
      x: this.position.x + this.direction.x,
      y: this.position.y + this.direction.y
    };

    const targetTile = grid[targetPoint.y] &&
      grid[targetPoint.y][targetPoint.x];

    if (!targetTile) {
      this.outOfBounds = true;
      return;
    }

    switch (targetTile) {
      case Tile.Space:
      case Tile.Start:
        this.position = targetPoint;
        break;
      case Tile.Wall:
        this.direction = turnDirectionClockWise(this.direction);
    }
  }
}

const run = (input: string) => {
  const lines = input.trim().split('\n');

  const grid: Tile[][] = lines.map(line => line.split('') as Tile[]);

  let startingPoint: Point = findStartingPoint(grid);

  const guard = new Guard(startingPoint);

  const pointsVisited = new Map<string, boolean>();

  while (true) {
    guard.move(grid);

    const key = `${guard.position.x}|${guard.position.y}`;
    pointsVisited.set(`${key}`, true);

    if (guard.outOfBounds) {
      break;
    }
  }

  return pointsVisited.size;
};

export default run;
