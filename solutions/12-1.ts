type Point = { x: number, y: number };

type TileMap = Map<string, boolean>;

type ContiguousTileset = {
  map: TileMap,
  area: number,
  perimeter: number
};

const allDirections: Point[] = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 }
];

const key = (point: Point): string => {
  return `${point.x}|${point.y}`;
};

const traverseContiguousTiles = (tileset: ContiguousTileset, grid: string[][], point: Point): ContiguousTileset  => {
  tileset = structuredClone(tileset);

  // already visited
  if (tileset.map.has(key(point))) {
    return tileset;
  }

  tileset.map.set(key(point), true);

  const thisPlotCrop = grid[point.y][point.x];

  tileset.area++;

  allDirections.forEach(direction => {
    const candidatePoint = {
      x: point.x + direction.x,
      y: point.y + direction.y
    };

    const candidate = grid[candidatePoint.y] &&
      grid[candidatePoint.y][candidatePoint.x];

    if (candidate && candidate === thisPlotCrop) {
      const nextTileset = traverseContiguousTiles(tileset, grid, candidatePoint);
      tileset.map = new Map([...tileset.map, ...nextTileset.map]);
      tileset.area = nextTileset.area;
      tileset.perimeter = nextTileset.perimeter;
    } else {
      tileset.perimeter++;
    }
  });

  return tileset;
}

const run = (input: string) => {
  const lines = input.trim().split('\n');
  const grid = lines.map(line => line.split(''));

  let allTilesVisited: TileMap = new Map<string, boolean>();

  let totalFenceCost = 0;

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const point = { x: j, y: i };

      // tile was visited earlier, ignore
      if (allTilesVisited.has(key(point))) {
        continue;
      }

      let tileset: ContiguousTileset = {
        map: new Map<string, boolean>(),
        area: 0,
        perimeter: 0
      };

      tileset = traverseContiguousTiles(tileset, grid, point);

      /*
      console.log(`tileset crop: ${grid[point.y][point.x]}`);
      console.log(`tileset area: ${tileset.area}`);
      console.log(`tileset perimeter: ${tileset.perimeter}`);
      console.log('===========');
     */

      // add contiguous tiles from this area to ones we've checked
      allTilesVisited = new Map([...allTilesVisited, ...tileset.map]);

      totalFenceCost += tileset.area * tileset.perimeter;
    }
  }

  return totalFenceCost;
};

export default run;
