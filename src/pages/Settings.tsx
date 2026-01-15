import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Shield, 
  Bell, 
  Database, 
  Archive, 
  AlertTriangle,
  Save,
  Key
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
import { toast } from 'sonner';

export default function Settings() {
  const handleArchive = () => {
    toast.info("La fonctionnalité d'archivage sera disponible prochainement.");
  };

  return (
    <MainLayout
      title="Paramètres"
      subtitle="Configuration de l'application"
    >
      <div className="max-w-3xl space-y-6">
        {/* Security */}
        <div className="card-elevated p-6">
          <h3 className="font-serif font-bold text-lg mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Sécurité
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="accessCode">Code d'Accès Principal</Label>
              <div className="flex gap-2">
                <Input
                  id="accessCode"
                  type="password"
                  placeholder="••••••"
                  className="max-w-xs"
                />
                <Button variant="outline" className="gap-2">
                  <Key className="w-4 h-4" />
                  Modifier
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Ce code protège l'accès à l'interface d'administration
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="securityCode">Code de Sécurité (Actions Critiques)</Label>
              <div className="flex gap-2">
                <Input
                  id="securityCode"
                  type="password"
                  placeholder="••••••"
                  className="max-w-xs"
                />
                <Button variant="outline" className="gap-2">
                  <Key className="w-4 h-4" />
                  Modifier
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Requis pour les actions dangereuses comme l'archivage annuel
              </p>
            </div>
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
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Alertes de retard</p>
                <p className="text-sm text-muted-foreground">
                  Être notifié des membres en retard de paiement
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Événements du Dahira</p>
                <p className="text-sm text-muted-foreground">
                  Rappels pour le Magal, Gamou et autres événements
                </p>
              </div>
              <Switch defaultChecked />
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
