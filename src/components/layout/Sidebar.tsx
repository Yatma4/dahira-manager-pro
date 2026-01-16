import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Wallet, 
  FileText, 
  Settings,
  Star,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navigation = [
  { name: 'Tableau de Bord', href: '/', icon: LayoutDashboard },
  { name: 'Membres', href: '/membres', icon: Users },
  { name: 'Nouveau Membre', href: '/membres/nouveau', icon: UserPlus },
  { name: 'Cotisations', href: '/cotisations', icon: Wallet },
  { name: 'Rapports', href: '/rapports', icon: FileText },
  { name: 'Paramètres', href: '/parametres', icon: Settings },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-20 px-4 border-b border-sidebar-border">
        <div className={cn('flex items-center gap-3', collapsed && 'justify-center w-full')}>
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Star className="w-6 h-6 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="font-serif font-bold text-lg text-sidebar-foreground leading-tight">
                Dahira
              </h1>
              <p className="text-xs text-muted-foreground">Noukhbaou</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href !== '/' && location.pathname.startsWith(item.href));
          
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50',
                collapsed && 'justify-center px-2'
              )}
            >
              <item.icon className={cn(
                'w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110',
                isActive && 'text-primary'
              )} />
              {!collapsed && (
                <span className="animate-fade-in">{item.name}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-24 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-soft hover:scale-110 transition-transform"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* Footer */}
      <div className={cn(
        'p-4 border-t border-sidebar-border',
        collapsed && 'text-center'
      )}>
        {!collapsed && (
          <p className="text-xs text-muted-foreground animate-fade-in">
            © {new Date().getFullYear()} Dahira Noukhbaou
          </p>
        )}
      </div>
    </aside>
  );
}
