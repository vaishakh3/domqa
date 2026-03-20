import type { ElementFingerprint, ElementSummary, LocatedElement } from "./types";

const TEXT_LIMIT = 120;

const escapeCss = (value: string) => value.replace(/([#.;:[\],>+~*^$|=()])/g, "\\$1");
const normalizedText = (value?: string | null) => (value ?? "").replace(/\s+/g, " ").trim().slice(0, TEXT_LIMIT);

export function getElementSummary(el: Element): ElementSummary {
  const htmlEl = el as HTMLElement;
  const rect = htmlEl.getBoundingClientRect?.();
  return {
    tagName: el.tagName.toLowerCase(),
    id: el.getAttribute("id"),
    classes: Array.from(el.classList),
    role: el.getAttribute("role"),
    name: el.getAttribute("name"),
    ariaLabel: el.getAttribute("aria-label"),
    textSnippet: normalizedText(htmlEl.innerText || el.textContent),
    rect: rect ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height } : undefined,
  };
}

function buildCssSelector(el: Element): string | null {
  const id = el.getAttribute("id");
  if (id) return `#${escapeCss(id)}`;
  const testId = el.getAttribute("data-testid") || el.getAttribute("data-test") || el.getAttribute("data-qa");
  if (testId) return `[data-testid="${testId}"]`;
  const classes = Array.from(el.classList).slice(0, 3).map((c) => `.${escapeCss(c)}`).join("");
  return `${el.tagName.toLowerCase()}${classes}`;
}

function buildCssPath(el: Element): string {
  const parts: string[] = [];
  let current: Element | null = el;
  while (current && parts.length < 6) {
    const parent = current.parentElement;
    const index = parent ? Array.from(parent.children).indexOf(current) + 1 : 1;
    parts.unshift(`${current.tagName.toLowerCase()}:nth-child(${index})`);
    current = parent;
  }
  return parts.join(" > ");
}

export function generateCandidateSelectors(el: Element) {
  const text = normalizedText((el as HTMLElement).innerText || el.textContent);
  const role = el.getAttribute("role");
  const name = el.getAttribute("aria-label") || el.getAttribute("name");
  const testId = el.getAttribute("data-testid") || el.getAttribute("data-test") || el.getAttribute("data-qa");
  return {
    css: buildCssSelector(el),
    cssPath: buildCssPath(el),
    xpath: null,
    testId: testId ? `[data-testid="${testId}"]` : null,
    aria: role && name ? `${role}[name="${name}"]` : null,
    text: text || null,
  };
}

export function generateElementFingerprint(el: Element): ElementFingerprint {
  const summary = getElementSummary(el);
  const ancestry = [] as ElementFingerprint["ancestry"];
  let current: Element | null = el;
  for (let depth = 0; current && depth < 5; depth += 1) {
    const parent = current.parentElement;
    ancestry.push({
      tagName: current.tagName.toLowerCase(),
      id: current.getAttribute("id"),
      classes: Array.from(current.classList).slice(0, 4),
      index: parent ? Array.from(parent.children).indexOf(current) : 0,
    });
    current = parent;
  }
  const siblings = Array.from(el.parentElement?.children ?? [])
    .filter((child) => child !== el)
    .slice(0, 6)
    .map((child) => ({ tagName: child.tagName.toLowerCase(), textSnippet: normalizedText((child as HTMLElement).innerText || child.textContent) }));
  const nearbyText = [
    normalizedText(el.previousElementSibling?.textContent),
    normalizedText(el.nextElementSibling?.textContent),
    normalizedText(el.parentElement?.textContent),
  ].filter(Boolean);
  const stableAttributes = ["id", "name", "role", "aria-label", "placeholder", "data-testid", "data-test", "data-qa", "href", "src"]
    .reduce<Record<string, string>>((acc, key) => {
      const value = el.getAttribute(key);
      if (value) acc[key] = value;
      return acc;
    }, {});

  return {
    summary,
    selectors: generateCandidateSelectors(el),
    stableAttributes,
    ancestry,
    siblings,
    nearbyText,
    rect: summary.rect,
  };
}

export function scoreElementMatch(candidate: Element, fingerprint: ElementFingerprint): number {
  let score = 0;
  const summary = getElementSummary(candidate);
  if (summary.tagName === fingerprint.summary.tagName) score += 0.2;
  if (summary.id && summary.id === fingerprint.summary.id) score += 0.35;
  if (summary.role && summary.role === fingerprint.summary.role) score += 0.1;
  if (summary.ariaLabel && summary.ariaLabel === fingerprint.summary.ariaLabel) score += 0.1;
  const overlap = summary.classes.filter((cls) => fingerprint.summary.classes.includes(cls)).length;
  score += Math.min(overlap * 0.05, 0.15);
  if (summary.textSnippet && fingerprint.summary.textSnippet && summary.textSnippet.includes(fingerprint.summary.textSnippet.slice(0, 24))) score += 0.2;
  return Math.min(score, 1);
}

export function locateElementFromFingerprint(fingerprint: ElementFingerprint, root: ParentNode = document): LocatedElement {
  const selectorOrder = [
    ["testId", fingerprint.selectors.testId],
    ["css", fingerprint.selectors.css],
    ["cssPath", fingerprint.selectors.cssPath],
  ] as const;

  for (const [strategy, selector] of selectorOrder) {
    if (!selector) continue;
    const found = root.querySelector(selector);
    if (found) return { found: true, confidence: 0.92, strategy, summary: getElementSummary(found) };
  }

  const tag = fingerprint.summary.tagName;
  const candidates = Array.from(root.querySelectorAll(tag));
  let best: Element | null = null;
  let bestScore = 0;
  for (const candidate of candidates) {
    const score = scoreElementMatch(candidate, fingerprint);
    if (score > bestScore) {
      bestScore = score;
      best = candidate;
    }
  }

  if (best && bestScore >= 0.45) {
    return { found: true, confidence: Number(bestScore.toFixed(2)), strategy: "scored-search", summary: getElementSummary(best) };
  }

  return { found: false, confidence: bestScore, strategy: "not-found" };
}
