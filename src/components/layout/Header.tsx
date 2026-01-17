import { useState, useEffect } from 'react';
import { Bell, Search, LogOut, X, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { useMembers } from '@/contexts/MemberContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { logout, settings } = useAppSettings();
  const { members } = useMembers();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof members>([]);
  const [showResults, setShowResults] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Générer les notifications basées sur les paramètres
  useEffect(() => {
    const newNotifications: Notification[] = [];
    
    if (settings.notifications.rappelsCotisation) {
      newNotifications.push({
        id: '1',
        title: 'Rappel de cotisation',
        message: 'N\'oubliez pas de collecter les cotisations du mois',
        type: 'info',
        read: false,
        createdAt: new Date().toISOString(),
      });
    }
    
    if (settings.notifications.alertesRetard) {
      const membersWithoutPayment = members.filter(m => m.statutCotisation === 'cotisant').length;
      if (membersWithoutPayment > 0) {
        newNotifications.push({
          id: '2',
          title: 'Membres actifs',
          message: `${membersWithoutPayment} membres cotisants à suivre`,
          type: 'warning',
          read: false,
          createdAt: new Date().toISOString(),
        });
      }
    }
    
    if (settings.notifications.evenementsDahira) {
      newNotifications.push({
        id: '3',
        title: 'Événements à venir',
        message: 'Préparez-vous pour les prochains événements du Dahira',
        type: 'success',
        read: false,
        createdAt: new Date().toISOString(),
      });
    }
    
    setNotifications(newNotifications);
  }, [settings.notifications, members]);

  const handleLogout = () => {
    logout();
    toast.success('Déconnexion réussie');
    navigate('/login');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      const filtered = members.filter(
        (m) =>
          m.prenom.toLowerCase().includes(query.toLowerCase()) ||
          m.nom.toLowerCase().includes(query.toLowerCase()) ||
          m.telephone.includes(query) ||
          m.section.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleSelectMember = (memberId: string) => {
    setSearchQuery('');
    setShowResults(false);
    navigate(`/membres/${memberId}`);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="animate-slide-in">
          <h1 className="text-2xl font-serif font-bold text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un membre..."
              className="w-64 pl-10 bg-background"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchQuery && setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
            />
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                {searchResults.map((member) => (
                  <button
                    key={member.id}
                    className="w-full px-4 py-2 text-left hover:bg-muted/50 flex items-center gap-3"
                    onClick={() => handleSelectMember(member.id)}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {member.prenom[0]}{member.nom[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{member.prenom} {member.nom}</p>
                      <p className="text-xs text-muted-foreground">{member.section} • {member.telephone}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {showResults && searchQuery && searchResults.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-50 p-4 text-center text-muted-foreground text-sm">
                Aucun membre trouvé
              </div>
            )}
          </div>

          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="flex items-center justify-between p-4 border-b">
                <h4 className="font-semibold">Notifications</h4>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    <Check className="w-4 h-4 mr-1" />
                    Tout marquer lu
                  </Button>
                )}
              </div>
              <ScrollArea className="h-72">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Aucune notification
                  </div>
                ) : (
                  <div className="divide-y">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-muted/50 cursor-pointer ${
                          !notification.read ? 'bg-primary/5' : ''
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-2 h-2 rounded-full mt-2 ${
                              notification.type === 'info'
                                ? 'bg-blue-500'
                                : notification.type === 'warning'
                                ? 'bg-yellow-500'
                                : notification.type === 'success'
                                ? 'bg-green-500'
                                : 'bg-red-500'
                            }`}
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{notification.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                          </div>
                          {!notification.read && (
                            <span className="text-xs text-primary">Nouveau</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </PopoverContent>
          </Popover>

          {/* Logout */}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleLogout}
            title="Déconnexion"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}