import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface NotificationSettings {
  rappelsCotisation: boolean;
  alertesRetard: boolean;
  evenementsDahira: boolean;
}

export interface Commission {
  id: string;
  nom: string;
  description: string;
  postes: Poste[];
  createdAt: string;
}

export interface Poste {
  id: string;
  titre: string;
  description: string;
  membreId?: string; // ID du membre occupant le poste
}

interface AppSettings {
  accessCode: string;
  securityCode: string;
  sections: string[];
  notifications: NotificationSettings;
  isAuthenticated: boolean;
  commissions: Commission[];
  dahiraName: string;
  customContributions: CustomContribution[];
}

export interface CustomContribution {
  id: string;
  label: string;
  description: string;
  montant?: number;
  obligatoire: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
}

interface AppSettingsContextType {
  settings: AppSettings;
  updateAccessCode: (oldCode: string, newCode: string) => boolean;
  updateSecurityCode: (code: string, newSecurityCode: string) => boolean;
  verifyAccessCode: (code: string) => boolean;
  verifySecurityCode: (code: string) => boolean;
  login: (code: string) => boolean;
  logout: () => void;
  addSection: (section: string) => void;
  removeSection: (section: string) => void;
  updateNotifications: (notifications: Partial<NotificationSettings>) => void;
  getSections: () => string[];
  addCommission: (commission: Omit<Commission, 'id' | 'createdAt' | 'postes'>) => void;
  updateCommission: (id: string, commission: Partial<Commission>) => void;
  deleteCommission: (id: string) => void;
  addPosteToCommission: (commissionId: string, poste: Omit<Poste, 'id'>) => void;
  updatePoste: (commissionId: string, posteId: string, poste: Partial<Poste>) => void;
  deletePoste: (commissionId: string, posteId: string) => void;
  clearAllData: (securityCode: string) => boolean;
  archiveYear: (securityCode: string) => { success: boolean; message: string };
  exportData: () => string;
  addCustomContribution: (contribution: Omit<CustomContribution, 'id'>) => void;
  updateCustomContribution: (id: string, contribution: Partial<CustomContribution>) => void;
  deleteCustomContribution: (id: string) => void;
}

const DEFAULT_SECTIONS = [
  'Médina',
  'Plateau',
  'Grand Dakar',
  'Parcelles Assainies',
  'Pikine',
  'Guédiawaye',
  'Rufisque',
  'Keur Massar',
];

const DEFAULT_SETTINGS: AppSettings = {
  accessCode: '1234', // Code par défaut
  securityCode: '0000', // Code de sécurité par défaut
  sections: DEFAULT_SECTIONS,
  notifications: {
    rappelsCotisation: true,
    alertesRetard: true,
    evenementsDahira: true,
  },
  isAuthenticated: false,
  commissions: [],
  dahiraName: 'Dahira',
  customContributions: [],
};

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('dahira_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { 
        ...DEFAULT_SETTINGS,
        ...parsed, 
        isAuthenticated: false,
        commissions: parsed.commissions || [],
      };
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('dahira_settings', JSON.stringify(settings));
  }, [settings]);

  const verifyAccessCode = (code: string): boolean => {
    return code === settings.accessCode;
  };

  const verifySecurityCode = (code: string): boolean => {
    return code === settings.securityCode;
  };

  const login = (code: string): boolean => {
    if (verifyAccessCode(code)) {
      setSettings(prev => ({ ...prev, isAuthenticated: true }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setSettings(prev => ({ ...prev, isAuthenticated: false }));
  };

  const updateAccessCode = (oldCode: string, newCode: string): boolean => {
    if (verifyAccessCode(oldCode)) {
      setSettings(prev => ({ ...prev, accessCode: newCode }));
      return true;
    }
    return false;
  };

  const updateSecurityCode = (code: string, newSecurityCode: string): boolean => {
    if (verifyAccessCode(code)) {
      setSettings(prev => ({ ...prev, securityCode: newSecurityCode }));
      return true;
    }
    return false;
  };

  const addSection = (section: string) => {
    if (!settings.sections.includes(section)) {
      setSettings(prev => ({
        ...prev,
        sections: [...prev.sections, section],
      }));
    }
  };

  const removeSection = (section: string) => {
    setSettings(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s !== section),
    }));
  };

  const updateNotifications = (notifications: Partial<NotificationSettings>) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, ...notifications },
    }));
  };

  const getSections = () => settings.sections;

  // Commission management
  const addCommission = (commission: Omit<Commission, 'id' | 'createdAt' | 'postes'>) => {
    const newCommission: Commission = {
      ...commission,
      id: crypto.randomUUID(),
      postes: [],
      createdAt: new Date().toISOString(),
    };
    setSettings(prev => ({
      ...prev,
      commissions: [...prev.commissions, newCommission],
    }));
  };

  const updateCommission = (id: string, commission: Partial<Commission>) => {
    setSettings(prev => ({
      ...prev,
      commissions: prev.commissions.map(c =>
        c.id === id ? { ...c, ...commission } : c
      ),
    }));
  };

  const deleteCommission = (id: string) => {
    setSettings(prev => ({
      ...prev,
      commissions: prev.commissions.filter(c => c.id !== id),
    }));
  };

  const addPosteToCommission = (commissionId: string, poste: Omit<Poste, 'id'>) => {
    const newPoste: Poste = {
      ...poste,
      id: crypto.randomUUID(),
    };
    setSettings(prev => ({
      ...prev,
      commissions: prev.commissions.map(c =>
        c.id === commissionId
          ? { ...c, postes: [...c.postes, newPoste] }
          : c
      ),
    }));
  };

  const updatePoste = (commissionId: string, posteId: string, poste: Partial<Poste>) => {
    setSettings(prev => ({
      ...prev,
      commissions: prev.commissions.map(c =>
        c.id === commissionId
          ? {
              ...c,
              postes: c.postes.map(p =>
                p.id === posteId ? { ...p, ...poste } : p
              ),
            }
          : c
      ),
    }));
  };

  const deletePoste = (commissionId: string, posteId: string) => {
    setSettings(prev => ({
      ...prev,
      commissions: prev.commissions.map(c =>
        c.id === commissionId
          ? { ...c, postes: c.postes.filter(p => p.id !== posteId) }
          : c
      ),
    }));
  };

  // Clear all test data
  const clearAllData = (securityCode: string): boolean => {
    if (!verifySecurityCode(securityCode)) {
      return false;
    }
    
    // Clear members and contributions
    localStorage.removeItem('dahira_members');
    localStorage.removeItem('dahira_contributions');
    
    // Reset commissions
    setSettings(prev => ({
      ...prev,
      commissions: [],
    }));
    
    // Trigger a page reload to refresh contexts
    window.location.reload();
    return true;
  };

  // Archive year
  const archiveYear = (securityCode: string): { success: boolean; message: string } => {
    if (!verifySecurityCode(securityCode)) {
      return { success: false, message: 'Code de sécurité incorrect' };
    }

    const currentYear = new Date().getFullYear();
    
    // Get current data
    const members = localStorage.getItem('dahira_members');
    const contributions = localStorage.getItem('dahira_contributions');
    
    // Create archive
    const archive = {
      year: currentYear,
      archivedAt: new Date().toISOString(),
      members: members ? JSON.parse(members) : [],
      contributions: contributions ? JSON.parse(contributions) : [],
    };
    
    // Save archive
    const archives = localStorage.getItem('dahira_archives');
    const existingArchives = archives ? JSON.parse(archives) : [];
    existingArchives.push(archive);
    localStorage.setItem('dahira_archives', JSON.stringify(existingArchives));
    
    // Clear only contributions for the new year (keep members)
    localStorage.setItem('dahira_contributions', JSON.stringify([]));
    
    return { success: true, message: `Données de l'année ${currentYear} archivées avec succès` };
  };

  // Export data
  const exportData = (): string => {
    const members = localStorage.getItem('dahira_members');
    const contributions = localStorage.getItem('dahira_contributions');
    const archives = localStorage.getItem('dahira_archives');
    
    const data = {
      exportedAt: new Date().toISOString(),
      members: members ? JSON.parse(members) : [],
      contributions: contributions ? JSON.parse(contributions) : [],
      settings: {
        sections: settings.sections,
        commissions: settings.commissions,
        customContributions: settings.customContributions,
      },
      archives: archives ? JSON.parse(archives) : [],
    };
    
    return JSON.stringify(data, null, 2);
  };

  // Custom Contribution management
  const addCustomContribution = (contribution: Omit<CustomContribution, 'id'>) => {
    const newContribution: CustomContribution = {
      ...contribution,
      id: crypto.randomUUID(),
    };
    setSettings(prev => ({
      ...prev,
      customContributions: [...prev.customContributions, newContribution],
    }));
  };

  const updateCustomContribution = (id: string, contribution: Partial<CustomContribution>) => {
    setSettings(prev => ({
      ...prev,
      customContributions: prev.customContributions.map(c =>
        c.id === id ? { ...c, ...contribution } : c
      ),
    }));
  };

  const deleteCustomContribution = (id: string) => {
    setSettings(prev => ({
      ...prev,
      customContributions: prev.customContributions.filter(c => c.id !== id),
    }));
  };

  return (
    <AppSettingsContext.Provider
      value={{
        settings,
        updateAccessCode,
        updateSecurityCode,
        verifyAccessCode,
        verifySecurityCode,
        login,
        logout,
        addSection,
        removeSection,
        updateNotifications,
        getSections,
        addCommission,
        updateCommission,
        deleteCommission,
        addPosteToCommission,
        updatePoste,
        deletePoste,
        clearAllData,
        archiveYear,
        exportData,
        addCustomContribution,
        updateCustomContribution,
        deleteCustomContribution,
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider');
  }
  return context;
}
