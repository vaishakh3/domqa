import { projectSchema } from "@domqa/shared/schemas";
import { prisma } from "../db";

export async function listProjects(userId: string) {
  return prisma.project.findMany({
    where: { ownerId: userId },
    include: { environments: true, _count: { select: { issues: true } } },
    orderBy: { updatedAt: "desc" },
  });
}

export async function createProject(userId: string, input: unknown) {
  const data = projectSchema.parse(input);
  return prisma.project.create({
    data: {
      ownerId: userId,
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      memberships: { create: { userId, role: "owner" } },
      environments: { create: [{ name: "production" }, { name: "staging" }, { name: "development" }] },
    },
  });
}
