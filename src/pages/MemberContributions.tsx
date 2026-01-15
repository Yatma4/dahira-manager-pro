import { MainLayout } from '@/components/layout/MainLayout';
import { ContributionTracker } from '@/components/contributions/ContributionTracker';

export default function MemberContributions() {
  return (
    <MainLayout
      title="Suivi des Cotisations"
      subtitle="Historique et enregistrement des paiements"
    >
      <ContributionTracker />
    </MainLayout>
  );
}
