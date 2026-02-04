import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useAppSettings, CustomContribution } from '@/contexts/AppSettingsContext';
import { Plus, Trash2, Edit, Coins, X, Save } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export function CustomContributionsManager() {
  const { 
    settings, 
    addCustomContribution, 
    updateCustomContribution, 
    deleteCustomContribution 
  } = useAppSettings();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingContrib, setEditingContrib] = useState<CustomContribution | null>(null);
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [montant, setMontant] = useState<string>('');
  const [obligatoire, setObligatoire] = useState(false);

  const resetForm = () => {
    setLabel('');
    setDescription('');
    setMontant('');
    setObligatoire(false);
    setEditingContrib(null);
  };

  const handleOpenDialog = (contrib?: CustomContribution) => {
    if (contrib) {
      setEditingContrib(contrib);
      setLabel(contrib.label);
      setDescription(contrib.description);
      setMontant(contrib.montant?.toString() || '');
      setObligatoire(contrib.obligatoire);
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!label.trim()) {
      toast.error('Le libellé est requis');
      return;
    }

    const contribData = {
      label: label.trim(),
      description: description.trim(),
      montant: montant ? parseInt(montant) : undefined,
      obligatoire,
    };

    if (editingContrib) {
      updateCustomContribution(editingContrib.id, contribData);
      toast.success(`Cotisation "${label}" modifiée`);
    } else {
      addCustomContribution(contribData);
      toast.success(`Cotisation "${label}" ajoutée`);
    }

    resetForm();
    setDialogOpen(false);
  };

  const handleDelete = (contrib: CustomContribution) => {
    deleteCustomContribution(contrib.id);
    toast.success(`Cotisation "${contrib.label}" supprimée`);
  };

  return (
    <div className="card-elevated p-6">
      <h3 className="font-serif font-bold text-lg mb-6 flex items-center gap-2">
        <Coins className="w-5 h-5 text-primary" />
        Types de Cotisations Personnalisées
      </h3>
      
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Ajoutez des types de cotisations supplémentaires en plus des cotisations standard 
          (Sociale, Mensuel, Sass Wer Bi, Dekhane, Alarba).
        </p>

        {settings.customContributions.length === 0 ? (
          <p className="text-muted-foreground text-sm py-4">
            Aucune cotisation personnalisée créée
          </p>
        ) : (
          <div className="space-y-3">
            {settings.customContributions.map((contrib) => (
              <div
                key={contrib.id}
                className="flex items-start justify-between p-4 bg-muted/30 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{contrib.label}</h4>
                    {contrib.obligatoire && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        Obligatoire
                      </span>
                    )}
                  </div>
                  {contrib.description && (
                    <p className="text-sm text-muted-foreground mt-1">{contrib.description}</p>
                  )}
                  {contrib.montant && (
                    <p className="text-sm font-medium text-primary mt-1">
                      {contrib.montant.toLocaleString('fr-FR')} FCFA
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenDialog(contrib)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(contrib)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2" onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4" />
              Ajouter une Cotisation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingContrib ? 'Modifier la Cotisation' : 'Nouvelle Cotisation'}
              </DialogTitle>
              <DialogDescription>
                {editingContrib 
                  ? 'Modifiez les informations de cette cotisation.'
                  : 'Créez un nouveau type de cotisation personnalisée.'}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div>
                <Label htmlFor="contribLabel">Libellé *</Label>
                <Input
                  id="contribLabel"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="Ex: Cotisation Magal"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="contribDescription">Description</Label>
                <Textarea
                  id="contribDescription"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description de la cotisation"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="contribMontant">Montant (FCFA)</Label>
                <Input
                  id="contribMontant"
                  type="number"
                  value={montant}
                  onChange={(e) => setMontant(e.target.value)}
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
                    Les cotisations obligatoires sont requises pour tous les membres
                  </p>
                </div>
                <Switch
                  checked={obligatoire}
                  onCheckedChange={setObligatoire}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                <X className="w-4 h-4 mr-2" />
                Annuler
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                {editingContrib ? 'Modifier' : 'Ajouter'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
