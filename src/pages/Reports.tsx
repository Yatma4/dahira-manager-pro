import { MainLayout } from '@/components/layout/MainLayout';
import { useMembers } from '@/contexts/MemberContext';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { Button } from '@/components/ui/button';
import { FileText, Download, Users, Wallet, Calendar, Building, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import {
  generateMemberCensusReport,
  generateAnnualReport,
  generateSectionReport,
  generateContributionHistoryReport,
  generateLatePaymentReport,
  generateCommissionMembersReport,
} from '@/utils/pdfGenerator';

export default function Reports() {
  const { members, contributions } = useMembers();
  const { settings } = useAppSettings();
  const currentYear = new Date().getFullYear();

  const reports = [
    {
      title: 'Recensement des Membres',
      description: 'Liste complète de tous les membres sans informations financières',
      icon: Users,
      color: 'bg-primary/10 text-primary',
      generator: () => {
        generateMemberCensusReport({ members, contributions, dahiraName: 'Dahira' });
        toast.success('Rapport téléchargé avec succès');
      },
    },
    {
      title: 'Rapport Annuel Général',
      description: `Statistiques financières complètes pour l'année ${currentYear}`,
      icon: FileText,
      color: 'bg-accent/10 text-accent',
      generator: () => {
        generateAnnualReport({ members, contributions, dahiraName: 'Dahira' }, currentYear);
        toast.success('Rapport téléchargé avec succès');
      },
    },
    {
      title: 'Rapport par Section',
      description: 'Répartition des membres et cotisations par section',
      icon: Building,
      color: 'bg-success/10 text-success',
      generator: () => {
        generateSectionReport({ members, contributions, dahiraName: 'Dahira' });
        toast.success('Rapport téléchargé avec succès');
      },
    },
    {
      title: 'Historique des Cotisations',
      description: 'Détail de tous les paiements reçus',
      icon: Wallet,
      color: 'bg-warning/10 text-warning',
      generator: () => {
        generateContributionHistoryReport({ members, contributions, dahiraName: 'Dahira' });
        toast.success('Rapport téléchargé avec succès');
      },
    },
    {
      title: 'Membres en Retard',
      description: 'Liste des membres avec des cotisations impayées',
      icon: Calendar,
      color: 'bg-destructive/10 text-destructive',
      generator: () => {
        generateLatePaymentReport({ members, contributions, dahiraName: settings.dahiraName || 'Dahira' });
        toast.success('Rapport téléchargé avec succès');
      },
    },
    {
      title: 'Membres des Commissions',
      description: 'Liste des commissions avec leurs membres assignés',
      icon: Briefcase,
      color: 'bg-primary/10 text-primary',
      generator: () => {
        generateCommissionMembersReport(settings.commissions, members, settings.dahiraName || 'Dahira');
        toast.success('Rapport téléchargé avec succès');
      },
    },
  ];

  const handleGenerateReport = (report: typeof reports[0]) => {
    if (members.length === 0) {
      toast.error('Aucun membre enregistré. Ajoutez des membres pour générer un rapport.');
      return;
    }
    report.generator();
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
                Les rapports sont téléchargés directement sur votre ordinateur.
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
                onClick={() => handleGenerateReport(report)}
              >
                <Download className="w-4 h-4" />
                Télécharger PDF
              </Button>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="card-elevated p-6">
          <h3 className="font-serif font-bold text-lg mb-4">Instructions</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Cliquez sur "Télécharger PDF" pour générer et télécharger un rapport</p>
            <p>• Les fichiers PDF sont enregistrés dans votre dossier de téléchargements</p>
            <p>• Les rapports peuvent être ouverts avec n'importe quel lecteur PDF</p>
            <p>• Chaque rapport inclut la date de génération pour référence</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
