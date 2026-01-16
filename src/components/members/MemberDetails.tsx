import { useParams, useNavigate } from 'react-router-dom';
import { useMembers } from '@/contexts/MemberContext';
import { calculateMonthlyTotal } from '@/types/member';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  Wallet,
  Edit,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
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

export function MemberDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getMemberById, deleteMember, getContributionsForMember } = useMembers();

  const member = getMemberById(id!);

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
  const totalPaid = contributions.reduce((sum, c) => sum + c.montant, 0);

  const handleDelete = () => {
    deleteMember(member.id);
    toast.success('Membre supprimé avec succès');
    navigate('/membres');
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
            {member.prenom} {member.nom}
          </h2>
          <p className="text-muted-foreground">{member.section}</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => navigate(`/membres/${member.id}/modifier`)}
          >
            <Edit className="w-4 h-4" />
            Modifier
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="gap-2">
                <Trash2 className="w-4 h-4" />
                Supprimer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir supprimer ce membre ? Cette action est irréversible
                  et supprimera également tout l'historique de ses cotisations.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card-elevated p-6">
            <h3 className="font-serif font-bold text-lg mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Informations Personnelles
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Nom complet</p>
                <p className="font-medium">{member.prenom} {member.nom}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Genre</p>
                <p className="font-medium">{member.genre === 'homme' ? 'Homme' : 'Femme'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date de naissance</p>
                <p className="font-medium">
                  {format(new Date(member.dateNaissance), 'dd MMMM yyyy', { locale: fr })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lieu de naissance</p>
                <p className="font-medium">{member.lieuNaissance}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> Adresse
                </p>
                <p className="font-medium">{member.adresse}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Phone className="w-4 h-4" /> Téléphone
                </p>
                <p className="font-medium">{member.telephone}</p>
              </div>
            </div>
          </div>

          <div className="card-elevated p-6">
            <h3 className="font-serif font-bold text-lg mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Affiliation au Dahira
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Section</p>
                <p className="font-medium">{member.section}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sous-section</p>
                <p className="font-medium">{member.sousSection || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date d'adhésion</p>
                <p className="font-medium">
                  {format(new Date(member.dateAdhesion), 'dd MMMM yyyy', { locale: fr })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Statut</p>
                <Badge variant={member.statutCotisation === 'cotisant' ? 'default' : 'secondary'}>
                  {member.statutCotisation === 'cotisant' ? 'Cotisant' : 'Non cotisant'}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card-elevated p-6 bg-primary/5">
            <h3 className="font-serif font-bold text-lg mb-4 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              Cotisations
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Sass (initial)</p>
                <p className="text-2xl font-bold">{member.montantSass.toLocaleString()} FCFA</p>
              </div>
              <hr className="border-border" />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Sass/12</span>
                  <span className="font-medium">{monthlyTotal.sassMensuel.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Mensuel</span>
                  <span className="font-medium">{monthlyTotal.mensuel.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Sass Wer Bi</span>
                  <span className="font-medium">{monthlyTotal.sassWerBi.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Sociale</span>
                  <span className="font-medium">{monthlyTotal.sociale.toLocaleString()} FCFA</span>
                </div>
              </div>
              <hr className="border-border" />
              <div className="flex justify-between">
                <span className="font-semibold">Total mensuel</span>
                <span className="text-xl font-bold text-primary">
                  {monthlyTotal.total.toLocaleString()} FCFA
                </span>
              </div>
            </div>
          </div>

          <div className="card-elevated p-6">
            <h4 className="font-medium mb-4">Résumé des paiements</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total payé</span>
                <span className="font-bold text-success">{totalPaid.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nombre de paiements</span>
                <span className="font-medium">{contributions.length}</span>
              </div>
            </div>
            <Button 
              className="w-full mt-4" 
              onClick={() => navigate(`/cotisations/${member.id}`)}
            >
              Gérer les cotisations
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
