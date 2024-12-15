type Point = { x: number, y: number };
type Direction = {
  x: -1 | 0 | 1,
  y: -1 | 0 | 1
};
type Instruction = '^' | '>' | 'v' | '<';

enum Tile {
  Space = '.',
  Wall = '#',
  Box = 'O',
  Robot = '@'
};

// find the starting position
// set the starting pos as empty
// - we're tracking robot position separately
const findStartingPoint = (grid: Tile[][]): Point => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === Tile.Robot) {
        grid[i][j] = Tile.Space;

        return {
          x: j,
          y: i
        };
      }
    }
  }

  throw new Error('no starting point?');
};

class Robot {
  position: Point;
  instructions: Instruction[];

  constructor(startingPos: Point, instructions: Instruction[]) {
    this.position = startingPos;
    this.instructions = instructions;
  }

  act(grid: Tile[][]) {
    const nextInstruction = this.instructions.shift();
    if (!nextInstruction) {
      return;
    }

    const direction = this.readInstruction(nextInstruction);

    if (this.push(grid, this.position, direction)) {
      this.position = {
        x: this.position.x + direction.x,
        y: this.position.y + direction.y
      };
    }
  }

  push (grid: Tile[][], point: Point, direction: Direction): boolean {
    const targetPoint: Point = {
      x: point.x + direction.x,
      y: point.y + direction.y
    };

    const targetTile = grid[targetPoint.y] &&
      grid[targetPoint.y][targetPoint.x];

    // next tile is wall, can't push
    if (targetTile === Tile.Wall) {
      return false;
    }

    // next tile is box, check if pushable first
    if (targetTile === Tile.Box) {
      const pushWorked = this.push(grid, targetPoint, direction);

      if (pushWorked) {
        grid[targetPoint.y][targetPoint.x] = Tile.Space;
        grid[targetPoint.y + direction.y][targetPoint.x + direction.x] = Tile.Box;
      }

      return pushWorked;
    }

    // empty space, pushed
    return true;
  }

  readInstruction (instruction: Instruction): Direction {
    switch (instruction) {
      case '^':
        return { x: 0, y: -1 };
      case '>':
        return { x: 1, y: 0 };
      case 'v':
        return { x: 0, y: 1 };
      case '<':
        return { x: -1, y: 0 };
    }
  }
}

const debugLog = (grid: Tile[][], robot: Robot) => {
  grid = structuredClone(grid);
  grid[robot.position.y][robot.position.x] = Tile.Robot;

  console.log('\n');
  console.log(grid.map(line => line.join('')).join('\n'));
};

const run = (input: string) => {
  const [gridInput, instructionInput] = input.trim().split('\n\n');

  const grid: Tile[][] = gridInput
    .split('\n')
    .map(line => line.split('')) as Tile[][];

  const initialPos: Point = findStartingPoint(grid);
  const instructions: Instruction[] = instructionInput
    // can be multi-line
    .split('\n')
    .join('')
    .split('') as Instruction[];

  const robot = new Robot(initialPos, instructions);

  debugLog(grid, robot);

  while (robot.instructions.length) {
    robot.act(grid);
    //debugLog(grid, robot);
  }

  debugLog(grid, robot);

  // score the boxes
  let score = 0;

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === Tile.Box) {
        score += i * 100 + j;
      }
    }
  }

  return score;
};

export default run;
