import { MainLayout } from '@/components/layout/MainLayout';
import { MemberDetails } from '@/components/members/MemberDetails';

export default function MemberDetail() {
  return (
    <MainLayout
      title="Détails du Membre"
      subtitle="Informations complètes et historique"
    >
      <MemberDetails />
    </MainLayout>
  );
}
