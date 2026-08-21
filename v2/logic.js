// V2 learning engine. It is an ES module and also exposes itself on globalThis
// for browser pages that load it with <script type="module">.
export const OPERATIONS = Object.freeze({
  add: { label: "+", solve: (a, b) => a + b },
  sub: { label: "-", solve: (a, b) => a - b },
  mul: { label: "x", solve: (a, b) => a * b },
  div: { label: "/", solve: (a, b) => a / b },
});

export const DEFAULT_OPERATIONS = Object.freeze(["add", "sub", "mul", "div"]);
const FACTOR_MIN = 1;
const FACTOR_MAX = 10;

function finiteNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function positiveInteger(value, fallback) {
  return Math.max(1, Math.floor(finiteNumber(value, fallback)));
}

export function normalizeOperations(operations) {
  const source = Array.isArray(operations) ? operations : DEFAULT_OPERATIONS;
  const selected = source.filter((operation) => Object.hasOwn(OPERATIONS, operation));
  return selected.length ? [...new Set(selected)] : [...DEFAULT_OPERATIONS];
}

export function randomInt(min, max, rng = Math.random) {
  const low = Math.ceil(finiteNumber(min, 0));
  const high = Math.floor(finiteNumber(max, low));
  if (high <= low) return low;
  const random = Math.min(0.999999999999, Math.max(0, finiteNumber(rng(), 0)));
  return low + Math.floor(random * (high - low + 1));
}

export function factKey(operation, a, b) {
  const left = positiveInteger(a, 1);
  const right = positiveInteger(b, 1);
  if (operation === "mul" || operation === "div") {
    const factorA = operation === "div" ? right : left;
    const factorB = operation === "div" ? left / right : right;
    const ordered = [factorA, factorB].sort((x, y) => x - y);
    return `mul:${ordered[0]}:${ordered[1]}`;
  }
  if (operation === "add") {
    const ordered = [left, right].sort((x, y) => x - y);
    return `add:${ordered[0]}:${ordered[1]}`;
  }
  return `sub:${left}:${right}`;
}

export function multiplicationFacts(max = 100) {
  const limit = positiveInteger(max, 100);
  const facts = [];
  for (let a = FACTOR_MIN; a <= FACTOR_MAX; a += 1) {
    for (let b = a; b <= FACTOR_MAX; b += 1) {
      if (a * b <= limit) facts.push({ a, b, answer: a * b, key: factKey("mul", a, b) });
    }
  }
  return facts;
}

export function divisionFacts(max = 100) {
  const limit = positiveInteger(max, 100);
  return multiplicationFacts(limit).flatMap(({ a, b, answer, key }) => {
    const facts = [{ a: answer, b, answer: a, key }];
    if (a !== b) facts.push({ a: answer, b: a, answer: b, key });
    return facts;
  });
}

function problemFromFact(operation, fact) {
  return { a: fact.a, b: fact.b, op: operation };
}

export function computeAnswer(operation, a, b) {
  if (!Object.hasOwn(OPERATIONS, operation)) return null;
  const left = finiteNumber(a, NaN);
  const right = finiteNumber(b, NaN);
  if (!Number.isFinite(left) || !Number.isFinite(right) || (operation === "div" && right === 0)) return null;
  return OPERATIONS[operation].solve(left, right);
}

export function inverseHint(problem) {
  if (!problem || !Object.hasOwn(OPERATIONS, problem.op)) return "";
  const answer = computeAnswer(problem.op, problem.a, problem.b);
  if (answer === null) return "";
  const { a, b, op } = problem;
  if (op === "add") return `${a} + ${b} = ${answer}; ${answer} - ${b} = ${a}.`;
  if (op === "sub") return `${a} - ${b} = ${answer}; ${answer} + ${b} = ${a}.`;
  if (op === "mul") return `${a} x ${b} = ${answer}; ${answer} / ${b} = ${a}.`;
  return `${a} / ${b} = ${answer}; ${answer} x ${b} = ${a}.`;
}

function basicCandidates(operation, max) {
  const limit = positiveInteger(max, 20);
  const candidates = [];
  if (operation === "add") {
    for (let a = 1; a < limit; a += 1) for (let b = a; a + b <= limit; b += 1) candidates.push({ a, b });
  } else if (operation === "sub") {
    for (let a = 2; a <= limit; a += 1) for (let b = 1; b < a; b += 1) candidates.push({ a, b });
  } else if (operation === "mul") {
    return multiplicationFacts(limit);
  } else if (operation === "div") {
    return divisionFacts(limit);
  }
  return candidates.map((fact) => ({ ...fact, answer: computeAnswer(operation, fact.a, fact.b), key: factKey(operation, fact.a, fact.b) }));
}

export function createProblem(operation, max = 20, rng = Math.random) {
  const op = normalizeOperations([operation])[0];
  const candidates = basicCandidates(op, max);
  const fact = candidates[randomInt(0, candidates.length - 1, rng)] || { a: 1, b: 1 };
  const problem = problemFromFact(op, fact);
  return { ...problem, answer: computeAnswer(op, problem.a, problem.b), factKey: factKey(op, problem.a, problem.b), hint: inverseHint(problem) };
}

export function buildProblems(count, max = 20, operations = DEFAULT_OPERATIONS, rng = Math.random) {
  const selected = normalizeOperations(operations);
  return Array.from({ length: Math.max(0, Math.floor(finiteNumber(count, 0))) }, () =>
    createProblem(selected[randomInt(0, selected.length - 1, rng)], max, rng));
}

export function normalizeMastery(input, now = Date.now()) {
  const source = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const output = {};
  Object.entries(source).forEach(([key, value]) => {
    if (typeof key !== "string" || !value || typeof value !== "object" || Array.isArray(value)) return;
    const attempts = Math.max(0, Math.floor(finiteNumber(value.attempts, 0)));
    const correct = Math.min(attempts, Math.max(0, Math.floor(finiteNumber(value.correct, value.firstTryCorrect || 0))));
    const firstTryCorrect = Math.min(correct, Math.max(0, Math.floor(finiteNumber(value.firstTryCorrect, 0))));
    const corrections = Math.min(attempts - firstTryCorrect, Math.max(0, Math.floor(finiteNumber(value.corrections, 0))));
    output[key] = {
      attempts,
      correct,
      firstTryCorrect,
      corrections,
      lastSeenAt: Math.max(0, finiteNumber(value.lastSeenAt, 0)),
      lastCorrectAt: Math.max(0, finiteNumber(value.lastCorrectAt, 0)),
      dueAt: Math.max(0, finiteNumber(value.dueAt, now)),
    };
  });
  return output;
}

export function masteryStrength(record) {
  const item = normalizeMastery({ item: record }).item;
  if (!item || !item.attempts) return 0;
  return (item.firstTryCorrect + item.corrections * 0.45) / item.attempts;
}

export function scoreAttempt({ correct, firstTry = false, corrected = false } = {}) {
  if (!correct) return 0;
  if (firstTry) return 100;
  if (corrected) return 45;
  return 60;
}

export function recordAttempt(mastery, problem, result = {}, now = Date.now()) {
  const records = normalizeMastery(mastery, now);
  const key = problem && problem.factKey ? problem.factKey : factKey(problem && problem.op, problem && problem.a, problem && problem.b);
  const previous = records[key] || { attempts: 0, correct: 0, firstTryCorrect: 0, corrections: 0, lastSeenAt: 0, lastCorrectAt: 0, dueAt: now };
  const correct = result.correct === true;
  const firstTry = correct && result.firstTry === true;
  const corrected = correct && !firstTry && result.corrected === true;
  const next = {
    ...previous,
    attempts: previous.attempts + 1,
    correct: previous.correct + (correct ? 1 : 0),
    firstTryCorrect: previous.firstTryCorrect + (firstTry ? 1 : 0),
    corrections: previous.corrections + (corrected ? 1 : 0),
    lastSeenAt: now,
    lastCorrectAt: correct ? now : previous.lastCorrectAt,
  };
  const strength = masteryStrength(next);
  // Weak or missed facts reappear soon; secure facts are spaced out.
  const delay = !correct ? 5 * 60e3 : firstTry && strength >= 0.8 ? 3 * 24 * 60 * 60e3 : 30 * 60e3;
  next.dueAt = now + delay;
  records[key] = next;
  return records;
}

export function prioritizedFacts(mastery, operations = DEFAULT_OPERATIONS, now = Date.now()) {
  const allowed = new Set(normalizeOperations(operations));
  return Object.entries(normalizeMastery(mastery, now))
    .filter(([key]) => allowed.has(key.split(":")[0]) || (key.startsWith("mul:") && (allowed.has("mul") || allowed.has("div"))))
    .map(([key, record]) => ({ key, ...record, strength: masteryStrength(record), overdue: Math.max(0, now - record.dueAt) }))
    .sort((a, b) => (b.overdue - a.overdue) || (a.strength - b.strength) || (a.lastSeenAt - b.lastSeenAt));
}

export function selectAdaptiveProblems({ count = 10, max = 20, operations = DEFAULT_OPERATIONS, mastery = {}, now = Date.now(), rng = Math.random, confidenceStart = false } = {}) {
  const selected = normalizeOperations(operations);
  const records = normalizeMastery(mastery, now);
  let candidates = selected.flatMap((op) => basicCandidates(op, max).map((fact) => ({ ...problemFromFact(op, fact), factKey: fact.key })));
  if (confidenceStart && selected.every((op) => op === "mul" || op === "div")) {
    const friendlyFactors = new Set([2, 3, 5, 10]);
    const friendly = candidates.filter((problem) => {
      const [, left, right] = problem.factKey.split(":");
      return friendlyFactors.has(Number(left)) && friendlyFactors.has(Number(right));
    });
    if (friendly.length) candidates = friendly;
  }
  const ranked = candidates.map((problem) => {
    const record = records[problem.factKey];
    const strength = masteryStrength(record);
    const dueAt = record ? record.dueAt : now;
    // Due/weak facts are preferred, but known facts receive a success-friendly baseline.
    const weight = (dueAt <= now ? 4 : 1) + (1 - strength) * 3 + (record && strength >= 0.7 ? 2 : 0);
    return { problem, weight };
  });
  const length = Math.max(0, Math.floor(finiteNumber(count, 0)));
  return Array.from({ length }, () => {
    const total = ranked.reduce((sum, item) => sum + item.weight, 0);
    let cursor = finiteNumber(rng(), 0) * total;
    const chosen = ranked.find((item) => ((cursor -= item.weight) <= 0)) || ranked[ranked.length - 1];
    const problem = chosen ? chosen.problem : createProblem(selected[0], max, rng);
    return { ...problem, answer: computeAnswer(problem.op, problem.a, problem.b), hint: inverseHint(problem) };
  });
}

export function median(values) {
  const numbers = (Array.isArray(values) ? values : []).map((value) => Number(value)).filter(Number.isFinite).sort((a, b) => a - b);
  if (!numbers.length) return null;
  const middle = Math.floor(numbers.length / 2);
  return numbers.length % 2 ? numbers[middle] : (numbers[middle - 1] + numbers[middle]) / 2;
}

export function buildReport(attempts, mastery = {}) {
  const entries = Array.isArray(attempts) ? attempts.filter((entry) => entry && typeof entry === "object") : [];
  const firstTryCorrect = entries.filter((entry) => entry.correct && entry.firstTry).length;
  const corrected = entries.filter((entry) => entry.correct && !entry.firstTry && entry.corrected).length;
  const score = entries.reduce((sum, entry) => sum + scoreAttempt(entry), 0);
  const timings = entries.map((entry) => entry.durationMs).filter(Number.isFinite);
  const normalized = normalizeMastery(mastery);
  return {
    attempts: entries.length,
    correct: entries.filter((entry) => entry.correct).length,
    firstTryCorrect,
    corrected,
    score,
    medianDurationMs: median(timings),
    mastery: Object.keys(normalized).length,
    weakFacts: prioritizedFacts(normalized).filter((item) => item.strength < 0.7).map((item) => item.key),
  };
}

export function migrateLearningData(input, now = Date.now()) {
  const data = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  return { version: 2, mastery: normalizeMastery(data.mastery || data.facts || data, now) };
}

const api = { OPERATIONS, DEFAULT_OPERATIONS, randomInt, normalizeOperations, factKey, multiplicationFacts, divisionFacts, computeAnswer, inverseHint, createProblem, buildProblems, normalizeMastery, masteryStrength, scoreAttempt, recordAttempt, prioritizedFacts, selectAdaptiveProblems, median, buildReport, migrateLearningData };
if (typeof globalThis !== "undefined") globalThis.MathSprintV2Logic = api;
