/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Activity, 
  ShieldAlert, 
  Phone, 
  Calendar, 
  ArrowRight, 
  DollarSign, 
  AlertTriangle, 
  TrendingDown, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  HelpCircle, 
  Sliders, 
  MessageSquare, 
  Settings, 
  Check, 
  ExternalLink, 
  Play, 
  X, 
  AlertCircle,
  Stethoscope,
  ChevronRight,
  Shield,
  HeartPulse
} from "lucide-react";

// Helper component for animating counters on viewport entry
function AnimatedCounter({ 
  value, 
  duration = 1500, 
  prefix = "", 
  suffix = "", 
  locale = false 
}: { 
  value: number; 
  duration?: number; 
  prefix?: string; 
  suffix?: string; 
  locale?: boolean; 
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Cubic ease-out
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setCount(easedProgress * value);
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  const displayVal = Math.round(count);
  return (
    <span>{prefix}{locale ? displayVal.toLocaleString() : displayVal}{suffix}</span>
  );
}

export default function App() {
  // Configurable Links state with LocalStorage persistence
  const [calendlyUrl, setCalendlyUrl] = useState(() => {
    const saved = localStorage.getItem("icu_calendly_url");
    if (!saved || saved === "https://calendly.com/thedigitalicu/diagnostic-call") {
      return "https://calendly.com/thedigitalicu/30min";
    }
    return saved;
  });
  const [whatsappNumber, setWhatsappNumber] = useState(() => {
    return localStorage.getItem("icu_whatsapp_number") || "+1 (555) 019-9000";
  });
  const [whatsappText, setWhatsappText] = useState(() => {
    return localStorage.getItem("icu_whatsapp_text") || "Hello! I just completed my Digital ICU revenue diagnostic and want to stop the bleed. Can we chat?";
  });

  // UI Control states
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isSavedNoticeVisible, setIsSavedNoticeVisible] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Active FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // ROI Calculator states
  const [followers, setFollowers] = useState(250000);
  const [convRate, setConvRate] = useState(0.04); // in % (e.g. 0.04%)
  const [monthlyPrice, setMonthlyPrice] = useState(99);

  // Live Bleed counter baseline accumulated loss state
  const [accumulatedLoss, setAccumulatedLoss] = useState(0);

  // Nav Scrolled state
  const [isNavScrolled, setIsNavScrolled] = useState(false);

  // Clean WhatsApp phone number for wa.me links
  const cleanPhone = whatsappNumber.replace(/\D/g, "");
  const finalWhatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappText)}`;

  // Monitor scroll for nav styling
  useEffect(() => {
    const handleScroll = () => {
      setIsNavScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate live numbers based on inputs
  const members = Math.round(followers * (convRate / 100));
  const mrr = members * monthlyPrice;
  const annualCommunityIncome = mrr * 12;
  const highTicketEstimate = Math.round(members * 0.05) * 5000;
  const totalAnnualRevenue = annualCommunityIncome + highTicketEstimate;
  const dailyRevenueLost = Math.round(totalAnnualRevenue / 365);
  const breakEvenMembers = Math.ceil(4500 / monthlyPrice);

  // Suggested tier based on follower metrics
  const recommendedTier = followers < 75000 ? 1 : followers < 200000 ? 2 : 3;

  // Real-time ticker for accumulated bleed loss
  // Daily loss of $462 (default) corresponds to roughly $0.32/minute, which is $0.0053/second.
  // We calculate this live based on the dynamic dailyRevenueLost from the slider inputs!
  useEffect(() => {
    const bleedRatePerMs = dailyRevenueLost / 86400 / 1000;
    const intervalTime = 50; // update every 50ms for hyper-fluid rendering

    const interval = setInterval(() => {
      setAccumulatedLoss(prev => prev + (bleedRatePerMs * intervalTime));
    }, intervalTime);

    return () => clearInterval(interval);
  }, [dailyRevenueLost]);

  // Handle saving the custom links
  const handleSaveLinks = (e: FormEvent) => {
    e.preventDefault();
    localStorage.setItem("icu_calendly_url", calendlyUrl);
    localStorage.setItem("icu_whatsapp_number", whatsappNumber);
    localStorage.setItem("icu_whatsapp_text", whatsappText);
    
    setIsSavedNoticeVisible(true);
    setTimeout(() => {
      setIsSavedNoticeVisible(false);
    }, 3000);
  };

  const handleOpenCalendly = () => {
    // Attempt to open in a beautiful inline modal first for a seamless preview
    setIsBookingModalOpen(true);
  };

  return (
    <div className="bg-bg2 text-t2 font-sans selection:bg-teal-accent selection:text-bg1 min-h-screen relative overflow-x-hidden medical-grid-bg">
      
      {/* FIXED NAVIGATION */}
      <nav id="nav" className={`fixed top-0 left-0 right-0 z-100 h-[66px] flex items-center transition-all ${isNavScrolled ? "bg-bg1/95 border-b border-b3/25 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-md" : "bg-bg1/90 border-b border-b1"}`}>
        <div className="max-w-[1160px] w-full mx-auto px-5 flex items-center justify-between gap-5">
          <a href="#" className="flex items-center gap-[9px] text-none group">
            <div className="w-[32px] h-[32px] bg-gradient-to-br from-teal-accent to-emerald-500 rounded-lg flex items-center justify-center font-mono text-[10px] font-bold text-bg1 tracking-wider shadow-[0_0_15px_rgba(13,245,196,0.2)] group-hover:shadow-[0_0_25px_rgba(13,245,196,0.5)] transition-all">
              ICU
            </div>
            <span className="font-serif text-[21px] font-semibold text-t1 tracking-wide group-hover:text-teal-accent transition-colors flex items-center gap-1.5">
              The Digital ICU
              <span className="w-1.5 h-1.5 rounded-full bg-teal-accent animate-pulse"></span>
            </span>
          </a>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#diagnosis" className="text-tm hover:text-t1 text-[13px] tracking-wide transition-colors">Diagnosis</a>
            <a href="#skills" className="text-tm hover:text-t1 text-[13px] tracking-wide transition-colors">Treatment</a>
            <a href="#tiers" className="text-tm hover:text-t1 text-[13px] tracking-wide transition-colors">Tiers</a>
            <a href="#faq" className="text-tm hover:text-t1 text-[13px] tracking-wide transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href={finalWhatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-tm hover:text-teal-accent transition-all font-mono py-1.5 px-3.5 border border-b2 hover:border-teal-accent/30 rounded"
              id="nav-whatsapp-link"
            >
              <MessageSquare size={13} className="text-[#25D366]" />
              WhatsApp Direct
            </a>
            <button 
              onClick={handleOpenCalendly}
              className="bg-teal-accent text-bg1 font-sans text-[13px] font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition-all cursor-pointer whitespace-nowrap shadow-[0_0_15px_rgba(13,245,196,0.25)] hover:shadow-[0_0_25px_rgba(13,245,196,0.45)]"
              id="nav-cta-book-diagnosis"
            >
              Book Your Diagnosis
            </button>
          </div>
        </div>
      </nav>

      {/* 3. HERO SECTION */}
      <section id="hero" className="min-h-screen flex flex-col items-center justify-center px-5 pt-36 pb-20 bg-bg1 relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(13,245,196,0.06)_1px,transparent_1px)] bg-[size:28px_28px] opacity-70 pointer-events-none"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 border border-teal-accent/20 bg-teal-accent/5 rounded-full px-4.5 py-1.5 font-mono text-xs text-teal-accent mb-7 tracking-wider"
        >
          <span className="text-amb-accent text-[13px] tracking-[2px]">★★★★★</span>
          <span>TRUSTED BY ELITE MEDICAL PROFESSIONALS WORLDWIDE</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-serif text-[clamp(44px,6vw,88px)] font-light text-t1 leading-[1.05] tracking-tight max-w-[1000px] mb-8"
        >
          You have half a million followers.<br />
          Your digital revenue has <em className="not-italic text-red-accent font-semibold italic relative inline-block">
            flatlined.
            <span className="absolute bottom-1 left-0 right-0 h-[2px] bg-red-accent/40 animate-pulse"></span>
          </em>
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="font-sans text-[clamp(15px,2vw,18px)] font-light text-tm max-w-[620px] leading-relaxed mb-10"
        >
          <p className="mb-4">
            You create content that reaches millions. You carry the full legal risk of a licensed practitioner. And yet every viral video ends the same way — overflowing DMs, a dead-end booking link, and a bank account that has not moved a single dollar from the audience you spent years building.
          </p>
          <p>
            The Digital ICU builds the compliance-first, automated architecture that permanently ends that gap — without adding a single hour to your clinical schedule.
          </p>
        </motion.div>

        {/* EKG / VSL PREVIEW PANEL */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full max-w-[840px] mx-auto p-2 bg-bg1/80 border border-teal-accent/20 rounded-2xl mb-12 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(13,245,196,0.1)] relative group clinical-card-glow"
        >
          {/* Diagnostic indicators */}
          <div className="absolute top-5 left-5 bg-red-accent/90 rounded px-2.5 py-1.5 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-white z-10 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
            LIVE &middot; DIAGNOSTIC MONITOR
          </div>
          
          <div className="absolute top-5 right-5 bg-black/80 border border-teal-accent/20 rounded px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-wider text-teal-accent z-10 flex items-center gap-1.5">
            <HeartPulse size={11} className="text-teal-accent animate-pulse" />
            0rtber0y75 SECURED
          </div>

          <div className="w-full rounded-xl overflow-hidden aspect-video bg-[#030509] border border-b1 relative">
            <iframe 
              src="https://fast.wistia.net/embed/iframe/0rtber0y75" 
              title="The Digital ICU Diagnosis Video"
              allow="autoplay; fullscreen" 
              allowFullScreen
              frameBorder="0" 
              scrolling="no" 
              className="w-full h-full absolute inset-0"
              width="100%" 
              height="100%"
            />
          </div>
        </motion.div>

        {/* Dual CTA buttons on Hero */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col items-center gap-4.5 w-full max-w-md mx-auto"
        >
          <div className="flex flex-col sm:flex-row gap-3.5 w-full justify-center">
            <button 
              onClick={handleOpenCalendly}
              className="flex items-center justify-center gap-2 bg-teal-accent text-bg1 font-sans text-base font-semibold px-8 py-4.5 rounded-lg shadow-lg hover:opacity-95 transform hover:-translate-y-0.5 transition-all cursor-pointer flex-1"
              id="hero-cta-calendly"
            >
              Book Your Free Diagnostic
              <ArrowRight size={16} />
            </button>
            <a 
              href={finalWhatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 border border-b3 hover:border-teal-accent text-t1 font-sans text-base font-semibold px-8 py-4.5 rounded-lg bg-bg3/40 hover:bg-bg3/90 transition-all flex-1"
              id="hero-cta-whatsapp"
            >
              <MessageSquare size={16} className="text-[#25D366]" />
              Chat on WhatsApp
            </a>
          </div>

          <div className="text-xs text-tm">No commitment. No pitch. No agency proposal. Just your numbers.</div>
          <div className="font-mono text-[10px] tracking-widest text-tg uppercase mt-2">
            PATIENT: DIGITAL REVENUE SYSTEM &mdash; STATUS: CRITICAL &mdash; ADMISSION OPEN
          </div>
        </motion.div>
      </section>

      {/* 4. TRUST STRIP */}
      <section id="trust" className="bg-bg3 border-t border-b border-b1 py-8 px-5">
        <div className="max-w-[1160px] mx-auto flex flex-col items-center gap-4.5">
          <div className="font-mono text-[10px] tracking-widest text-tg uppercase">
            PRACTITIONERS ADMITTED FROM INSTITUTIONS INCLUDING
          </div>
          <div className="flex items-center justify-center flex-wrap gap-y-3.5 gap-x-8 text-center">
            <span className="font-sans text-[14px] font-medium text-white/20 hover:text-white/40 transition-colors">Mayo Clinic</span>
            <span className="hidden sm:inline w-[1px] h-4 bg-white/10"></span>
            <span className="font-sans text-[14px] font-medium text-white/20 hover:text-white/40 transition-colors">Cleveland Clinic</span>
            <span className="hidden sm:inline w-[1px] h-4 bg-white/10"></span>
            <span className="font-sans text-[14px] font-medium text-white/20 hover:text-white/40 transition-colors">Johns Hopkins</span>
            <span className="hidden sm:inline w-[1px] h-4 bg-white/10"></span>
            <span className="font-sans text-[14px] font-medium text-white/20 hover:text-white/40 transition-colors">Stanford Medicine</span>
            <span className="hidden sm:inline w-[1px] h-4 bg-white/10"></span>
            <span className="font-sans text-[14px] font-medium text-white/20 hover:text-white/40 transition-colors">Harvard Medical School</span>
          </div>
        </div>
      </section>

      {/* 5. VITAL SIGNS (MONITORED REAL-TIME VALUES) */}
      <section id="vitals" className="bg-bg3 border-b border-b2/40 relative">
        <div className="max-w-[1160px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 lg:divide-x divide-b2/30">
          {/* Card 1 */}
          <div className="p-10 flex flex-col justify-between group hover:bg-bg5/20 transition-all duration-300">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-tm mb-2.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-accent animate-pulse"></span>
                Traffic Loss Rate
              </div>
              <div className="font-serif text-[56px] font-semibold text-red-accent leading-none mb-3">
                <AnimatedCounter value={95} suffix="%" />
              </div>
            </div>
            <p className="font-sans text-[13px] text-tm leading-relaxed font-light">
              Of your global followers hit a dead-end clinic booking link and disappear. Every single day you post without a capture system.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-10 flex flex-col justify-between group hover:bg-bg5/20 transition-all duration-300">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-tm mb-2.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amb-accent animate-pulse"></span>
                Current Digital Income
              </div>
              <div className="font-serif text-[56px] font-semibold text-amb-accent leading-none mb-3">
                $0
              </div>
            </div>
            <p className="font-sans text-[13px] text-tm leading-relaxed font-light">
              Despite millions of monthly content views and a global audience actively searching for your expertise. Structurally zero.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-10 flex flex-col justify-between group hover:bg-bg5/20 transition-all duration-300">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-tm mb-2.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-accent"></span>
                Daily Patient Ceiling
              </div>
              <div className="font-serif text-[56px] font-semibold text-t1 leading-none mb-3">
                <AnimatedCounter value={20} />
              </div>
            </div>
            <p className="font-sans text-[13px] text-tm leading-relaxed font-light">
              The hard biological ceiling of a linear income model. Fame does not move this number. Only a parallel digital architecture does.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-10 flex flex-col justify-between group hover:bg-bg5/20 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-accent/5 rounded-full blur-2xl pointer-events-none"></div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-tm mb-2.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-accent animate-ping"></span>
                90-Day MRR Target
              </div>
              <div className="font-serif text-[56px] font-semibold text-teal-accent leading-none mb-3">
                <AnimatedCounter value={9900} prefix="$" locale={true} />
              </div>
            </div>
            <p className="font-sans text-[13px] text-tm leading-relaxed font-light">
              From just 100 community members at $99/month. Zero new clinical hours. Zero new patients. Zero new content required.
            </p>
          </div>
        </div>
      </section>

      {/* 6. MIRROR (INTAKE NARRATIVE & METRICS) */}
      <section id="mirror" className="py-24 px-5 bg-bg2 relative">
        <div className="max-w-[1160px] mx-auto">
          <div className="inline-flex items-center gap-2 text-teal-accent font-mono text-[10px] uppercase tracking-widest mb-4">
            <span className="w-5.5 h-[1px] bg-teal-accent"></span>
            PATIENT INTAKE REPORT
          </div>
          <h2 className="font-serif text-[clamp(34px,4.5vw,56px)] font-medium text-t1 leading-none mb-12">
            We already know <em className="text-teal-accent not-italic font-normal italic">exactly where you are.</em>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Written Narrative Case */}
            <div className="bg-bg3/80 border border-teal-accent/20 border-l-4 border-l-teal-accent rounded-xl p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_20px_rgba(13,245,196,0.02)] hover:border-teal-accent/35 transition-all duration-300">
              <div className="font-mono text-[9px] uppercase tracking-widest text-tg mb-4">
                06:30 &middot; TUESDAY MORNING &middot; PATIENT INTAKE
              </div>
              <div className="space-y-4 text-sm leading-relaxed text-[#7A8A9E] font-light">
                <p>
                  You wake up and check your phone. <strong className="text-t1 font-normal">The video you posted three days ago has hit 2.1 million views.</strong> For a moment, there is that familiar surge.
                </p>
                <p>Then you open your bank notifications. Nothing has changed.</p>
                <p>
                  You scroll your DMs. <strong className="text-t1 font-normal">There are 847 of them.</strong> A woman in Manchester asking about her thyroid. A man in Vancouver asking about testosterone protocols. A mother in Dubai asking about her daughter's gut symptoms. All of them desperate. All of them genuinely helped by your content. All of them unreachable — because your licence does not cross state lines, let alone oceans.
                </p>
                <p>
                  You close the app. Drive to the clinic. See nineteen patients. Drive home exhausted. Try to be present with your family. <strong className="text-t1 font-normal">Open your phone and begin planning the next video.</strong>
                </p>
                <p>Another day. Another two million impressions. Another zero from your digital audience.</p>
              </div>
            </div>

            {/* Severity Stack list */}
            <div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-tg mb-4">
                ACTIVE SYMPTOMS &middot; SEVERITY INDEX
              </div>
              <div className="flex flex-col gap-3.5">
                {[
                  { label: "Unmonetised global traffic", desc: "95% of followers generate zero revenue while platforms collect all ad income", severity: "CRITICAL", level: "crit" },
                  { label: "Geographic income ceiling", desc: "Licensing laws lock every dollar of digital demand to one zip code", severity: "CRITICAL", level: "crit" },
                  { label: "Liability exposure", desc: "Unarchitectured DMs represent a medical board risk every single day", severity: "CRITICAL", level: "crit" },
                  { label: "Operational burnout", desc: "Two full-time jobs generating the income of one", severity: "HIGH", level: "high" },
                  { label: "Audience depreciation", desc: "Every follower rented from Big Tech with zero ownership guarantee", severity: "HIGH", level: "high" },
                ].map((item, idx) => (
                  <div key={idx} className="bg-bg3 border border-b2 rounded-xl p-5 flex items-center justify-between gap-4 hover:border-teal-accent/20 hover:bg-bg3/60 transition-all duration-300">
                    <div className="text-[13px] leading-normal text-tm">
                      <strong className="text-t2 font-medium block sm:inline mr-1">{item.label}</strong> — {item.desc}
                    </div>
                    <span className={`font-mono text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-lg border whitespace-nowrap ${
                      item.level === "crit" 
                        ? "bg-red-d text-red-accent border-red-b/40 animate-pulse" 
                        : "bg-amb-d text-amb-accent border-amb-accent/20"
                    }`}>
                      {item.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. DIAGNOSIS (THE FOUR STRUCTURAL EMERGENCIES) */}
      <section id="diagnosis" className="py-24 px-5 bg-bg3 border-y border-b2/40 relative">
        <div className="max-w-[1160px] mx-auto">
          <div className="inline-flex items-center gap-2 text-teal-accent font-mono text-[10px] uppercase tracking-widest mb-4">
            <span className="w-5.5 h-[1px] bg-teal-accent"></span>
            CLINICAL DIAGNOSIS
          </div>
          <h2 className="font-serif text-[clamp(34px,4.5vw,56px)] font-medium text-t1 leading-none mb-5 max-w-[700px]">
            Four structural <span className="text-red-accent not-italic italic">emergencies</span> draining your revenue every day.
          </h2>
          <p className="font-sans text-lg font-light text-tm max-w-[600px] leading-relaxed mb-16">
            None of these failures are your fault. The system was not built for someone with your combination of clinical authority and global digital reach. But they are your problem.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { 
                num: "01", 
                icon: "🩺", 
                title: "The Leaky Bucket", 
                desc: "Every time you post a video, you fill a bucket with the most valuable resource on the internet — qualified, intent-driven trust from an audience that chose to follow a medical professional. Then the bucket hits a dead-end link and every drop falls through the holes. The traffic was real. The demand was real. The revenue was invisible.",
                quote: "My last video hit 5 million views. I had 1,200 DMs in 48 hours. My bank account did not move a single dollar."
              },
              { 
                num: "02", 
                icon: "⚖️", 
                title: "The Geographic Prison", 
                desc: "Your medical licence is one of the most powerful professional credentials that exists. It is also, in digital terms, a prison. State licensing laws mean your clinical income cannot legally cross state lines — let alone oceans. Your content reaches forty countries. Your revenue is imprisoned in the same zip code as your parking space.",
                quote: "If only my followers in London and Sydney could legally pay me for the protocols I use in my clinic every day."
              },
              { 
                num: "03", 
                icon: "⚠️", 
                title: "The Liability Minefield", 
                desc: "Your DMs are not a community. They are an unmonitored, compliance-free zone where your medical licence is exposed to attack every hour. Every follower asking about symptoms. Every response — however careful — is a potential HIPAA violation. One wrong reply by a VA you trusted and you are facing a medical board investigation.",
                quote: "A VA sent a clinically specific response to a follower. Completely innocent in intent. I almost lost my licence over a $10/hr decision."
              },
              { 
                num: "04", 
                icon: "🔥", 
                title: "The Burnout Spiral", 
                desc: "You are working 60 clinical hours per week while simultaneously running an unpaid second full-time job creating content for platforms that collect all advertising revenue while you do all the intellectual labour. Your income is still 100% linear. Nothing compounds. Nothing builds while you sleep. The machine was designed to keep you running.",
                quote: "I did not survive a decade of medical training to spend my days off filming videos for an algorithm that does not pay me."
              }
            ].map((diag, idx) => (
              <div key={idx} className="bg-bg4/40 border border-b2 hover:border-teal-accent/35 rounded-2xl p-8 lg:p-10 relative flex flex-col justify-between hover:bg-bg4/75 hover:shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(13,245,196,0.05)] transition-all duration-300">
                <div className="font-serif text-[76px] font-extralight text-tg absolute top-5 right-7 leading-none select-none opacity-40">
                  {diag.num}
                </div>
                <div>
                  <div className="w-11 h-11 rounded-xl bg-bg1 flex items-center justify-center text-xl mb-6 shadow-inner border border-b1">
                    {diag.icon}
                  </div>
                  <h3 className="font-serif text-2xl font-normal text-t1 mb-4">{diag.title}</h3>
                  <p className="text-[14px] text-tm leading-relaxed mb-6 font-light">{diag.desc}</p>
                </div>
                <div className="mt-4 p-5 bg-bg5/40 border-l-2 border-l-red-accent rounded-r-xl font-sans text-[13px] italic text-[#8B9BB4] leading-relaxed relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-red-accent/5 rounded-full blur-xl pointer-events-none"></div>
                  "{diag.quote}"
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. COST OF INACTION (REAL-TIME LOSS AND BLEED CALCULATION) */}
      <section id="inaction" className="py-24 px-5 bg-bg2 relative">
        <div className="max-w-[1160px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-teal-accent font-mono text-[10px] uppercase tracking-widest mb-4 mx-auto justify-center">
            <span className="w-5.5 h-[1px] bg-teal-accent"></span>
            THE COST OF INACTION
          </div>
          <h2 className="font-serif text-[clamp(34px,4.5vw,56px)] font-medium text-t1 leading-none mb-5 max-w-[700px] mx-auto">
            Every day you wait, the damage <span className="text-red-accent not-italic font-semibold">compounds.</span>
          </h2>
          <p className="font-sans text-lg font-light text-tm max-w-[600px] leading-relaxed mb-12 mx-auto">
            This is not a business problem that holds still while you consider your options. It gets measurably worse every day. Here is the conservative arithmetic.
          </p>

          {/* DYNAMIC BLEED COUNT PANEL */}
          <div className="border border-red-accent/35 bg-red-d/30 rounded-2xl p-6 md:p-10 max-w-[640px] mx-auto mb-14 shadow-[0_15px_40px_rgba(255,62,85,0.08)] text-center relative overflow-hidden group warning-card-glow">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-red-accent/40"></div>
            <div className="font-mono text-xs uppercase tracking-widest text-red-accent mb-4 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-accent animate-ping"></span>
              REVENUE LOST SINCE YOU OPENED THIS PAGE
            </div>
            
            <div className="font-mono text-[42px] md:text-[54px] font-bold text-red-accent leading-none mb-3">
              ${accumulatedLoss.toFixed(2)}
            </div>

            <div className="font-mono text-[10px] uppercase tracking-wider text-tm">
              ${(dailyRevenueLost / 1440).toFixed(2)}/minute &middot; Running Live &middot; ${dailyRevenueLost.toLocaleString()}/day baseline loss
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-[1000px] mx-auto">
            <div className="bg-bg3 border border-b2 hover:border-red-accent/25 rounded-xl p-8 flex flex-col justify-between transition-all duration-300">
              <div>
                <div className="font-mono text-[28px] font-bold text-red-accent mb-2">
                  ${dailyRevenueLost.toLocaleString()}
                </div>
                <div className="font-serif text-[17px] text-t1 font-medium mb-3">
                  Lost every day the system is missing
                </div>
              </div>
              <p className="text-[13px] text-tm leading-relaxed mt-2 font-light">
                Based on your follower count of {followers.toLocaleString()} with a conservative {convRate}% conversion rate — well below the 0.1–0.5% industry standard for medical professionals.
              </p>
            </div>

            <div className="bg-bg3 border border-b2 hover:border-amb-accent/25 rounded-xl p-8 flex flex-col justify-between transition-all duration-300">
              <div>
                <div className="font-mono text-[28px] font-bold text-amb-accent mb-2">
                  Zero
                </div>
                <div className="font-serif text-[17px] text-t1 font-medium mb-3">
                  Audience Ownership Guarantee
                </div>
              </div>
              <p className="text-[13px] text-tm leading-relaxed mt-2 font-light">
                Every follower you have built is rented from Big Tech — not owned by you. One algorithm swing, shadowban, or policy modification and your audience can disappear in 48 hours.
              </p>
            </div>

            <div className="bg-bg3 border border-b2 hover:border-teal-accent/25 rounded-xl p-8 flex flex-col justify-between transition-all duration-300">
              <div>
                <div className="font-mono text-[28px] font-bold text-t1 mb-2">
                  5 Days
                </div>
                <div className="font-serif text-[17px] text-t1 font-medium mb-3">
                  Clinic Hours Ceiling Permanent
                </div>
              </div>
              <p className="text-[13px] text-tm leading-relaxed mt-2 font-light">
                If nothing changes structurally, trading clinical hours for cash remains the permanent blueprint of your life. The path to leverage requires exactly one compliance-first change.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. BEFORE / AFTER STATE TRANSFORMATION */}
      <section id="transform" className="py-24 px-5 bg-bg3 border-y border-b2/40 relative">
        <div className="max-w-[1160px] mx-auto">
          <div className="inline-flex items-center gap-2 text-teal-accent font-mono text-[10px] uppercase tracking-widest mb-4">
            <span className="w-5.5 h-[1px] bg-teal-accent"></span>
            THE TRANSFORMATION
          </div>
          <h2 className="font-serif text-[clamp(34px,4.5vw,56px)] font-medium text-t1 leading-none mb-12">
            Where you are now.<br />Where you <em className="text-teal-accent not-italic">will be.</em>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Current State */}
            <div className="bg-bg2 border border-red-accent/15 rounded-xl overflow-hidden shadow-lg flex flex-col justify-between hover:border-red-accent/25 transition-all duration-300">
              <div className="bg-red-accent/10 text-red-accent border-b border-b2 px-6 py-4 font-mono text-[10px] uppercase tracking-widest font-semibold flex items-center gap-2">
                <AlertCircle size={14} />
                CURRENT STATE &middot; THE BURNT CAREGIVER
              </div>
              <div className="p-8 flex-1">
                <p className="text-[13px] italic text-[#7A8A9E] leading-relaxed mb-6 font-light">
                  You entered medicine to heal people and build a great life. The system turned you into an exhausted, underpaid content creator for platforms that do not know your name.
                </p>
                <ul className="space-y-4">
                  {[
                    "60 clinical hours per week — every hour still traded directly for money",
                    "Second unpaid job creating content for Big Tech ad revenue",
                    "95% of your global audience disappears every day, revenue uncaptured",
                    "DMs flooded with patients you cannot legally help, charge, or redirect",
                    "Medical licence exposed to regulatory risk inside an unarchitectured inbox",
                    "Watching unqualified influencers charge $10,000 for advice worth far less than yours",
                    "Missing family time because the content treadmill stops for nothing",
                    "Financial freedom stays something you read about, not something you live"
                  ].map((item, idx) => (
                    <li key={idx} className="flex gap-3 text-[12px] text-[#7A8A9E] leading-relaxed items-start font-light">
                      <XCircle size={14} className="text-red-accent shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Desired State */}
            <div className="bg-bg2 border border-teal-accent/15 rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(13,245,196,0.03)] flex flex-col justify-between hover:border-teal-accent/25 transition-all duration-300">
              <div className="bg-teal-accent/10 text-teal-accent border-b border-b2 px-6 py-4 font-mono text-[10px] uppercase tracking-widest font-semibold flex items-center gap-2">
                <HeartPulse size={14} />
                DESIRED STATE &middot; THE DIGITAL MEDICAL ENTREPRENEUR
              </div>
              <div className="p-8 flex-1">
                <p className="text-[13px] italic text-teal-accent/70 leading-relaxed mb-6 font-light">
                  Your clinical expertise scales globally. Your income no longer requires your physical presence. Medicine becomes a choice you make, not a trap you survive.
                </p>
                <ul className="space-y-4">
                  {[
                    "Waking up to passive income notifications — money made while you slept",
                    "Clinic reduced to 2 days per week — because you love medicine, not because you need it",
                    "A global paying community generating $9,900+ per month in recurring income",
                    "AI handling all community questions around the clock — zero manual involvement",
                    "A legally protected digital campus shielding your licence while generating income",
                    "Your entire audience owned — on a platform no algorithm can delete",
                    "High-ticket backend closing $5,000+ premium clients automatically",
                    "Peers asking how you built it — and meaning it as the highest compliment"
                  ].map((item, idx) => (
                    <li key={idx} className="flex gap-3 text-[12px] text-teal-accent leading-relaxed items-start font-light">
                      <CheckCircle2 size={14} className="text-teal-accent shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. THE DIFFERENCE CARD / TREATMENT INTRO */}
      <section id="solution" className="py-24 px-5 bg-bg2">
        <div className="max-w-[1160px] mx-auto">
          <div className="inline-flex items-center gap-2 text-teal-accent font-mono text-[10px] uppercase tracking-widest mb-4">
            <span className="w-5.5 h-[1px] bg-teal-accent"></span>
            THE TREATMENT
          </div>
          <h2 className="font-serif text-[clamp(34px,4.5vw,56px)] font-medium text-t1 leading-none mb-6">
            You do not need more followers.<br />You need the <em className="text-teal-accent not-italic font-semibold">architecture</em> that monetises the ones you have.
          </h2>
          <p className="font-sans text-lg font-light text-tm max-w-[600px] leading-relaxed mb-16">
            Most practitioners have tried the obvious fixes. Local SEO ads. A VA. Basic email lists. None of it works because none of it addresses your specific problem — which is not a marketing problem. It is a compliance architecture problem.
          </p>

          <div className="bg-bg3 border border-teal-accent/15 rounded-2xl p-8 md:p-12 max-w-[800px] mx-auto shadow-[0_0_60px_rgba(0,0,0,0.5),0_0_30px_rgba(13,245,196,0.03)] hover:border-teal-accent/25 transition-all duration-300">
            <div className="font-mono text-[11px] uppercase tracking-widest text-teal-accent mb-4">
              THE DIGITAL ICU DIFFERENCE
            </div>
            <p className="font-serif text-[24px] md:text-[28px] font-medium text-t1 leading-normal mb-8">
              "Other agencies promise to get you more followers. We build the automated architecture that extracts $60,000 a year from the followers you already have — without you lifting a finger."
            </p>

            <div className="divide-y divide-b2/20">
              {[
                { old: "Local SEO and Google ads", new: "Global audience monetisation architecture" },
                { old: "More views and followers", new: "Revenue extraction from existing followers" },
                { old: "Generic marketing language", new: "Compliance-First Education Infrastructure" },
                { old: "Manual VAs and basic tools", new: "AI-automated 8-skill system with compliance layer" },
                { old: "Local patient foot traffic", new: "Borderless global MRR subscriptions" }
              ].map((row, idx) => (
                <div key={idx} className="flex items-center py-4.5 text-[13px] gap-4 hover:bg-bg4/35 px-2 rounded-lg transition-colors">
                  <div className="flex-1 text-tm line-through opacity-50 truncate font-light">{row.old}</div>
                  <div className="font-mono text-[9px] text-teal-accent tracking-widest uppercase shrink-0">VS</div>
                  <div className="flex-1 text-t2 font-medium truncate">{row.new}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 11. TREATMENT PROTOCOLS (THE 8 INTEGRATED SKILLS) */}
      <section id="skills" className="py-24 px-5 bg-bg3 border-y border-b1">
        <div className="max-w-[1160px] mx-auto">
          <div className="inline-flex items-center gap-2 text-teal-accent font-mono text-[10px] uppercase tracking-widest mb-4">
            <span className="w-5.5 h-[1px] bg-teal-accent"></span>
            TREATMENT PROTOCOL
          </div>
          <h2 className="font-serif text-[clamp(34px,4.5vw,56px)] font-medium text-t1 leading-none mb-6">
            The 8-Skill System.<br /><em className="text-teal-accent not-italic">Built to stop the bleed.</em>
          </h2>
          <p className="font-sans text-lg font-light text-tm max-w-[600px] leading-relaxed mb-16">
            This is not a collection of tools. It is a single integrated infrastructure where every component connects to the next. Remove one piece and the system breaks. Together, they form the only compliance-first digital monetisation architecture designed for licensed medical professionals.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { num: "SKILL 01", title: "Traffic Trapdoor", desc: "A precision lead magnet pulling followers off rented platforms onto a private email list you own permanently. Target: 500+ qualified out-of-state leads in 30 days." },
              { num: "SKILL 02", title: "Behavioural Email Flows", desc: "Seven automated trust-building sequences that deliver clinical authority and convert cold followers into paying community members — 24 hours a day, zero input from you." },
              { num: "SKILL 03", title: "Newsletter-as-a-Service", desc: "You record one 10-minute voice note. Our AI captures your exact clinical voice and publishes a polished weekly newsletter. Zero writing. Zero editing. Zero time." },
              { num: "SKILL 04", title: "Borderless Skool Campus", desc: "A gated, paid global health education community legally structured as general educational content — bypassing state licensing restrictions. Every member pays $99/month." },
              { num: "SKILL 05", title: "Compliance-First Legal Gates", desc: "Legally vetted, HIPAA-safe educational disclaimers and waivers installed before any member enters. Transforms you from a liable practitioner into a globally protected health educator." },
              { num: "SKILL 06", title: "AI Support Chatbot", desc: "A custom AI assistant trained on your protocols, philosophy, and voice. Handles every routine member question around the clock. You never manually reply to an out-of-state message again." },
              { num: "SKILL 07", title: "AI Hook Engineering", desc: "AI analyses your highest-performing content and engineers optimised hooks for future videos. Your existing filming schedule produces compounding top-of-funnel traffic automatically." },
              { num: "SKILL 08", title: "High-Ticket Backend", desc: "A $5,000–$10,000 consulting or masterclass programme converting your top 5% of community members into high-margin private clients — with a VSL and application funnel doing all the selling." }
            ].map((skill, idx) => (
              <div 
                key={idx} 
                className="bg-bg4/40 border border-b2 rounded-2xl p-6 hover:border-teal-accent/35 hover:bg-bg4/75 hover:shadow-[0_15px_40px_-15px_rgba(13,245,196,0.06)] hover:-translate-y-1 relative overflow-hidden group transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-teal-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="font-mono text-[10px] text-teal-accent tracking-widest mb-3 relative z-10">{skill.num}</div>
                <h3 className="font-serif text-[19px] font-semibold text-t1 mb-2 relative z-10">{skill.title}</h3>
                <p className="text-[12.5px] text-tm leading-relaxed relative z-10 font-light">{skill.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. DYNAMIC INTERACTIVE ROI CALCULATOR */}
      <section id="calc" className="py-24 px-5 bg-bg2">
        <div className="max-w-[1160px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-teal-accent font-mono text-[10px] uppercase tracking-widest mb-4 mx-auto justify-center">
            <span className="w-5.5 h-[1px] bg-teal-accent"></span>
            YOUR REVENUE DIAGNOSTIC
          </div>
          <h2 className="font-serif text-[clamp(34px,4.5vw,56px)] font-medium text-t1 leading-none mb-5 max-w-[700px] mx-auto">
            Calculate your <em className="text-teal-accent not-italic">exact</em> daily bleed rate.
          </h2>
          <p className="font-sans text-lg font-light text-tm max-w-[600px] leading-relaxed mb-16 mx-auto">
            Input your numbers. See what you are actually losing. The calculation uses a 0.04% conversion rate — well below the 0.1–0.5% industry average.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-[960px] mx-auto text-left">
            {/* Range Controls */}
            <div className="bg-bg3 border border-teal-accent/15 rounded-3xl p-8 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(13,245,196,0.01)] hover:border-teal-accent/25 transition-all duration-300">
              <div className="space-y-6">
                {/* Control 1: Followers */}
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-tm mb-2.5 flex justify-between">
                    <span>Follower Count</span>
                    <span className="text-t1 text-xs font-semibold">{followers.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min={50000} 
                    max={1000000} 
                    step={10000} 
                    value={followers}
                    onChange={(e) => setFollowers(Number(e.target.value))}
                    className="w-full h-[3px] bg-bg5 rounded-lg appearance-none cursor-pointer accent-teal-accent focus:outline-none"
                  />
                </div>

                {/* Control 2: Conversion Rate */}
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-tm mb-2.5 flex justify-between">
                    <span>Conversion Rate</span>
                    <span className="text-t1 text-xs font-semibold">{convRate.toFixed(2)}%</span>
                  </div>
                  <input 
                    type="range" 
                    min={0.02} 
                    max={0.50} 
                    step={0.01} 
                    value={convRate}
                    onChange={(e) => setConvRate(Number(e.target.value))}
                    className="w-full h-[3px] bg-bg5 rounded-lg appearance-none cursor-pointer accent-teal-accent focus:outline-none"
                  />
                </div>

                {/* Control 3: Price */}
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-tm mb-2.5 flex justify-between">
                    <span>Monthly Subscription Fee</span>
                    <span className="text-t1 text-xs font-semibold">${monthlyPrice}</span>
                  </div>
                  <input 
                    type="range" 
                    min={49} 
                    max={199} 
                    step={5} 
                    value={monthlyPrice}
                    onChange={(e) => setMonthlyPrice(Number(e.target.value))}
                    className="w-full h-[3px] bg-bg5 rounded-lg appearance-none cursor-pointer accent-teal-accent focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-b2/20">
                <div className="font-mono text-[10px] text-center text-teal-accent uppercase tracking-wider mb-3">
                  Recommended Strategy: Tier {recommendedTier} &mdash; {
                    recommendedTier === 1 ? "Global Capture Foundation" : recommendedTier === 2 ? "Borderless MRR Campus" : "Global Authority Empire"
                  }
                </div>
                <button 
                  onClick={handleOpenCalendly}
                  className="w-full bg-teal-accent text-bg1 font-sans text-sm font-semibold py-4 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-teal-accent/20"
                  id="calc-cta-btn"
                >
                  Begin Tier {recommendedTier} Admission
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>

            {/* Simulated Live Outputs */}
            <div className="bg-bg3 border border-teal-accent/15 rounded-3xl p-8 divide-y divide-b2/25 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(13,245,196,0.01)] hover:border-teal-accent/25 transition-all duration-300">
              <div className="space-y-4 divide-y divide-b2/20 flex-1">
                <div className="flex justify-between items-center py-2 text-sm">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-tm">Community Members</span>
                  <span className="font-mono text-t1 font-semibold">{members.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-4 text-sm">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-tm">Monthly MRR</span>
                  <span className="font-mono text-t1 font-semibold">${mrr.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-4 text-sm">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-tm">Annual Community Income</span>
                  <span className="font-mono text-t1 font-semibold">${annualCommunityIncome.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-4 text-sm">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-tm">High-Ticket Estimate (5% Ascension)</span>
                  <span className="font-mono text-tm font-medium">${highTicketEstimate.toLocaleString()}/yr est.</span>
                </div>
                <div className="flex justify-between items-center py-4 text-sm">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-tm">Total Annual Digital Revenue</span>
                  <span className="font-mono text-teal-accent font-bold text-lg">${totalAnnualRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-4 text-sm">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-red-accent font-medium">Daily Revenue Lost Right Now</span>
                  <span className="font-mono text-red-accent font-bold">${dailyRevenueLost.toLocaleString()}/day</span>
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center text-xs text-tm font-mono">
                <span>BREAK-EVEN TARGET</span>
                <span className="text-t1 font-medium">{breakEvenMembers} MEMBERS (${(breakEvenMembers * monthlyPrice).toLocaleString()}/mo MRR)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 13. TIERING / PACKAGES (WITH COMPLIANCE REASSURANCES) */}
      <section id="tiers" className="py-24 px-5 bg-bg3 border-y border-b1">
        <div className="max-w-[1160px] mx-auto">
          <div className="inline-flex items-center gap-2 text-teal-accent font-mono text-[10px] uppercase tracking-widest mb-4">
            <span className="w-5.5 h-[1px] bg-teal-accent"></span>
            TREATMENT PLANS
          </div>
          <h2 className="font-serif text-[clamp(34px,4.5vw,56px)] font-medium text-t1 leading-none mb-6">
            Three admission <em className="text-teal-accent not-italic">tiers.</em><br />One outcome: financial health.
          </h2>
          <p className="font-sans text-lg font-light text-tm max-w-[600px] leading-relaxed mb-16">
            Every tier is fully done-for-you. You build nothing, write nothing, and operate nothing. We execute 100% of the architecture while you focus on your patients.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* TIER 1 */}
            <div className="bg-bg2 border border-b1 rounded-2xl p-8 relative flex flex-col justify-between">
              <div>
                <div className="font-mono text-[10px] text-tm uppercase tracking-wider mb-2">TIER 1 &mdash; ADMISSION</div>
                <h3 className="font-serif text-[28px] font-medium text-t1 leading-snug mb-3">Global Capture Foundation</h3>
                <p className="text-sm font-light text-tm leading-relaxed min-h-[48px] mb-6">
                  For clinic owners with a massive global following and zero digital infrastructure. Plug the traffic leak in 30 days.
                </p>
                <div className="flex items-baseline gap-1.5 mb-8">
                  <span className="font-serif text-[52px] font-medium text-t1 leading-none">$2,500</span>
                  <span className="text-sm text-tm">/ month</span>
                </div>

                <div className="border-t border-b1 pt-6">
                  <ul className="space-y-4">
                    {[
                      "Traffic Trapdoor Lead Magnet — 500+ out-of-state leads in 30 days",
                      "Behavioural Email Nurture Flows — fully automated, zero input",
                      "Newsletter-as-a-Service Engine — AI clones your exact clinical voice",
                      "Geographic Bounce Tracker — live daily revenue leak data",
                      "Liability Shield Disclaimers — legal protection active day one"
                    ].map((li, idx) => (
                      <li key={idx} className="flex gap-2.5 text-[13px] text-tm leading-normal items-start">
                        <span className="w-4 h-4 rounded bg-teal-10 border border-teal-18 text-teal-accent flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold">✓</span>
                        <span>{li}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8">
                <div className="p-4 bg-teal-accent/5 border border-teal-accent/15 rounded-xl text-xs text-teal-accent leading-relaxed mb-5 font-light">
                  <strong>Guarantee:</strong> If fewer than 300 qualified out-of-state leads in 30 days, we manage your infrastructure free until achieved.
                </div>
                <button 
                  onClick={handleOpenCalendly}
                  className="w-full text-center bg-transparent hover:bg-bg3 border border-b3 hover:border-teal-accent text-tm hover:text-t1 font-sans text-sm font-medium py-3.5 rounded-lg transition-all cursor-pointer"
                  id="tier-1-btn"
                >
                  Begin Tier 1 Admission &rarr;
                </button>
              </div>
            </div>

            {/* TIER 2 (FEATURED) */}
            <div className="bg-bg2 border border-teal-accent/40 rounded-2xl p-8 relative flex flex-col justify-between shadow-[0_20px_50px_rgba(0,201,167,0.07)]">
              <span className="absolute top-5 right-5 bg-teal-accent text-bg1 font-mono text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                MOST POPULAR
              </span>
              <div>
                <div className="font-mono text-[10px] text-teal-accent uppercase tracking-wider mb-2">TIER 2 &mdash; TREATMENT</div>
                <h3 className="font-serif text-[28px] font-medium text-t1 leading-snug mb-3">Borderless MRR Campus</h3>
                <p className="text-sm font-light text-tm leading-relaxed min-h-[48px] mb-6">
                  For visionary practitioners ready to generate high-margin monthly recurring revenue from their global audience. Full 8-skill deployment in 60 days.
                </p>
                <div className="flex items-baseline gap-1.5 mb-8">
                  <span className="font-serif text-[52px] font-medium text-t1 leading-none">$4,500</span>
                  <span className="text-sm text-tm">/ month</span>
                </div>

                <div className="border-t border-b1 pt-6">
                  <ul className="space-y-4">
                    {[
                      "Everything in Tier 1 — fully deployed and operational",
                      "Borderless Skool Community — built, structured, and launched",
                      "Compliance-First Legal Gates — HIPAA-safe waivers and disclaimers",
                      "AI Support Chatbot — trained on your protocols and voice",
                      "AI Hook Engineering — data-driven content reach amplification",
                      "Sales Conversion Email Campaigns — continuous automated revenue"
                    ].map((li, idx) => (
                      <li key={idx} className="flex gap-2.5 text-[13px] text-tm leading-normal items-start">
                        <span className="w-4 h-4 rounded bg-teal-10 border border-teal-18 text-teal-accent flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold">✓</span>
                        <span>{li}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8">
                <div className="p-4 bg-teal-accent/5 border border-teal-accent/15 rounded-xl text-xs text-teal-accent leading-relaxed mb-5 font-light">
                  <strong>Guarantee:</strong> If $3,000 MRR not reached in 60 days, we waive our full retainer until that milestone is achieved.
                </div>
                <button 
                  onClick={handleOpenCalendly}
                  className="w-full text-center bg-teal-accent text-bg1 font-sans text-sm font-bold py-3.5 rounded-lg hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-teal-accent/20"
                  id="tier-2-btn"
                >
                  Begin Tier 2 Admission &rarr;
                </button>
              </div>
            </div>

            {/* TIER 3 */}
            <div className="bg-bg2 border border-b2 rounded-2xl p-8 relative flex flex-col justify-between hover:border-teal-accent/25 transition-all duration-300">
              <div>
                <div className="font-mono text-[10px] text-tm uppercase tracking-wider mb-2">TIER 3 &mdash; FULL RECOVERY</div>
                <h3 className="font-serif text-[28px] font-medium text-t1 leading-snug mb-3">Global Authority Empire</h3>
                <p className="text-sm font-light text-tm leading-relaxed min-h-[48px] mb-6">
                  For elite practitioners demanding maximum financial leverage. Full MRR infrastructure plus a premium high-ticket programme.
                </p>
                <div className="flex items-baseline gap-1.5 mb-8">
                  <span className="font-serif text-[52px] font-medium text-t1 leading-none">$7,500</span>
                  <span className="text-sm text-tm">/ month</span>
                </div>

                <div className="border-t border-b2/20 pt-6">
                  <ul className="space-y-4">
                    {[
                      "Everything in Tiers 1 and 2 — fully deployed",
                      "High-Ticket Backend Architecture — $5,000–$10,000 programme",
                      "Video Sales Letter (VSL) Scripting — emotionally engineered",
                      "Application Funnel — filters unqualified global leads automatically",
                      "Revenue Attribution Dashboard — live MRR tracking",
                      "High-Ticket Ascension Email Flow — automated premium upsell"
                    ].map((li, idx) => (
                      <li key={idx} className="flex gap-2.5 text-[13px] text-tm leading-normal items-start font-light">
                        <span className="w-4 h-4 rounded bg-teal-accent/10 border border-teal-accent/20 text-teal-accent flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold">✓</span>
                        <span>{li}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8">
                <div className="p-4 bg-teal-accent/5 border border-teal-accent/15 rounded-xl text-xs text-teal-accent leading-relaxed mb-5 font-light">
                  <strong>Guarantee:</strong> $3K MRR in 60 days AND 2 high-ticket sales at $5,000+ in 90 days, or we work at no charge until delivered.
                </div>
                <button 
                  onClick={handleOpenCalendly}
                  className="w-full text-center bg-transparent hover:bg-bg3 border border-b2 hover:border-teal-accent text-tm hover:text-t1 font-sans text-sm font-medium py-3.5 rounded-lg transition-all cursor-pointer"
                  id="tier-3-btn"
                >
                  Begin Tier 3 Admission &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 14. TIMELINE FLOW */}
      <section id="timeline" className="py-24 px-5 bg-bg2">
        <div className="max-w-[1160px] mx-auto">
          <div className="inline-flex items-center gap-2 text-teal-accent font-mono text-[10px] uppercase tracking-widest mb-4">
            <span className="w-5.5 h-[1px] bg-teal-accent"></span>
            RECOVERY TIMELINE
          </div>
          <h2 className="font-serif text-[clamp(34px,4.5vw,56px)] font-medium text-t1 leading-none mb-6">
            From flatline to <em className="text-teal-accent not-italic">full health.</em><br />In 30 days.
          </h2>
          <p className="font-sans text-lg font-light text-tm max-w-[600px] leading-relaxed mb-16">
            We require one hour per week from you. Every system is built, tested, and launched by our team while you continue seeing patients.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 bg-bg3/50 border border-b2 rounded-2xl overflow-hidden divide-y md:divide-y-0 lg:divide-x divide-b2/20">
            {[
              { num: "1", week: "WEEK 1", title: "Audit & Architecture", desc: "Full Leaky Bucket diagnostic. Skool campus setup, legal waivers installed, HIPAA disclaimers active, existing content mapped to community modules. You attend one 45-minute onboarding call." },
              { num: "2", week: "WEEK 2", title: "AI Systems Deployed", desc: "Custom AI chatbot trained on your protocols and voice. 7-email welcome sequence deployed. Member onboarding journey built. All automations tested end-to-end before a single follower sees the system." },
              { num: "3", week: "WEEK 3", title: "Soft Launch", desc: "Top 10 content pieces migrated into the community library. Launch announcement published across your existing channels. Target: 60 paying members at $99/month — immediate break-even on your entire investment." },
              { num: "4", week: "WEEK 4", title: "Revenue Dashboard Live", desc: "You see your live MRR dashboard for the first time. Top 5% most engaged members identified as high-ticket candidates. Ascension sequence activated. Referral flywheel started. System now runs without you." }
            ].map((step, idx) => (
              <div key={idx} className="p-8 relative min-h-[260px] flex flex-col justify-between hover:bg-bg4/20 transition-all duration-300">
                <div className="font-serif text-[84px] font-light text-tg absolute bottom-4 right-5 leading-none select-none opacity-20">
                  {step.num}
                </div>
                <div>
                  <div className="font-mono text-[10px] text-teal-accent tracking-widest uppercase mb-2.5">{step.week}</div>
                  <h3 className="font-serif text-[21px] font-semibold text-t1 mb-3.5 leading-snug">{step.title}</h3>
                  <p className="text-[13px] text-tm leading-relaxed relative z-10 font-light">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 15. CLINICAL FAQ ACCORDIONS */}
      <section id="faq" className="py-24 px-5 bg-bg3 border-y border-b2/40">
        <div className="max-w-[800px] mx-auto">
          <div className="inline-flex items-center gap-2 text-teal-accent font-mono text-[10px] uppercase tracking-widest mb-4 mx-auto justify-center w-full">
            <span className="w-5.5 h-[1px] bg-teal-accent"></span>
            CLINICAL REBUTTALS
          </div>
          <h2 className="font-serif text-[clamp(34px,4.5vw,56px)] font-medium text-t1 leading-none mb-5 text-center">
            Common hesitations.<br /><em className="text-teal-accent not-italic">Clinical answers.</em>
          </h2>
          <p className="font-sans text-lg font-light text-tm text-center leading-relaxed mb-12">
            Every concern you have right now has been raised by every physician before you.
          </p>

          <div className="border border-b2 rounded-2xl overflow-hidden divide-y divide-b2/30">
            {[
              { 
                q: "I cannot give medical advice online. One wrong interaction and I face a board investigation or HIPAA violation.", 
                a: "Correct — and that is precisely why your current unarchitectured DMs are the actual liability. You are already exposed every single day with no legal framework. We build a legally distinct parallel business. The community is gated as General Health Education — not personalised medical advice — with education-only waivers and HIPAA-safe disclaimers reviewed by medical compliance specialists. You move from dangerously exposed to legally shielded and financially productive." 
              },
              { 
                q: "I already work 60 hours a week. I have no bandwidth to manage a community or write newsletters.", 
                a: "This is a Negative Work architecture — we are not adding tasks. We are eliminating the hours you currently waste reading DMs you cannot legally answer. Your AI chatbot handles all community questions around the clock. The AI newsletter engine publishes from a 10-minute voice note you record during your commute. Your total new weekly commitment is under one hour. In exchange, those drained hours become owned, revenue-generating infrastructure." 
              },
              { 
                q: "My medical colleagues will see this and think I have gone commercial. It could damage my reputation.", 
                a: "Charging a premium for access to your expertise does not damage your credibility — it elevates your standard of care. You currently provide world-class clinical education to millions of people at zero cost. That audience takes zero action and pays you zero compensation. A paid community filters out passive browsers and validates your knowledge. This is the exact model used by Mayo Clinic and Cleveland Clinic. Your peers will ask how you built it." 
              },
              { 
                q: "I tried hiring a VA to help with my digital presence before and it created more legal risk.", 
                a: "What you attempted was patchwork — a single hired task with no compliance architecture, no legal framework, and no connected revenue system. A VA answering DMs is a liability with a monthly invoice. This system integrates all eight components as a single connected infrastructure. Legal gates are installed before any follower reaches any part of the system. The failure was the approach entirely, not the idea." 
              },
              { 
                q: "What if I do not hit the guaranteed targets? What happens?", 
                a: "Each tier carries a specific, legally worded guarantee. Tier 1: if fewer than 300 qualified leads are captured in 30 days, we manage your infrastructure free until that milestone is reached. Tier 2: if $3,000 MRR is not generated in 60 days, we waive our retainer until achieved. Tier 3: if $3K MRR and two $5,000+ high-ticket sales are not generated in 90 days, we continue working at no charge until both milestones are delivered. The risk sits with us, not you." 
              },
              { 
                q: "How much time does this actually require from me each week?", 
                a: "One hour per week. You record an unstructured voice note during your commute or between patients. Our AI converts that into your polished weekly newsletter. You attend no meetings, write no content, answer no DM, and manage no community. Everything else is built, operated, and optimised by our team. You continue seeing patients exactly as before — while the system generates revenue in the background." 
              },
              { 
                q: "What is Skool and why is it used instead of a custom platform?", 
                a: "Skool is a leading gated community platform used by top creators globally. We use it because it is legally structured as a general education platform — which is the critical distinction that allows practitioners to monetise global audiences without violating state licensing laws. It handles payment processing, member management, and content delivery. Building a custom platform would add six to twelve months of development time and create unnecessary technical complexity. Skool is the fastest, most legally sound path to your first MRR dollar." 
              },
              { 
                q: "What type of practitioner is the ideal client for this system?", 
                a: "The ideal client is an independent clinic owner, functional medicine practitioner, MedSpa director, or cash-pay physician with a minimum of 50,000 followers on at least one social media platform and a clinic booking link as their only bio CTA. If you have a large global audience and your current monetisation is zero, this system was built for exactly your situation. The higher your follower count, the faster the ROI — because the gap between your current $0 and the conservative projection is wider." 
              }
            ].map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="bg-bg2/60">
                  <button 
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left px-7 py-5.5 flex justify-between items-center gap-4.5 cursor-pointer focus:outline-none hover:bg-bg1/20 transition-colors"
                  >
                    <span className="font-sans text-[15px] font-medium text-t1 leading-relaxed">{faq.q}</span>
                    <span className="font-mono text-lg text-teal-accent shrink-0">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="px-7 pb-6 text-[14px] text-tm leading-relaxed bg-bg2/40 border-t border-b2/10 pt-4 font-light">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 16. CLIENT PERSONAS (ADMISSION PROFILES) */}
      <section id="personas" className="py-24 px-5 bg-bg2">
        <div className="max-w-[1160px] mx-auto">
          <div className="inline-flex items-center gap-2 text-teal-accent font-mono text-[10px] uppercase tracking-widest mb-4">
            <span className="w-5.5 h-[1px] bg-teal-accent"></span>
            ADMISSION PROFILES
          </div>
          <h2 className="font-serif text-[clamp(34px,4.5vw,56px)] font-medium text-t1 leading-none mb-6">
            Four types of practitioners<br />we <em className="text-teal-accent not-italic">treat.</em>
          </h2>
          <p className="font-sans text-lg font-light text-tm max-w-[600px] leading-relaxed mb-16">
            Each profile carries a distinct primary emergency. Each requires a different clinical framing. If you see yourself clearly in one of these, we already understand your specific situation.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
            {[
              { letter: "A", type: "BEST CLIENT &middot; PRIMARY TARGET", name: "The Geographically-Trapped Visionary", pain: "Cash-pay clinic owner. 100K–500K followers. Globally famous, locally imprisoned. DMs flood with patients in 40 countries. Viral dopamine followed by financial silence. The most acute Leaky Bucket case.", rx: "Prescription: 'Health-at-Scale' — geographic liberation through a compliant global education campus." },
              { letter: "B", type: "SECONDARY TARGET", name: "The Burnout-Driven FIRE Aspirant", pain: "Hospital physician. FIRE-movement devotee. Treats the medical degree as a cash engine for buying freedom. Paralysed by tech complexity. Drowning in insurance bureaucracy and EHR documentation.", rx: "Prescription: 'Digital real estate' — community subscriptions framed as monthly rent from an owned asset." },
              { letter: "C", type: "HIGHEST COMPLIANCE CONCERN", name: "The Ethical and Skeptical Sage", pain: "MD/PhD who went viral accidentally. Credibility is everything. Deeply suspicious of all commercial intent. Frozen by legal liability fears. Hangs up on any pitch that sounds like marketing.", rx: "Prescription: 'Compliance-First Education Infrastructure' — never a funnel, never a campaign, never an agency." },
              { letter: "D", type: "HIGH URGENCY PROFILE", name: "The Rebel Disruptor", pain: "Anti-establishment MD with a tribal following. Terrified of de-platforming. Depends entirely on algorithms he publicly condemns. No owned audience. Revenue collapses with every policy update.", rx: "Prescription: 'Digital sovereignty' — an uncancellable community that no algorithm or platform can touch." }
            ].map((persona, idx) => (
              <div key={idx} className="bg-bg3 border border-b2 rounded-2xl p-7 flex flex-col justify-between hover:border-teal-accent/20 transition-all duration-300">
                <div>
                  <div className="w-11 h-11 rounded-lg bg-teal-accent text-bg1 font-serif text-2xl font-bold flex items-center justify-center mb-6">
                    {persona.letter}
                  </div>
                  <div className="font-mono text-[9px] text-tm uppercase tracking-widest mb-2.5" dangerouslySetInnerHTML={{ __html: persona.type }}></div>
                  <h3 className="font-serif text-xl font-medium text-t1 mb-4 leading-tight">{persona.name}</h3>
                  <p className="text-[12.5px] text-tm leading-relaxed mb-6 font-light">{persona.pain}</p>
                </div>
                <div className="p-4 bg-teal-accent/5 border border-teal-accent/15 rounded-lg text-teal-accent text-[12px] leading-relaxed font-light">
                  {persona.rx}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 17. FINAL ACTION CTA (BOOK DIAGNOSTIC CALL) */}
      <section id="cta-final" className="py-28 px-5 bg-bg1 relative overflow-hidden text-center border-t border-b1">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-gradient-to-br from-teal-accent/10 to-transparent blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-[700px] mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 text-teal-accent font-mono text-[10px] uppercase tracking-widest mb-4">
            <span className="w-5.5 h-[1px] bg-teal-accent"></span>
            ADMIT YOUR BUSINESS TODAY
          </div>
          <h2 className="font-serif text-[clamp(40px,5.5vw,72px)] font-semibold text-t1 leading-[1.1] mb-6">
            Stop the <em className="text-red-accent not-italic font-bold">bleed.</em><br />Book your free diagnostic.
          </h2>
          <p className="font-sans text-lg font-light text-tm leading-relaxed mb-10 max-w-[560px] mx-auto">
            You already know the problem is real. You feel it every time a video goes viral and the bank account stays flat. We analyse your specific social media presence, calculate your exact Daily Bleed Rate, and present a precise treatment plan tailored to your audience size, niche, and current infrastructure. 30 minutes. Free. No pitch.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto justify-center">
            <button 
              onClick={handleOpenCalendly}
              className="flex-1 bg-teal-accent text-bg1 font-sans text-base font-bold px-8 py-4.5 rounded-lg hover:opacity-90 transform hover:-translate-y-0.5 transition-all cursor-pointer shadow-lg"
              id="final-cta-calendly"
            >
              Book Your Free Diagnostic &rarr;
            </button>
            <a 
              href={finalWhatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 border border-b3 hover:border-teal-accent text-t1 font-sans text-base font-semibold px-8 py-4.5 rounded-lg bg-bg3/50 hover:bg-bg3/90 transition-all flex items-center justify-center gap-2"
              id="final-cta-whatsapp"
            >
              <MessageSquare size={16} className="text-[#25D366]" />
              Chat on WhatsApp
            </a>
          </div>

          <div className="text-xs text-tm mt-4.5">No commitment required. No agency proposal. Just your numbers.</div>
          <div className="font-mono text-[10px] tracking-widest text-tg uppercase mt-10">
            WE ADMIT A MAXIMUM OF 4 NEW CLIENTS PER MONTH &mdash; AVAILABLE SLOTS THIS QUARTER ARE CLOSING
          </div>
        </div>
      </section>

      {/* 18. FOOTER */}
      <footer className="bg-bg3 border-t border-b1 py-12 px-5 text-center sm:text-left">
        <div className="max-w-[1160px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-[9px] text-none">
            <div className="w-[30px] h-[30px] bg-teal-accent rounded-md flex items-center justify-center font-mono text-[9px] font-medium text-bg1 tracking-wider">
              ICU
            </div>
            <span className="font-serif text-[18px] font-semibold text-tm tracking-wide">The Digital ICU</span>
          </div>

          <span className="font-mono text-[11px] uppercase tracking-wider text-tg">
            CRITICAL CARE FOR YOUR DIGITAL REVENUE &middot; EST. 2025
          </span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-tg">
            &copy; {new Date().getFullYear()} THE DIGITAL ICU &middot; ALL RIGHTS RESERVED
          </span>
        </div>
      </footer>

      {/* 19. FLOATING INSTRUMENT WIDGET (QUICK LINKS + STATUS) */}
      <div className="fixed bottom-6 right-6 z-150 flex flex-col gap-2.5 items-end">
        {/* Realtime Loss Indicator Pill */}
        <div className="bg-bg1/90 border border-b2 px-3 py-1.5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.5)] flex items-center gap-2 text-[10px] font-mono select-none backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-accent"></span>
          </span>
          <span className="text-red-accent font-semibold">${accumulatedLoss.toFixed(2)} LOST</span>
        </div>

        {/* Floating Dialer Expandable */}
        <div className="flex gap-2">
          {/* WhatsApp floating trigger */}
          <a 
            href={finalWhatsappUrl}
            target="_blank"
            rel="noreferrer"
            title="Chat live on WhatsApp"
            className="w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-lg transform hover:scale-105 transition-all cursor-pointer"
            id="floating-whatsapp-widget"
          >
            <Phone size={20} className="fill-white" />
          </a>

          {/* Calendly floating trigger */}
          <button 
            onClick={handleOpenCalendly}
            title="Book Diagnostic Call on Calendly"
            className="w-12 h-12 rounded-full bg-teal-accent text-bg1 flex items-center justify-center shadow-lg transform hover:scale-105 transition-all cursor-pointer"
            id="floating-calendly-widget"
          >
            <Calendar size={20} className="fill-bg1" />
          </button>
        </div>
      </div>

      {/* 20. BUILT-IN CALENDLY SCHEDULER MODAL (PERFECT FOR PREVIEW IFRAME COMPATIBILITY) */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-bg1 border border-b2 rounded-2xl w-full max-w-[900px] h-[90vh] flex flex-col overflow-hidden shadow-2xl relative"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-b1 bg-bg3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-accent"></span>
                  </span>
                  <span className="font-mono text-xs uppercase tracking-widest text-teal-accent">DIAGNOSTIC APPOINTMENT PORTAL</span>
                </div>
                <button 
                  onClick={() => setIsBookingModalOpen(false)}
                  className="text-tm hover:text-white p-1 hover:bg-bg4 rounded-md transition-all cursor-pointer"
                  id="btn-close-calendly-modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Booking Scheduler Content */}
              <div className="flex-1 bg-bg2 relative">
                {/* Fallback & Config Help Panel (Only visible if URL is clearly default or fake) */}
                <div className="absolute top-3 left-3 right-3 bg-teal-10 border border-teal-18 rounded-lg px-4 py-2.5 text-xs text-teal-accent flex items-center justify-between z-10 font-mono">
                  <div className="flex items-center gap-1.5">
                    <Activity size={14} className="animate-pulse" />
                    <span>Active target scheduling link: <strong className="text-white underline">{calendlyUrl}</strong></span>
                  </div>
                  <button 
                    onClick={() => {
                      setIsBookingModalOpen(false);
                      setIsControlPanelOpen(true);
                    }}
                    className="underline text-[10px] text-white hover:text-teal-accent font-bold"
                  >
                    CHANGE URL
                  </button>
                </div>

                {/* Built-in iframe for live booking inside standard workspace sandbox */}
                <iframe 
                  src={calendlyUrl}
                  width="100%" 
                  height="100%" 
                  frameBorder="0"
                  className="pt-12 bg-white"
                  title="Calendly Scheduler"
                ></iframe>
              </div>

              {/* Status bar */}
              <div className="px-6 py-3 border-t border-b1 bg-bg3 flex items-center justify-between font-mono text-[10px] text-tg uppercase">
                <span>The Digital ICU Automated Connector</span>
                <span className="text-teal-accent">LIVE LINK SECURED</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 21. VSL VIDEO MODAL FOR DEMONSTRATING CLINICAL AUDITS */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-bg1 border border-b2 rounded-2xl w-full max-w-[820px] aspect-video flex flex-col overflow-hidden shadow-2xl relative"
            >
              <button 
                onClick={() => setIsVideoModalOpen(false)}
                className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/80 p-2 rounded-full transition-all cursor-pointer z-50 border border-white/10"
                id="btn-close-vsl-modal"
              >
                <X size={16} />
              </button>

              {/* We provide a beautiful, clinical interactive diagnostic presentation that behaves like a real audit */}
              <div className="flex-1 flex flex-col items-center justify-center bg-bg2 p-10 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(rgba(0,201,167,0.04)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                
                <div className="max-w-md mx-auto relative z-10">
                  <div className="w-14 h-14 rounded-full bg-teal-accent/10 border border-teal-accent/20 text-teal-accent flex items-center justify-center mx-auto mb-6">
                    <HeartPulse size={26} className="animate-bounce" />
                  </div>
                  <h3 className="font-serif text-2xl font-medium text-t1 mb-3">Live Diagnostic Stream</h3>
                  <p className="text-xs text-tm font-mono mb-6 leading-relaxed uppercase tracking-wider">
                    SIMULATION STATUS: DIGITAL ICU AUDIT SEQUENCE INITIALIZED
                  </p>
                  
                  <div className="bg-bg3 border border-b2 rounded-lg p-5 text-left font-mono text-[11px] text-teal-accent mb-6 leading-relaxed space-y-2 max-h-[160px] overflow-y-auto">
                    <div>&gt; Loading medical-influencer top of funnel telemetry...</div>
                    <div>&gt; Followers count: {followers.toLocaleString()} identified.</div>
                    <div>&gt; Flatline revenue detected ($0 MRR captured).</div>
                    <div>&gt; Calculating clinical leakage: ${(dailyRevenueLost).toLocaleString()}/day bleed rate.</div>
                    <div className="text-red-accent animate-pulse">&gt; WARNING: State licensing border limits detected. HIPAA compliance gates missing.</div>
                    <div className="text-white">&gt; READY to route your custom scheduling links...</div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={() => {
                        setIsVideoModalOpen(false);
                        setIsBookingModalOpen(true);
                      }}
                      className="flex-1 bg-teal-accent text-bg1 font-sans text-xs font-bold py-3.5 rounded-lg hover:opacity-90 cursor-pointer"
                      id="vsl-book-btn"
                    >
                      BOOK DIAGNOSIS
                    </button>
                    <button 
                      onClick={() => setIsVideoModalOpen(false)}
                      className="flex-1 bg-transparent hover:bg-bg4 border border-b2 text-tm hover:text-white font-sans text-xs font-medium py-3.5 rounded-lg"
                    >
                      CONTINUE DIAGNOSIS
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
