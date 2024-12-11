type Block = {
  fileId: string, // e.g. '12' | '.'
  size: number
};

const isEmptyBlock = (block: Block | undefined): boolean => {
  if (!block) { return false; }

  return block.fileId === '.';
};

// overwrite the old place of the file block with empty space,
// merging with empty space before or after if needs be
// (not strictly necessary but made debugging easier)
const emptyBlock = (blocks: Block[], index: number, size: number) => {
  let startIndex = index;
  let blocksToRemove = 1;
  const newEmptyBlock = {
    fileId: '.',
    size
  };

  const blockBefore = blocks[index - 1];
  const blockAfter = blocks[index + 1];
  if (isEmptyBlock(blockBefore)) {
    newEmptyBlock.size += blocks[index - 1].size;
    startIndex = index - 1;
    blocksToRemove++;
  }

  if (isEmptyBlock(blockAfter)) {
    newEmptyBlock.size += blocks[index + 1].size;
    blocksToRemove++;
  }

  blocks.splice(startIndex, blocksToRemove, newEmptyBlock);
};

const reorderBlocks = (blocks: Block[]): Block[] => {
  const nonEmptyBlocks = blocks
    .filter(block => !isEmptyBlock(block))
    .reverse();

  nonEmptyBlocks.forEach((block) => {
    for (let i = 0; i < blocks.length; i++) {
      if (isEmptyBlock(blocks[i]) && blocks[i].size >= block.size) {
        const oldIndex = blocks.indexOf(block);
        if (oldIndex < i) {
          break;
        }

        emptyBlock(blocks, oldIndex, block.size);

        const diff = blocks[i].size - block.size;
        blocks[i] = block;

        if (diff > 0) {
          // merge leftover space if there's any to the right
          if (blocks[i + 1].fileId === '.') {
            blocks[i + 1].size += diff;
          } else {
            // otherwise add an empty block with the leftover space
            blocks.splice(i + 1, 0, { fileId: '.', size: diff });
          }
        }

        break;
      }

    }
  });

  return blocks;
};

const run = (input: string) => {
  const numbers = input
    .trim()
    .split('')
    .map(num => parseInt(num));

  let blocks: Block[] = numbers.reduce((blocks, num, i) => {
    const char = i % 2 === 0
      // file
      ? Math.floor(i / 2).toString()
      // free space
      : '.';

    if (num) {
      blocks.push({
        fileId: char,
        size: num
      });
    }

    return blocks;
  }, [] as Block[]);

  blocks = reorderBlocks(blocks);

  const result = blocks.reduce(({ checksum, position }, block) => {
    if (block.fileId === '.') {
      position += block.size;
    } else {
      for (let i = 0; i < block.size; i++) {
        checksum += parseInt(block.fileId) * position;
        position++;
      }
    }

    return { checksum, position };
  }, { checksum: 0, position: 0 });

  return result.checksum;
};

export default run;
