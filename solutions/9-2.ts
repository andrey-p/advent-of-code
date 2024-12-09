const isEmptyBlock = (block: string): boolean => {
  return /^\.+$/.test(block);
};

const reorderBlocks = (blocks: string[]): string[] => {
  const nonEmptyBlocks = blocks
    .filter(block => !isEmptyBlock(block))
    .reverse();

  nonEmptyBlocks.forEach(block => {
    for (let i = 0; i < blocks.length; i++) {
      if (isEmptyBlock(blocks[i]) && blocks[i].length >= block.length) {
        // console.log(`putting block ${block} in index [${i}]`);

        const oldIndex = blocks.indexOf(block);
        if (oldIndex <= i) {
          continue;
        }

        // overwrite where the numbered block was with ..s
        blocks[oldIndex] = '.'.repeat(block.length);

        const diff = blocks[i].length - block.length;
        blocks[i] = block;

        // add an empty block with the leftover space
        if (diff > 0) {
          blocks.splice(i + 1, 0, '.'.repeat(diff));
        }

        break;
      }
    }

    console.log(blocks.join(''));
  });

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

    if (num) {
      blocks.push(char.repeat(num));
    }

    return blocks;
  }, [] as string[]);

  console.log(blocks);

  blocks = reorderBlocks(blocks)
    // turn from multi-character array of strings
    // to single-character array of strings
    // ['00', '.'] => ['0', '0', '.']
    .join('')
    .split('');

  return blocks.reduce((checksum, block, i) => {
    return block === '.'
      ? checksum
      : checksum + (parseInt(block) * i);
  }, 0);

  return blocks;
};

export default run;
