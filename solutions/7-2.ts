// I tried to do this without brute forcing; I failed

type Operator = '+' | '*' | '||';
const possibleOperators: Operator[] = ['+', '*', '||'];

type Operation = {
  op: Operator,
  value: number
};

const checkEquationIsCorrect = (result: number, operations: Operation[]): boolean => {
  const resultToCheck = operations.reduce((acc, operation) => {
    switch(operation.op) {
      case '+':
        acc += operation.value;
        break;
      case '*':
        acc *= operation.value;
        break;
      case '||':
        acc = parseInt(acc.toString() + operation.value.toString());
    }

    return acc;
  }, 0);

  return result === resultToCheck;
};

const getNextIteration = (operations: Operation[]): Operation[] | null => {
  const nextOperations = JSON.parse(JSON.stringify(operations)) as Operation[];
  const lastOp = possibleOperators[possibleOperators.length - 1];

  // first op should always be implicit +

  if (nextOperations.slice(1).every(operation => operation.op === lastOp)) {
    return null;
  }

  for (let i = operations.length - 1; i >= 0; i--) {
    if (operations[i].op === lastOp) {
      nextOperations[i].op = possibleOperators[0];
    } else {
      const currentIndex = possibleOperators.indexOf(operations[i].op);
      nextOperations[i].op = possibleOperators[currentIndex + 1];
      break;
    }
  }

  return nextOperations
};

const run = (input: string) => {
  const lines = input.trim().split('\n');

  const total = lines.reduce((total, line) => {
    const parts = line.split(': ');

    const equationResult = parseInt(parts[0]);
    const equationNumbers = parts[1]
      .split(' ')
      .map(value => parseInt(value));

    let operationsAttempt: Operation[] | null = equationNumbers.map(num => ({
      op: possibleOperators[0],
      value: num
    }));

    let isValid = false;

    while (operationsAttempt) {
      if (!operationsAttempt) {
        break;
      }

      if (checkEquationIsCorrect(equationResult, operationsAttempt)) {
        isValid = true;
        break;
      }

      operationsAttempt = getNextIteration(operationsAttempt);
    }

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
