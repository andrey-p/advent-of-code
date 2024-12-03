type Direction = 'up' | 'down' | null;

const run = (input: string) => {
  const lines = input.split('\n');

  const safeReports = lines.reduce((totalSafe, line) => {
    const report = line.trim();

    if (!report) {
      return totalSafe;
    }

    const levels = report
      .split(' ')
      .map((val) => parseInt(val));

    let isSafe = true;
    let direction: Direction = null;

    for (let i = 0; i < levels.length - 1; i++) {
      const diff = levels[i + 1] - levels[i];

      if (diff === 0 || Math.abs(diff) > 3) {
        isSafe = false;

        break;
      } else if (diff > 0) {
        if (direction && direction === 'down') {
          isSafe = false;

          break;
        } else {
          direction = 'up';
        }
      } else if (diff < 0) {
        if (direction && direction === 'up') {
          isSafe = false;

          break;
        } else {
          direction = 'down';
        }
      }
    }

    if (isSafe) {
      return totalSafe + 1;
    } else {
      return totalSafe;
    }
  }, 0);

  return safeReports;
};

export default run;
