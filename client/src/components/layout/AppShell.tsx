import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen w-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-zinc-800">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 bg-zinc-950 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};
