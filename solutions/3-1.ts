const run = (input: string): number => {
  const matches = input.match(/mul\(\d{1,3},\d{1,3}\)/g);

  if (!matches) {
    return 0;
  }

  return matches.reduce((total, mul) => {
    const numbers: number[] = mul.match(/\d+/g)?.map(number => parseInt(number))
      || [];

    if (numbers.length === 2) {
      total += numbers[0] * numbers[1];
    }

    return total;
  }, 0);
};

export default run;
