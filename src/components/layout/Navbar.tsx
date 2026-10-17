import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 sm:pt-6 transition-all duration-300">
      <nav 
        className={`w-full max-w-5xl rounded-full transition-all duration-300 px-6 sm:px-8 py-3.5 flex items-center justify-between border ${
          scrolled
            ? 'bg-slate-950/85 backdrop-blur-xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)]'
            : 'bg-slate-900/40 backdrop-blur-md border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.2)]'
        }`}
      >
        {/* Clean Typography Brand Name (No icon logo) */}
        <Link to="/" className="flex items-center group">
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-slate-200 transition-colors">
            Proctor<span className="text-cyan-400">Vision</span>
          </span>
        </Link>

        {/* Modern Capsule Navigation Bar with 3 Selected Buttons */}
        <div className="hidden md:flex items-center gap-1 p-1 rounded-full bg-slate-950/60 border border-white/[0.08] backdrop-blur-md shadow-inner">
          <a
            href="#features"
            className="px-4 py-1.5 rounded-full text-xs lg:text-sm font-medium text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="px-4 py-1.5 rounded-full text-xs lg:text-sm font-medium text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
          >
            How It Works
          </a>
          <a
            href="#demo"
            className="px-4 py-1.5 rounded-full text-xs lg:text-sm font-medium text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all duration-200 flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live Demo</span>
          </a>
        </div>

        {/* Only Login Button */}
        <div className="hidden sm:flex items-center">
          <Link
            to="/login"
            className="group relative inline-flex items-center gap-2 text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 px-5 py-2 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all transform hover:-translate-y-0.5"
          >
            <span>Login</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-full text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Glass Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-20 left-4 right-4 rounded-2xl p-5 bg-slate-950/95 backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col gap-4">
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-slate-200 hover:text-cyan-400 py-1 transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-slate-200 hover:text-cyan-400 py-1 transition-colors"
          >
            How It Works
          </a>
          <a
            href="#demo"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-slate-200 hover:text-cyan-400 py-1 transition-colors flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Demo
          </a>

          <div className="h-px bg-white/10 my-1" />

          <Link
            to="/login"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-center py-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-teal-300 text-slate-950 font-semibold text-sm transition-all"
          >
            Login
          </Link>
        </div>
      )}
    </header>
  );
};
