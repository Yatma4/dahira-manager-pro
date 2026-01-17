import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMembers } from '@/contexts/MemberContext';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { Member, Gender, ContributionStatus } from '@/types/member';
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
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Edit, Save } from 'lucide-react';

const memberSchema = z.object({
  prenom: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  dateNaissance: z.string().min(1, 'La date de naissance est requise'),
  lieuNaissance: z.string().min(2, 'Le lieu de naissance est requis'),
  adresse: z.string().min(5, 'L\'adresse doit contenir au moins 5 caractères'),
  telephone: z.string().min(9, 'Le numéro de téléphone est invalide'),
  profession: z.string().min(2, 'La profession est requise'),
  dahiraName: z.string().min(2, 'Le nom du Dahira est requis'),
  section: z.string().min(1, 'La section est requise'),
  sousSection: z.string().optional(),
  dateAdhesion: z.string().min(1, 'La date d\'adhésion est requise'),
  genre: z.enum(['homme', 'femme']),
  montantSass: z.number().min(0, 'Le montant du Sass doit être positif'),
  statutCotisation: z.enum(['cotisant', 'non_cotisant']),
});

type MemberFormData = z.infer<typeof memberSchema>;

interface MemberEditFormProps {
  member: Member;
}

export function MemberEditForm({ member }: MemberEditFormProps) {
  const { updateMember } = useMembers();
  const { getSections } = useAppSettings();
  const sections = getSections();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      prenom: member.prenom,
      nom: member.nom,
      dateNaissance: member.dateNaissance,
      lieuNaissance: member.lieuNaissance,
      adresse: member.adresse,
      telephone: member.telephone,
      profession: member.profession || '',
      dahiraName: member.dahiraName || 'Dahira',
      section: member.section,
      sousSection: member.sousSection || '',
      dateAdhesion: member.dateAdhesion,
      genre: member.genre,
      montantSass: member.montantSass,
      statutCotisation: member.statutCotisation,
    },
  });

  const watchedSection = watch('section');
  const watchedGenre = watch('genre');
  const watchedStatut = watch('statutCotisation');

  const onSubmit = async (data: MemberFormData) => {
    try {
      updateMember(member.id, {
        prenom: data.prenom,
        nom: data.nom,
        dateNaissance: data.dateNaissance,
        lieuNaissance: data.lieuNaissance,
        adresse: data.adresse,
        telephone: data.telephone,
        profession: data.profession,
        dahiraName: data.dahiraName,
        section: data.section,
        sousSection: data.sousSection || '',
        dateAdhesion: data.dateAdhesion,
        genre: data.genre,
        montantSass: data.montantSass,
        statutCotisation: data.statutCotisation,
      });
      toast.success('Membre modifié avec succès!');
      navigate(`/membres/${member.id}`);
    } catch (error) {
      toast.error('Erreur lors de la modification du membre');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="card-elevated p-6">
        <h3 className="font-serif font-bold text-lg mb-6 flex items-center gap-2">
          <Edit className="w-5 h-5 text-primary" />
          Informations Personnelles
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Prénom */}
          <div className="space-y-2">
            <Label htmlFor="prenom">Prénom *</Label>
            <Input
              id="prenom"
              {...register('prenom')}
              placeholder="Entrez le prénom"
              className="input-styled"
            />
            {errors.prenom && (
              <p className="text-sm text-destructive">{errors.prenom.message}</p>
            )}
          </div>

          {/* Nom */}
          <div className="space-y-2">
            <Label htmlFor="nom">Nom *</Label>
            <Input
              id="nom"
              {...register('nom')}
              placeholder="Entrez le nom"
              className="input-styled"
            />
            {errors.nom && (
              <p className="text-sm text-destructive">{errors.nom.message}</p>
            )}
          </div>

          {/* Genre */}
          <div className="space-y-2">
            <Label>Genre *</Label>
            <Select
              onValueChange={(value) => setValue('genre', value as Gender)}
              value={watchedGenre}
            >
              <SelectTrigger className="input-styled">
                <SelectValue placeholder="Sélectionner le genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="homme">Homme</SelectItem>
                <SelectItem value="femme">Femme</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date de naissance */}
          <div className="space-y-2">
            <Label htmlFor="dateNaissance">Date de Naissance *</Label>
            <Input
              id="dateNaissance"
              type="date"
              {...register('dateNaissance')}
              className="input-styled"
            />
            {errors.dateNaissance && (
              <p className="text-sm text-destructive">{errors.dateNaissance.message}</p>
            )}
          </div>

          {/* Lieu de naissance */}
          <div className="space-y-2">
            <Label htmlFor="lieuNaissance">Lieu de Naissance *</Label>
            <Input
              id="lieuNaissance"
              {...register('lieuNaissance')}
              placeholder="Ville ou village"
              className="input-styled"
            />
            {errors.lieuNaissance && (
              <p className="text-sm text-destructive">{errors.lieuNaissance.message}</p>
            )}
          </div>

          {/* Profession */}
          <div className="space-y-2">
            <Label htmlFor="profession">Profession *</Label>
            <Input
              id="profession"
              {...register('profession')}
              placeholder="Ex: Enseignant, Commerçant..."
              className="input-styled"
            />
            {errors.profession && (
              <p className="text-sm text-destructive">{errors.profession.message}</p>
            )}
          </div>

          {/* Téléphone */}
          <div className="space-y-2">
            <Label htmlFor="telephone">Téléphone *</Label>
            <Input
              id="telephone"
              {...register('telephone')}
              placeholder="+221 77 XXX XX XX"
              className="input-styled"
            />
            {errors.telephone && (
              <p className="text-sm text-destructive">{errors.telephone.message}</p>
            )}
          </div>

          {/* Adresse */}
          <div className="space-y-2">
            <Label htmlFor="adresse">Adresse Complète *</Label>
            <Input
              id="adresse"
              {...register('adresse')}
              placeholder="Adresse complète du membre"
              className="input-styled"
            />
            {errors.adresse && (
              <p className="text-sm text-destructive">{errors.adresse.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="card-elevated p-6">
        <h3 className="font-serif font-bold text-lg mb-6">Affiliation au Dahira</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nom du Dahira */}
          <div className="space-y-2">
            <Label htmlFor="dahiraName">Nom du Dahira *</Label>
            <Input
              id="dahiraName"
              {...register('dahiraName')}
              placeholder="Nom du Dahira"
              className="input-styled"
            />
            {errors.dahiraName && (
              <p className="text-sm text-destructive">{errors.dahiraName.message}</p>
            )}
          </div>

          {/* Section */}
          <div className="space-y-2">
            <Label>Section *</Label>
            <Select 
              onValueChange={(value) => setValue('section', value)}
              value={watchedSection}
            >
              <SelectTrigger className="input-styled">
                <SelectValue placeholder="Sélectionner la section" />
              </SelectTrigger>
              <SelectContent>
                {sections.map((section) => (
                  <SelectItem key={section} value={section}>
                    {section}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.section && (
              <p className="text-sm text-destructive">{errors.section.message}</p>
            )}
          </div>

          {/* Sous-section */}
          <div className="space-y-2">
            <Label htmlFor="sousSection">Sous-Section</Label>
            <Input
              id="sousSection"
              {...register('sousSection')}
              placeholder="Sous-section (optionnel)"
              className="input-styled"
            />
          </div>

          {/* Date d'adhésion */}
          <div className="space-y-2">
            <Label htmlFor="dateAdhesion">Date d'Adhésion *</Label>
            <Input
              id="dateAdhesion"
              type="date"
              {...register('dateAdhesion')}
              className="input-styled"
            />
            {errors.dateAdhesion && (
              <p className="text-sm text-destructive">{errors.dateAdhesion.message}</p>
            )}
          </div>

          {/* Statut cotisation */}
          <div className="space-y-2">
            <Label>Statut de Cotisation *</Label>
            <Select
              onValueChange={(value) => setValue('statutCotisation', value as ContributionStatus)}
              value={watchedStatut}
            >
              <SelectTrigger className="input-styled">
                <SelectValue placeholder="Sélectionner le statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cotisant">Cotisant</SelectItem>
                <SelectItem value="non_cotisant">Non Cotisant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Montant Sass */}
          <div className="space-y-2">
            <Label htmlFor="montantSass">Montant du Sass (FCFA) *</Label>
            <Input
              id="montantSass"
              type="number"
              {...register('montantSass', { valueAsNumber: true })}
              placeholder="Ex: 12000"
              className="input-styled"
            />
            {errors.montantSass && (
              <p className="text-sm text-destructive">{errors.montantSass.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Ce montant sera réparti sur les mois restants de l'année en cours
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(`/membres/${member.id}`)}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting} className="gap-2">
          <Save className="w-4 h-4" />
          {isSubmitting ? 'Enregistrement...' : 'Enregistrer les Modifications'}
        </Button>
      </div>
    </form>
  );
}