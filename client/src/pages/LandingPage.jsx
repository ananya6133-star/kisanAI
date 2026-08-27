import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sprout, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Droplet, 
  Bug, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  FileText,
  Activity,
  Compass
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

export function LandingPage() {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Sprout,
      title: 'Crop Suitability Intelligence',
      description: 'Assess crop viability based on soil type, seasonal microclimate, and irrigation infrastructure before committing inputs.',
      color: 'bg-emerald-100 text-emerald-800'
    },
    {
      icon: Layers,
      title: 'Soil & pH Management',
      description: 'Receive soil conditioning protocols, organic matter dosage, and pH buffering tips tailored to your specific field texture.',
      color: 'bg-amber-100 text-amber-800'
    },
    {
      icon: Droplet,
      title: 'Precision Irrigation Schedules',
      description: 'Optimize water efficiency for canal, borewell, or drip setups with stage-specific moisture delivery rules.',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      icon: Bug,
      title: 'Integrated Pest & Disease Defense',
      description: 'Analyze observed foliar and stem symptoms with preventive IPM protocols that minimize unnecessary synthetic chemicals.',
      color: 'bg-red-100 text-red-700'
    },
    {
      icon: Activity,
      title: 'Targeted Nutrient Strategies',
      description: 'Calculate basal and split top-dressing schedules to eliminate fertilizer waste and maximize nutrient uptake.',
      color: 'bg-purple-100 text-purple-800'
    },
    {
      icon: ShieldCheck,
      title: 'Responsible AI & Data Privacy',
      description: 'Strict user isolation via PostgreSQL RLS and grounded agronomic prompts preventing invented chemical guarantees.',
      color: 'bg-teal-100 text-teal-800'
    }
  ];

  const steps = [
    {
      step: '01',
      title: 'Input Your Farm Parameters',
      desc: 'Enter your location, crop, soil type, irrigation availability, and any observed foliar symptoms in under 2 minutes.'
    },
    {
      step: '02',
      title: 'Gemini AI Agronomic Analysis',
      desc: 'Our backend orchestrates Google Gemini models to synthesize comprehensive, validated crop management guidance.'
    },
    {
      step: '03',
      title: 'Implement Structured Actions',
      desc: 'Follow immediate high-priority actions, irrigation schedules, and nutrient timing to safeguard and elevate your harvest.'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-12 pb-8 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold mb-6 shadow-sm animate-pulse-subtle">
          <Sprout className="w-3.5 h-3.5 text-emerald-600" />
          <span>Next-Generation Agricultural Intelligence</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 font-display tracking-tight leading-[1.15] mb-6">
          Scientific Crop Advisory Powered by <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Responsible AI</span>
        </h1>

        <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10">
          Transform your farm, soil, and weather observations into actionable, high-precision crop management protocols. Built for modern agricultural producers.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to={isAuthenticated ? '/advisory/new' : '/register'}>
            <Button size="lg" variant="primary" icon={ArrowRight} className="w-full sm:w-auto text-base shadow-glow">
              {isAuthenticated ? 'Create New Advisory' : 'Start Free Crop Advisory'}
            </Button>
          </Link>
          <Link to={isAuthenticated ? '/dashboard' : '/login'}>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-base">
              {isAuthenticated ? 'Go to Dashboard' : 'Sign In to Account'}
            </Button>
          </Link>
        </div>

        {/* Hero Features Pill Highlights */}
        <div className="mt-12 pt-8 border-t border-slate-200/60 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-medium text-slate-600">
          <div className="flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Tailored to 20+ Crops</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Integrated Pest Management</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Strict Data Isolation</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Printable Field Reports</span>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-xs uppercase font-bold tracking-wider text-emerald-600 mb-2">Capabilities</h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
            Comprehensive Agronomic Guidance Across Every Phase
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} hoverEffect className="p-6 bg-white border-slate-200">
                <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center mb-4 shadow-sm`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900 font-display mb-2">{item.title}</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.description}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 3-Step How It Works */}
      <section className="bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">Streamlined Workflow</span>
            <h3 className="text-2xl sm:text-4xl font-bold font-display tracking-tight">
              From Field Input to Scientific Guidance in 3 Steps
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.step} className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-3">
                <span className="text-3xl font-black font-display text-emerald-400">{s.step}</span>
                <h4 className="text-lg font-bold text-white font-display">{s.title}</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link to={isAuthenticated ? '/advisory/new' : '/register'}>
              <Button variant="amber" size="lg" icon={ArrowRight}>
                Try KisanAI Advisory Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Responsible AI Disclaimer Banner */}
      <section className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-center max-w-3xl mx-auto text-xs text-amber-950 space-y-2">
        <div className="flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-amber-900">
          <ShieldCheck className="w-4 h-4 text-amber-700" />
          <span>Responsible Agricultural Advisory Guarantee</span>
        </div>
        <p className="leading-relaxed">
          KisanAI uses Google Gemini models configured with strict agronomic safety guardrails. Recommendations are advisory and do not replace mandatory pesticide product labeling or local agricultural department testing.
        </p>
      </section>
    </div>
  );
}
