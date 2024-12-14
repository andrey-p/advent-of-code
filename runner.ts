import { readFileSync } from 'fs';

type Solution = {
  default: (input: string) => any;
}

let day: string = process.argv[2];

// 9-1 -> 09-1
if (day.length === 3) {
  day = '0' + day;
}

const input: string = readFileSync(`./inputs/${day}.txt`, { encoding: 'utf8' });
const solution: Solution = await import(`./solutions/${day}.ts`);

console.time('solution');
console.log(await solution.default(input));
console.timeEnd('solution');
