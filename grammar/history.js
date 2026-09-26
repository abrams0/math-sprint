export const HISTORY_KEY = "mathSprintGrammar:history:v1";
export const HISTORY_LIMIT = 20;

export function normalizeHistory(value) {
  if (!Array.isArray(value)) return [];
  const unique = new Map();
  for (const entry of value) {
    if (!entry || typeof entry.id !== "string" || !entry.id || entry.id.length > 100
      || !Number.isSafeInteger(entry.completedAt) || entry.completedAt <= 0 || entry.completedAt > 8640000000000000
      || !Number.isInteger(entry.total) || entry.total < 1 || entry.total > 1000
      || !Number.isInteger(entry.firstCorrect) || entry.firstCorrect < 0 || entry.firstCorrect > entry.total) continue;
    const { id, completedAt, total, firstCorrect } = entry;
    unique.set(id, { id, completedAt, total, firstCorrect });
  }
  return [...unique.values()].sort((a, b) => a.completedAt - b.completedAt).slice(-HISTORY_LIMIT);
}

export function readHistory(getStorage = () => localStorage) {
  try {
    return { entries: normalizeHistory(JSON.parse(getStorage().getItem(HISTORY_KEY) || "[]")), saved: true };
  } catch {
    return { entries: [], saved: false };
  }
}

export function recordResult(entries, result, getStorage = () => localStorage) {
  const stored = readHistory(getStorage);
  const merged = normalizeHistory([...stored.entries, ...entries, result]);
  try {
    getStorage().setItem(HISTORY_KEY, JSON.stringify(merged));
    return { entries: merged, saved: true };
  } catch {
    // Keep this visit's results visible even when the browser refuses persistent storage.
    return { entries: merged, saved: false };
  }
}

export function chartGeometry(entries, width) {
  const height = 240;
  const left = 48;
  const right = Math.max(180, width) - 20;
  const top = 34;
  const bottom = 210;
  const points = entries.map((entry, index) => ({
    x: entries.length === 1 ? (left + right) / 2 : left + (right - left) * index / (entries.length - 1),
    y: bottom - (entry.firstCorrect / entry.total) * (bottom - top),
    entry,
  }));
  let line = "";
  points.forEach((point, index) => {
    if (!index) { line = `M ${point.x} ${point.y}`; return; }
    const previous = points[index - 1];
    const midX = (previous.x + point.x) / 2;
    // Horizontal controls keep each segment between its endpoints: no fake peaks or overshoot.
    line += ` C ${midX} ${previous.y} ${midX} ${point.y} ${point.x} ${point.y}`;
  });
  const area = points.length > 1 ? `${line} L ${points.at(-1).x} ${bottom} L ${points[0].x} ${bottom} Z` : "";
  return { height, left, right, top, bottom, points, line, area };
}

export function renderHistoryChart(svg, entries, { title, description, pointLabel, percentage }) {
  const width = svg.parentElement.clientWidth;
  if (!width || !entries.length) return;
  const geometry = chartGeometry(entries, width);
  svg.replaceChildren();
  svg.setAttribute("viewBox", `0 0 ${width} ${geometry.height}`);
  const node = (tag, attributes, parent = svg, text) => {
    const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, String(value));
    if (text !== undefined) element.textContent = text;
    parent.append(element);
    return element;
  };
  node("title", { id: "historySvgTitle" }, svg, title);
  node("desc", { id: "historySvgDescription" }, svg, description);
  const defs = node("defs", {});
  const gradient = node("linearGradient", { id: "historyWaveFill", x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
  node("stop", { offset: "0%", "stop-color": "#82ad82", "stop-opacity": ".34" }, gradient);
  node("stop", { offset: "100%", "stop-color": "#82ad82", "stop-opacity": ".025" }, gradient);
  if (geometry.area) node("path", { d: geometry.area, fill: "url(#historyWaveFill)" });
  for (const value of [0, .5, 1]) {
    const y = geometry.bottom - value * (geometry.bottom - geometry.top);
    node("line", { x1: geometry.left, y1: y, x2: geometry.right, y2: y, class: "history-grid" });
    node("text", { x: geometry.left - 9, y: y + 4, "text-anchor": "end", class: "history-axis" }, svg, percentage(value));
  }
  for (const point of geometry.points) {
    node("line", { x1: point.x, y1: geometry.bottom, x2: point.x, y2: point.y, class: "history-stem" });
  }
  node("path", { d: geometry.line, class: "history-wave" });
  geometry.points.forEach((point, index) => {
    const latest = index === geometry.points.length - 1;
    const dot = node("circle", { cx: point.x, cy: point.y, r: latest ? 5.5 : 3.5, class: latest ? "history-dot latest" : "history-dot" });
    node("title", {}, dot, pointLabel(point.entry));
  });
  const last = geometry.points.at(-1);
  const labelX = Math.max(geometry.left + 25, Math.min(geometry.right - 25, last.x));
  node("rect", { x: labelX - 25, y: last.y - 30, width: 50, height: 22, rx: 10, class: "history-latest-pill" });
  node("text", { x: labelX, y: last.y - 15, "text-anchor": "middle", class: "history-latest-label" }, svg,
    percentage(last.entry.firstCorrect / last.entry.total));
}
