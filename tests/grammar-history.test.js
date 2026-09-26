import assert from "node:assert/strict";
import { HISTORY_KEY, HISTORY_LIMIT, normalizeHistory, readHistory, recordResult, chartGeometry } from "../grammar/history.js";

const result = (index, firstCorrect = index % 11) => ({ id: `session-${index}`, completedAt: 1700000000000 + index * 1000, total: 10, firstCorrect });
const many = Array.from({ length: 30 }, (_, index) => result(index));
assert.equal(HISTORY_LIMIT, 20);
assert.deepEqual(normalizeHistory(many.toReversed()), many.slice(-20));
assert.deepEqual(normalizeHistory([result(1), result(1)]), [result(1)]);
assert.deepEqual(normalizeHistory(null), []);
assert.deepEqual(normalizeHistory([null, {}, { ...result(1), total: 0 }, { ...result(1), firstCorrect: 11 },
  { ...result(1), firstCorrect: -1 }, { ...result(1), firstCorrect: "5" }, { ...result(1), completedAt: Infinity },
  { ...result(1), completedAt: 8640000000000001 }, { ...result(1), total: 3.5 }, { ...result(1), id: "" }]), []);
const data = new Map();
const storage = { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
assert.deepEqual(readHistory(() => storage), { entries: [], saved: true });
let saved = recordResult([], result(1, 7), () => storage);
assert(saved.saved);
assert.equal(saved.entries[0].firstCorrect / saved.entries[0].total, .7);
assert.deepEqual(readHistory(() => storage), saved);
assert.equal(recordResult(saved.entries, result(1, 7), () => storage).entries.length, 1);
// Merge already-persisted results rather than overwriting another tab's completed lesson.
saved = recordResult([], result(2), () => storage);
assert.equal(saved.entries.length, 2);
for (const entry of many) saved = recordResult(saved.entries, entry, () => storage);
assert.deepEqual(saved.entries, many.slice(-20));
assert.equal(JSON.parse(data.get(HISTORY_KEY)).length, 20);
data.set(HISTORY_KEY, "not-json");
assert.deepEqual(readHistory(() => storage), { entries: [], saved: false });
assert.equal(recordResult([], result(3), () => storage).saved, true);
const denied = () => { throw new Error("Storage denied"); };
assert.deepEqual(readHistory(denied), { entries: [], saved: false });
const unsaved = recordResult([result(1)], result(2), denied);
assert.equal(unsaved.saved, false);
assert.deepEqual(unsaved.entries, [result(1), result(2)]);
assert.equal(recordResult([], result(4), () => ({ getItem: () => null, setItem: denied })).saved, false);

for (const width of [200, 280, 390, 760]) {
  for (const scores of [[], [0], [10], [5], [0, 10, 0, 10], Array(20).fill(10), Array(20).fill(0),
    Array.from({length: 20}, (_, i) => i % 11)]) {
    const entries = scores.map((score, index) => result(index, score));
    const graph = chartGeometry(entries, width);
    assert.equal(graph.points.length, scores.length);
    assert(!/NaN|Infinity/.test(graph.line + graph.area));
    if (entries.length < 2) assert.equal(graph.area, "");
    graph.points.forEach((point, index) => {
      assert(point.x >= graph.left && point.x <= graph.right);
      assert(point.y >= graph.top && point.y <= graph.bottom);
      assert.equal(point.y, graph.bottom - scores[index] / 10 * (graph.bottom - graph.top));
      if (!index) return;
      const previous = graph.points[index - 1];
      assert(point.x > previous.x);
      // The horizontal-control cubic must not fabricate values above/below either recorded score.
      for (let step = 0; step <= 100; step++) {
        const t = step / 100;
        const y = (1-t)**3 * previous.y + 3*(1-t)**2*t*previous.y + 3*(1-t)*t*t*point.y + t**3*point.y;
        assert(y >= Math.min(previous.y, point.y) - 1e-9 && y <= Math.max(previous.y, point.y) + 1e-9);
      }
    });
  }
}
console.log("Grammar history tests passed: persistence, deduplication, chronology, 20-result limit, invalid data, denied storage and bounded curves.");
