import { generateElementFingerprint } from '../lib/shared';
import { mountPanel, removePanel } from '../panel';

type ConsoleEntry = { level: string; message: string; timestamp: string };
type NetworkEntry = { method: string; url: string; status?: number; ok?: boolean; startedAt?: string; endedAt?: string; resourceType?: string };
const consoleBuffer: ConsoleEntry[] = [];
const networkBuffer: NetworkEntry[] = [];
let inspectMode = false;
let currentHighlight: HTMLDivElement | null = null;

function pushConsole(level: string, args: unknown[]) { consoleBuffer.push({ level, message: args.map(String).join(' '), timestamp: new Date().toISOString() }); if (consoleBuffer.length > 40) consoleBuffer.shift(); }
['log','warn','error'].forEach((level) => { const original = console[level as 'log']; console[level as 'log'] = (...args: unknown[]) => { pushConsole(level, args); original(...args); }; });
window.addEventListener('error', (event) => pushConsole('error', [event.message]));
window.addEventListener('unhandledrejection', (event) => pushConsole('error', [String(event.reason)]));
const originalFetch = window.fetch.bind(window);
window.fetch = async (...args) => { const startedAt = new Date().toISOString(); const response = await originalFetch(...args); if (!response.ok) networkBuffer.push({ method: (args[1]?.method || 'GET') as string, url: String(args[0]), status: response.status, ok: response.ok, startedAt, endedAt: new Date().toISOString(), resourceType: 'fetch' }); return response; };

function ensureHighlight() { if (currentHighlight) return currentHighlight; currentHighlight = document.createElement('div'); Object.assign(currentHighlight.style, { position: 'fixed', border: '2px solid #7c3aed', background: 'rgba(124,58,237,.12)', zIndex: '2147483646', pointerEvents: 'none', borderRadius: '8px', transition: 'all .08s ease' }); document.body.appendChild(currentHighlight); return currentHighlight; }
function updateHighlight(target: HTMLElement) { const rect = target.getBoundingClientRect(); const el = ensureHighlight(); Object.assign(el.style, { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px` }); }
function clearHighlight() { currentHighlight?.remove(); currentHighlight = null; }
function isExtensionElement(target: HTMLElement) { return Boolean(target.closest('#domqa-sidecar-root')); }

function hoverListener(event: MouseEvent) { const target = event.target as HTMLElement | null; if (!inspectMode || !target || isExtensionElement(target)) return; updateHighlight(target); }
async function clickListener(event: MouseEvent) { const target = event.target as HTMLElement | null; if (!inspectMode || !target || isExtensionElement(target)) return; event.preventDefault(); event.stopPropagation(); inspectMode = false; const fingerprint = generateElementFingerprint(target); chrome.storage.local.get(['projectId'], (storage) => chrome.runtime.sendMessage({ type: 'DOMQA_CAPTURE_SCREENSHOT' }, (response) => { mountPanel({
  projectId: storage.projectId || '',
  selectedElement: fingerprint.summary,
  locator: {
    primaryCssSelector: fingerprint.selectors.css,
    xpathSelector: fingerprint.selectors.xpath,
    testIdSelector: fingerprint.selectors.testId,
    ariaSelector: fingerprint.selectors.aria,
    textSelector: fingerprint.selectors.text,
    attributeFingerprint: fingerprint.stableAttributes,
    ancestryFingerprint: fingerprint.ancestry,
    siblingFingerprint: fingerprint.siblings,
    nearbyTextFingerprint: fingerprint.nearbyText,
    rectFingerprint: fingerprint.rect,
    rawFingerprint: fingerprint,
  },
  targetRect: fingerprint.rect,
  pageUrl: location.href,
  pageTitle: document.title,
  pageOrigin: location.origin,
  viewportWidth: window.innerWidth,
  viewportHeight: window.innerHeight,
  pageWidth: document.documentElement.scrollWidth,
  pageHeight: document.documentElement.scrollHeight,
  userAgent: navigator.userAgent,
  browserLanguage: navigator.language,
  screenshotDataUrl: response?.dataUrl ?? null,
  consoleLogs: consoleBuffer,
  networkLogs: networkBuffer,
}); })); }

function keyListener(event: KeyboardEvent) { if (event.key === 'Escape') { inspectMode = false; clearHighlight(); removePanel(); } }
document.addEventListener('mousemove', hoverListener, true);
document.addEventListener('click', clickListener, true);
document.addEventListener('keydown', keyListener, true);
chrome.runtime.onMessage.addListener((message) => { if (message.type === 'DOMQA_SET_INSPECT_MODE') { inspectMode = message.enabled; if (!inspectMode) { clearHighlight(); removePanel(); } } });
