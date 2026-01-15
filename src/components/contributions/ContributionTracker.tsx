import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMembers } from '@/contexts/MemberContext';
import { calculateMonthlyTotal, MOIS, ContributionType, CONTRIBUTION_CONFIGS } from '@/types/member';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ArrowLeft, Plus, Check, X, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function ContributionTracker() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getMemberById, getContributionsForMember, addContribution } = useMembers();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newContribution, setNewContribution] = useState({
    type: 'mensuel' as ContributionType,
    montant: 0,
    mois: new Date().getMonth() + 1,
  });

  const member = getMemberById(id!);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  if (!member) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Membre non trouvé</p>
        <Button variant="link" onClick={() => navigate('/membres')}>
          Retour à la liste
        </Button>
      </div>
    );
  }

  const monthlyTotal = calculateMonthlyTotal(member);
  const contributions = getContributionsForMember(member.id);
  const yearContributions = contributions.filter(c => c.annee === selectedYear);

  const getMonthStatus = (month: number) => {
    const monthContribs = yearContributions.filter(c => c.mois === month);
    const totalPaid = monthContribs.reduce((sum, c) => sum + c.montant, 0);
    
    if (totalPaid >= monthlyTotal.total) return 'complete';
    if (totalPaid > 0) return 'partial';
    return 'unpaid';
  };

  const handleAddContribution = () => {
    if (newContribution.montant <= 0) {
      toast.error('Le montant doit être supérieur à 0');
      return;
    }

    addContribution({
      membreId: member.id,
      type: newContribution.type,
      montant: newContribution.montant,
      mois: newContribution.mois,
      annee: selectedYear,
      datePaiement: new Date().toISOString(),
    });

    toast.success('Cotisation enregistrée avec succès');
    setIsDialogOpen(false);
    setNewContribution({
      type: 'mensuel',
      montant: 0,
      mois: new Date().getMonth() + 1,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/membres')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-serif font-bold">
            Cotisations de {member.prenom} {member.nom}
          </h2>
          <p className="text-muted-foreground">
            Cotisation mensuelle: {monthlyTotal.total.toLocaleString()} FCFA
          </p>
        </div>
        <Select
          value={selectedYear.toString()}
          onValueChange={(v) => setSelectedYear(parseInt(v))}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nouvelle Cotisation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enregistrer une Cotisation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Type de cotisation</Label>
                <Select
                  value={newContribution.type}
                  onValueChange={(v) => setNewContribution(prev => ({ ...prev, type: v as ContributionType }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTRIBUTION_CONFIGS.map((config) => (
                      <SelectItem key={config.type} value={config.type}>
                        {config.label} {config.obligatoire ? '' : '(Volontaire)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Mois</Label>
                <Select
                  value={newContribution.mois.toString()}
                  onValueChange={(v) => setNewContribution(prev => ({ ...prev, mois: parseInt(v) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MOIS.map((mois, index) => (
                      <SelectItem key={mois} value={(index + 1).toString()}>
                        {mois}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Montant (FCFA)</Label>
                <Input
                  type="number"
                  value={newContribution.montant}
                  onChange={(e) => setNewContribution(prev => ({ ...prev, montant: parseInt(e.target.value) || 0 }))}
                  placeholder="Montant en FCFA"
                />
              </div>
              <Button onClick={handleAddContribution} className="w-full">
                Enregistrer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Monthly Grid */}
      <div className="card-elevated p-6">
        <h3 className="font-serif font-bold text-lg mb-6 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          Suivi Mensuel {selectedYear}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {MOIS.map((mois, index) => {
            const status = getMonthStatus(index + 1);
            const monthContribs = yearContributions.filter(c => c.mois === index + 1);
            const totalPaid = monthContribs.reduce((sum, c) => sum + c.montant, 0);

            return (
              <div
                key={mois}
                className={`p-4 rounded-lg border-2 transition-all ${
                  status === 'complete'
                    ? 'border-success bg-success/5'
                    : status === 'partial'
                    ? 'border-warning bg-warning/5'
                    : 'border-border bg-muted/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{mois}</span>
                  {status === 'complete' ? (
                    <Check className="w-5 h-5 text-success" />
                  ) : status === 'partial' ? (
                    <div className="w-5 h-5 rounded-full border-2 border-warning bg-warning/20" />
                  ) : (
                    <X className="w-5 h-5 text-muted-foreground/50" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {totalPaid.toLocaleString()} / {monthlyTotal.total.toLocaleString()} FCFA
                </p>
                {status === 'partial' && (
                  <p className="text-xs text-warning mt-1">
                    Reste: {(monthlyTotal.total - totalPaid).toLocaleString()} FCFA
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Contributions */}
      <div className="card-elevated p-6">
        <h3 className="font-serif font-bold text-lg mb-4">Historique des paiements</h3>
        {yearContributions.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            Aucune cotisation enregistrée pour {selectedYear}
          </p>
        ) : (
          <div className="space-y-3">
            {yearContributions
              .sort((a, b) => new Date(b.datePaiement).getTime() - new Date(a.datePaiement).getTime())
              .map((contribution) => {
                const config = CONTRIBUTION_CONFIGS.find(c => c.type === contribution.type);
                return (
                  <div
                    key={contribution.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{config?.label || contribution.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {MOIS[contribution.mois - 1]} {contribution.annee}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-success">
                        +{contribution.montant.toLocaleString()} FCFA
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(contribution.datePaiement), 'dd/MM/yyyy', { locale: fr })}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
