import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const { login } = useAppSettings();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (login(code)) {
      toast.success('Connexion réussie');
      navigate('/');
    } else {
      setError('Code d\'accès incorrect');
      setCode('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <div className="w-full max-w-md px-4">
        <div className="card-elevated p-8 text-center">
          {/* Logo/Header */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Lock className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-foreground">
              Dahira Noukhbaou
            </h1>
            <p className="text-muted-foreground mt-2">
              Système de Gestion des Membres
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="accessCode" className="text-left block">
                Code d'Accès
              </Label>
              <Input
                id="accessCode"
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Entrez le code d'accès"
                className="text-center text-lg tracking-widest"
                maxLength={10}
                autoFocus
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg">
              Accéder à l'Application
            </Button>
          </form>

          <p className="mt-6 text-xs text-muted-foreground">
            Code par défaut : 1234
          </p>
        </div>
      </div>
    </div>
  );
}
