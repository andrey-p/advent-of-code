// or coordinate or vector or whatever
type Point = {
  x: number,
  y: number
};

type Rect = {
  width: number,
  height: number
} & Point;

type Robot = {
  position: Point,
  speed: Point
};

const bounds: Rect = {
  x: 0,
  y: 0,
  width: 101,
  height: 103
  // width: 11,
  // height: 7
};

// split bounds into quarters, disregarding the middle lines
const quadrants: Rect[] = [
  { x: 0, y: 0 }, // top left
  { x: Math.ceil(bounds.width / 2), y: 0 }, // top right
  { x: 0, y: Math.ceil(bounds.height / 2) }, // bottom left
  { x: Math.ceil(bounds.width / 2), y: Math.ceil(bounds.height / 2) }, // bottom right
].map(point => ({
  ...point,
  width: Math.floor(bounds.width / 2),
  height: Math.floor(bounds.height / 2)
}));

const iterations = 100;

const moveRobot = (robot: Robot) => {
  const nextPos = {
    x: robot.position.x + robot.speed.x,
    y: robot.position.y + robot.speed.y
  };

  if (nextPos.x < 0) {
    nextPos.x += bounds.width;
  } else if (nextPos.x >= bounds.width) {
    nextPos.x -= bounds.width;
  }

  if (nextPos.y < 0) {
    nextPos.y += bounds.height;
  } else if (nextPos.y >= bounds.height) {
    nextPos.y -= bounds.height;
  }

  robot.position = nextPos;
};

const debugLog = (robots: Robot[]) => {
  let grid: string[][] = [];

  for (let i = 0; i < bounds.height; i++) {
    const row = [];
    for (let j = 0; j < bounds.width; j++) {
      let char = '.';

      if (i === Math.floor(bounds.height / 2) ||
         j === Math.floor(bounds.width / 2)) {
        char = 'X';
      }

      row.push(char);
    }
    grid.push(row);
  }

  robots.forEach(robot => {
    const pos = robot.position;
    const charAtPos = grid[pos.y][pos.x];

    if (charAtPos !== 'X') {
      const numRobots = parseInt(charAtPos) || 0;
      grid[pos.y][pos.x] = (numRobots + 1).toString();
    }
  });

  console.log('\n');
  console.log(grid.map(line => line.join('')).join('\n'));
};

const run = (input: string) => {
  const robots = input
    .trim()
    .split('\n')
    .map(line => {
      const [x, y, vX, vY] = (line.match(/-?\d+/g) || ['', ''])
        .map(num => parseInt(num));

      const robot: Robot = {
        position: { x, y },
        speed: { x: vX, y: vY }
      };

      return robot;
    });

  debugLog(robots);

  for (let i = 0; i < iterations; i++) {
    robots.forEach(moveRobot);
  }

  debugLog(robots);

  const safetyFactor = quadrants.reduce((acc, quadrant) => {
    const robotsInQuadrant = robots.filter(robot => {
      return robot.position.x >= quadrant.x &&
        robot.position.x < quadrant.width + quadrant.x &&
        robot.position.y >= quadrant.y &&
        robot.position.y < quadrant.height + quadrant.y;
    });

    console.log(robotsInQuadrant.length);

    return acc *= robotsInQuadrant.length;
  }, 1);

  return safetyFactor;
};

export default run;
