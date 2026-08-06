-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProspectStatus" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProspectStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT,
    "linkedinCompanyUrl" TEXT,
    "careersUrl" TEXT,
    "atsProvider" TEXT,
    "atsSlug" TEXT,
    "hqCity" TEXT,
    "hqCountry" TEXT,
    "indiaOffices" JSONB,
    "foundedYear" INTEGER,
    "headcount" INTEGER,
    "headcountSourceUrl" TEXT,
    "fundingStage" TEXT,
    "totalFunding" TEXT,
    "investors" JSONB,
    "category" TEXT,
    "icpSummary" TEXT,
    "gtmMotion" TEXT,
    "isB2bSaas" BOOLEAN,
    "isIndiaRelevant" BOOLEAN,
    "researchStatus" TEXT NOT NULL DEFAULT 'shell',
    "lastResearchedAt" TIMESTAMP(3),
    "sourceUrl" TEXT,
    "confidence" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyResearch" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "overview" JSONB NOT NULL,
    "businessModelAndTargetMarket" JSONB NOT NULL,
    "leadershipAndOrgSignals" JSONB NOT NULL,
    "technologyStack" JSONB NOT NULL,
    "recentDevelopmentsAndTriggers" JSONB NOT NULL,
    "buyingSignalsAndIntent" JSONB NOT NULL,
    "competitiveLandscape" JSONB NOT NULL,
    "identifiedPainPoints" JSONB NOT NULL,
    "recommendedEngagementStrategy" JSONB NOT NULL,
    "accountFitAssessment" JSONB NOT NULL,
    "researchedAt" TIMESTAMP(3),
    "modelUsed" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyResearch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearchGap" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "fieldName" TEXT NOT NULL,
    "searchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sourcesAttempted" JSONB,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResearchGap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "reviewType" TEXT NOT NULL,
    "source" TEXT,
    "sourceUrl" TEXT,
    "reviewDate" TIMESTAMP(3),
    "reviewerRole" TEXT,
    "reviewerStatus" TEXT,
    "location" TEXT,
    "rating" DOUBLE PRECISION,
    "ratingScale" DOUBLE PRECISION,
    "positives" TEXT,
    "negatives" TEXT,
    "credibilityNote" TEXT,
    "confidence" TEXT,
    "ingestedVia" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewTheme" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "reviewType" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "sentiment" TEXT NOT NULL,
    "mentionCount" INTEGER NOT NULL,
    "representativePoints" JSONB,
    "confidence" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewTheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "title" TEXT,
    "department" TEXT,
    "roleCategory" TEXT,
    "roleCategoryConfidence" TEXT,
    "linkedinUrl" TEXT,
    "linkedinUrlSource" TEXT,
    "publicEmail" TEXT,
    "publicEmailSourceUrl" TEXT,
    "workEmailPattern" TEXT,
    "workEmailPatternEvidence" TEXT,
    "officeLocation" TEXT,
    "reportsTo" TEXT,
    "hiringInfluence" TEXT,
    "publicActivity" JSONB,
    "evidence" TEXT,
    "sourceUrl" TEXT,
    "confidence" TEXT,
    "manualEmail" TEXT,
    "manualPhone" TEXT,
    "manualLinkedin" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "normalizedTitle" TEXT,
    "department" TEXT,
    "city" TEXT,
    "workMode" TEXT,
    "experienceRange" TEXT,
    "salaryMin" INTEGER,
    "salaryMax" INTEGER,
    "salarySource" TEXT,
    "jdText" TEXT,
    "applyUrl" TEXT,
    "atsJobId" TEXT,
    "postedAt" TIMESTAMP(3),
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'open',
    "closeDetectedAt" TIMESTAMP(3),
    "sourceUrl" TEXT,
    "confidence" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Signal" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3),
    "detail" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "confidence" TEXT,
    "weight" INTEGER,
    "origin" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Signal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Outreach" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "personName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'not_contacted',
    "notes" TEXT,
    "nextActionDate" TIMESTAMP(3),
    "history" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Outreach_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "jobTitle" TEXT,
    "status" TEXT NOT NULL DEFAULT 'wishlist',
    "notes" TEXT,
    "nextActionDate" TIMESTAMP(3),
    "history" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "mentionCount" INTEGER NOT NULL DEFAULT 0,
    "exampleJobIds" JSONB,
    "selfRating" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ProspectStatus_userId_companyId_key" ON "ProspectStatus"("userId", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyResearch_companyId_key" ON "CompanyResearch"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_name_key" ON "Skill"("name");

-- AddForeignKey
ALTER TABLE "ProspectStatus" ADD CONSTRAINT "ProspectStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyResearch" ADD CONSTRAINT "CompanyResearch_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchGap" ADD CONSTRAINT "ResearchGap_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewTheme" ADD CONSTRAINT "ReviewTheme_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signal" ADD CONSTRAINT "Signal_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Outreach" ADD CONSTRAINT "Outreach_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
