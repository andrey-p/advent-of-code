const reorderBlocks = (blocks: string[]): string[] => {
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i] !== '.') {
      continue;
    }

    for (let j = blocks.length - 1; j > 0; j--) {
      if (blocks[j] !== '.') {
        const temp = blocks[i];
        blocks[i] = blocks[j];
        blocks[j] = temp;
        break;
      }

      if (i === j) {
        return blocks;
      }
    }
  }

  return blocks;
};

const run = (input: string) => {
  const numbers = input
    .trim()
    .split('')
    .map(num => parseInt(num));

  let blocks: string[] = numbers.reduce((blocks, num, i) => {
    const char = i % 2 === 0
      // file
      ? Math.floor(i / 2).toString()
      // free space
      : '.';

    for (let i = 0; i < num; i++) {
      blocks.push(char);
    }

    return blocks;
  }, [] as string[]);

  blocks = reorderBlocks(blocks);

  return blocks.reduce((checksum, block, i) => {
    return block === '.'
      ? checksum
      : checksum + (parseInt(block) * i);
  }, 0);

  return blocks;
};

export default run;
