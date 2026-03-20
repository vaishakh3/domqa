import { z } from "zod";
import { issuePriorities, issueStatuses, issueTypes } from "./types";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const signupSchema = loginSchema.extend({
  name: z.string().min(2).max(80),
});

export const projectSchema = z.object({
  name: z.string().min(2).max(80),
  slug: z.string().min(2).max(80).regex(/^[a-z0-9-]+$/),
  description: z.string().max(400).optional().or(z.literal("")),
});

export const issueInputSchema = z.object({
  projectId: z.string().cuid(),
  title: z.string().min(3).max(160),
  description: z.string().min(3).max(4000),
  type: z.enum(issueTypes),
  priority: z.enum(issuePriorities),
  environment: z.string().max(40).optional().nullable(),
  pageUrl: z.string().url(),
  pageTitle: z.string().max(300),
  pageOrigin: z.string().max(200),
  viewportWidth: z.number().int().positive(),
  viewportHeight: z.number().int().positive(),
  pageWidth: z.number().int().positive().nullable().optional(),
  pageHeight: z.number().int().positive().nullable().optional(),
  userAgent: z.string().max(500),
  browserLanguage: z.string().max(32).optional().nullable(),
  screenshotUrl: z.string().max(500).optional().nullable(),
  screenshotWidth: z.number().int().positive().optional().nullable(),
  screenshotHeight: z.number().int().positive().optional().nullable(),
  targetRect: z.object({ x: z.number(), y: z.number(), width: z.number(), height: z.number() }).optional().nullable(),
  selectedElement: z.object({
    tagName: z.string(),
    id: z.string().optional().nullable(),
    classes: z.array(z.string()).default([]),
    role: z.string().optional().nullable(),
    name: z.string().optional().nullable(),
    ariaLabel: z.string().optional().nullable(),
    textSnippet: z.string().optional().nullable(),
  }).optional().nullable(),
  locator: z.object({
    primaryCssSelector: z.string().optional().nullable(),
    xpathSelector: z.string().optional().nullable(),
    testIdSelector: z.string().optional().nullable(),
    ariaSelector: z.string().optional().nullable(),
    textSelector: z.string().optional().nullable(),
    attributeFingerprint: z.record(z.string(), z.string()).default({}),
    ancestryFingerprint: z.array(z.any()).default([]),
    siblingFingerprint: z.array(z.any()).default([]),
    nearbyTextFingerprint: z.array(z.string()).default([]),
    rectFingerprint: z.any().nullable().optional(),
    rawFingerprint: z.any(),
  }),
  consoleLogs: z.array(z.object({
    level: z.string(), message: z.string(), source: z.string().optional().nullable(), line: z.number().optional().nullable(), column: z.number().optional().nullable(), timestamp: z.string().optional().nullable(), metadata: z.any().optional().nullable(),
  })).default([]),
  networkLogs: z.array(z.object({
    method: z.string(), url: z.string(), status: z.number().optional().nullable(), ok: z.boolean().optional().nullable(), resourceType: z.string().optional().nullable(), startedAt: z.string().optional().nullable(), endedAt: z.string().optional().nullable(), metadata: z.any().optional().nullable(),
  })).default([]),
  sessionIdentifier: z.string().max(120).optional().nullable(),
});

export const commentSchema = z.object({ body: z.string().min(1).max(2000) });
export const issueUpdateSchema = z.object({
  title: z.string().min(3).max(160).optional(),
  description: z.string().min(3).max(4000).optional(),
  type: z.enum(issueTypes).optional(),
  priority: z.enum(issuePriorities).optional(),
  status: z.enum(issueStatuses).optional(),
  assigneeId: z.string().cuid().nullable().optional(),
});
