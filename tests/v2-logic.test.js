import {
  buildProblems, buildReport, computeAnswer, divisionFacts, factKey, inverseHint,
  median, migrateLearningData, multiplicationFacts, normalizeMastery, prioritizedFacts,
  recordAttempt, scoreAttempt, selectAdaptiveProblems,
} from "../v2/logic.js";

function assert(condition, message) { if (!condition) throw new Error(message); }
function equal(actual, expected, message) { assert(actual === expected, `${message}: expected ${expected}, got ${actual}`); }

function testGeneration() {
  const rng = () => 0;
  ["add", "sub", "mul", "div"].forEach((operation) => {
    const problems = buildProblems(12, 20, [operation], rng);
    equal(problems.length, 12, `${operation}: requested count`);
    problems.forEach((problem) => {
      equal(problem.op, operation, `${operation}: operation retained`);
      equal(problem.answer, computeAnswer(problem.op, problem.a, problem.b), `${operation}: answer is derived`);
      assert(problem.hint.includes("="), `${operation}: inverse hint supplied`);
      if (problem.op === "add") assert(problem.a + problem.b <= 20, "addition bounded");
      if (problem.op === "sub") assert(problem.a > problem.b, "subtraction stays positive");
      if (problem.op === "mul") assert(problem.a * problem.b <= 20, "multiplication bounded");
      if (problem.op === "div") assert(problem.a % problem.b === 0 && Number.isInteger(problem.answer) && problem.a <= 20, "division is an exact fact");
    });
  });
  assert(multiplicationFacts(20).every((fact) => fact.a <= fact.b && fact.answer <= 20), "fact pool is child-friendly");
  assert(divisionFacts(20).every((fact) => fact.a % fact.b === 0 && fact.answer <= 10), "division derives from facts");
  assert(divisionFacts(20).some((fact) => fact.a === 20 && fact.b === 4 && fact.answer === 5), "division includes first inverse form");
  assert(divisionFacts(20).some((fact) => fact.a === 20 && fact.b === 5 && fact.answer === 4), "division includes second inverse form");
  equal(factKey("mul", 3, 4), factKey("div", 12, 3), "inverse facts share mastery");
  equal(inverseHint({ op: "div", a: 12, b: 3 }), "12 / 3 = 4; 4 x 3 = 12.", "division hint");
}

function testMasteryAndPriority() {
  const now = 1000000;
  const problem = { op: "mul", a: 3, b: 4 };
  let mastery = recordAttempt({}, problem, { correct: false }, now);
  mastery = recordAttempt(mastery, problem, { correct: true, corrected: true }, now + 1);
  const record = mastery["mul:3:4"];
  equal(record.attempts, 2, "attempts retained");
  equal(record.corrections, 1, "correction retained");
  assert(record.dueAt > now, "due time is scheduled");
  const ranked = prioritizedFacts({ ...mastery, "add:1:2": { attempts: 4, correct: 4, firstTryCorrect: 4, dueAt: now + 1e8 } }, ["div"], now + 2e6);
  equal(ranked.length, 1, "operation filter includes inverse multiplication facts");
  equal(ranked[0].key, "mul:3:4", "division sees multiplication weakness");
}

function testAdaptiveDeterminism() {
  const weak = { "mul:2:2": { attempts: 5, correct: 0, dueAt: 0 } };
  const options = { count: 4, max: 10, operations: ["mul"], mastery: weak, now: 100, rng: () => 0 };
  const first = selectAdaptiveProblems(options);
  const second = selectAdaptiveProblems(options);
  assert(JSON.stringify(first) === JSON.stringify(second), "selection is deterministic with injected rng");
  assert(first.every((problem) => problem.op === "mul" && problem.answer <= 10), "adaptive selection honors operation and max");
  equal(first[0].factKey, "mul:1:1", "stable weighted selection");
  const confidence = selectAdaptiveProblems({ count: 20, max: 20, operations: ["div"], confidenceStart: true });
  assert(confidence.every((problem) => {
    const [, left, right] = problem.factKey.split(":").map(Number);
    return [2, 3, 5, 10].includes(left) && [2, 3, 5, 10].includes(right);
  }), "confidence start uses friendly fact families");
  assert(confidence.every((problem) => problem.b !== 1), "confidence start avoids patronizing divide-by-one facts");
}

function testDataAndReports() {
  const normalized = normalizeMastery({ valid: { attempts: "3", correct: 99, firstTryCorrect: -1, corrections: "2" }, bad: null });
  equal(Object.keys(normalized).length, 1, "malformed records discarded");
  equal(normalized.valid.correct, 3, "counts clamped");
  equal(median([8, 2, 4, 6]), 5, "even median");
  equal(median([]), null, "empty median");
  equal(scoreAttempt({ correct: true, firstTry: true }), 100, "first try receives highest score");
  assert(scoreAttempt({ correct: true, corrected: true }) > scoreAttempt({ correct: false }), "correction has value");
  const report = buildReport([{ correct: true, firstTry: true, durationMs: 900 }, { correct: true, corrected: true, durationMs: 1100 }, { correct: false, durationMs: 300 }]);
  equal(report.score, 145, "score does not reward raw speed");
  equal(report.medianDurationMs, 900, "median timing reported");
  const migrated = migrateLearningData({ facts: { "mul:2:3": { attempts: 1, correct: 1, firstTryCorrect: 1 } } }, 44);
  equal(migrated.version, 2, "data migration version");
  assert(migrated.mastery["mul:2:3"], "legacy facts migrated");
}

testGeneration();
testMasteryAndPriority();
testAdaptiveDeterminism();
testDataAndReports();
console.log("V2 logic tests passed.");
