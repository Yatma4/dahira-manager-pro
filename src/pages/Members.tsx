import { MainLayout } from '@/components/layout/MainLayout';
import { MemberList } from '@/components/members/MemberList';

export default function Members() {
  return (
    <MainLayout
      title="Gestion des Membres"
      subtitle="Consultez, modifiez et gérez tous les membres du dahira"
    >
      <MemberList />
    </MainLayout>
  );
}
