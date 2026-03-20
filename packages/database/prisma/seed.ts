import { hash } from "../../../apps/web/lib/password";
import { prisma } from "../client";

async function main() {
  const email = "demo@domqa.app";
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { name: "Demo User", email, passwordHash: hash("password123") },
  });
  const project = await prisma.project.upsert({
    where: { slug: "acme-storefront" },
    update: {},
    create: {
      ownerId: user.id,
      name: "Acme Storefront",
      slug: "acme-storefront",
      description: "Seeded ecommerce frontend.",
      environments: { create: [{ name: "production" }, { name: "staging" }] },
      memberships: { create: [{ userId: user.id, role: "owner" }] },
    },
  });
  await prisma.issue.upsert({
    where: { key: "DOMQA-100" },
    update: {},
    create: {
      projectId: project.id,
      reporterId: user.id,
      key: "DOMQA-100",
      title: "Checkout CTA overlaps footer on tablet width",
      description: "The buy button clips into the footer when viewport width is around 900px.",
      type: "ui",
      priority: "high",
      status: "open",
      pageUrl: "https://demo.example.com/checkout",
      pageTitle: "Checkout",
      pageOrigin: "https://demo.example.com",
      environment: "staging",
      viewportWidth: 900,
      viewportHeight: 1200,
      userAgent: "Seed data",
      selectedElementTag: "button",
      selectedElementClasses: "cta primary",
      selectedElementTextSnippet: "Complete order",
      locator: {
        create: {
          primaryCssSelector: "button.cta.primary",
          attributeFingerprint: { class: "cta primary" },
          ancestryFingerprint: [],
          siblingFingerprint: [],
          nearbyTextFingerprint: ["Order summary"],
          rawFingerprint: { version: 1 },
        },
      },
      comments: { create: { authorId: user.id, body: "Captured from staging QA review." } },
    },
  });
}

main().finally(() => prisma.$disconnect());
