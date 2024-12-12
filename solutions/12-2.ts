type Point = { x: number, y: number };
type Border = {
  orientation: 'vertical' | 'horizontal'
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
        ...candidatePoint,
        orientation: direction.y === 0 ?
          'vertical' :
          'horizontal'
      });
    }
  });

  return tileset;
}

const countPerimeterSides = (perimeter: Border[]): number => {
  perimeter = structuredClone(perimeter);
  let sides = 0;

  // go through all the borders
  while (perimeter.length) {
    const border = perimeter[0];
    const alignedBorders: Border[] = [];
    const bordersLeft: Border[] = [];

    // huh
    type PointKey = keyof typeof border;
    let compareBy: PointKey;
    let sortBy: PointKey;

    sides++;

    if (border.orientation === 'horizontal') {
      compareBy = 'y';
      sortBy = 'x';
    } else {
      compareBy = 'x';
      sortBy = 'y';
    }

    // get all the borders that line up with the current one
    // (e.g. all horizontal borders along y=5);
    perimeter.forEach(borderB => {
      if (border[compareBy] === borderB[compareBy] &&
          border.orientation === borderB.orientation) {
        alignedBorders.push(borderB);
      } else {
        bordersLeft.push(borderB);
      }
    });

    // sort them so we get contiguous borders
    alignedBorders.sort((a, b) => b[sortBy] - a[sortBy]);

    // go through the aligned borders...
    let countedOppositeSides = false;
    for (let i = 0; i < alignedBorders.length - 1; i++) {
      // aligned borders but separated by at least one tile
      // count that as a separate side
      if (alignedBorders[i][sortBy] - alignedBorders[i + 1][sortBy] > 1) {
        sides++;
        // new side - the border might be doubled again
        countedOppositeSides = false;
      }

      // if there's multiple instances of this border, that means
      // it's used by 2 lines of the tileset, so it needs to be double counted
      if (alignedBorders[i][sortBy] === alignedBorders[i + 1][sortBy] && !countedOppositeSides) {
        sides++;
        countedOppositeSides = true;
      }
    }

    perimeter = bordersLeft;
  }

  return sides;
};

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
        perimeter: []
      };

      tileset = traverseContiguousTiles(tileset, grid, point);

      //console.log(tileset.perimeter);

      const perimeterSides = countPerimeterSides(tileset.perimeter);

      console.log(`tileset crop: ${grid[point.y][point.x]}`);
      console.log(`tileset area: ${tileset.area}`);
      console.log(`tileset perimeter: ${perimeterSides}`);
      console.log('===========');

      // add contiguous tiles from this area to ones we've checked
      allTilesVisited = new Map([...allTilesVisited, ...tileset.map]);

      totalFenceCost += tileset.area * perimeterSides;
    }
  }

  return totalFenceCost;
};

export default run;
