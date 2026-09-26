import assert from "node:assert/strict";
import { CATEGORIES, EXAMPLES, dictionaryUrl, parseDictionary, loadWords, buildDeck, createSession, answerSession } from "../grammar/logic.js";
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
assert.equal(new URL(dictionaryUrl()).hostname, "query.wikidata.org");
assert.match(new URL(dictionaryUrl()).searchParams.get("query"), /Q188/);
assert.equal(Object.keys(EXAMPLES).length, 72);
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
assert.deepEqual(await loadWords(async (_url, options) => {
  assert.equal(options.credentials, "omit");
  assert.equal(options.cache, "no-store");
  return { ok: true, json: async () => fixture };
}), words);
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
