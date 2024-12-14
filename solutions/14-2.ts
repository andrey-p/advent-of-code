import { firefox, Page } from 'playwright';
import { writeFileSync } from 'fs';
import { join } from 'path';

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

const iterations = 7337;

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

const getAsciiPicture = (robots: Robot[]): string => {
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

  return grid.map(line => line.join('')).join('\n');
};

// create a screenshot so the pattern can be spotted visually
// e.g. in thumbnails
const takeSnapshot = async (page: Page, input: string, i: number) => {
  console.log('taking screenshot ' + i);
  await page.setContent(`<html><body><pre>${input}</pre></body></html>`);
  const buffer = await page.screenshot({
    style: 'body { background: black; color: white; }',
    fullPage: true,
    clip: {
      x: 0,
      y: 0,
      width: 800,
      height: 1600
    }
  });
  const path = join(__dirname, `../outputs/14-2/${i}.png`);
  writeFileSync(path, buffer);
};

const run = async (input: string) => {
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

  const browser = await firefox.launch();
  const page = await browser.newPage();
  await page.goto('about:blank');

  for (let i = 0; i < iterations; i++) {
    robots.forEach(moveRobot);
    // pattern emerges every 101st image after 65
    // pattern emerges and every 103rd image after 24
    if ((i - 24) % 103 === 0 || (i - 65) % 101 === 0) {
      await takeSnapshot(page, getAsciiPicture(robots), i);
    }
  }

  await browser.close();

  return true;
};

export default run;
