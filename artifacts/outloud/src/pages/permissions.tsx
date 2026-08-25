import { useState } from "react";
import { useLocation } from "wouter";
import { Video, Mic, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";

type Mode = "av" | "audio";

export default function Permissions() {
  const [, setLocation] = useLocation();
  const [requesting, setRequesting] = useState<Mode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deniedMode, setDeniedMode] = useState<Mode | null>(null);

  const requestAccess = async (mode: Mode) => {
    setError(null);
    setRequesting(mode);

    if (!navigator.mediaDevices?.getUserMedia) {
      setRequesting(null);
      setError("This browser doesn't support camera or microphone access. Please try a modern browser like Chrome.");
      return;
    }

    try {
      const constraints: MediaStreamConstraints =
        mode === "av" ? { video: true, audio: true } : { audio: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      // Only confirming access here; the practice screen opens its own stream.
      stream.getTracks().forEach((track) => track.stop());
      setLocation(`/practice?q=1&media=${mode}`);
    } catch (err) {
      setRequesting(null);
      setDeniedMode(mode);
      const name = (err as { name?: string })?.name;
      if (name === "NotAllowedError" || name === "PermissionDeniedError") {
        setError(
          mode === "av"
            ? "Camera and microphone access was denied. You can try again or continue with microphone only."
            : "Microphone access was denied. Please allow microphone access in your browser to continue.",
        );
      } else if (name === "NotFoundError" || name === "DevicesNotFoundError") {
        setError("We couldn't find a camera or microphone on this device.");
      } else {
        setError("We couldn't access your camera or microphone. Please try again.");
      }
    }
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

          {/* Error / retry state */}
          {error && (
            <div className="w-full bg-error-container text-on-error-container rounded-lg p-sm mb-md flex items-start gap-sm text-left border border-error/30">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="font-body-md text-body-md leading-relaxed">{error}</p>
            </div>
          )}

          {/* Action Area */}
          <div className="w-full flex flex-col gap-sm">
            <button 
              onClick={() => requestAccess("av")}
              disabled={requesting !== null}
              className="w-full bg-primary text-on-primary font-label-md text-label-md py-sm px-sm rounded-lg hover:bg-on-primary-fixed transition-colors duration-200 flex items-center justify-center gap-xs focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-surface-container-lowest disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {requesting === "av" && <Loader2 className="w-4 h-4 animate-spin" />}
              {deniedMode === "av" && error ? "Try Again: Allow Camera & Microphone" : "Allow Camera & Microphone"}
            </button>
            <button 
              onClick={() => requestAccess("audio")}
              disabled={requesting !== null}
              className="w-full bg-surface-container-lowest text-primary border border-outline-variant font-label-md text-label-md py-sm px-sm rounded-lg hover:bg-surface-container-low transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-surface-container-lowest disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-xs"
            >
              {requesting === "audio" && <Loader2 className="w-4 h-4 animate-spin" />}
              Use Microphone Only
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
