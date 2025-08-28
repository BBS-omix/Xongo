import { Navigation } from '@/components/navigation';
import { Hero } from '@/components/sections/hero';
import { ProblemSolution } from '@/components/sections/problem-solution';
import { HowItWorks } from '@/components/sections/how-it-works';
import { MarketOpportunity } from '@/components/sections/market-opportunity';
import { PersonaStories } from '@/components/sections/persona-stories';
import { WhatWeOffer } from '@/components/sections/what-we-offer';
import { BusinessModel } from '@/components/sections/business-model';
import { UsageMetrics } from '@/components/sections/usage-metrics';
import { DeploymentInsights } from '@/components/sections/deployment-insights';
import { GoToMarketFunnel } from '@/components/sections/go-to-market-funnel';
import { UnitEconomics } from '@/components/sections/unit-economics';
import { ExcelTables } from '@/components/sections/excel-tables';
import { TurkishFinancialCharts } from '@/components/charts/turkish-financial-charts';
import { CustomerSuccess } from '@/components/sections/customer-success';
import { Achievements } from '@/components/sections/achievements';
import { Roadmap } from '@/components/sections/roadmap';
import { KPIs } from '@/components/sections/kpis';
import { Risks } from '@/components/sections/risks';
import { FinancialProjections } from '@/components/sections/financial-projections';
import { ValueDashboard } from '@/components/sections/value-dashboard';
import { Footer } from '@/components/footer';
import { OrganizationGraph } from '@/components/sections/organization-graph';
import {WhatCustomerPays} from '@/components/sections/what-customer-pays'

export default function Home() {
  return (
    <div className="min-h-screen bg-light">
      <Navigation />
      <Hero />
      <ProblemSolution />
      <HowItWorks />
      <MarketOpportunity />
      <PersonaStories />
      <WhatWeOffer />
      <BusinessModel />
      <UsageMetrics />
      <WhatCustomerPays/>
      <OrganizationGraph/>

      <Roadmap />
      {/* <DeploymentInsights /> */}
      <GoToMarketFunnel />
      <UnitEconomics />
      <Risks />
      <Achievements />
      <KPIs />
      <CustomerSuccess />   
      <ExcelTables />
      <TurkishFinancialCharts />

    

     
      {/* <FinancialProjections /> */}
      <ValueDashboard />
      <Footer />
    </div>
  );
}
