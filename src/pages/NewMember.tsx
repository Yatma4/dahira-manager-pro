import { MainLayout } from '@/components/layout/MainLayout';
import { MemberForm } from '@/components/members/MemberForm';

export default function NewMember() {
  return (
    <MainLayout
      title="Nouveau Membre"
      subtitle="Enregistrer un nouveau membre dans le dahira"
    >
      <MemberForm />
    </MainLayout>
  );
}
