import { buildProblems, advanceQueue } from "../logic.node.mjs";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function testAddition() {
  const max = 20;
  const problems = buildProblems(500, max, ["add"]);
  problems.forEach(({ a, b }) => {
    assert(a >= 1, "add: a >= 1");
    assert(b >= 1, "add: b >= 1");
    assert(a + b <= max, `add: sum <= ${max}`);
  });
}

function testSubtraction() {
  const max = 50;
  const problems = buildProblems(500, max, ["sub"]);
  problems.forEach(({ a, b }) => {
    assert(a >= 1, "sub: a >= 1");
    assert(b >= 1, "sub: b >= 1");
    assert(a >= b, "sub: non-negative");
  });
}

function testMultiplication() {
  const max = 20;
  const problems = buildProblems(500, max, ["mul"]);
  problems.forEach(({ a, b }) => {
    assert(a >= 1 && a <= 10, "mul: a in 1..10");
    assert(b >= 1 && b <= 10, "mul: b in 1..10");
    assert(a * b <= max, "mul: result <= max");
  });
}

function testDivision() {
  const max = 20;
  const problems = buildProblems(500, max, ["div"]);
  problems.forEach(({ a, b }) => {
    assert(a >= 1 && a <= 10, "div: a in 1..10");
    assert(b >= 1 && b <= 10, "div: b in 1..10");
    assert(a % b === 0, "div: integer result");
    assert(a / b <= max, "div: result <= max");
  });
}

function testQueue() {
  const A = { id: "A" };
  const B = { id: "B" };
  const C = { id: "C" };
  const q1 = advanceQueue([A, B, C], false);
  assert(q1[0] === B && q1[2] === A, "queue: incorrect requeue");
  const q2 = advanceQueue([A, B, C], true);
  assert(q2.length === 2 && q2[0] === B && q2[1] === C, "queue: correct shift");
}

function run() {
  testAddition();
  testSubtraction();
  testMultiplication();
  testDivision();
  testQueue();
  console.log("All tests passed.");
}

run();
