const run = (input: string): number => {
  const lines = input.split('\n');
  const left: number[] = [];
  const right = new Map<number, number>();

  lines.forEach((line) => {
    const matches = line.match(/(\d+)\s+(\d+)/);

    if (matches) {
      left.push(parseInt(matches[1]));

      const rightVal = parseInt(matches[2]);

      if (!right.has(rightVal)) {
        right.set(rightVal, 0);
      }

      const rightValCount = right.get(rightVal) ?? 0;
      right.set(rightVal, rightValCount + 1);
    }
  });

  const similarity = left.reduce((total, val) => {
    const multiplier = (right.get(val) ?? 0);
    total += val * multiplier;

    return total;
  }, 0);

  return similarity;
};

export default run;
