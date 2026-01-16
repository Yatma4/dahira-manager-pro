export type Gender = 'homme' | 'femme';
export type ContributionStatus = 'cotisant' | 'non_cotisant';

export interface Member {
  id: string;
  prenom: string;
  nom: string;
  dateNaissance: string;
  lieuNaissance: string;
  adresse: string;
  telephone: string;
  section: string;
  sousSection: string;
  dateAdhesion: string;
  genre: Gender;
  montantSass: number;
  statutCotisation: ContributionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Contribution {
  id: string;
  membreId: string;
  type: ContributionType;
  montant: number;
  mois: number; // 1-12
  annee: number;
  datePaiement: string;
  createdAt: string;
}

export type ContributionType = 
  | 'sociale' 
  | 'mensuel' 
  | 'sass_wer_bi' 
  | 'sass_mensuel' 
  | 'dekhane' 
  | 'alarba';

export interface ContributionConfig {
  type: ContributionType;
  label: string;
  montantHomme?: number;
  montantFemme?: number;
  montantAdulte?: number;
  montantEnfant?: number;
  montant?: number;
  obligatoire: boolean;
  description: string;
}

export const CONTRIBUTION_CONFIGS: ContributionConfig[] = [
  {
    type: 'sociale',
    label: 'Sociale',
    montant: 500,
    obligatoire: true,
    description: 'Cotisation sociale mensuelle (500 FCFA pour tous)',
  },
  {
    type: 'mensuel',
    label: 'Mensuel',
    montantHomme: 1000,
    montantFemme: 500,
    obligatoire: true,
    description: 'Cotisation mensuelle (Hommes: 1000 FCFA, Femmes: 500 FCFA)',
  },
  {
    type: 'sass_wer_bi',
    label: 'Sass Wer Bi',
    montantAdulte: 1000,
    montantEnfant: 500,
    obligatoire: true,
    description: 'Sass Wer Bi mensuel (Adultes: 1000 FCFA, Enfants: 500 FCFA)',
  },
  {
    type: 'dekhane',
    label: 'Dekhane',
    obligatoire: false,
    description: 'Dépôt volontaire, montant libre',
  },
  {
    type: 'alarba',
    label: 'Alarba',
    obligatoire: false,
    description: 'Don volontaire, montant libre',
  },
];

export interface MonthlyTotal {
  sassMensuel: number;
  mensuel: number;
  sassWerBi: number;
  sociale: number;
  total: number;
}

// Arrondir au multiple de 50 le plus proche
function roundToNearest50(value: number): number {
  return Math.round(value / 50) * 50;
}

// Calculer le nombre de mois restants dans l'année à partir de la date d'adhésion
export function getRemainingMonths(dateAdhesion: string): number {
  const adhesionDate = new Date(dateAdhesion);
  const currentYear = new Date().getFullYear();
  const adhesionYear = adhesionDate.getFullYear();
  
  // Si adhésion dans l'année courante, calculer les mois restants
  if (adhesionYear === currentYear) {
    const adhesionMonth = adhesionDate.getMonth() + 1; // 1-12
    return 13 - adhesionMonth; // Mois restants incluant le mois d'adhésion
  }
  
  // Si adhésion dans une année précédente, utiliser 12 mois
  return 12;
}

export function calculateMonthlyTotal(member: Member): MonthlyTotal {
  if (member.statutCotisation === 'non_cotisant') {
    return { sassMensuel: 0, mensuel: 0, sassWerBi: 0, sociale: 0, total: 0 };
  }

  // Calculer le Sass mensuel sur les mois restants de l'année
  const remainingMonths = getRemainingMonths(member.dateAdhesion);
  const sassMensuelRaw = member.montantSass / remainingMonths;
  const sassMensuel = roundToNearest50(sassMensuelRaw);
  const mensuel = member.genre === 'homme' ? 1000 : 500;
  const sassWerBi = 1000; // Adulte
  const sociale = 500;
  const total = sassMensuel + mensuel + sassWerBi + sociale;

  return { sassMensuel, mensuel, sassWerBi, sociale, total };
}

export const MOIS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];
