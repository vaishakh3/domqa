import { issueInputSchema, issueUpdateSchema, commentSchema } from "@domqa/shared/schemas";
import { prisma } from "../db";

async function nextIssueKey(projectId: string) {
  const count = await prisma.issue.count({ where: { projectId } });
  return `DOMQA-${100 + count}`;
}

export async function createIssue(reporterId: string, input: unknown) {
  const data = issueInputSchema.parse(input);
  const project = await prisma.project.findFirst({ where: { id: data.projectId, ownerId: reporterId } });
  if (!project) throw new Error("Project not found");
  const key = await nextIssueKey(project.id);
  return prisma.issue.create({
    data: {
      projectId: data.projectId,
      reporterId,
      key,
      title: data.title,
      description: data.description,
      type: data.type,
      priority: data.priority,
      environment: data.environment,
      pageUrl: data.pageUrl,
      pageTitle: data.pageTitle,
      pageOrigin: data.pageOrigin,
      viewportWidth: data.viewportWidth,
      viewportHeight: data.viewportHeight,
      pageWidth: data.pageWidth,
      pageHeight: data.pageHeight,
      userAgent: data.userAgent,
      browserLanguage: data.browserLanguage,
      screenshotUrl: data.screenshotUrl,
      screenshotWidth: data.screenshotWidth,
      screenshotHeight: data.screenshotHeight,
      targetRectX: data.targetRect?.x,
      targetRectY: data.targetRect?.y,
      targetRectWidth: data.targetRect?.width,
      targetRectHeight: data.targetRect?.height,
      selectedElementTag: data.selectedElement?.tagName,
      selectedElementId: data.selectedElement?.id,
      selectedElementClasses: data.selectedElement?.classes.join(" "),
      selectedElementRole: data.selectedElement?.role,
      selectedElementName: data.selectedElement?.name,
      selectedElementAriaLabel: data.selectedElement?.ariaLabel,
      selectedElementTextSnippet: data.selectedElement?.textSnippet,
      locator: { create: {
        primaryCssSelector: data.locator.primaryCssSelector,
        xpathSelector: data.locator.xpathSelector,
        testIdSelector: data.locator.testIdSelector,
        ariaSelector: data.locator.ariaSelector,
        textSelector: data.locator.textSelector,
        attributeFingerprint: data.locator.attributeFingerprint,
        ancestryFingerprint: data.locator.ancestryFingerprint,
        siblingFingerprint: data.locator.siblingFingerprint,
        nearbyTextFingerprint: data.locator.nearbyTextFingerprint,
        rectFingerprint: data.locator.rectFingerprint,
        rawFingerprint: data.locator.rawFingerprint,
      } },
      activities: { create: { actorId: reporterId, type: "created", metadata: { source: "extension" } } },
      consoleLogs: { create: data.consoleLogs.map((entry) => ({ ...entry, timestamp: entry.timestamp ? new Date(entry.timestamp) : null })) },
      networkLogs: { create: data.networkLogs.map((entry) => ({ ...entry, startedAt: entry.startedAt ? new Date(entry.startedAt) : null, endedAt: entry.endedAt ? new Date(entry.endedAt) : null })) },
    },
    include: { locator: true },
  });
}

export async function listIssues(userId: string, searchParams: URLSearchParams) {
  const status = searchParams.get("status") || undefined;
  const priority = searchParams.get("priority") || undefined;
  const projectId = searchParams.get("projectId") || undefined;
  const q = searchParams.get("q") || undefined;
  return prisma.issue.findMany({
    where: {
      project: { ownerId: userId },
      status: status as never,
      priority: priority as never,
      projectId,
      OR: q ? [{ title: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }, { key: { contains: q, mode: "insensitive" } }] : undefined,
    },
    include: { project: true, reporter: true, assignee: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getIssue(userId: string, issueId: string) {
  return prisma.issue.findFirst({ where: { id: issueId, project: { ownerId: userId } }, include: { project: true, reporter: true, assignee: true, locator: true, comments: { include: { author: true }, orderBy: { createdAt: "asc" } }, activities: { include: { actor: true }, orderBy: { createdAt: "desc" } }, consoleLogs: true, networkLogs: true } });
}

export async function updateIssue(userId: string, issueId: string, input: unknown) {
  const data = issueUpdateSchema.parse(input);
  const issue = await getIssue(userId, issueId);
  if (!issue) throw new Error("Issue not found");
  return prisma.issue.update({ where: { id: issueId }, data: { ...data, activities: data.status ? { create: { actorId: userId, type: "status_changed", metadata: { status: data.status } } } : undefined } });
}

export async function addComment(userId: string, issueId: string, input: unknown) {
  const data = commentSchema.parse(input);
  const issue = await getIssue(userId, issueId);
  if (!issue) throw new Error("Issue not found");
  return prisma.issueComment.create({ data: { issueId, authorId: userId, body: data.body } });
}
