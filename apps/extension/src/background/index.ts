chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'DOMQA_CAPTURE_SCREENSHOT') {
    chrome.tabs.captureVisibleTab(sender.tab?.windowId, { format: 'png' }, (dataUrl) => sendResponse({ dataUrl }));
    return true;
  }
  if (message.type === 'DOMQA_STORAGE_SET') {
    chrome.storage.local.set(message.payload, () => sendResponse({ ok: true }));
    return true;
  }
  if (message.type === 'DOMQA_STORAGE_GET') {
    chrome.storage.local.get(message.keys, (result) => sendResponse(result));
    return true;
  }
});
