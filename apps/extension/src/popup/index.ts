const app = document.getElementById("app");
if (app) {
  app.innerHTML = `<h1 style="margin:0">DOMQA</h1><p class="muted">Authenticate in the dashboard, choose a project, then enable inspect mode on the current tab.</p><input id="projectId" placeholder="Project ID"/><button id="enable">Enable inspect mode</button><button id="disable" style="background:#334155">Disable inspect mode</button><button id="open">Open dashboard</button>`;
  const projectInput = app.querySelector<HTMLInputElement>("#projectId");
  chrome.storage.local.get(["projectId"], (result) => { if (projectInput && result.projectId) projectInput.value = result.projectId; });
  app.querySelector("#enable")?.addEventListener("click", async () => {
    if (projectInput?.value) chrome.storage.local.set({ projectId: projectInput.value });
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab.id) chrome.tabs.sendMessage(tab.id, { type: "DOMQA_SET_INSPECT_MODE", enabled: true });
  });
  app.querySelector("#disable")?.addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab.id) chrome.tabs.sendMessage(tab.id, { type: "DOMQA_SET_INSPECT_MODE", enabled: false });
  });
  app.querySelector("#open")?.addEventListener("click", () => chrome.tabs.create({ url: "http://localhost:3000/dashboard" }));
}
