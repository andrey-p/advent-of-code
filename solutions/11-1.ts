const iterations = 25;

const run = (input: string) => {
  let stones = input
    .trim()
    .split(' ')
    .map(num => parseInt(num));

  for (let i = 0; i < iterations; i++)  {
    const newStones: number[] = [];

    for (let j = 0; j < stones.length; j++) {
      if (stones[j] === 0) {
        newStones.push(1);
        continue;
      }

      const stringed = stones[j].toString();

      if (stringed.length % 2 === 0) {
        const midpoint = stringed.length / 2;
        newStones.push(parseInt(stringed.slice(0, midpoint)));
        newStones.push(parseInt(stringed.slice(midpoint)));
      } else {
        newStones.push(stones[j] * 2024);
      }
    }

    stones = newStones;
  }

  return stones.length;
};

export default run;
