import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';

export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-sm">
        <Sprout className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 font-display">404</h1>
      <h2 className="text-xl font-bold text-slate-800 font-display">Page Not Found</h2>
      <p className="text-sm text-slate-500 max-w-sm">
        The agricultural advisory page or record you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="pt-2">
        <Button variant="primary" icon={ArrowLeft}>
          Return Home
        </Button>
      </Link>
    </div>
  );
}
