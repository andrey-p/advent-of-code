type Point = { x: number, y: number };
type Border = {
  direction: Point
} & Point;

type TileMap = Map<string, boolean>;

type ContiguousTileset = {
  map: TileMap,
  area: number,
  perimeter: Border[]
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
      tileset.perimeter = nextTileset.perimeter.concat();
    } else {
      tileset.perimeter.push({
        ...point,
        direction
      });
    }
  });

  return tileset;
}

// this is some of the clunkiest code I've written
// but it works
const countPerimeterSides = (perimeter: Border[]): number => {
  perimeter = structuredClone(perimeter);
  let sides = 0;

  // go through all the borders
  while (perimeter.length) {
    // pick the first border left
    const border = perimeter[0];
    const alignedBorders: Border[] = [];
    const bordersLeft: Border[] = [];

    // weird type thing needed but OK
    type PointKey = keyof typeof border;
    let compareBy: PointKey;
    let sortBy: PointKey;

    // border we're looking at is horizontal
    if (border.direction.x === 0) {
      compareBy = 'y';
      sortBy = 'x';
    } else {
      // vertical
      compareBy = 'x';
      sortBy = 'y';
    }

    // get all the borders that line up with the current one
    // (e.g. all horizontal borders along y=5 pointing downwards);
    perimeter.forEach(borderB => {
      if (border[compareBy] === borderB[compareBy] &&
          border.direction.x === borderB.direction.x &&
          border.direction.y === borderB.direction.y) {
        alignedBorders.push(borderB);
      } else {
        bordersLeft.push(borderB);
      }
    });

    // sort them so we can keep track of which ones are contiguous
    alignedBorders.sort((a, b) => b[sortBy] - a[sortBy]);

    // this'll have at least one side
    // just for being here
    let sidesForThisSet = 1;

    for (let i = 0; i < alignedBorders.length - 1; i++) {
      // if the border is broken up by at least one tile
      // count that as a separate side
      if (alignedBorders[i][sortBy] - alignedBorders[i + 1][sortBy] > 1) {
        sidesForThisSet++;
      }
    }

    sides += sidesForThisSet;
    perimeter = bordersLeft;
  }

  return sides;
};

const run = (input: string) => {
  const lines = input.trim().split('\n');
  const grid = lines.map(line => line.split(''));

  let allTilesVisited: TileMap = new Map<string, boolean>();

  let totalFenceCost = 0;
  let totalArea = 0;

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
        perimeter: []
      };

      tileset = traverseContiguousTiles(tileset, grid, point);

      //console.log(tileset.perimeter);

      const perimeterSides = countPerimeterSides(tileset.perimeter);

      console.log(`tileset crop: ${grid[point.y][point.x]}`);
      console.log(`tileset area: ${tileset.area}`);
      console.log(`tileset perimeter: ${perimeterSides}`);
      console.log('===========');
      totalArea += tileset.area;

      // add contiguous tiles from this area to ones we've checked
      allTilesVisited = new Map([...allTilesVisited, ...tileset.map]);

      totalFenceCost += tileset.area * perimeterSides;
    }
  }

  return totalFenceCost;
};

export default run;
