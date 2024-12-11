const run = (input: string): number => {
  const matches = input.match(/(do\(\))|(don't\(\))|(mul\(\d{1,3},\d{1,3}\))/g);

  if (!matches) {
    return 0;
  }

  let total = 0;
  let mulEnabled = true;

  matches.forEach((instruction: string) => {
    if (instruction === 'do()') {
      mulEnabled = true;
    } else if (instruction === 'don\'t()') {
      mulEnabled = false;
    } else if (mulEnabled) {
      const numbers: number[] = instruction.match(/\d+/g)?.map(number => parseInt(number))
        || [];

      if (numbers.length === 2) {
        total += numbers[0] * numbers[1];
      }
    }
  });

  return total;
};

export default run;
