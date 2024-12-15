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
  Robot = '@',
  BoxLeft = '[',
  BoxRight = ']'
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

const getOtherHalfOfBox = (grid: Tile[][], point: Point): Point => {
  const tile = grid[point.y] &&
    grid[point.y][point.x];
  const otherHalfPoint = structuredClone(point);

  if (tile === Tile.BoxLeft) {
    otherHalfPoint.x = point.x + 1;
  } else if (tile === Tile.BoxRight) {
    otherHalfPoint.x = point.x - 1;
  } else {
    throw new Error('can\'t get tile');
  }

  return otherHalfPoint;
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

    if (this.checkPush(grid, this.position, direction)) {
      this.commitPush(grid, this.position, direction);
      this.position = {
        x: this.position.x + direction.x,
        y: this.position.y + direction.y
      };
    }
  }

  checkPush (grid: Tile[][], originPoint: Point, direction: Direction): boolean {
    const targetPoint: Point = {
      x: originPoint.x + direction.x,
      y: originPoint.y + direction.y
    };

    const targetTile = grid[targetPoint.y] &&
      grid[targetPoint.y][targetPoint.x];

    // next tile is wall, can't push
    if (targetTile === Tile.Wall) {
      return false;
    }

    // next tile is box, check if both sides are pushable
    if (targetTile === Tile.BoxLeft || targetTile === Tile.BoxRight) {
      // get the other half of the box so we can track that
      const otherHalfPoint = getOtherHalfOfBox(grid, targetPoint);

      // left or right push will be processed as per normal box rules here
      let pushWorks = this.checkPush(grid, targetPoint, direction);

      // push up or down, push the other half of the box too
      if (direction.y !== 0) {
        pushWorks = pushWorks && this.checkPush(grid, otherHalfPoint, direction);
      }

      return pushWorks;
    }

    // empty space, pushed
    return true;
  }

  commitPush (grid: Tile[][], originPoint: Point, direction: Direction, propagateToOtherHalf: boolean = true) {
    const targetPoint: Point = {
      x: originPoint.x + direction.x,
      y: originPoint.y + direction.y
    };

    const originTile = grid[originPoint.y] &&
      grid[originPoint.y][originPoint.x];

    const targetTile = grid[targetPoint.y] &&
      grid[targetPoint.y][targetPoint.x];

    // propagate push before moving this tile
    if (targetTile === Tile.BoxLeft || targetTile === Tile.BoxRight) {
      this.commitPush(grid, targetPoint, direction);
    }

    // propagate push to other half of this box
    if (
      (originTile === Tile.BoxLeft || originTile === Tile.BoxRight) &&
      // ... but only if it's a vertical push
      // (horizontal case is handled just above)
      direction.y !== 0 &&
      // and if this isn't in itself a propagated push
      propagateToOtherHalf
    ) {
      const otherHalfPoint = getOtherHalfOfBox(grid, originPoint);
      this.commitPush(grid, otherHalfPoint, direction, false);
    }

    // finally, vacate this spot and move the this bit on
    grid[targetPoint.y][targetPoint.x] = originTile;
    grid[originPoint.y][originPoint.x] = Tile.Space;
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

const chonkifyGrid = (grid: Tile[][]): Tile[][] => {
  const newGrid: Tile[][] = [];

  for (let i = 0; i < grid.length; i++) {
    newGrid.push([]);
    for (let j = 0; j < grid[i].length; j++) {
      switch (grid[i][j]) {
        case Tile.Wall:
          newGrid[i].push(Tile.Wall);
          newGrid[i].push(Tile.Wall);
          break;
        case Tile.Robot:
          newGrid[i].push(Tile.Robot);
          newGrid[i].push(Tile.Space);
          break;
        case Tile.Box:
          newGrid[i].push(Tile.BoxLeft);
          newGrid[i].push(Tile.BoxRight);
          break;
        default:
          newGrid[i].push(Tile.Space);
          newGrid[i].push(Tile.Space);
      }
    }
  }

  return newGrid;
};

const debugLog = (grid: Tile[][], robot: Robot) => {
  grid = structuredClone(grid);
  grid[robot.position.y][robot.position.x] = Tile.Robot;

  console.log('\n');
  console.log(grid.map(line => line.join('')).join('\n'));
};

const run = (input: string) => {
  const [gridInput, instructionInput] = input.trim().split('\n\n');

  let grid: Tile[][] = gridInput
    .split('\n')
    .map(line => line.split('')) as Tile[][];
  grid = chonkifyGrid(grid);

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
    // debugLog(grid, robot);
  }

  debugLog(grid, robot);

  // score the boxes
  let score = 0;

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === Tile.BoxLeft) {
        score += i * 100 + j;
      }
    }
  }

  return score;
};

export default run;
