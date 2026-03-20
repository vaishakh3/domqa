import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { generateElementFingerprint, locateElementFromFingerprint } from "./fingerprint";

test("fingerprint locates element by ranked selector strategy", () => {
  const dom = new JSDOM(`<main><button data-testid="submit-btn" class="primary">Save changes</button></main>`);
  const button = dom.window.document.querySelector("button");
  assert.ok(button);
  const fingerprint = generateElementFingerprint(button!);
  const located = locateElementFromFingerprint(fingerprint, dom.window.document);
  assert.equal(located.found, true);
  assert.equal(located.strategy, "testId");
});

test("fingerprint fallback scored search works when selectors drift", () => {
  const original = new JSDOM(`<div><a class="cta hero">Start trial</a></div>`);
  const el = original.window.document.querySelector("a");
  assert.ok(el);
  const fingerprint = generateElementFingerprint(el!);

  const changed = new JSDOM(`<div><a class="hero cta secondary">Start trial today</a></div>`);
  const located = locateElementFromFingerprint(fingerprint, changed.window.document);
  assert.equal(located.found, true);
  assert.equal(located.strategy, "scored-search");
});
