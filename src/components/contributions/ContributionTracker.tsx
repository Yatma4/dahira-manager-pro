import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMembers } from '@/contexts/MemberContext';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { calculateMonthlyTotal, MOIS, ContributionType, CONTRIBUTION_CONFIGS, getFirstContributionMonth } from '@/types/member';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { ArrowLeft, Plus, Check, X, Wallet, Settings, Edit, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

export function ContributionTracker() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getMemberById, getContributionsForMember, addContribution } = useMembers();
  const { settings, addCustomContribution, updateCustomContribution, deleteCustomContribution } = useAppSettings();
  
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<{ id: string; label: string; description: string; montant?: number; obligatoire: boolean } | null>(null);
  const [newTypeForm, setNewTypeForm] = useState({
    label: '',
    description: '',
    montant: '',
    obligatoire: false,
  });
  
  const [newContribution, setNewContribution] = useState({
    type: 'mensuel' as ContributionType | string,
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
  
  // Calcul du premier mois de cotisation (à partir de l'adhésion)
  const adhesionDate = new Date(member.dateAdhesion);
  const adhesionYear = adhesionDate.getFullYear();
  const firstContributionMonth = selectedYear === adhesionYear ? getFirstContributionMonth(member.dateAdhesion) : 1;

  // Tous les types de cotisation (standard + personnalisées)
  const allContributionTypes = [
    ...CONTRIBUTION_CONFIGS,
    ...settings.customContributions.map(c => ({
      type: c.id as ContributionType,
      label: c.label,
      montant: c.montant,
      obligatoire: c.obligatoire,
      description: c.description,
    }))
  ];

  const getMonthStatus = (month: number) => {
    // Si le mois est avant l'adhésion, pas de cotisation requise
    if (selectedYear === adhesionYear && month < firstContributionMonth) {
      return 'not_required';
    }
    
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
      type: newContribution.type as ContributionType,
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

  const handleSaveContributionType = () => {
    if (!newTypeForm.label.trim()) {
      toast.error('Le libellé est requis');
      return;
    }

    const contribData = {
      label: newTypeForm.label.trim(),
      description: newTypeForm.description.trim(),
      montant: newTypeForm.montant ? parseInt(newTypeForm.montant) : undefined,
      obligatoire: newTypeForm.obligatoire,
    };

    if (editingType) {
      updateCustomContribution(editingType.id, contribData);
      toast.success(`Type "${newTypeForm.label}" modifié`);
    } else {
      addCustomContribution(contribData);
      toast.success(`Type "${newTypeForm.label}" ajouté`);
    }

    resetTypeForm();
    setIsTypeDialogOpen(false);
  };

  const handleEditType = (contrib: { id: string; label: string; description: string; montant?: number; obligatoire: boolean }) => {
    setEditingType(contrib);
    setNewTypeForm({
      label: contrib.label,
      description: contrib.description,
      montant: contrib.montant?.toString() || '',
      obligatoire: contrib.obligatoire,
    });
    setIsTypeDialogOpen(true);
  };

  const handleDeleteType = (id: string, label: string) => {
    deleteCustomContribution(id);
    toast.success(`Type "${label}" supprimé`);
  };

  const resetTypeForm = () => {
    setNewTypeForm({ label: '', description: '', montant: '', obligatoire: false });
    setEditingType(null);
  };

  // Mois disponibles pour l'enregistrement (à partir de l'adhésion)
  const availableMonths = MOIS.map((mois, index) => ({
    name: mois,
    number: index + 1,
    disabled: selectedYear === adhesionYear && index + 1 < firstContributionMonth,
  }));

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
            {selectedYear === adhesionYear && (
              <span className="ml-2 text-xs">(à partir de {MOIS[firstContributionMonth - 1]})</span>
            )}
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
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Enregistrer une Cotisation</DialogTitle>
              <DialogDescription>
                Enregistrez une cotisation pour {member.prenom} {member.nom}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Type de cotisation</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-1 text-xs h-7"
                    onClick={() => {
                      resetTypeForm();
                      setIsTypeDialogOpen(true);
                    }}
                  >
                    <Settings className="w-3 h-3" />
                    Gérer les types
                  </Button>
                </div>
                <Select
                  value={newContribution.type}
                  onValueChange={(v) => setNewContribution(prev => ({ ...prev, type: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {allContributionTypes.map((config) => (
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
                    {availableMonths.map((m) => (
                      <SelectItem 
                        key={m.name} 
                        value={m.number.toString()}
                        disabled={m.disabled}
                      >
                        {m.name} {m.disabled && '(Avant adhésion)'}
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

            // Mois avant l'adhésion - affichage spécial
            if (status === 'not_required') {
              return (
                <div
                  key={mois}
                  className="p-4 rounded-lg border-2 border-dashed border-muted bg-muted/10 opacity-50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-muted-foreground">{mois}</span>
                    <span className="text-xs text-muted-foreground">N/A</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Avant adhésion
                  </p>
                </div>
              );
            }

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
                const config = allContributionTypes.find(c => c.type === contribution.type);
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

      {/* Dialog pour gérer les types de cotisation */}
      <Dialog open={isTypeDialogOpen} onOpenChange={(open) => {
        setIsTypeDialogOpen(open);
        if (!open) resetTypeForm();
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingType ? 'Modifier le type' : 'Ajouter un type de cotisation'}
            </DialogTitle>
            <DialogDescription>
              {editingType 
                ? 'Modifiez les informations de ce type de cotisation.'
                : 'Créez un nouveau type de cotisation personnalisée.'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="typeLabel">Libellé *</Label>
              <Input
                id="typeLabel"
                value={newTypeForm.label}
                onChange={(e) => setNewTypeForm(prev => ({ ...prev, label: e.target.value }))}
                placeholder="Ex: Cotisation Magal"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="typeDescription">Description</Label>
              <Textarea
                id="typeDescription"
                value={newTypeForm.description}
                onChange={(e) => setNewTypeForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description de la cotisation"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="typeMontant">Montant (FCFA)</Label>
              <Input
                id="typeMontant"
                type="number"
                value={newTypeForm.montant}
                onChange={(e) => setNewTypeForm(prev => ({ ...prev, montant: e.target.value }))}
                placeholder="Laisser vide pour montant libre"
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Laissez vide si le montant est libre
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Cotisation obligatoire</Label>
                <p className="text-xs text-muted-foreground">
                  Requise pour tous les membres
                </p>
              </div>
              <Switch
                checked={newTypeForm.obligatoire}
                onCheckedChange={(checked) => setNewTypeForm(prev => ({ ...prev, obligatoire: checked }))}
              />
            </div>

            {/* Liste des types personnalisés existants */}
            {settings.customContributions.length > 0 && !editingType && (
              <div className="border-t pt-4 mt-4">
                <Label className="text-sm text-muted-foreground">Types personnalisés existants</Label>
                <div className="space-y-2 mt-2">
                  {settings.customContributions.map((contrib) => (
                    <div key={contrib.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                      <span className="text-sm">{contrib.label}</span>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={() => handleEditType(contrib)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={() => handleDeleteType(contrib.id, contrib.label)}
                        >
                          <Trash2 className="w-3 h-3 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTypeDialogOpen(false)}>
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>
            <Button onClick={handleSaveContributionType}>
              <Save className="w-4 h-4 mr-2" />
              {editingType ? 'Modifier' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
