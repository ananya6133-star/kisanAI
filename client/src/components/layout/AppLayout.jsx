import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Outlet />
      </main>
      
      {/* Global Agrarian Responsible Advisory Footer */}
      <footer className="no-print bg-white border-t border-slate-200 mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 font-display">KisanAI</span>
            <span>•</span>
            <span>AI-Powered Agriculture Crop Advisory Assistant</span>
          </div>
          <div className="text-center sm:text-right text-slate-400">
            Advisory guidance only. Verify chemical & pesticide application with local agricultural authorities.
          </div>
        </div>
      </footer>
    </div>
  );
}
