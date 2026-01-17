import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Member, Contribution, calculateMonthlyTotal } from '@/types/member';
import { Commission, Poste } from '@/contexts/AppSettingsContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

interface ReportData {
  members: Member[];
  contributions: Contribution[];
  dahiraName?: string;
}

// Fonction pour formater les montants en entier (45 000 F au lieu de 45/000)
function formatMontant(montant: number): string {
  return montant.toLocaleString('fr-FR').replace(/\s/g, ' ') + ' F';
}

function addHeader(doc: jsPDF, title: string, dahiraName: string = 'Dahira') {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(dahiraName, pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(title, pageWidth / 2, 30, { align: 'center' });
  
  doc.setFontSize(10);
  doc.text(`Généré le ${format(new Date(), 'dd MMMM yyyy à HH:mm', { locale: fr })}`, pageWidth / 2, 38, { align: 'center' });
  
  // Ligne de séparation
  doc.setLineWidth(0.5);
  doc.line(20, 42, pageWidth - 20, 42);
}

function addFooter(doc: jsPDF, pageNumber: number) {
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
}

export function generateMemberCensusReport(data: ReportData): void {
  const doc = new jsPDF('l'); // Landscape pour plus de colonnes
  const { members, dahiraName } = data;
  
  addHeader(doc, 'Recensement des Membres', dahiraName);
  
  // Stats summary
  doc.setFontSize(11);
  doc.text(`Nombre total de membres: ${members.length}`, 20, 52);
  doc.text(`Hommes: ${members.filter(m => m.genre === 'homme').length} | Femmes: ${members.filter(m => m.genre === 'femme').length}`, 20, 58);
  
  // Table avec adresse, date de naissance et profession
  const tableData = members.map((m, index) => [
    (index + 1).toString(),
    `${m.prenom} ${m.nom}`,
    m.genre === 'homme' ? 'H' : 'F',
    m.dateNaissance ? format(new Date(m.dateNaissance), 'dd/MM/yyyy') : '-',
    m.adresse || '-',
    m.profession || '-',
    m.telephone,
    m.section,
    format(new Date(m.dateAdhesion), 'dd/MM/yyyy')
  ]);
  
  autoTable(doc, {
    startY: 65,
    head: [['#', 'Nom Complet', 'Genre', 'Date Naissance', 'Adresse', 'Profession', 'Téléphone', 'Section', 'Adhésion']],
    body: tableData,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 35 },
      2: { cellWidth: 15 },
      3: { cellWidth: 25 },
      4: { cellWidth: 45 },
      5: { cellWidth: 30 },
      6: { cellWidth: 30 },
      7: { cellWidth: 30 },
      8: { cellWidth: 22 }
    },
    didDrawPage: (data) => {
      addFooter(doc, doc.internal.pages.length - 1);
    }
  });
  
  doc.save(`recensement_membres_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
}

export function generateAnnualReport(data: ReportData, year: number): void {
  const doc = new jsPDF();
  const { members, contributions, dahiraName } = data;
  
  const yearContributions = contributions.filter(c => c.annee === year);
  const totalCollected = yearContributions.reduce((sum, c) => sum + c.montant, 0);
  
  addHeader(doc, `Rapport Annuel ${year}`, dahiraName);
  
  // Summary stats
  let yPos = 52;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Résumé Financier', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total collecté: ${formatMontant(totalCollected)}CFA`, 25, yPos);
  yPos += 6;
  doc.text(`Nombre de paiements: ${yearContributions.length}`, 25, yPos);
  yPos += 6;
  doc.text(`Membres actifs: ${members.filter(m => m.statutCotisation === 'cotisant').length}`, 25, yPos);
  
  // Monthly breakdown
  yPos += 15;
  doc.setFont('helvetica', 'bold');
  doc.text('Répartition Mensuelle', 20, yPos);
  
  const monthlyData = MONTHS.map((month, index) => {
    const monthContribs = yearContributions.filter(c => c.mois === index + 1);
    const total = monthContribs.reduce((sum, c) => sum + c.montant, 0);
    return [month, monthContribs.length.toString(), `${formatMontant(total)}CFA`];
  });
  
  autoTable(doc, {
    startY: yPos + 5,
    head: [['Mois', 'Paiements', 'Total']],
    body: monthlyData,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [39, 174, 96] },
    columnStyles: {
      2: { halign: 'right' }
    },
    didDrawPage: () => addFooter(doc, doc.internal.pages.length - 1)
  });
  
  doc.save(`rapport_annuel_${year}_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
}

export function generateSectionReport(data: ReportData): void {
  const doc = new jsPDF();
  const { members, contributions, dahiraName } = data;
  const currentYear = new Date().getFullYear();
  
  addHeader(doc, 'Rapport par Section', dahiraName);
  
  // Group by section
  const sections = [...new Set(members.map(m => m.section))];
  
  const sectionData = sections.map(section => {
    const sectionMembers = members.filter(m => m.section === section);
    const sectionContribs = contributions.filter(c => 
      c.annee === currentYear && sectionMembers.some(m => m.id === c.membreId)
    );
    const total = sectionContribs.reduce((sum, c) => sum + c.montant, 0);
    
    return [
      section,
      sectionMembers.length.toString(),
      sectionMembers.filter(m => m.genre === 'homme').length.toString(),
      sectionMembers.filter(m => m.genre === 'femme').length.toString(),
      `${formatMontant(total)}CFA`
    ];
  });
  
  autoTable(doc, {
    startY: 50,
    head: [['Section', 'Membres', 'Hommes', 'Femmes', 'Collecté']],
    body: sectionData,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [155, 89, 182] },
    columnStyles: {
      4: { halign: 'right' }
    },
    didDrawPage: () => addFooter(doc, doc.internal.pages.length - 1)
  });
  
  doc.save(`rapport_sections_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
}

export function generateContributionHistoryReport(data: ReportData): void {
  const doc = new jsPDF('l'); // Landscape
  const { members, contributions, dahiraName } = data;
  
  addHeader(doc, 'Historique des Cotisations', dahiraName);
  
  // Sort by date
  const sortedContribs = [...contributions].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  const tableData = sortedContribs.map((c, index) => {
    const member = members.find(m => m.id === c.membreId);
    return [
      (index + 1).toString(),
      member ? `${member.prenom} ${member.nom}` : 'Inconnu',
      member?.section || '-',
      MONTHS[c.mois - 1],
      c.annee.toString(),
      `${formatMontant(c.montant)}CFA`,
      format(new Date(c.createdAt), 'dd/MM/yyyy')
    ];
  });
  
  autoTable(doc, {
    startY: 50,
    head: [['#', 'Membre', 'Section', 'Mois', 'Année', 'Montant', 'Date']],
    body: tableData,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [230, 126, 34] },
    columnStyles: {
      5: { halign: 'right' }
    },
    didDrawPage: () => addFooter(doc, doc.internal.pages.length - 1)
  });
  
  doc.save(`historique_cotisations_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
}

export function generateLatePaymentReport(data: ReportData): void {
  const doc = new jsPDF();
  const { members, contributions, dahiraName } = data;
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  
  addHeader(doc, 'Membres en Retard de Paiement', dahiraName);
  
  // Find members who haven't paid for current month
  const lateMembers = members.filter(m => {
    if (m.statutCotisation !== 'cotisant') return false;
    const memberContribs = contributions.filter(
      c => c.membreId === m.id && c.annee === currentYear && c.mois === currentMonth
    );
    return memberContribs.length === 0;
  });
  
  doc.setFontSize(11);
  doc.text(`Membres n'ayant pas payé pour ${MONTHS[currentMonth - 1]} ${currentYear}: ${lateMembers.length}`, 20, 52);
  
  const tableData = lateMembers.map((m, index) => {
    const monthlyTotal = calculateMonthlyTotal(m);
    const lastPayment = contributions
      .filter(c => c.membreId === m.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    
    return [
      (index + 1).toString(),
      `${m.prenom} ${m.nom}`,
      m.telephone,
      m.section,
      `${formatMontant(monthlyTotal.total)}CFA`,
      lastPayment 
        ? `${MONTHS[lastPayment.mois - 1]} ${lastPayment.annee}` 
        : 'Aucun'
    ];
  });
  
  autoTable(doc, {
    startY: 60,
    head: [['#', 'Membre', 'Téléphone', 'Section', 'Mensuel dû', 'Dernier paiement']],
    body: tableData,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [231, 76, 60] },
    didDrawPage: () => addFooter(doc, doc.internal.pages.length - 1)
  });
  
  doc.save(`membres_retard_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
}

// Nouveau rapport des membres des commissions
export function generateCommissionMembersReport(
  commissions: Commission[], 
  members: Member[], 
  dahiraName: string = 'Dahira'
): void {
  const doc = new jsPDF();
  
  addHeader(doc, 'Rapport des Commissions', dahiraName);
  
  let yPos = 52;
  
  // Stats summary
  doc.setFontSize(11);
  doc.text(`Nombre de commissions: ${commissions.length}`, 20, yPos);
  const totalPostes = commissions.reduce((sum, c) => sum + c.postes.length, 0);
  doc.text(`Nombre total de postes: ${totalPostes}`, 20, yPos + 6);
  
  yPos += 20;
  
  commissions.forEach((commission, index) => {
    // Nom de la commission
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`${index + 1}. ${commission.nom}`, 20, yPos);
    
    if (commission.description) {
      yPos += 6;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(commission.description, 25, yPos);
    }
    
    yPos += 8;
    
    if (commission.postes.length > 0) {
      const posteData = commission.postes.map(poste => {
        const membre = poste.membreId ? members.find(m => m.id === poste.membreId) : null;
        return [
          poste.titre,
          membre ? `${membre.prenom} ${membre.nom}` : 'Non attribué',
          membre?.telephone || '-',
          membre?.section || '-'
        ];
      });
      
      autoTable(doc, {
        startY: yPos,
        head: [['Poste', 'Membre', 'Téléphone', 'Section']],
        body: posteData,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [52, 73, 94] },
        margin: { left: 25 },
        tableWidth: 160,
      });
      
      yPos = (doc as any).lastAutoTable.finalY + 15;
    } else {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.text('Aucun poste défini', 25, yPos);
      yPos += 15;
    }
    
    // Nouvelle page si nécessaire
    if (yPos > 250 && index < commissions.length - 1) {
      doc.addPage();
      yPos = 20;
    }
  });
  
  // Ajouter le footer
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    addFooter(doc, i);
  }
  
  doc.save(`rapport_commissions_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
}