import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Turnstile } from '@marsidev/react-turnstile';
import { 
  Calendar, User, Phone, CheckCircle2, ChevronRight, 
  ChevronLeft, Send, MapPin, Star, Gift 
} from 'lucide-react';

// --- COMPONENTS ---

const InputField = ({ label, icon: Icon, value, onChange, ...props }) => (
  <div className="mb-6">
    <label className="block text-zinc-500 text-[10px] mb-2 ml-1 uppercase tracking-[0.2em] font-bold">{label}</label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-blue-400 transition-colors">
        <Icon size={18} />
      </div>
      <input {...props} value={value} onChange={onChange}
        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:bg-white/[0.07] focus:border-blue-500/50 transition-all duration-300"
      />
    </div>
  </div>
);

const SelectionCard = ({ label, selected, onClick, multi = false }) => {
  const isSelected = multi ? selected.includes(label) : selected === label;
  return (
    <button type="button" onClick={onClick}
      className={`w-full p-4 rounded-xl border text-left transition-all duration-500 ${
        isSelected 
        ? 'bg-blue-600/20 border-blue-500/50 text-white shadow-[0_0_20px_rgba(59,130,246,0.2)]' 
        : 'bg-white/[0.02] border-white/5 text-zinc-500 hover:bg-white/5 hover:border-white/20'
      }`}
    >
      <div className="flex justify-between items-center">
        <span className="text-sm tracking-wide">{label}</span>
        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-white/10'}`}>
          {isSelected && <CheckCircle2 size={10} className="text-white" />}
        </div>
      </div>
    </button>
  );
};

// --- MAIN APP ---

const UyStudiosBooking = () => {
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [turnstileToken, setTurnstileToken] = useState(null);
  
  const [formData, setFormData] = useState({
    email: '', clientName: '', phone: '', serviceNeeded: '', 
    photoType: '', enhancement: '', eventDate: '', notes: '', 
    coupon: '', location: '', duration: '', 
    videoProduct: [] 
  });

  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz3QaFdbeegeOLY23Wbg3lmpOKyfbcybrYXqhQ6_TLycMpB0vqwPea-ScbVe284OiUkhA/exec";
  const TURNSTILE_SITE_KEY = "0x4AAAAAADSbnMYDzBynsnXL";

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const toggleVideoProduct = (product) => {
    setFormData(prev => ({
      ...prev,
      videoProduct: prev.videoProduct.includes(product)
        ? prev.videoProduct.filter(p => p !== product)
        : [...prev.videoProduct, product]
    }));
  };

  const nextStep = () => {
    if (step === 2) {
      if (formData.serviceNeeded === 'Video') setStep(6);
      else setStep(3);
    } else if (step === 5) {
      if (formData.serviceNeeded === 'Photo and Video') setStep(6);
      else handleFinalSubmit(); 
    } else if (step === 6) {
      handleFinalSubmit(); 
    } else {
      setStep(s => s + 1);
    }
  };

  const prevStep = () => {
    if (step === 6 && formData.serviceNeeded === 'Video') setStep(2);
    else if (step === 6 && formData.serviceNeeded === 'Photo and Video') setStep(5);
    else setStep(s => s - 1);
  };

  const handleFinalSubmit = async () => {
    if (!turnstileToken) {
      alert("Please complete the security check to proceed.");
      return;
    }

    setIsSubmitting(true);
    const dataToSubmit = {
        ...formData,
        videoProduct: formData.videoProduct.join(', '),
        turnstile: turnstileToken
    };

    try {
      await fetch(SCRIPT_URL, { 
        method: 'POST', 
        mode: 'no-cors', 
        body: JSON.stringify(dataToSubmit) 
      });
      setSubmitted(true);
    } catch (err) { alert("Submission failed."); }
    setIsSubmitting(false);
  };

  // --- REPAIRED RESPONSIVE SPLASH SCREEN ---
  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden px-6 text-center">
      {/* Centered Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-600/20 blur-[100px] rounded-full animate-pulse" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 1.5 }}
        className="relative z-10 w-full"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.4em] sm:tracking-[0.6em] text-white uppercase leading-relaxed">
          Uy Studios
        </h1>
        
        {/* Centered Progress Bar */}
        <div className="w-32 sm:w-48 h-[1px] bg-white/10 mt-8 mx-auto overflow-hidden">
          <motion.div 
            initial={{ x: '-100%' }} 
            animate={{ x: '100%' }} 
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} 
            className="w-full h-full bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.8)]" 
          />
        </div>
      </motion.div>
    </div>
  );

  if (submitted) return (
    <div className="min-h-screen bg-[#060606] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} 
        className="text-center max-w-md p-12 rounded-[3rem] bg-zinc-900/40 border border-white/5 shadow-[0_30px_100px_-15px_rgba(59,130,246,0.3)]">
        <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(59,130,246,0.4)]">
          <CheckCircle2 size={40} className="text-blue-400" />
        </div>
        <h2 className="text-3xl font-light tracking-widest uppercase mb-4 text-white">Confirmed</h2>
        <p className="text-zinc-500 leading-relaxed mb-10 text-sm">Your booking request has been securely transmitted. A studio representative will contact you shortly.</p>
        <button onClick={() => window.location.reload()} className="text-[10px] tracking-[0.4em] uppercase text-blue-400 font-bold hover:text-white transition-colors">Restart Form</button>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#030303] text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="fixed -bottom-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed top-0 left-0 w-[400px] h-[400px] bg-blue-900/5 blur-[150px] rounded-full pointer-events-none" />
      
      <motion.div layout className="max-w-xl w-full bg-zinc-900/40 backdrop-blur-3xl border border-white/[0.08] rounded-[2.5rem] p-8 md:p-14 relative z-10 shadow-[0_35px_80px_-15px_rgba(59,130,246,0.2)]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-light tracking-[0.4em] uppercase mb-1">Uy Studios</h1>
            <p className="text-[9px] text-zinc-600 tracking-[0.4em] uppercase font-black">Booking Phase 0{step}</p>
          </div>
          <div className="flex gap-1.5 mb-2">
            {[1,2,3,4,5,6].map(i => <div key={i} className={`h-1 rounded-full transition-all duration-700 ${step >= i ? 'w-6 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]' : 'w-2 bg-white/5'}`} />)}
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
            
            {step === 1 && (
              <div className="py-4">
                <h3 className="text-[11px] text-blue-400 mb-8 uppercase tracking-[0.3em] font-bold">Identification</h3>
                <InputField label="Email Address" icon={Send} type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="studio@contact.com" />
              </div>
            )}

            {step === 2 && (
              <div className="py-2">
                <InputField label="Full Client Name" icon={User} value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} />
                <InputField label="Phone Number" icon={Phone} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                <label className="block text-zinc-500 text-[10px] mb-4 ml-1 uppercase tracking-[0.2em] font-bold">Inquiry Type</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {['Photography', 'Video', 'Photo and Video'].map(s => <SelectionCard key={s} label={s} selected={formData.serviceNeeded} onClick={() => setFormData({...formData, serviceNeeded: s})} />)}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="grid grid-cols-2 gap-2.5 py-4">
                {['Wedding', 'Event', 'Birthday', 'Graduation', 'Sports', 'Portraits', 'Property', 'Commercial'].map(t => <SelectionCard key={t} label={t} selected={formData.photoType} onClick={() => setFormData({...formData, photoType: t})} />)}
              </div>
            )}

            {step === 4 && (
              <div className="py-6">
                <p className="text-sm text-zinc-400 mb-8 tracking-wide">Do you require professional high-end retouching for this project?</p>
                <div className="grid grid-cols-2 gap-4">
                  {['Yes', 'No'].map(o => <SelectionCard key={o} label={o} selected={formData.enhancement} onClick={() => setFormData({...formData, enhancement: o})} />)}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="py-2">
                <InputField label="Target Event Date" icon={Calendar} type="date" value={formData.eventDate} onChange={e => setFormData({...formData, eventDate: e.target.value})} />
                <InputField label="Additional Requirements" icon={Star} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
                <InputField label="Referral / Coupon" icon={Gift} value={formData.coupon} onChange={e => setFormData({...formData, coupon: e.target.value})} />
                
                {formData.serviceNeeded === 'Photography' && (
                  <div className="mt-4 flex justify-center scale-90 origin-center opacity-80 hover:opacity-100 transition-opacity">
                    <Turnstile 
                      siteKey={TURNSTILE_SITE_KEY} 
                      theme="dark" 
                      onSuccess={(token) => setTurnstileToken(token)} 
                    />
                  </div>
                )}
              </div>
            )}

            {step === 6 && (
              <div className="space-y-6 max-h-[55vh] overflow-y-auto pr-3 custom-scrollbar py-2">
                <InputField label="Venue Location" icon={MapPin} value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="City or Specific Venue" />
                <div>
                  <label className="block text-zinc-500 text-[10px] mb-3 uppercase tracking-[0.2em] font-bold">Coverage Window</label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {['1-3 hrs', '3-6 hrs', '6-8 hrs', '8-10 hrs', '10-12 hrs'].map(d => <SelectionCard key={d} label={d} selected={formData.duration} onClick={() => setFormData({...formData, duration: d})} />)}
                  </div>
                </div>
                <div>
                  <label className="block text-zinc-500 text-[10px] mb-1 uppercase tracking-[0.2em] font-bold">Deliverable Format</label>
                  <p className="text-[9px] text-blue-400/60 uppercase tracking-widest mb-4">Select all that apply</p>
                  <div className="space-y-2 mb-6">
                    {['Highlight film', 'Color corrected raw footage', 'Social Media Teaser', 'Full Documentary Edit'].map(p => (
                        <SelectionCard key={p} label={p} multi={true} selected={formData.videoProduct} onClick={() => toggleVideoProduct(p)} />
                    ))}
                  </div>
                </div>

                <div className="flex justify-center scale-90 origin-center opacity-80 hover:opacity-100 transition-opacity pb-4">
                  <Turnstile 
                    siteKey={TURNSTILE_SITE_KEY} 
                    theme="dark" 
                    onSuccess={(token) => setTurnstileToken(token)} 
                  />
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        <div className="mt-14 flex gap-5">
          {step > 1 && (
            <button type="button" onClick={prevStep} className="p-5 rounded-2xl border border-white/5 text-zinc-500 hover:text-white hover:bg-white/5 transition-all">
              <ChevronLeft size={24} />
            </button>
          )}
          <button type="button" onClick={nextStep} disabled={isSubmitting} 
            className="flex-1 flex items-center justify-center gap-4 bg-white text-black font-black text-xs uppercase tracking-[0.2em] py-5 rounded-2xl hover:bg-blue-400 hover:text-white hover:shadow-[0_0_30px_rgba(96,165,250,0.5)] transition-all duration-500 disabled:opacity-50">
            {isSubmitting ? "Syncing..." : (step === 5 && formData.serviceNeeded === 'Photography') || step === 6 ? "Finalize Booking" : "Proceed"} 
            <ChevronRight size={18} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default UyStudiosBooking;