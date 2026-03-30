"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Activity } from "lucide-react";

export default function PipelineCalculatorPage() {
  const [leads, setLeads] = useState<number | "">("");
  const [acv, setAcv] = useState<number | "">("");
  const [winRate, setWinRate] = useState<number | "">("");
  const [responseTime, setResponseTime] = useState<number | "">("");
  const [showResults, setShowResults] = useState(false);

  const [baseline, setBaseline] = useState(0);
  const [latencyTax, setLatencyTax] = useState(0);
  const [actualCaptured, setActualCaptured] = useState(0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const calculateBleed = () => {
    if (!leads || !acv || !winRate || !responseTime) return;

    const L = Number(leads);
    const A = Number(acv);
    const W = Number(winRate) / 100;

    // Baseline: 100% of potential closes if contacted < 5 mins
    const baseRev = L * W * A;

    // The Latency Tax (HBR data: 400x drop if > 5 minutes, modeling a realistic drop curve)
    let conversionPenalty = 0;
    if (responseTime === 30) conversionPenalty = 0.15;
    else if (responseTime === 60) conversionPenalty = 0.25;
    else if (responseTime === 360) conversionPenalty = 0.40;
    else if (responseTime === 720) conversionPenalty = 0.60;
    else if (responseTime === 1440) conversionPenalty = 0.75;
    else if (responseTime === 2880) conversionPenalty = 0.90;

    const lostRev = baseRev * conversionPenalty;
    const actual = baseRev - lostRev;

    setBaseline(baseRev);
    setLatencyTax(lostRev);
    setActualCaptured(actual);
    setShowResults(true);
  };

  return (
    <main className="min-h-screen bg-charcoal-900 text-foreground pb-24 font-sans">
      <div className="max-w-3xl mx-auto px-6 pt-16">
        
        {/* HERO */}
        <header className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-gold-500/10 border border-gold-500/20 text-gold-500 mb-6">
            Free Diagnostic Tool
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            The Pipeline <span className="bg-gradient-to-r from-[#ffd700] to-[#aa8c2c] bg-clip-text text-transparent">Hemorrhage</span> Calculator
          </h1>
          <p className="text-charcoal-300 max-w-xl mx-auto text-lg/relaxed opacity-80">
            Find out exactly how much revenue your team is burning every month because of slow lead response times.
          </p>
        </header>

        {/* INPUT CARD */}
        <div className="bg-charcoal-900 border border-charcoal-800 rounded-2xl p-6 md:p-8 shadow-2xl shadow-black/50 mb-10 ring-1 ring-white/5">
          <div className="mb-6 border-b border-charcoal-800 pb-4">
            <h2 className="text-xl font-bold text-white tracking-tight">Enter Your Numbers</h2>
            <p className="text-sm text-gray-400 mt-1">Fill in the 4 fields below. The math will do the rest.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-300">Monthly Inbound Leads</label>
              <input
                type="number"
                value={leads}
                onChange={(e) => setLeads(Number(e.target.value))}
                placeholder="e.g., 200"
                className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500 transition-all font-medium"
              />
              <span className="text-xs text-gray-500">Total form fills & demo requests</span>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-300">Average Contract Value (ACV)</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-gray-500 font-medium">$</span>
                <input
                  type="number"
                  value={acv}
                  onChange={(e) => setAcv(Number(e.target.value))}
                  placeholder="15000"
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg pl-8 pr-4 py-3 text-white focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500 transition-all font-medium"
                />
              </div>
              <span className="text-xs text-gray-500">Your average annual deal size</span>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-300">Current Win Rate (%)</label>
              <div className="relative">
                <input
                  type="number"
                  value={winRate}
                  onChange={(e) => setWinRate(Number(e.target.value))}
                  placeholder="20"
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg pl-4 pr-8 py-3 text-white focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500 transition-all font-medium"
                />
                <span className="absolute right-4 top-3 text-gray-500 font-medium">%</span>
              </div>
              <span className="text-xs text-gray-500">Closed-won conversion rate</span>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-300">Avg. Lead Response Time</label>
              <select
                value={responseTime}
                onChange={(e) => setResponseTime(Number(e.target.value))}
                className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500 transition-all font-medium appearance-none"
              >
                <option value="" disabled>Select response time...</option>
                <option value="5">Under 5 minutes (Baseline)</option>
                <option value="30">Under 30 minutes</option>
                <option value="60">Under 1 hour</option>
                <option value="360">1 - 6 hours</option>
                <option value="720">6 - 12 hours</option>
                <option value="1440">12 - 24 hours</option>
                <option value="2880">24+ hours</option>
              </select>
              <span className="text-xs text-gray-500">Time to first human contact</span>
            </div>
          </div>

          <button
            onClick={calculateBleed}
            className="w-full bg-gold-500 hover:bg-gold-400 text-[#121212] font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            Calculate My Pipeline Bleed
            <ArrowRight size={18} className="stroke-[3]" />
          </button>
        </div>

        {/* RESULTS */}
        <AnimatePresence>
          {showResults && (
            <motion.div
              key={`${baseline}-${latencyTax}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-charcoal-900 border border-charcoal-800 rounded-2xl p-6 md:p-8 shadow-2xl ring-1 ring-white/5 relative overflow-hidden"
            >
              {/* Subtle Red glow for pain */}
              {latencyTax > 0 && (
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-900/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              )}
              
              <h2 className="text-2xl font-bold tracking-tight mb-8">Your Pipeline Diagnosis</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10 w-full">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 transition-colors hover:border-gold-500/30"
                >
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Baseline Revenue</span>
                  <span className="text-2xl md:text-3xl font-black text-white block mb-1 break-words">{formatCurrency(baseline)}</span>
                  <span className="text-xs text-gray-500">If contacted &lt; 5 mins</span>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-red-950/20 border border-red-900/30 rounded-xl p-5 relative overflow-hidden transition-colors hover:border-red-500/30"
                >
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wider block mb-1">Your "Latency Tax"</span>
                  <span className="text-2xl md:text-3xl font-black text-red-500 block mb-1 break-words">-{formatCurrency(latencyTax)}</span>
                  <span className="text-xs text-red-500/70">Pipeline burned</span>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 transition-colors hover:border-gold-500/30"
                >
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Actual Captured</span>
                  <span className="text-2xl md:text-3xl font-black text-white block mb-1 break-words">{formatCurrency(actualCaptured)}</span>
                  <span className="text-xs text-gray-500">What sales actually closes</span>
                </motion.div>
              </div>

              {latencyTax > 0 ? (
                <div className="bg-[#121212] border border-gold-500/20 rounded-xl p-6 md:p-8 text-center relative z-10">
                  <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                    <Activity size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    Your pipeline is bleeding <span className="text-red-500">{(latencyTax / baseline * 100).toFixed(0)}%</span> of its potential.
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-lg mx-auto">
                    You can try fixing this by hiring more SDRs and writing strict SLAs. But humans sleep, eat, and forget.
                    I build <strong className="text-white">Autonomous Speed-to-Lead Interceptors</strong> that drop your response time to under 60 seconds, 24/7/365. 
                    We work for free until that red number turns green.
                  </p>
                  <a
                    href="https://calendly.com/your-booking-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-lg shadow-red-900/20 cursor-pointer"
                  >
                    Book a Pipeline Architecture Audit
                  </a>
                </div>
              ) : (
                <div className="text-center p-8 bg-[#1a1a1a] rounded-xl border border-green-500/20">
                  <h3 className="text-green-500 font-bold text-xl mb-2">Zero Latency Detected</h3>
                  <p className="text-gray-400">Your speed-to-lead is world class. You are capturing 100% of your baseline pipeline potential.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* FOOTER */}
        <footer className="mt-20 text-center pb-8 border-t border-charcoal-800 pt-8 opacity-60 hover:opacity-100 transition-opacity">
          <p className="text-sm font-medium text-white">Built by <span className="text-gold-500 font-bold">Victor C.</span> | GTM & RevOps Engineer</p>
          <p className="text-xs text-gray-500 mt-2">Autonomous speed-to-lead engines, outbound funnels, and CRM agents.</p>
        </footer>
      </div>
    </main>
  );
}
