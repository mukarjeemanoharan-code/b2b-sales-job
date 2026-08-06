import { PrismaClient } from "@prisma/client";
import { batch1 } from "./data/batch1";
import { batch2 } from "./data/batch2";
import { batch3 } from "./data/batch3";

const prisma = new PrismaClient();

const companies = [...batch1, ...batch2, ...batch3];

async function main() {
  console.log(`Seeding ${companies.length} companies...`);
  for (const c of companies) {
    const company = await prisma.company.create({
      data: {
        name: c.name,
        website: c.website,
        linkedinCompanyUrl: c.linkedinCompanyUrl,
        atsProvider: c.atsProvider ?? null,
        atsSlug: c.atsSlug ?? null,
        hqCity: c.hqCity,
        hqCountry: c.hqCountry,
        foundedYear: c.foundedYear ?? null,
        headcount: c.headcount ?? null,
        headcountSourceUrl: c.headcountSourceUrl ?? null,
        fundingStage: c.fundingStage,
        totalFunding: c.totalFunding ?? null,
        investors: c.investors ?? [],
        category: c.category,
        icpSummary: c.icpSummary,
        gtmMotion: c.gtmMotion ?? null,
        isB2bSaas: true,
        isIndiaRelevant: true,
        researchStatus: "researched",
        lastResearchedAt: new Date("2026-07-28"),
        sourceUrl: c.sourceUrl,
        confidence: "likely",
      },
    });

    await prisma.companyResearch.create({
      data: {
        companyId: company.id,
        overview: c.research.overview,
        businessModelAndTargetMarket: c.research.businessModelAndTargetMarket,
        leadershipAndOrgSignals: c.research.leadershipAndOrgSignals,
        technologyStack: c.research.technologyStack,
        recentDevelopmentsAndTriggers: c.research.recentDevelopmentsAndTriggers,
        buyingSignalsAndIntent: c.research.buyingSignalsAndIntent,
        competitiveLandscape: c.research.competitiveLandscape,
        identifiedPainPoints: c.research.identifiedPainPoints,
        recommendedEngagementStrategy: c.research.recommendedEngagementStrategy,
        accountFitAssessment: c.research.accountFitAssessment,
        researchedAt: new Date("2026-07-28"),
        modelUsed: "manual-import:owner-supplied-research-library",
      },
    });

    for (const p of c.people) {
      await prisma.person.create({
        data: {
          companyId: company.id,
          fullName: p.fullName,
          title: p.title,
          roleCategory: p.roleCategory ?? "leader",
          roleCategoryConfidence: p.roleCategoryConfidence ?? "verified",
          linkedinUrl: p.linkedinUrl ?? null,
          linkedinUrlSource: p.linkedinUrl ? p.sourceUrl : null,
          evidence: p.evidence ?? null,
          sourceUrl: p.sourceUrl,
          confidence: "verified",
        },
      });
    }

    for (const j of c.jobs) {
      await prisma.job.create({
        data: {
          companyId: company.id,
          title: j.title,
          normalizedTitle: j.normalizedTitle ?? null,
          city: j.city ?? null,
          workMode: j.workMode ?? null,
          experienceRange: j.experienceRange ?? null,
          salaryMin: j.salaryMin ?? null,
          salaryMax: j.salaryMax ?? null,
          salarySource: j.salarySource ?? null,
          status: j.status ?? "open",
          closeDetectedAt: j.status === "closed" ? new Date("2026-07-28") : null,
          postedAt: j.postedAt ? new Date(j.postedAt) : null,
          sourceUrl: j.sourceUrl,
          confidence: j.confidence ?? "likely",
          jdText: j.note ?? null,
        },
      });
    }

    for (const s of c.signals) {
      await prisma.signal.create({
        data: {
          companyId: company.id,
          type: s.type,
          eventDate: s.eventDate ? new Date(s.eventDate) : null,
          detail: s.detail,
          sourceUrl: s.sourceUrl,
          confidence: s.confidence ?? "likely",
        },
      });
    }

    for (const g of c.gaps) {
      await prisma.researchGap.create({
        data: {
          companyId: company.id,
          fieldName: g.fieldName,
          sourcesAttempted: g.sourcesAttempted ?? [],
          note: g.note,
        },
      });
    }

    console.log(`  seeded ${c.name}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
