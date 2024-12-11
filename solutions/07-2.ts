const checkRemainingNumbers = (result: number, numbers: number[]): boolean => {
  numbers = numbers.concat();

  // the next number either multiplies or adds to all the others
  const nextNumber = numbers.shift();

  // ran out of numbers, not sure when this would happen?
  if (!nextNumber) {
    return false;
  }

  // got to the end of the chain, this last number was added
  if (result === nextNumber) {
    return true;
  }

  const re = new RegExp(nextNumber + '$');
  if (result.toString().match(re)) {
    const tempResult = parseInt(result.toString().replace(re, ''));

    if (checkRemainingNumbers(tempResult, numbers)) {
      return true;
    }
  }

  // possibly a multiplier
  // try dividing the result and see whether the rest is valid
  if (result % nextNumber === 0) {
    console.log(`trying ${result}: ${numbers.join(' ')} * ${nextNumber}`);
    const tempResult = result / nextNumber;

    if (checkRemainingNumbers(tempResult, numbers)) {
      // the rest checks out
      return true;
    }
  }

  console.log(`trying ${result}: ${numbers.join(' ')} + ${nextNumber}`);

  // if we got here, try assuming the next number was added
  result -= nextNumber;

  if (result === 0) {
    return true;
  } else if (result < 0) {
    return false;
  } else {
    return checkRemainingNumbers(result, numbers);
  }
};

const run = (input: string) => {
  const lines = input.trim().split('\n');

  const total = lines.reduce((total, line) => {
    const parts = line.split(': ');

    const equationResult = parseInt(parts[0]);
    const equationNumbers = parts[1]
      .split(' ')
      .map(value => parseInt(value));

    // the numbers given are applied left to right,
    // so flip them to start with the most recent operation
    const numbersReversed = equationNumbers.concat().reverse();

    const isValid = checkRemainingNumbers(equationResult, numbersReversed);

    if (isValid) {
      console.log(`VALID: ${line}`);
    } else {
      console.log(`NOT VALID: ${line}`);
    }

    return isValid
      ? total + equationResult
      : total;
  }, 0);

  return total;
};

export default run;
