export const operations = {
  add: {
    label: "+",
    solve: (a, b) => a + b,
  },
  sub: {
    label: "−",
    solve: (a, b) => a - b,
  },
  mul: {
    label: "×",
    solve: (a, b) => a * b,
  },
  div: {
    label: "÷",
    solve: (a, b) => a / b,
  },
};

const MULTIPLICATION_PAIRS = (() => {
  const pairs = [];
  for (let a = 1; a <= 10; a += 1) {
    for (let b = 1; b <= 10; b += 1) {
      pairs.push([a, b]);
    }
  }
  return pairs;
})();

const DIVISION_PAIRS = (() => {
  const pairs = [];
  for (let dividend = 1; dividend <= 10; dividend += 1) {
    for (let divisor = 1; divisor <= 10; divisor += 1) {
      if (dividend % divisor === 0) {
        pairs.push([dividend, divisor]);
      }
    }
  }
  return pairs;
})();

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickMultiplicationPair(max) {
  const pool = MULTIPLICATION_PAIRS.filter(([a, b]) => a * b <= max);
  const pairs = pool.length ? pool : MULTIPLICATION_PAIRS;
  const [a, b] = pairs[randomInt(0, pairs.length - 1)];
  return { a, b };
}

function pickDivisionPair(max) {
  const pool = DIVISION_PAIRS.filter(([a, b]) => a / b <= max);
  const pairs = pool.length ? pool : DIVISION_PAIRS;
  const [dividend, divisor] = pairs[randomInt(0, pairs.length - 1)];
  return { a: dividend, b: divisor };
}

export function buildProblems(count, max, ops) {
  const problems = [];
  for (let i = 0; i < count; i += 1) {
    let a = 0;
    let b = 0;
    const op = ops[randomInt(0, ops.length - 1)];

    if (op === "add") {
      a = randomInt(1, Math.max(1, max - 1));
      b = randomInt(1, max - a);
    } else if (op === "sub") {
      a = randomInt(1, max);
      b = randomInt(1, a);
    } else if (op === "mul") {
      const pair = pickMultiplicationPair(max);
      a = pair.a;
      b = pair.b;
    } else if (op === "div") {
      const pair = pickDivisionPair(max);
      a = pair.a;
      b = pair.b;
    }

    problems.push({
      a,
      b,
      op,
      firstAttempted: false,
      solved: false,
      startTimestamp: null,
    });
  }
  return problems;
}

export function advanceQueue(queue, isCorrect) {
  if (!queue.length) return [];
  const next = queue.slice();
  if (isCorrect) {
    next.shift();
  } else {
    next.push(next.shift());
  }
  return next;
}
