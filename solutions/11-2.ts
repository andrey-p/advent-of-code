const iterations = 75;
//const iterations = 75;
const addVal = (dest: Map<number, number>, key: number, val: number) => {
  const oldVal = dest.get(key) || 0;
  dest.set(key, oldVal + val);
};

const run = (input: string) => {
  const numbers = input
    .trim()
    .split(' ')
    .map(num => parseInt(num));

  let stones = new Map<number, number>();

  // assuming all the initial numbers are unique
  numbers.forEach(num => {
    stones.set(num, 1);
  });

  for (let i = 0; i < iterations; i++)  {
    const newStones = new Map<number, number>();

    stones.forEach((val, key) => {
      if (key === 0) {
        addVal(newStones, 1, val);
        return;
      }

      const keyString = key.toString();
      if (keyString.length % 2 === 0) {
        const midpoint = keyString.length / 2;
        const key1 = parseInt(keyString.slice(0, midpoint));
        const key2 = parseInt(keyString.slice(midpoint));

        addVal(newStones, key1, val);
        addVal(newStones, key2, val);
      } else {
        addVal(newStones, key * 2024, val);
      }
    });

    stones = newStones;
    // console.log(stones);
  }

  let total = 0;
  stones.forEach((val) => {
    total += val;
  });

  return total;
};

export default run;
