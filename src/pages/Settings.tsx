import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { 
  Shield, 
  Bell, 
  Database, 
  Archive, 
  AlertTriangle,
  Save,
  Key,
  Plus,
  X,
  MapPin
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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

export default function Settings() {
  const { 
    settings, 
    updateAccessCode, 
    updateSecurityCode, 
    updateNotifications,
    addSection,
    removeSection 
  } = useAppSettings();

  // Access code state
  const [oldAccessCode, setOldAccessCode] = useState('');
  const [newAccessCode, setNewAccessCode] = useState('');
  const [confirmAccessCode, setConfirmAccessCode] = useState('');

  // Security code state
  const [currentCode, setCurrentCode] = useState('');
  const [newSecurityCode, setNewSecurityCode] = useState('');
  const [confirmSecurityCode, setConfirmSecurityCode] = useState('');

  // Section state
  const [newSection, setNewSection] = useState('');
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);

  const handleUpdateAccessCode = () => {
    if (newAccessCode !== confirmAccessCode) {
      toast.error('Les codes ne correspondent pas');
      return;
    }
    if (newAccessCode.length < 4) {
      toast.error('Le code doit contenir au moins 4 caractères');
      return;
    }
    if (updateAccessCode(oldAccessCode, newAccessCode)) {
      toast.success('Code d\'accès modifié avec succès');
      setOldAccessCode('');
      setNewAccessCode('');
      setConfirmAccessCode('');
    } else {
      toast.error('Ancien code incorrect');
    }
  };

  const handleUpdateSecurityCode = () => {
    if (newSecurityCode !== confirmSecurityCode) {
      toast.error('Les codes ne correspondent pas');
      return;
    }
    if (newSecurityCode.length < 4) {
      toast.error('Le code doit contenir au moins 4 caractères');
      return;
    }
    if (updateSecurityCode(currentCode, newSecurityCode)) {
      toast.success('Code de sécurité modifié avec succès');
      setCurrentCode('');
      setNewSecurityCode('');
      setConfirmSecurityCode('');
    } else {
      toast.error('Code d\'accès incorrect');
    }
  };

  const handleAddSection = () => {
    if (newSection.trim()) {
      addSection(newSection.trim());
      toast.success(`Section "${newSection}" ajoutée`);
      setNewSection('');
      setSectionDialogOpen(false);
    }
  };

  const handleRemoveSection = (section: string) => {
    removeSection(section);
    toast.success(`Section "${section}" supprimée`);
  };

  const handleArchive = () => {
    toast.info("La fonctionnalité d'archivage sera disponible prochainement.");
  };

  return (
    <MainLayout
      title="Paramètres"
      subtitle="Configuration de l'application"
    >
      <div className="max-w-3xl space-y-6">
        {/* Security - Access Code */}
        <div className="card-elevated p-6">
          <h3 className="font-serif font-bold text-lg mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Sécurité
          </h3>
          <div className="space-y-6">
            {/* Access Code */}
            <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
              <Label className="font-medium">Modifier le Code d'Accès Principal</Label>
              <div className="grid gap-3">
                <Input
                  type="password"
                  placeholder="Ancien code"
                  value={oldAccessCode}
                  onChange={(e) => setOldAccessCode(e.target.value)}
                  className="max-w-xs"
                />
                <Input
                  type="password"
                  placeholder="Nouveau code"
                  value={newAccessCode}
                  onChange={(e) => setNewAccessCode(e.target.value)}
                  className="max-w-xs"
                />
                <Input
                  type="password"
                  placeholder="Confirmer le nouveau code"
                  value={confirmAccessCode}
                  onChange={(e) => setConfirmAccessCode(e.target.value)}
                  className="max-w-xs"
                />
                <Button 
                  variant="outline" 
                  className="gap-2 w-fit"
                  onClick={handleUpdateAccessCode}
                >
                  <Key className="w-4 h-4" />
                  Modifier le Code d'Accès
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Ce code protège l'accès à l'interface d'administration
              </p>
            </div>

            {/* Security Code */}
            <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
              <Label className="font-medium">Modifier le Code de Sécurité (Actions Critiques)</Label>
              <div className="grid gap-3">
                <Input
                  type="password"
                  placeholder="Code d'accès actuel"
                  value={currentCode}
                  onChange={(e) => setCurrentCode(e.target.value)}
                  className="max-w-xs"
                />
                <Input
                  type="password"
                  placeholder="Nouveau code de sécurité"
                  value={newSecurityCode}
                  onChange={(e) => setNewSecurityCode(e.target.value)}
                  className="max-w-xs"
                />
                <Input
                  type="password"
                  placeholder="Confirmer le code de sécurité"
                  value={confirmSecurityCode}
                  onChange={(e) => setConfirmSecurityCode(e.target.value)}
                  className="max-w-xs"
                />
                <Button 
                  variant="outline" 
                  className="gap-2 w-fit"
                  onClick={handleUpdateSecurityCode}
                >
                  <Key className="w-4 h-4" />
                  Modifier le Code de Sécurité
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Requis pour les actions dangereuses comme l'archivage annuel
              </p>
            </div>
          </div>
        </div>

        {/* Sections Management */}
        <div className="card-elevated p-6">
          <h3 className="font-serif font-bold text-lg mb-6 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Gestion des Sections
          </h3>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {settings.sections.map((section) => (
                <div
                  key={section}
                  className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm"
                >
                  {section}
                  <button
                    onClick={() => handleRemoveSection(section)}
                    className="hover:bg-primary/20 rounded-full p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            
            <Dialog open={sectionDialogOpen} onOpenChange={setSectionDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Ajouter une Section
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter une Nouvelle Section</DialogTitle>
                  <DialogDescription>
                    Entrez le nom de la nouvelle section à ajouter.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Label htmlFor="newSection">Nom de la Section</Label>
                  <Input
                    id="newSection"
                    value={newSection}
                    onChange={(e) => setNewSection(e.target.value)}
                    placeholder="Ex: Thiaroye"
                    className="mt-2"
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSectionDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleAddSection}>
                    Ajouter
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Notifications */}
        <div className="card-elevated p-6">
          <h3 className="font-serif font-bold text-lg mb-6 flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Rappels de cotisation</p>
                <p className="text-sm text-muted-foreground">
                  Recevoir des rappels pour les cotisations mensuelles
                </p>
              </div>
              <Switch 
                checked={settings.notifications.rappelsCotisation}
                onCheckedChange={(checked) => 
                  updateNotifications({ rappelsCotisation: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Alertes de retard</p>
                <p className="text-sm text-muted-foreground">
                  Être notifié des membres en retard de paiement
                </p>
              </div>
              <Switch 
                checked={settings.notifications.alertesRetard}
                onCheckedChange={(checked) => 
                  updateNotifications({ alertesRetard: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Événements du Dahira</p>
                <p className="text-sm text-muted-foreground">
                  Rappels pour le Magal, Gamou et autres événements
                </p>
              </div>
              <Switch 
                checked={settings.notifications.evenementsDahira}
                onCheckedChange={(checked) => 
                  updateNotifications({ evenementsDahira: checked })
                }
              />
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="card-elevated p-6">
          <h3 className="font-serif font-bold text-lg mb-6 flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            Gestion des Données
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div>
                <p className="font-medium">Exporter les données</p>
                <p className="text-sm text-muted-foreground">
                  Télécharger toutes les données au format Excel
                </p>
              </div>
              <Button variant="outline">Exporter</Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div>
                <p className="font-medium">Sauvegarder</p>
                <p className="text-sm text-muted-foreground">
                  Créer une sauvegarde complète des données
                </p>
              </div>
              <Button variant="outline">Sauvegarder</Button>
            </div>
          </div>
        </div>

        {/* Year-end Archive */}
        <div className="card-elevated p-6 border-destructive/20 bg-destructive/5">
          <h3 className="font-serif font-bold text-lg mb-6 flex items-center gap-2 text-destructive">
            <Archive className="w-5 h-5" />
            Archivage Annuel
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-destructive/10 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-destructive">Action Irréversible</p>
                <p className="text-sm text-muted-foreground">
                  L'archivage annuel va générer le rapport final de l'année, 
                  archiver toutes les données de cotisations et réinitialiser 
                  le suivi pour la nouvelle année. Les informations des membres 
                  seront conservées.
                </p>
              </div>
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <Archive className="w-4 h-4" />
                  Archiver l'Année
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    Confirmer l'Archivage Annuel
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action va:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Générer le rapport annuel général</li>
                      <li>Archiver toutes les cotisations de l'année</li>
                      <li>Réinitialiser le suivi pour la nouvelle année</li>
                    </ul>
                    <p className="mt-3 font-medium">
                      Vous devrez entrer le code de sécurité pour confirmer.
                    </p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={handleArchive}>
                    Confirmer l'Archivage
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button className="gap-2" onClick={() => toast.success('Paramètres enregistrés')}>
            <Save className="w-4 h-4" />
            Enregistrer les Paramètres
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
