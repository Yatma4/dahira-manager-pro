import { useMembers } from '@/contexts/MemberContext';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { User } from 'lucide-react';

export function RecentMembers() {
  const { members } = useMembers();
  
  const recentMembers = [...members]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (recentMembers.length === 0) {
    return (
      <div className="card-elevated p-6">
        <h3 className="font-serif font-bold text-lg mb-4">Derniers Membres</h3>
        <div className="text-center py-8 text-muted-foreground">
          <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Aucun membre enregistré</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-elevated p-6">
      <h3 className="font-serif font-bold text-lg mb-4">Derniers Membres</h3>
      <div className="space-y-4">
        {recentMembers.map((member, index) => (
          <div 
            key={member.id} 
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold">
                {member.prenom[0]}{member.nom[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">
                {member.prenom} {member.nom}
              </p>
              <p className="text-sm text-muted-foreground">{member.section}</p>
            </div>
            <div className="text-right">
              <Badge variant={member.statutCotisation === 'cotisant' ? 'default' : 'secondary'}>
                {member.statutCotisation === 'cotisant' ? 'Cotisant' : 'Non cotisant'}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(member.createdAt), { 
                  addSuffix: true, 
                  locale: fr 
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
