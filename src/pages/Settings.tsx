import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useAppSettings, Commission, Poste } from '@/contexts/AppSettingsContext';
import { useMembers } from '@/contexts/MemberContext';
import { CustomContributionsManager } from '@/components/settings/CustomContributionsManager';
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
  MapPin,
  Users,
  Briefcase,
  Trash2,
  Download,
  FileJson,
  Edit
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

export default function Settings() {
  const { 
    settings, 
    updateAccessCode, 
    updateSecurityCode, 
    updateNotifications,
    addSection,
    removeSection,
    addCommission,
    deleteCommission,
    addPosteToCommission,
    updatePoste,
    deletePoste,
    clearAllData,
    archiveYear,
    exportData,
  } = useAppSettings();
  
  const { members } = useMembers();

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

  // Commission state
  const [commissionDialogOpen, setCommissionDialogOpen] = useState(false);
  const [newCommissionName, setNewCommissionName] = useState('');
  const [newCommissionDescription, setNewCommissionDescription] = useState('');

  // Poste state
  const [posteDialogOpen, setPosteDialogOpen] = useState(false);
  const [selectedCommissionId, setSelectedCommissionId] = useState<string | null>(null);
  const [newPosteTitre, setNewPosteTitre] = useState('');
  const [newPosteDescription, setNewPosteDescription] = useState('');
  const [newPosteMembreId, setNewPosteMembreId] = useState<string>('');
  const [editingPoste, setEditingPoste] = useState<Poste | null>(null);

  // Delete data state
  const [deleteDataCode, setDeleteDataCode] = useState('');
  const [archiveCode, setArchiveCode] = useState('');

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

  const handleAddCommission = () => {
    if (newCommissionName.trim()) {
      addCommission({
        nom: newCommissionName.trim(),
        description: newCommissionDescription.trim(),
      });
      toast.success(`Commission "${newCommissionName}" ajoutée`);
      setNewCommissionName('');
      setNewCommissionDescription('');
      setCommissionDialogOpen(false);
    }
  };

  const handleAddPoste = () => {
    if (selectedCommissionId && newPosteTitre.trim()) {
      if (editingPoste) {
        updatePoste(selectedCommissionId, editingPoste.id, {
          titre: newPosteTitre.trim(),
          description: newPosteDescription.trim(),
          membreId: newPosteMembreId && newPosteMembreId !== 'none' ? newPosteMembreId : undefined,
        });
        toast.success(`Poste "${newPosteTitre}" modifié`);
      } else {
        addPosteToCommission(selectedCommissionId, {
          titre: newPosteTitre.trim(),
          description: newPosteDescription.trim(),
          membreId: newPosteMembreId && newPosteMembreId !== 'none' ? newPosteMembreId : undefined,
        });
        toast.success(`Poste "${newPosteTitre}" ajouté`);
      }
      setNewPosteTitre('');
      setNewPosteDescription('');
      setNewPosteMembreId('');
      setSelectedCommissionId(null);
      setEditingPoste(null);
      setPosteDialogOpen(false);
    }
  };

  const handleDeleteData = () => {
    if (clearAllData(deleteDataCode)) {
      toast.success('Toutes les données ont été supprimées');
    } else {
      toast.error('Code de sécurité incorrect');
    }
    setDeleteDataCode('');
  };

  const handleArchive = () => {
    const result = archiveYear(archiveCode);
    if (result.success) {
      toast.success(result.message);
      window.location.reload();
    } else {
      toast.error(result.message);
    }
    setArchiveCode('');
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dahira_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Données exportées avec succès');
  };

  const handleSaveBackup = () => {
    handleExport();
  };

  const getMemberName = (membreId?: string) => {
    if (!membreId) return 'Non attribué';
    const member = members.find(m => m.id === membreId);
    return member ? `${member.prenom} ${member.nom}` : 'Membre inconnu';
  };

  return (
    <MainLayout
      title="Paramètres"
      subtitle="Configuration de l'application"
    >
      <div className="max-w-4xl space-y-6">
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
                Requis pour les actions dangereuses comme l'archivage annuel (par défaut: 0000)
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

        {/* Commissions Management */}
        <div className="card-elevated p-6">
          <h3 className="font-serif font-bold text-lg mb-6 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            Gestion des Commissions
          </h3>
          <div className="space-y-4">
            {settings.commissions.length === 0 ? (
              <p className="text-muted-foreground text-sm">Aucune commission créée</p>
            ) : (
              <div className="space-y-4">
                {settings.commissions.map((commission) => (
                  <div
                    key={commission.id}
                    className="p-4 bg-muted/30 rounded-lg space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{commission.nom}</h4>
                        {commission.description && (
                          <p className="text-sm text-muted-foreground">{commission.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedCommissionId(commission.id);
                            setPosteDialogOpen(true);
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            deleteCommission(commission.id);
                            toast.success('Commission supprimée');
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    
                    {commission.postes.length > 0 && (
                      <div className="pl-4 border-l-2 border-primary/20 space-y-2">
                        {commission.postes.map((poste) => (
                          <div
                            key={poste.id}
                            className="flex items-center justify-between py-2"
                          >
                            <div>
                              <p className="text-sm font-medium">{poste.titre}</p>
                              <p className="text-xs text-muted-foreground">
                                {getMemberName(poste.membreId)}
                              </p>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedCommissionId(commission.id);
                                  setEditingPoste(poste);
                                  setNewPosteTitre(poste.titre);
                                  setNewPosteDescription(poste.description);
                                  setNewPosteMembreId(poste.membreId || 'none');
                                  setPosteDialogOpen(true);
                                }}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  deletePoste(commission.id, poste.id);
                                  toast.success('Poste supprimé');
                                }}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <Dialog open={commissionDialogOpen} onOpenChange={setCommissionDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Ajouter une Commission
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter une Nouvelle Commission</DialogTitle>
                  <DialogDescription>
                    Créez une nouvelle commission pour le dahira.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div>
                    <Label htmlFor="commissionName">Nom de la Commission</Label>
                    <Input
                      id="commissionName"
                      value={newCommissionName}
                      onChange={(e) => setNewCommissionName(e.target.value)}
                      placeholder="Ex: Commission Culturelle"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="commissionDescription">Description (optionnel)</Label>
                    <Textarea
                      id="commissionDescription"
                      value={newCommissionDescription}
                      onChange={(e) => setNewCommissionDescription(e.target.value)}
                      placeholder="Description de la commission"
                      className="mt-2"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setCommissionDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleAddCommission}>
                    Ajouter
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Poste Dialog */}
            <Dialog open={posteDialogOpen} onOpenChange={setPosteDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter un Poste</DialogTitle>
                  <DialogDescription>
                    Ajoutez un nouveau poste à cette commission.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div>
                    <Label htmlFor="posteTitre">Titre du Poste</Label>
                    <Input
                      id="posteTitre"
                      value={newPosteTitre}
                      onChange={(e) => setNewPosteTitre(e.target.value)}
                      placeholder="Ex: Président, Secrétaire, Trésorier"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="posteDescription">Description (optionnel)</Label>
                    <Textarea
                      id="posteDescription"
                      value={newPosteDescription}
                      onChange={(e) => setNewPosteDescription(e.target.value)}
                      placeholder="Responsabilités du poste"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Attribuer à un Membre (optionnel)</Label>
                    <Select
                      value={newPosteMembreId}
                      onValueChange={setNewPosteMembreId}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Sélectionner un membre" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Non attribué</SelectItem>
                        {members.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.prenom} {member.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setPosteDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleAddPoste}>
                    Ajouter
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>


        {/* Custom Contributions Management */}
        <CustomContributionsManager />

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
                  Télécharger toutes les données au format JSON
                </p>
              </div>
              <Button variant="outline" className="gap-2" onClick={handleExport}>
                <Download className="w-4 h-4" />
                Exporter
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div>
                <p className="font-medium">Sauvegarder</p>
                <p className="text-sm text-muted-foreground">
                  Créer une sauvegarde complète des données
                </p>
              </div>
              <Button variant="outline" className="gap-2" onClick={handleSaveBackup}>
                <FileJson className="w-4 h-4" />
                Sauvegarder
              </Button>
            </div>
          </div>
        </div>

        {/* Delete Test Data */}
        <div className="card-elevated p-6 border-warning/20 bg-warning/5">
          <h3 className="font-serif font-bold text-lg mb-6 flex items-center gap-2 text-warning">
            <Trash2 className="w-5 h-5" />
            Supprimer les Données de Test
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-warning/10 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-warning">Attention</p>
                <p className="text-sm text-muted-foreground">
                  Cette action supprimera tous les membres, cotisations et commissions.
                  Les paramètres de l'application seront conservés.
                </p>
              </div>
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="gap-2 border-warning text-warning hover:bg-warning/10">
                  <Trash2 className="w-4 h-4" />
                  Supprimer les Données de Test
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                    Confirmer la Suppression
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action va supprimer définitivement:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Tous les membres</li>
                      <li>Toutes les cotisations</li>
                      <li>Toutes les commissions</li>
                    </ul>
                    <div className="mt-4">
                      <Label htmlFor="deleteCode">Code de sécurité</Label>
                      <Input
                        id="deleteCode"
                        type="password"
                        value={deleteDataCode}
                        onChange={(e) => setDeleteDataCode(e.target.value)}
                        placeholder="Entrez le code de sécurité"
                        className="mt-2"
                      />
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteData}
                    className="bg-warning text-warning-foreground hover:bg-warning/90"
                  >
                    Confirmer la Suppression
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
                    <div className="mt-4">
                      <Label htmlFor="archiveCode">Code de sécurité</Label>
                      <Input
                        id="archiveCode"
                        type="password"
                        value={archiveCode}
                        onChange={(e) => setArchiveCode(e.target.value)}
                        placeholder="Entrez le code de sécurité"
                        className="mt-2"
                      />
                    </div>
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