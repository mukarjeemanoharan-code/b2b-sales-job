-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "lastResearchedAt" DATETIME,
    "sourceUrl" TEXT,
    "confidence" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CompanyResearch" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "researchedAt" DATETIME,
    "modelUsed" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CompanyResearch_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ResearchGap" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "fieldName" TEXT NOT NULL,
    "searchedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sourcesAttempted" JSONB,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ResearchGap_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "reviewType" TEXT NOT NULL,
    "source" TEXT,
    "sourceUrl" TEXT,
    "reviewDate" DATETIME,
    "reviewerRole" TEXT,
    "reviewerStatus" TEXT,
    "location" TEXT,
    "rating" REAL,
    "ratingScale" REAL,
    "positives" TEXT,
    "negatives" TEXT,
    "credibilityNote" TEXT,
    "confidence" TEXT,
    "ingestedVia" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Review_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ReviewTheme" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "reviewType" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "sentiment" TEXT NOT NULL,
    "mentionCount" INTEGER NOT NULL,
    "representativePoints" JSONB,
    "confidence" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ReviewTheme_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Person_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "postedAt" DATETIME,
    "firstSeenAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'open',
    "closeDetectedAt" DATETIME,
    "sourceUrl" TEXT,
    "confidence" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Job_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Signal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "eventDate" DATETIME,
    "detail" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "confidence" TEXT,
    "weight" INTEGER,
    "origin" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Signal_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Outreach" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "personName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'not_contacted',
    "notes" TEXT,
    "nextActionDate" DATETIME,
    "history" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Outreach_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "jobTitle" TEXT,
    "status" TEXT NOT NULL DEFAULT 'wishlist',
    "notes" TEXT,
    "nextActionDate" DATETIME,
    "history" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Application_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "mentionCount" INTEGER NOT NULL DEFAULT 0,
    "exampleJobIds" JSONB,
    "selfRating" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CompanyResearch_companyId_key" ON "CompanyResearch"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_name_key" ON "Skill"("name");
