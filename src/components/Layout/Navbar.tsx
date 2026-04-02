import React from 'react';
import { Menu, Bell, Search, User, LogOut } from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { Button } from '@/src/components/ui/Common';
import { useToast } from '@/src/components/ui/Toast';

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'info');
  };

  return (
    <header className="sticky top-0 z-30 w-full h-16 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="flex items-center justify-between h-full px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden p-2"
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg w-64 lg:w-96 border border-transparent focus-within:border-indigo-500 focus-within:bg-white transition-all">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search anything..."
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          <Button variant="ghost" size="sm" className="relative p-2 h-auto">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
          </Button>

          <div className="h-8 w-px bg-slate-200 mx-1" />

          <div className="flex items-center gap-3 pl-2">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-slate-900 leading-none">{user?.name}</p>
              <p className="text-xs text-slate-500 mt-1 capitalize">{user?.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-white shadow-sm ring-1 ring-slate-200">
              <User className="w-6 h-6 text-indigo-600" />
            </div>
          </div>

          <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block" />

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="p-2 h-auto text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
