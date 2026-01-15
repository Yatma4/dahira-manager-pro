import { useState } from 'react';
import { useMembers } from '@/contexts/MemberContext';
import { calculateMonthlyTotal, SECTIONS } from '@/types/member';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Eye, Wallet, UserPlus, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function MemberList() {
  const { members } = useMembers();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sectionFilter, setSectionFilter] = useState<string>('all');

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      `${member.prenom} ${member.nom}`.toLowerCase().includes(search.toLowerCase()) ||
      member.telephone.includes(search);
    const matchesSection = sectionFilter === 'all' || member.section === sectionFilter;
    return matchesSearch && matchesSection;
  });

  if (members.length === 0) {
    return (
      <div className="card-elevated p-12 text-center">
        <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
        <h3 className="font-serif text-xl font-bold mb-2">Aucun membre enregistré</h3>
        <p className="text-muted-foreground mb-6">
          Commencez par ajouter votre premier membre au dahira.
        </p>
        <Button asChild>
          <Link to="/membres/nouveau" className="gap-2">
            <UserPlus className="w-4 h-4" />
            Ajouter un Membre
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="card-elevated p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom ou téléphone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={sectionFilter} onValueChange={setSectionFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Toutes les sections" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les sections</SelectItem>
              {SECTIONS.map((section) => (
                <SelectItem key={section} value={section}>
                  {section}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button asChild>
            <Link to="/membres/nouveau" className="gap-2">
              <UserPlus className="w-4 h-4" />
              Nouveau
            </Link>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="card-elevated overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="table-header">
              <TableHead>Membre</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Cotisation/Mois</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map((member, index) => {
              const monthlyTotal = calculateMonthlyTotal(member);
              return (
                <TableRow 
                  key={member.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold text-sm">
                          {member.prenom[0]}{member.nom[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{member.prenom} {member.nom}</p>
                        <p className="text-xs text-muted-foreground">
                          {member.genre === 'homme' ? 'Homme' : 'Femme'} • Adhésion: {format(new Date(member.dateAdhesion), 'MMM yyyy', { locale: fr })}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{member.section}</p>
                      {member.sousSection && (
                        <p className="text-xs text-muted-foreground">{member.sousSection}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{member.telephone}</TableCell>
                  <TableCell>
                    <Badge variant={member.statutCotisation === 'cotisant' ? 'default' : 'secondary'}>
                      {member.statutCotisation === 'cotisant' ? 'Cotisant' : 'Non cotisant'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {monthlyTotal.total.toLocaleString()} FCFA
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/membres/${member.id}`)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/cotisations/${member.id}`)}
                      >
                        <Wallet className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      <div className="text-sm text-muted-foreground text-center">
        {filteredMembers.length} membre{filteredMembers.length > 1 ? 's' : ''} trouvé{filteredMembers.length > 1 ? 's' : ''}
      </div>
    </div>
  );
}
