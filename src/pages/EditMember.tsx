import { useParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { MemberEditForm } from '@/components/members/MemberEditForm';
import { useMembers } from '@/contexts/MemberContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function EditMember() {
  const { id } = useParams<{ id: string }>();
  const { getMemberById } = useMembers();
  const navigate = useNavigate();
  
  const member = getMemberById(id!);

  if (!member) {
    return (
      <MainLayout title="Membre non trouvé" subtitle="">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Ce membre n'existe pas ou a été supprimé.</p>
          <Button variant="outline" onClick={() => navigate('/membres')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la liste
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title={`Modifier ${member.prenom} ${member.nom}`}
      subtitle="Mettre à jour les informations du membre"
    >
      <MemberEditForm member={member} />
    </MainLayout>
  );
}
