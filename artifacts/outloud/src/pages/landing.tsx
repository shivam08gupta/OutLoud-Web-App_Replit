import { Link } from "wouter";
import { Bell, Menu } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background font-body-md selection:bg-surface-variant">
      {/* TopNavBar */}
      <nav className="bg-surface border-b border-surface-variant sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-md md:px-lg max-w-container-max mx-auto h-16">
          <div className="flex items-center gap-sm">
            <Link href="/" className="font-headline-md text-headline-md font-bold text-primary hover:opacity-80 transition-opacity">
              OutLoud
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-md">
            <Link href="/practice" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors duration-200">
              Practice
            </Link>
            <Link href="/dashboard" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors duration-200">
              History
            </Link>
            <Link href="/" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors duration-200">
              About
            </Link>
          </div>
          <div className="flex items-center gap-md">
            <button aria-label="notifications" className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-variant">
              <Bell className="w-5 h-5" />
            </button>
            <button aria-label="Menu" className="md:hidden text-on-surface-variant hover:text-primary transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden md:flex gap-sm">
              <Link href="/signin" className="font-label-md text-label-md border border-outline-variant text-primary px-sm py-2 rounded flex items-center justify-center hover:bg-surface-variant transition-colors">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-grow w-full max-w-container-max mx-auto px-md md:px-lg py-xl flex flex-col md:flex-row items-center justify-between gap-xl">
        {/* Hero Text */}
        <div className="flex flex-col gap-md max-w-2xl">
          <h1 className="font-display-lg text-display-lg md:text-[64px] md:leading-[1.1] text-primary tracking-tight">
            Practise speaking. Walk into interviews confident.
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[36rem]">
            Practise realistic job interview conversations, speak your answers out loud, and get focused feedback to improve your next response.
          </p>
          <div className="flex flex-col sm:flex-row gap-sm mt-sm">
            <Link href="/signin" className="bg-primary text-on-primary font-label-md text-label-md px-lg py-3 rounded-lg flex items-center justify-center hover:bg-opacity-90 transition-opacity">
              Start Practising
            </Link>
            <Link href="/signin" className="border border-outline-variant text-primary font-label-md text-label-md px-lg py-3 rounded-lg flex items-center justify-center hover:bg-surface-variant transition-colors">
              I already have an account
            </Link>
          </div>
          {/* Trust Indicators / Micro Copy */}
          <div className="flex items-center gap-sm mt-md opacity-80">
            <div className="w-5 h-5 rounded-full bg-secondary text-on-secondary flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-3 h-3 stroke-[3px]">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="font-caption text-caption text-on-surface-variant">Private, calm studio environment.</span>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="relative w-full max-w-[32rem] aspect-square md:aspect-[4/5] bg-surface-container-lowest rounded-xl border border-outline-variant shadow-[0_10px_20px_-5px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col items-center justify-center p-sm">
          <img 
            src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800" 
            alt="Person in video interview"
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />
          <div className="absolute bottom-md left-md right-md bg-surface-container-lowest/95 backdrop-blur-md border border-outline-variant rounded-lg p-sm flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-sm">
              <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 stroke-2">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" x2="12" y1="19" y2="22" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface">Audio Input Active</span>
                <span className="font-caption text-caption text-secondary">Clear Enunciation detected</span>
              </div>
            </div>
            <div className="w-16 h-8 flex items-center justify-between gap-[2px] opacity-70">
              <div className="w-1 h-3 bg-secondary rounded-full"></div>
              <div className="w-1 h-6 bg-secondary rounded-full"></div>
              <div className="w-1 h-4 bg-secondary rounded-full"></div>
              <div className="w-1 h-7 bg-secondary rounded-full"></div>
              <div className="w-1 h-2 bg-secondary rounded-full"></div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container border-t border-surface-variant w-full py-md px-md md:px-lg mt-auto flex flex-col md:flex-row justify-between items-center gap-sm">
        <div className="font-label-md text-label-md font-bold text-primary flex items-center gap-sm">
          OutLoud
          <span className="font-body-md text-body-md font-normal text-on-surface-variant ml-sm hidden md:inline">| Studio</span>
        </div>
        <div className="flex items-center gap-md">
          <Link href="/" className="font-body-md text-body-md text-on-surface-variant hover:text-primary hover:underline transition-all">Privacy Policy</Link>
          <Link href="/" className="font-body-md text-body-md text-on-surface-variant hover:text-primary hover:underline transition-all">Terms of Service</Link>
          <Link href="/" className="font-body-md text-body-md text-on-surface-variant hover:text-primary hover:underline transition-all">Contact Support</Link>
        </div>
        <div className="font-caption text-caption text-on-surface-variant">
          © 2024 OutLoud Studio. Precision in every word.
        </div>
      </footer>
    </div>
  );
}
