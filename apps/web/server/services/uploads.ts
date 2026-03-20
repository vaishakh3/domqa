import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

export async function saveBase64Image(dataUrl: string) {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match) return null;
  const [, mime, base64] = match;
  const ext = mime.includes("png") ? "png" : "jpg";
  const dir = process.env.UPLOAD_DIR || "apps/web/public/uploads";
  await mkdir(dir, { recursive: true });
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  await writeFile(join(dir, fileName), Buffer.from(base64, "base64"));
  return `/uploads/${fileName}`;
}
