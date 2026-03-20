import { PANEL_ID, API_BASE } from '../lib/shared';

type PanelPayload = Record<string, unknown> & { screenshotDataUrl?: string | null; projectId: string };

export function removePanel() { document.getElementById(PANEL_ID)?.remove(); }

export function mountPanel(payload: PanelPayload) {
  removePanel();
  const root = document.createElement('div'); root.id = PANEL_ID;
  root.innerHTML = `<div style="position:fixed;right:16px;bottom:16px;width:360px;z-index:2147483647;background:#0f172a;color:#fff;border:1px solid #334155;border-radius:16px;box-shadow:0 24px 60px rgba(0,0,0,.45);font-family:Inter,system-ui,sans-serif"><div style="padding:16px;border-bottom:1px solid #1e293b"><strong>DOMQA capture</strong><div style="font-size:12px;color:#94a3b8;margin-top:4px">Issue will be tied to the selected element, not only a screenshot.</div></div><form id="domqa-form" style="padding:16px;display:grid;gap:10px"><select name="type"><option value="bug">Bug</option><option value="ui">UI</option><option value="ux">UX</option><option value="content">Content</option><option value="accessibility">Accessibility</option><option value="suggestion">Suggestion</option></select><input name="title" placeholder="Issue title" required style="padding:10px;border-radius:10px;border:1px solid #334155;background:#111827;color:#fff"/><textarea name="description" placeholder="Describe what is wrong and why it matters." required style="min-height:100px;padding:10px;border-radius:10px;border:1px solid #334155;background:#111827;color:#fff"></textarea><select name="priority"><option value="medium">Medium</option><option value="low">Low</option><option value="high">High</option><option value="critical">Critical</option></select><input name="environment" placeholder="production / staging / dev" style="padding:10px;border-radius:10px;border:1px solid #334155;background:#111827;color:#fff"/><input name="projectId" placeholder="Project ID" required style="padding:10px;border-radius:10px;border:1px solid #334155;background:#111827;color:#fff" value="${payload.projectId || ''}"/><div style="display:flex;gap:8px"><button type="button" id="domqa-cancel" style="flex:1;padding:10px;border-radius:10px;background:#1e293b;color:#fff;border:none">Cancel</button><button type="submit" style="flex:1;padding:10px;border-radius:10px;background:#7c3aed;color:#fff;border:none">Submit issue</button></div><p id="domqa-status" style="font-size:12px;color:#94a3b8"></p></form></div>`;
  document.body.appendChild(root);
  root.querySelector('#domqa-cancel')?.addEventListener('click', () => removePanel());
  root.querySelector<HTMLFormElement>('#domqa-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const status = root.querySelector('#domqa-status') as HTMLParagraphElement;
    status.textContent = 'Uploading screenshot and creating issue...';
    const formData = Object.fromEntries(new FormData(form).entries());
    let screenshotUrl: string | null = null;
    if (payload.screenshotDataUrl) {
      const upload = await fetch(`${API_BASE}/api/uploads/presign`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dataUrl: payload.screenshotDataUrl }) });
      screenshotUrl = (await upload.json()).url;
    }
    const issuePayload = { ...payload, ...formData, screenshotUrl };
    const response = await fetch(`${API_BASE}/api/extension/issues`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(issuePayload) });
    status.textContent = response.ok ? 'Issue created in DOMQA.' : 'Unable to create issue.';
    if (response.ok) setTimeout(() => removePanel(), 800);
  });
}
