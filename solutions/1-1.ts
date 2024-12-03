const run = (input: string): number => {
  const lines = input.split('\n');
  const left: number[] = [];
  const right: number[] = [];

  lines.forEach((line) => {
    const matches = line.match(/(\d+)\s+(\d+)/);

    if (matches) {
      left.push(parseInt(matches[1]));
      right.push(parseInt(matches[2]));
    }
  });

  left.sort();
  right.sort();

  let total = 0;

  for (let i = 0; i < left.length; i++) {
    total += Math.abs(left[i] - right[i]);
  }

  return total;
};

export default run;
