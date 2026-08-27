import React, { useEffect, useState } from 'react';
import { Sprout, CheckCircle2, Loader2, Sparkles, ShieldCheck } from 'lucide-react';

export function AdvisoryLoading({ cropName = 'Crop' }) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { title: 'Analyzing Field Parameters', desc: 'Ingesting soil texture, pH, climate, and crop growth stage...' },
    { title: 'Evaluating Agronomic Models', desc: 'Consulting Google Gemini AI agricultural reasoning models...' },
    { title: 'Assessing Pest & Disease Vectors', desc: 'Cross-referencing reported foliar symptoms with safe IPM controls...' },
    { title: 'Generating Priority Action Plan', desc: 'Synthesizing irrigation schedule, nutrient dosage, and mitigations...' },
    { title: 'Validating Advisory Safety', desc: 'Verifying Zod schema conformity and responsible guidance rules...' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1400);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-xl mx-auto py-12 px-6 text-center">
      <div className="relative inline-block mb-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white flex items-center justify-center shadow-glow animate-bounce">
          <Sprout className="w-10 h-10" />
        </div>
        <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow animate-spin">
          <Sparkles className="w-4 h-4" />
        </div>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 font-display mb-2">
        Generating Advisory for {cropName}
      </h3>
      <p className="text-sm text-slate-500 max-w-md mx-auto mb-8">
        Our AI agronomist is synthesizing your field data to deliver tailored, practical, and scientific crop management guidance.
      </p>

      {/* Steps Checklist */}
      <div className="text-left bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        {steps.map((step, idx) => {
          const isDone = idx < activeStep;
          const isCurrent = idx === activeStep;
          const isPending = idx > activeStep;

          return (
            <div
              key={step.title}
              className={`flex items-start gap-3.5 transition-all duration-300 ${
                isPending ? 'opacity-40' : 'opacity-100'
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 animate-in zoom-in-50" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-400">
                    {idx + 1}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-semibold ${isCurrent ? 'text-emerald-800 font-display' : isDone ? 'text-slate-800' : 'text-slate-500'}`}>
                  {step.title}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Strictly evaluated against responsible agronomic safety protocols</span>
      </div>
    </div>
  );
}
