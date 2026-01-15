import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface NotificationSettings {
  rappelsCotisation: boolean;
  alertesRetard: boolean;
  evenementsDahira: boolean;
}

interface AppSettings {
  accessCode: string;
  securityCode: string;
  sections: string[];
  notifications: NotificationSettings;
  isAuthenticated: boolean;
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
};

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('dahira_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...parsed, isAuthenticated: false }; // Toujours déconnecté au démarrage
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
