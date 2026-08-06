export type Confidence = "verified" | "likely" | "inference" | "unverified" | "not_found";
export type Bullet = { text: string; source_url: string; confidence: Confidence };
export const b = (text: string, source_url: string, confidence: Confidence = "likely"): Bullet => ({
  text,
  source_url,
  confidence,
});

export type SeedJob = {
  title: string;
  normalizedTitle?: string | null;
  city?: string;
  workMode?: string;
  experienceRange?: string;
  salaryMin?: number;
  salaryMax?: number;
  salarySource?: string;
  status?: "open" | "closed";
  sourceUrl: string;
  confidence?: string;
  postedAt?: string;
  note?: string;
};
export type SeedPerson = {
  fullName: string;
  title: string;
  linkedinUrl?: string;
  sourceUrl: string;
  roleCategory?: "leader" | "buyer_persona" | "influencer" | "champion" | "recruiter";
  roleCategoryConfidence?: string;
  evidence?: string;
};
export type SeedSignal = {
  type: string;
  eventDate?: string;
  detail: string;
  sourceUrl: string;
  confidence?: string;
};
export type SeedGap = { fieldName: string; note: string; sourcesAttempted?: string[] };

export type SeedCompany = {
  name: string;
  website: string;
  linkedinCompanyUrl?: string;
  atsProvider?: string;
  atsSlug?: string;
  hqCity: string;
  hqCountry: string;
  foundedYear?: number;
  headcount?: number;
  headcountSourceUrl?: string;
  fundingStage: string;
  totalFunding?: string;
  investors?: string[];
  category: string;
  icpSummary: string;
  gtmMotion?: string;
  sourceUrl: string;
  people: SeedPerson[];
  jobs: SeedJob[];
  signals: SeedSignal[];
  gaps: SeedGap[];
  research: {
    overview: Bullet[];
    businessModelAndTargetMarket: Bullet[];
    leadershipAndOrgSignals: Bullet[];
    technologyStack: Bullet[];
    recentDevelopmentsAndTriggers: Bullet[];
    buyingSignalsAndIntent: Bullet[];
    competitiveLandscape: Bullet[];
    identifiedPainPoints: Bullet[];
    recommendedEngagementStrategy: Bullet[];
    accountFitAssessment: Bullet[];
  };
};
