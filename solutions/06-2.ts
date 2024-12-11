type Point = { x: number, y: number };
type Direction = {
  x: -1 | 0 | 1,
  y: -1 | 0 | 1
};
type Step = {
  position: Point,
  direction: Direction
};

enum Tile {
  Space = '.',
  Wall = '#',
  Start = '^',
  // debugging
  Path = 'o'
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

const dumpGrid = (grid: Tile[][], steps: Step[]) => {
  grid = JSON.parse(JSON.stringify(grid));

  steps.forEach(step => {
    grid[step.position.y][step.position.x] = Tile.Path;
  });

  const str = grid
    .map(row => row.join(''))
    .join('\n');

  console.log(str);
};

class Guard {
  position: Point;
  direction: Direction;
  outOfBounds: boolean;
  infiniteLoop: boolean;
  steps: Step[];

  constructor(startingPos: Point) {
    this.position = startingPos;
    this.outOfBounds = false;
    this.infiniteLoop = false;

    // assume guard starts pointing upwards
    this.direction = { x: 0, y: -1 };

    this.steps = [];
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

    // is the guard in an infinite loop?
    if (this.inInfiniteLoop()) {
      this.infiniteLoop = true;
    } else {
      this.steps.push({
        position: this.position,
        direction: this.direction
      });
    }
  }

  reset(position: Point) {
    this.position = position;
    this.direction = { x: 0, y: -1 };
    this.infiniteLoop = false;
    this.outOfBounds = false;
    this.steps = [];
  }

  inInfiniteLoop(): boolean {
    return this.steps.some(step => {
      return step.position.x === this.position.x &&
        step.position.y === this.position.y &&
        step.direction.x === this.direction.x &&
        step.direction.y === this.direction.y;
    });
  }
}

const run = (input: string) => {
  const lines = input.trim().split('\n');

  const grid: Tile[][] = lines.map(line => line.split('') as Tile[]);

  let startingPoint: Point = findStartingPoint(grid);

  const guard = new Guard(startingPoint);

  // run the guard until she's out of bounds
  while (true) {
    guard.move(grid);

    if (guard.outOfBounds) {
      break;
    }
  }

  // store the original path that the guard took
  const originalSteps = guard.steps.concat();

  console.log(`finished original run in ${originalSteps.length} steps`);
  dumpGrid(grid, guard.steps);

  // reset her back to normal
  guard.reset(startingPoint);

  // at each step, try to add an obstacle
  // and see if the guard ends up looping
  const loopablePositions = new Map<string, boolean>();

  originalSteps.forEach((step) => {
    // starting position not allowed
    if (step.position.y === startingPoint.y && step.position.x === startingPoint.x) {
      return;
    }

    const duplicateGrid = JSON.parse(JSON.stringify(grid));
    duplicateGrid[step.position.y][step.position.x] = Tile.Wall;
    //console.log(`adding obstacle at step ${i}`);

    while (true) {
      guard.move(duplicateGrid);

      if (guard.outOfBounds) {
        //console.log(`out of bounds in ${guard.steps.length} steps`);

        break;
      } else if (guard.infiniteLoop) {
        //console.log(`infinite loop in ${guard.steps.length} steps`);
        const key = `${step.position.x}|${step.position.y}`;
        loopablePositions.set(key, true);
        //dumpGrid(duplicateGrid, guard.steps);
        break;
      }
    }

    guard.reset(startingPoint);
  });

  console.log(guard.steps.length);

  return loopablePositions.size;
};

export default run;
