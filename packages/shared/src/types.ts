export const issueTypes = ["bug", "ui", "ux", "content", "accessibility", "suggestion"] as const;
export const issuePriorities = ["low", "medium", "high", "critical"] as const;
export const issueStatuses = ["open", "in_progress", "resolved", "closed"] as const;

export type IssueType = (typeof issueTypes)[number];
export type IssuePriority = (typeof issuePriorities)[number];
export type IssueStatus = (typeof issueStatuses)[number];

export type Rect = { x: number; y: number; width: number; height: number };

export type ElementSummary = {
  tagName: string;
  id?: string | null;
  classes: string[];
  role?: string | null;
  name?: string | null;
  ariaLabel?: string | null;
  textSnippet?: string | null;
  rect?: Rect;
};

export type ElementFingerprint = {
  summary: ElementSummary;
  selectors: {
    css?: string | null;
    cssPath?: string | null;
    xpath?: string | null;
    testId?: string | null;
    aria?: string | null;
    text?: string | null;
  };
  stableAttributes: Record<string, string>;
  ancestry: Array<{ tagName: string; id?: string | null; classes: string[]; index: number }>;
  siblings: Array<{ tagName: string; textSnippet?: string }>;
  nearbyText: string[];
  rect?: Rect;
};

export type LocatedElement = {
  found: boolean;
  confidence: number;
  strategy: string;
  summary?: ElementSummary;
};
