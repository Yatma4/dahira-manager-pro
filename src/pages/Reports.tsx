import { MainLayout } from '@/components/layout/MainLayout';
import { useMembers } from '@/contexts/MemberContext';
import { Button } from '@/components/ui/button';
import { FileText, Download, Users, Wallet, Calendar, Building } from 'lucide-react';
import { toast } from 'sonner';

export default function Reports() {
  const { members, contributions } = useMembers();
  const currentYear = new Date().getFullYear();

  const reports = [
    {
      title: 'Recensement des Membres',
      description: 'Liste complète de tous les membres sans informations financières',
      icon: Users,
      color: 'bg-primary/10 text-primary',
    },
    {
      title: 'Rapport Annuel Général',
      description: `Statistiques financières complètes pour l'année ${currentYear}`,
      icon: FileText,
      color: 'bg-accent/10 text-accent',
    },
    {
      title: 'Rapport par Section',
      description: 'Répartition des membres et cotisations par section',
      icon: Building,
      color: 'bg-success/10 text-success',
    },
    {
      title: 'Historique des Cotisations',
      description: 'Détail de tous les paiements reçus',
      icon: Wallet,
      color: 'bg-warning/10 text-warning',
    },
    {
      title: 'Membres en Retard',
      description: 'Liste des membres avec des cotisations impayées',
      icon: Calendar,
      color: 'bg-destructive/10 text-destructive',
    },
  ];

  const handleGenerateReport = (reportTitle: string) => {
    // Pour l'instant, afficher un message - la génération PDF nécessite un backend
    toast.info(`La génération du rapport "${reportTitle}" sera disponible prochainement.`);
  };

  return (
    <MainLayout
      title="Rapports"
      subtitle="Générez et consultez les rapports du dahira"
    >
      <div className="space-y-6">
        {/* Info Banner */}
        <div className="card-elevated p-6 bg-primary/5 border-primary/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg mb-1">Centre de Rapports</h3>
              <p className="text-muted-foreground">
                Générez des rapports PDF détaillés pour le suivi des activités du dahira. 
                Tous les rapports sont stockés et peuvent être téléchargés ultérieurement.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card-elevated p-4 text-center">
            <p className="text-3xl font-bold text-primary">{members.length}</p>
            <p className="text-sm text-muted-foreground">Membres enregistrés</p>
          </div>
          <div className="card-elevated p-4 text-center">
            <p className="text-3xl font-bold text-accent">
              {contributions.filter(c => c.annee === currentYear).length}
            </p>
            <p className="text-sm text-muted-foreground">Paiements cette année</p>
          </div>
          <div className="card-elevated p-4 text-center">
            <p className="text-3xl font-bold text-success">
              {(contributions.filter(c => c.annee === currentYear)
                .reduce((sum, c) => sum + c.montant, 0) / 1000).toFixed(0)}K
            </p>
            <p className="text-sm text-muted-foreground">FCFA collectés</p>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report, index) => (
            <div
              key={report.title}
              className="card-elevated p-6 hover:shadow-elevated transition-all animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-12 h-12 rounded-xl ${report.color} flex items-center justify-center mb-4`}>
                <report.icon className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg mb-2">{report.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => handleGenerateReport(report.title)}
              >
                <Download className="w-4 h-4" />
                Générer PDF
              </Button>
            </div>
          ))}
        </div>

        {/* Recent Reports */}
        <div className="card-elevated p-6">
          <h3 className="font-serif font-bold text-lg mb-4">Rapports Récents</h3>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Aucun rapport généré pour le moment</p>
            <p className="text-sm">Les rapports générés apparaîtront ici</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
