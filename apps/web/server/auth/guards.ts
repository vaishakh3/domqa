import { redirect } from "next/navigation";
import { prisma } from "../db";
import { getSessionUserId } from "./session";

export async function requireUser() {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) redirect("/login");
  return user;
}

export async function requireApiUser() {
  const userId = await getSessionUserId();
  if (!userId) throw new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  return user;
}
