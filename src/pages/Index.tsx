import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentMembers } from '@/components/dashboard/RecentMembers';
import { ContributionChart } from '@/components/dashboard/ContributionChart';
import { SectionStats } from '@/components/dashboard/SectionStats';
import { useMembers } from '@/contexts/MemberContext';
import { calculateMonthlyTotal } from '@/types/member';
import { Users, Wallet, TrendingUp, UserCheck } from 'lucide-react';

export default function Index() {
  const { members, contributions } = useMembers();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // Statistics
  const totalMembers = members.length;
  const cotisants = members.filter(m => m.statutCotisation === 'cotisant').length;
  
  const thisMonthContributions = contributions.filter(
    c => c.mois === currentMonth && c.annee === currentYear
  );
  const monthlyTotal = thisMonthContributions.reduce((sum, c) => sum + c.montant, 0);
  
  const expectedMonthly = members.reduce((sum, m) => {
    return sum + calculateMonthlyTotal(m).total;
  }, 0);

  const collectionRate = expectedMonthly > 0 
    ? Math.round((monthlyTotal / expectedMonthly) * 100) 
    : 0;

  return (
    <MainLayout 
      title="Tableau de Bord" 
      subtitle="Bienvenue sur la plateforme de gestion du Dahira Noukhbaou"
    >
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary-dark p-8 mb-8 text-primary-foreground">
        <div className="relative z-10">
          <h2 className="text-3xl font-serif font-bold mb-2">
            Bismillahi Rahmani Rahim
          </h2>
          <p className="text-primary-foreground/80 max-w-xl">
            Gérez efficacement les membres et les cotisations de votre dahira. 
            Suivez les paiements, générez des rapports et gardez une trace de toutes les activités.
          </p>
        </div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute right-20 bottom-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Membres"
          value={totalMembers}
          subtitle="Membres enregistrés"
          icon={Users}
          variant="primary"
          className="animate-fade-in"
        />
        <StatCard
          title="Membres Cotisants"
          value={cotisants}
          subtitle={`${totalMembers > 0 ? Math.round((cotisants / totalMembers) * 100) : 0}% du total`}
          icon={UserCheck}
          variant="default"
          className="animate-fade-in delay-100"
        />
        <StatCard
          title="Cotisations du Mois"
          value={`${(monthlyTotal / 1000).toFixed(0)}K`}
          subtitle="FCFA collectés"
          icon={Wallet}
          variant="accent"
          className="animate-fade-in delay-200"
        />
        <StatCard
          title="Taux de Recouvrement"
          value={`${collectionRate}%`}
          subtitle="Objectif mensuel"
          icon={TrendingUp}
          trend={collectionRate >= 50 ? { value: collectionRate, isPositive: true } : undefined}
          variant="default"
          className="animate-fade-in delay-300"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <ContributionChart />
        </div>
        <SectionStats />
      </div>

      {/* Recent Members */}
      <RecentMembers />
    </MainLayout>
  );
}
