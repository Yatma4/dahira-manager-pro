import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSettings } from '@/contexts/AppSettingsContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { settings } = useAppSettings();

  if (!settings.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
