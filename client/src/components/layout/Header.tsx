import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Button,
  Badge,
} from '../ui';
import { LogOut, Building2, User as UserIcon } from 'lucide-react';

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { team, user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="h-16 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-2.5 text-xs text-zinc-400">
        <Building2 size={15} className="text-zinc-300" />
        <span>Workspace:</span>
        <span className="text-zinc-100 font-semibold font-mono">{team?.name || 'Acme Corp'}</span>
      </div>

      <div className="flex items-center gap-4">
        <Badge variant="outline" className="bg-zinc-900 border-zinc-800 text-zinc-300 font-mono text-[11px] gap-2 px-2.5 py-1">
          <span className="h-2 w-2 rounded-full bg-zinc-100 animate-pulse" />
          SYSTEM NORMAL
        </Badge>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 border border-zinc-800 hover:border-zinc-700">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt={user?.name} />
                <AvatarFallback className="bg-zinc-900 text-zinc-100 font-bold text-xs">
                  {user?.name ? user.name.substring(0, 2).toUpperCase() : 'DE'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-zinc-900 border-zinc-800 text-zinc-100" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-white">{user?.name || 'Dev Engineer'}</p>
                <p className="text-xs leading-none text-zinc-400 font-mono">{user?.email || 'dev@example.com'}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem className="focus:bg-zinc-800 cursor-pointer">
              <UserIcon className="mr-2 h-4 w-4 text-zinc-400" />
              <span>Account Preferences</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem
              className="focus:bg-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
