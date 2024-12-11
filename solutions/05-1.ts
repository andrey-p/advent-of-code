const run = (input: string) => {
  const [ruleTxt, updateTxt] = input.trim().split('\n\n');

  const validComboRuleSet = ruleTxt
    .split('\n')
    .reduce((map, line) => {
      map.set(line, true);

      return map;
    }, new Map<string, boolean>());

  const updateLines = updateTxt.split('\n');
  let correctMiddlesSum = 0;

  updateLines.forEach((updateLine: string) => {
    const pages = updateLine.split(',');

    // go over every page in the list and make sure it does not break any rules
    const isCorrect = pages.every((page, i) => {
      for (let j = i + 1; j < pages.length; j++) {
        const ruleAgainstThisCombo = pages[j] + '|' + page;

        if (validComboRuleSet.has(ruleAgainstThisCombo)) {
          return false;
        }
      }

      return true;
    });

    if (isCorrect) {
      const middlePage = pages[Math.floor(pages.length / 2)];
      correctMiddlesSum += parseInt(middlePage);
    }
  });

  return correctMiddlesSum;
};

export default run;
