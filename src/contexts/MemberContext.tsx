import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Member, Contribution } from '@/types/member';

interface MemberContextType {
  members: Member[];
  contributions: Contribution[];
  addMember: (member: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMember: (id: string, member: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  addContribution: (contribution: Omit<Contribution, 'id' | 'createdAt'>) => void;
  getContributionsForMember: (memberId: string) => Contribution[];
  getMemberById: (id: string) => Member | undefined;
}

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export function MemberProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('dahira_members');
    return saved ? JSON.parse(saved) : [];
  });

  const [contributions, setContributions] = useState<Contribution[]>(() => {
    const saved = localStorage.getItem('dahira_contributions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('dahira_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('dahira_contributions', JSON.stringify(contributions));
  }, [contributions]);

  const addMember = (memberData: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newMember: Member = {
      ...memberData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setMembers(prev => [...prev, newMember]);
  };

  const updateMember = (id: string, memberData: Partial<Member>) => {
    setMembers(prev =>
      prev.map(m =>
        m.id === id
          ? { ...m, ...memberData, updatedAt: new Date().toISOString() }
          : m
      )
    );
  };

  const deleteMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    setContributions(prev => prev.filter(c => c.membreId !== id));
  };

  const addContribution = (contribData: Omit<Contribution, 'id' | 'createdAt'>) => {
    const newContribution: Contribution = {
      ...contribData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setContributions(prev => [...prev, newContribution]);
  };

  const getContributionsForMember = (memberId: string) => {
    return contributions.filter(c => c.membreId === memberId);
  };

  const getMemberById = (id: string) => {
    return members.find(m => m.id === id);
  };

  return (
    <MemberContext.Provider
      value={{
        members,
        contributions,
        addMember,
        updateMember,
        deleteMember,
        addContribution,
        getContributionsForMember,
        getMemberById,
      }}
    >
      {children}
    </MemberContext.Provider>
  );
}

export function useMembers() {
  const context = useContext(MemberContext);
  if (!context) {
    throw new Error('useMembers must be used within a MemberProvider');
  }
  return context;
}
