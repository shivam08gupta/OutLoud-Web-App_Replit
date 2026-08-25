import { useLocation } from "wouter";
import { Video, Mic, ShieldCheck } from "lucide-react";

export default function Permissions() {
  const [, setLocation] = useLocation();

  const proceed = () => {
    setLocation("/practice");
  };

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex items-center justify-center p-sm md:p-md overflow-hidden relative">
      {/* Ambient background layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface-container-low to-surface opacity-50 z-0"></div>
      
      {/* Main Content Canvas */}
      <main className="relative z-10 w-full max-w-[600px] mx-auto">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md md:p-lg shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04)] flex flex-col items-center text-center animate-fade-in-up">
          
          {/* Illustrative Icon Cluster */}
          <div className="flex items-center justify-center gap-xs mb-sm">
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center">
              <Video className="w-8 h-8 text-primary" />
            </div>
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center -ml-4 border-2 border-surface-container-lowest relative z-10">
              <Mic className="w-8 h-8 text-secondary fill-current" />
            </div>
          </div>

          {/* Headlines & Copy */}
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-xs">
            Let's make this feel like a real scenario
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-md max-w-[480px]">
            OutLoud uses your microphone so you can answer questions naturally. Your camera creates a more realistic interview environment, like practising in front of a mirror.
          </p>

          {/* Privacy Reassurance Box */}
          <div className="w-full bg-secondary-container rounded-lg p-md mb-lg flex items-start gap-sm text-left border border-secondary shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)]">
            <div className="w-9 h-9 rounded-full bg-surface-container-lowest flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-on-secondary-container" strokeWidth={2} />
            </div>
            <div>
              <p className="font-body-md text-body-md text-on-secondary-container leading-relaxed">
                <strong className="font-bold">Privacy first.</strong> We don't analyse your appearance, eye contact, body language, or emotions.
              </p>
            </div>
          </div>

          {/* Action Area */}
          <div className="w-full flex flex-col gap-sm">
            <button 
              onClick={proceed}
              className="w-full bg-primary text-on-primary font-label-md text-label-md py-sm px-sm rounded-lg hover:bg-on-primary-fixed transition-colors duration-200 flex items-center justify-center gap-xs focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-surface-container-lowest"
            >
              Allow Camera & Microphone
            </button>
            <button 
              onClick={proceed}
              className="w-full bg-surface-container-lowest text-primary border border-outline-variant font-label-md text-label-md py-sm px-sm rounded-lg hover:bg-surface-container-low transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-surface-container-lowest"
            >
              Use Microphone Only
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
