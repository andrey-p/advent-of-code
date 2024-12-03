import { readFileSync } from 'fs';

type Solution = {
  default: (input: string) => any;
}

const day: string = process.argv[2];
const input: string = readFileSync(`./inputs/${day}.txt`, { encoding: 'utf8' });
const solution: Solution = await import(`./solutions/${day}.ts`);

console.time('solution');
console.log(solution.default(input));
console.timeEnd('solution');
