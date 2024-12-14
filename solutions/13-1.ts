// or coordinate or vector or whatever
type Point = {
  x: number,
  y: number
};

const getPoint = (line: string): Point => {
  const [x, y] = (line.match(/\d+/g) || ['',''])
    .map(num => parseInt(num));

  return { x, y } as Point;
};

const getCredits = (combo: [number, number]): number => {
  return combo[0] * 3 + combo[1];
};

const run = (input: string) => {
  const inputs = input.trim().split('\n\n');

  let totalCredits = 0;

  inputs.forEach((machineBehaviour: string, i: number) => {
    const lines = machineBehaviour.split('\n');
    const buttonA = getPoint(lines[0]);
    const buttonB = getPoint(lines[1]);
    const prize = getPoint(lines[2]);

    // I don't remember enough algebra not to brute force this
    let buttonAPresses = 0;
    let buttonBPresses = 0;
    const correctPressCombos: [number, number][] = [];
    let pressesAreCorrect = false;

    while (buttonAPresses <= 100) {
      pressesAreCorrect = (buttonA.x * buttonAPresses + buttonB.x * buttonBPresses === prize.x) &&
        (buttonA.y * buttonAPresses + buttonB.y * buttonBPresses === prize.y);

      if (pressesAreCorrect) {
        correctPressCombos.push([buttonAPresses, buttonBPresses]);
      }

      buttonBPresses++;

      if (buttonBPresses > 100) {
        buttonBPresses = 0;
        buttonAPresses++;
      }
    }

    if (correctPressCombos.length) {
      console.log(correctPressCombos);
      const cheapestCombo = correctPressCombos.reduce((cheapest, current) => {
        if (getCredits(cheapest) > getCredits(current)) {
          return current;
        } else {
          return cheapest;
        }
      }, [100, 100]);

      console.log(`${i}: ${cheapestCombo.join(',')} => ${getCredits(cheapestCombo)} credits`);

      totalCredits += getCredits(cheapestCombo);
    } else {
      console.log(`no cheapest combo for ${i}`);
    }
  });

  return totalCredits;
};

export default run;
