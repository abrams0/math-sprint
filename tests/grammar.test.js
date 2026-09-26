import assert from "node:assert/strict";
import { CATEGORIES, EXAMPLES, dictionaryUrls, parseDictionary, loadWords, buildDeck, createSession, answerSession } from "../grammar/logic.js";
import { translations, translate } from "../grammar/i18n.js";

function row(word, id, lexeme = "L100") {
  return { lemma: { value: word, "xml:lang": "de" }, category: { value: `http://www.wikidata.org/entity/${id}` }, lexeme: { value: `http://www.wikidata.org/entity/${lexeme}` } };
}
const response = (bindings) => ({ results: { bindings } });
const fixture = response([
  ..."Hund Katze Baum Haus Buch Tisch Stuhl Ball Blume Sonne Schule Kind".split(" ").map(w => row(w, "Q1084")),
  ..."laufen spielen lesen schreiben lachen singen tanzen springen malen rechnen lernen schlafen".split(" ").map(w => row(w, "Q24905")),
  ..."klein groß weich hart kalt warm heiß süß sauer grün blau gelb".split(" ").map(w => row(w, "Q34698")),
]);
const words = parseDictionary(fixture);
assert.equal(words.length, 36);
assert.equal(Object.keys(EXAMPLES).length, 360);
const urls = dictionaryUrls();
assert.equal(urls.length, 6);
const requestedWords = [];
for (const url of urls) {
  assert.equal(new URL(url).hostname, "query.wikidata.org");
  assert(url.length < 4000, "Dictionary GET request is too long");
  const query = new URL(url).searchParams.get("query");
  assert.match(query, /Q188/);
  const batch = [...query.matchAll(/"([^"\n]+)"@de/g)].map(match => match[1]);
  assert.equal(batch.length, 60);
  requestedWords.push(...batch);
}
assert.deepEqual(requestedWords, Object.keys(EXAMPLES));
for (const [word, example] of Object.entries(EXAMPLES)) {
  assert(example.includes(word), `Missing target word in example: ${word}`);
  assert(/[.!?]$/.test(example), `Unfinished example: ${word}`);
}
for (const word of ["Freundschaft", "Verantwortung", "beobachten", "vergleichen", "zuverlässig", "ungewöhnlich"]) {
  assert(Object.hasOwn(EXAMPLES, word), `Missing more challenging vocabulary: ${word}`);
}
const challenging = parseDictionary(response([
  row("Freundschaft", "Q1084"), row("Verantwortung", "Q1084"),
  row("beobachten", "Q24905"), row("vergleichen", "Q24905"),
  row("zuverlässig", "Q34698"), row("ungewöhnlich", "Q34698"),
]));
assert.equal(challenging.length, 6);
assert.deepEqual(challenging.map(word => word.category), ["Nomen", "Nomen", "Verb", "Verb", "Adjektiv", "Adjektiv"]);
assert(challenging.every(word => word.example === EXAMPLES[word.word]));
assert.throws(() => parseDictionary({}), /Invalid dictionary/);
assert.deepEqual(parseDictionary(response([row("Hund", "Q1084"), row("Hund", "Q24905")])), []);
assert.deepEqual(parseDictionary(response([row("Hund", "Q1084"), row("Hund", "Q999999")])), []);
assert.deepEqual(parseDictionary(response([row("Hund", "Q1084"), { ...row("Hund", "Q1084"), category: null }])), []);
assert.deepEqual(parseDictionary(response([row("not-child-friendly", "Q1084"), row("Hund", "Q9999"), row("Hund", "Q1084", "bad-id")])), []);
assert.equal(parseDictionary(response([row("Hund", "Q1084"), row("Hund", "Q1084", "L200")])).length, 1);
assert.deepEqual(parseDictionary(response([{...row("Hund", "Q1084"), lemma: {value:"Hund", "xml:lang":"en"}}])), []);
for (const count of [10, 20, 30]) {
  for (let n = 0; n < 50; n++) {
    const deck = buildDeck(words, count);
    assert.equal(deck.length, count);
    assert.equal(new Set(deck.map(w => w.word)).size, count);
    const counts = CATEGORIES.map(c => deck.filter(w => w.category === c).length);
    assert(Math.max(...counts) - Math.min(...counts) <= 1);
  }
}
assert.throws(() => buildDeck(words, 0));
assert.throws(() => buildDeck([], 10));
const session = createSession([words[0], words[1], words[12]]);
assert.equal(answerSession(session, "Verb").correct, false);
assert.equal(session.pending[session.index].word, words[1].word);
answerSession(session, "Nomen");
assert.equal(answerSession(session, "Nomen").outcome, "review");
assert.equal(session.round, 2);
assert.deepEqual(session.pending.map(w => w.word), [words[0].word, words[12].word]);
answerSession(session, "Verb");
assert.equal(answerSession(session, "Verb").outcome, "review");
assert.equal(session.round, 3);
assert.equal(answerSession(session, "Nomen").outcome, "complete");
assert.equal(session.firstCorrect, 1);
assert.equal(session.corrected, 2);
assert.equal(session.attempts, 6);
assert.throws(() => answerSession(session, "Nomen"));
const perfect = createSession([words[0]]);
assert.equal(answerSession(perfect, "Nomen").outcome, "complete");
assert.equal(perfect.round, 1);
assert.equal(perfect.firstCorrect, 1);
assert.throws(() => answerSession(createSession([words[0]]), "Other"));
assert.throws(() => createSession([]));
let fetchCount = 0;
assert.deepEqual(await loadWords(async (url, options) => {
  assert.equal(url, urls[fetchCount++]);
  assert.equal(options.credentials, "omit");
  assert.equal(options.cache, "no-store");
  return { ok: true, json: async () => fixture };
}), words);
assert.equal(fetchCount, urls.length);
let partialRequests = 0;
await assert.rejects(loadWords(async () => {
  if (++partialRequests === 2) return {ok: false, status: 503};
  return {ok: true, json: async () => fixture};
}), /HTTP 503/);
assert.equal(partialRequests, 2, "Stop loading after a failed batch");
await assert.rejects(loadWords(async () => ({ok: false, status: 429})), /HTTP 429/);
await assert.rejects(loadWords(async () => ({ok: true, json: async () => response([])})), /Not enough/);
await assert.rejects(loadWords(async () => {throw new Error("Offline");}), /Offline/);
await assert.rejects(loadWords((_url, {signal}) => new Promise((_resolve, reject) => {
  signal.addEventListener("abort", () => reject(new Error("Timed out")), {once: true});
}), 5), /Timed out/);
const keys = Object.keys(translations.en).sort();
for (const [lang, entries] of Object.entries(translations)) {
  assert.deepEqual(Object.keys(entries).sort(), keys, `${lang}: missing translations`);
  for (const [key, value] of Object.entries(entries)) {
    assert(value.trim(), `${lang}: empty ${key}`);
    assert.deepEqual(value.match(/\{\w+\}/g)?.sort(), translations.en[key].match(/\{\w+\}/g)?.sort());
  }
  assert(!translate(lang, "round", {round: 2, current: 1, total: 5}).includes("{"));
}
console.log("Grammar tests passed: API validation, balanced decks, retry queue, errors, timeout and translations.");
