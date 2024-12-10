type Point = { x: number, y: number };

const key = (point: Point): string => {
  return `${point.x}|${point.y}`;
};

const allDirections: Point[] = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 }
];

const getNextSteps = (grid: number[][], currentPoint: Point): Point[] => {
  const currentElevation = grid[currentPoint.y][currentPoint.x];
  const targetElevation = currentElevation + 1;

  return allDirections.map(direction => ({
    x: currentPoint.x + direction.x,
    y: currentPoint.y + direction.y
  })).filter(candidate => {
    return grid[candidate.y] &&
      grid[candidate.y][candidate.x] &&
      grid[candidate.y][candidate.x] === targetElevation;
  });
};

const evaluateTrail = (trailEnds: Map<string, boolean>, grid: number[][], currentPoint: Point): Map<string, boolean> => {
  if (grid[currentPoint.y][currentPoint.x] === 9) {
    trailEnds.set(key(currentPoint), true);
    return trailEnds;
  }

  const nextSteps = getNextSteps(grid, currentPoint);

  return nextSteps.reduce((trailEnds, step) => {
    return evaluateTrail(trailEnds, grid, step);
  }, trailEnds);
};

const run = (input: string) => {
  const lines = input.trim().split('\n');
  const grid = lines.map(
    line => line.split('').map(cell => parseInt(cell))
  );

  let totalScores = 0;

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] !== 0) {
        continue;
      }

      const trailHeadPoint: Point = { x: j, y: i };

      const trailEnds = evaluateTrail(new Map<string, boolean>(), grid, trailHeadPoint);
      totalScores += trailEnds.size;
    }
  }

  return totalScores;
};

export default run;
