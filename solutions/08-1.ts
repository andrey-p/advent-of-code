type Point = { x: number, y: number };

const isPointInBounds = (grid: string[][], point: Point): boolean => {
  return point.x >= 0 &&
    point.x < grid[0].length &&
    point.y >= 0 &&
    point.y < grid.length;
};

const key = (point: Point): string => {
  return `${point.x}|${point.y}`;
};

const markAntinode = (grid: string[][], point: Point) => {
  if (grid[point.y][point.x] === '.') {
    grid[point.y][point.x] = '#';
  }
};

const run = (input: string) => {
  const lines = input.trim().split('\n');
  const grid = lines.map(line => line.split(''));

  const antennasByFrequency = new Map<string, Point[]>();

  // collate coordinates for every frequency
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const char = grid[i][j];

      if (char === '.') {
        continue;
      }

      const antennas = antennasByFrequency.get(char) || []
      const point: Point = { x: j, y: i };
      antennas.push(point);
      antennasByFrequency.set(char, antennas);
    }
  }

  const antinodeLocations = new Map<string, boolean>();
  antennasByFrequency.forEach((antennas) => {
    for (let i = 0; i < antennas.length; i++) {
      const antennaA = antennas[i];

      for (let j = i + 1; j < antennas.length; j++) {
        const antennaB = antennas[j];

        const diff: Point = {
          x: antennaB.x - antennaA.x,
          y: antennaB.y - antennaA.y
        };

        const antinodeA: Point = {
          x: antennaA.x - diff.x,
          y: antennaA.y - diff.y
        };
        if (isPointInBounds(grid, antinodeA)) {
          markAntinode(grid, antinodeA);
          antinodeLocations.set(key(antinodeA), true);
        }

        const antinodeB: Point = {
          x: antennaB.x + diff.x,
          y: antennaB.y + diff.y
        };
        if (isPointInBounds(grid, antinodeB)) {
          markAntinode(grid, antinodeB);
          antinodeLocations.set(key(antinodeB), true);
        }
      }
    }
  });

  console.log(grid.map(row => row.join('')).join('\n'));

  return antinodeLocations.size;
};

export default run;