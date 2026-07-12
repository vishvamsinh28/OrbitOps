"use client";

import { CtaFooter } from "./components/landing/CtaFooter";
import { Header } from "./components/landing/Header";
import { Hero } from "./components/landing/Hero";
import { LifecycleSection } from "./components/landing/LifecycleSection";
import { ModulesSection } from "./components/landing/ModulesSection";
import { RolesSection } from "./components/landing/RolesSection";
import { TickerAndStats } from "./components/landing/TickerAndStats";
import { WorkflowSection } from "./components/landing/WorkflowSection";
import { useLandingInteractions } from "./hooks/useLandingInteractions";

export default function Home() {
  useLandingInteractions();

  return (
    <main>
      <Header />
      <Hero />
      <TickerAndStats />
      <ModulesSection />
      <LifecycleSection />
      <RolesSection />
      <WorkflowSection />
      <CtaFooter />
    </main>
  );
}
