import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret");
const cookieName = "domqa_session";

export async function createSession(userId: string) {
  const token = await new SignJWT({ sub: userId }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(secret);
  const store = await cookies();
  store.set(cookieName, token, { httpOnly: true, sameSite: "lax", secure: false, path: "/" });
}

export async function clearSession() {
  const store = await cookies();
  store.set(cookieName, "", { httpOnly: true, maxAge: 0, path: "/" });
}

export async function getSessionUserId() {
  const store = await cookies();
  const token = store.get(cookieName)?.value;
  if (!token) return null;
  try {
    const payload = await jwtVerify(token, secret);
    return payload.payload.sub ?? null;
  } catch {
    return null;
  }
}
