import { MainLayout } from '@/components/layout/MainLayout';
import { useMembers } from '@/contexts/MemberContext';
import { calculateMonthlyTotal, MOIS } from '@/types/member';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Wallet, Eye, TrendingUp, Users, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Contributions() {
  const { members, contributions } = useMembers();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear] = useState(new Date().getFullYear());

  const cotisants = members.filter(m => m.statutCotisation === 'cotisant');

  const getMemberMonthStatus = (memberId: string) => {
    const memberContribs = contributions.filter(
      c => c.membreId === memberId && c.mois === selectedMonth && c.annee === selectedYear
    );
    const totalPaid = memberContribs.reduce((sum, c) => sum + c.montant, 0);
    const member = members.find(m => m.id === memberId);
    if (!member) return { paid: 0, expected: 0, status: 'unpaid' };
    
    const expected = calculateMonthlyTotal(member).total;
    const status = totalPaid >= expected ? 'complete' : totalPaid > 0 ? 'partial' : 'unpaid';
    return { paid: totalPaid, expected, status };
  };

  const totalExpected = cotisants.reduce((sum, m) => sum + calculateMonthlyTotal(m).total, 0);
  const totalCollected = contributions
    .filter(c => c.mois === selectedMonth && c.annee === selectedYear)
    .reduce((sum, c) => sum + c.montant, 0);
  
  const paidCount = cotisants.filter(m => getMemberMonthStatus(m.id).status === 'complete').length;

  return (
    <MainLayout
      title="Gestion des Cotisations"
      subtitle="Suivez et gérez les cotisations mensuelles"
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card-elevated p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cotisants</p>
                <p className="text-xl font-bold">{cotisants.length}</p>
              </div>
            </div>
          </div>
          <div className="card-elevated p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">À jour</p>
                <p className="text-xl font-bold">{paidCount}</p>
              </div>
            </div>
          </div>
          <div className="card-elevated p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Collecté</p>
                <p className="text-xl font-bold">{(totalCollected / 1000).toFixed(0)}K FCFA</p>
              </div>
            </div>
          </div>
          <div className="card-elevated p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Objectif</p>
                <p className="text-xl font-bold">{(totalExpected / 1000).toFixed(0)}K FCFA</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="card-elevated p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Période:</span>
            <Select
              value={selectedMonth.toString()}
              onValueChange={(v) => setSelectedMonth(parseInt(v))}
            >
              <SelectTrigger className="w-40">
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
            <span className="font-medium">{selectedYear}</span>
          </div>
        </div>

        {/* Table */}
        <div className="card-elevated overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="table-header">
                <TableHead>Membre</TableHead>
                <TableHead>Section</TableHead>
                <TableHead className="text-right">Attendu</TableHead>
                <TableHead className="text-right">Payé</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cotisants.map((member) => {
                const { paid, expected, status } = getMemberMonthStatus(member.id);
                return (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-semibold text-xs">
                            {member.prenom[0]}{member.nom[0]}
                          </span>
                        </div>
                        <span className="font-medium">{member.prenom} {member.nom}</span>
                      </div>
                    </TableCell>
                    <TableCell>{member.section}</TableCell>
                    <TableCell className="text-right">{expected.toLocaleString()} FCFA</TableCell>
                    <TableCell className="text-right font-medium">
                      {paid.toLocaleString()} FCFA
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={status === 'complete' ? 'default' : status === 'partial' ? 'secondary' : 'outline'}
                        className={
                          status === 'complete' 
                            ? 'bg-success text-success-foreground' 
                            : status === 'partial' 
                            ? 'bg-warning text-warning-foreground' 
                            : ''
                        }
                      >
                        {status === 'complete' ? 'Payé' : status === 'partial' ? 'Partiel' : 'Non payé'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/cotisations/${member.id}`} className="gap-2">
                          <Eye className="w-4 h-4" />
                          Détails
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
}
