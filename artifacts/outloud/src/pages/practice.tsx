import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { X, Video, Mic, StopCircle, HelpCircle, Loader2, Disc } from "lucide-react";

const QUESTIONS = [
  {
    prompt: "Tell me about a time when you disagreed with a stakeholder.",
    guidance: "Take a moment to think. There's no need to rush. Focus on outlining the situation, your specific action, and the constructive outcome.",
  },
  {
    prompt: "Describe a project where you had to learn something new under a tight deadline.",
    guidance: "Walk through how you prioritised learning, the resources you used, and how it affected the outcome.",
  },
  {
    prompt: "Tell me about a time you received difficult feedback. How did you respond?",
    guidance: "Focus on what you changed afterwards, not just how the feedback felt.",
  },
];
const TOTAL_QUESTIONS = QUESTIONS.length;

export default function Practice() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const currentQuestion = Math.min(
    Math.max(parseInt(new URLSearchParams(search).get("q") ?? "1", 10) || 1, 1),
    TOTAL_QUESTIONS,
  );
  const question = QUESTIONS[currentQuestion - 1];
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleStart = () => {
    setSeconds(0);
    setIsRecording(true);
  };

  const handleStop = () => {
    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setLocation(`/feedback?q=${currentQuestion}`);
    }, 1500);
  };

  const WaveformBars = () => (
    <div className="flex items-end h-8 gap-[2px] px-2">
      {[12, 24, 16, 32, 20, 28, 14].map((h, i) => (
        <div 
          key={i} 
          className="w-1 bg-secondary rounded-full transform-origin-bottom animate-[wave_1.2s_ease-in-out_infinite]"
          style={{ height: `${h}px`, animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );

  return (
    <div className="bg-primary text-on-primary min-h-screen flex flex-col font-body-md selection:bg-secondary selection:text-on-secondary">
      {/* Desktop Header */}
      <header className="hidden md:flex w-full h-16 justify-between items-center px-lg max-w-container-max mx-auto shrink-0 border-b border-on-primary-fixed-variant/30">
        <button onClick={() => setLocation("/dashboard")} className="flex items-center gap-xs text-primary-fixed-dim hover:text-on-primary transition-colors focus:outline-none focus:ring-2 focus:ring-secondary rounded p-1">
          <X className="w-5 h-5" />
          <span className="font-label-md text-label-md">Exit Practice</span>
        </button>
        <div className="font-headline-md text-headline-md font-bold text-on-primary tracking-tight">OutLoud</div>
        <div className="w-[100px]"></div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden w-full px-sm py-sm flex justify-between items-center bg-surface border-b border-outline-variant shrink-0">
        <button onClick={() => setLocation("/dashboard")} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors text-on-surface-variant">
          <X className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h1 className="font-label-md text-label-md text-primary font-bold">Behavioural Interview</h1>
          <p className="font-caption text-caption text-on-surface-variant mt-1">Question {currentQuestion} of {TOTAL_QUESTIONS}</p>
        </div>
        <div className="w-10 h-10"></div>
      </header>

      {/* Main Layout */}
      <main className="flex-grow w-full max-w-container-max mx-auto px-sm md:px-lg py-md md:py-lg flex flex-col md:flex-row gap-gutter overflow-hidden relative">
        
        {/* Mobile Camera View (Top) */}
        <div className="md:hidden w-full aspect-[3/4] max-h-[353px] bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden relative shadow-sm shrink-0 flex items-center justify-center">
          <img 
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" 
            className="w-full h-full object-cover" 
            alt="Preview" 
          />
          {isRecording && (
            <div className="absolute top-3 right-3 flex items-center gap-2 bg-surface-container-lowest/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-outline-variant">
              <div className="w-2 h-2 rounded-full bg-error animate-pulse"></div>
              <span className="font-caption text-caption font-medium text-on-surface">Live {formatTime(seconds)}</span>
            </div>
          )}
          <div className="absolute bottom-3 right-3 flex gap-2">
            <div className="w-10 h-10 rounded-full bg-surface-container-lowest/80 backdrop-blur-sm border border-outline-variant flex items-center justify-center text-on-surface">
              <Mic className="w-5 h-5" />
            </div>
            <div className="w-10 h-10 rounded-full bg-surface-container-lowest/80 backdrop-blur-sm border border-outline-variant flex items-center justify-center text-on-surface">
              <Video className="w-5 h-5" />
            </div>
          </div>
          {isRecording && <div className="absolute inset-0 border-4 border-error rounded-xl pointer-events-none animate-pulse"></div>}
        </div>

        {/* Desktop Camera View */}
        <div className="hidden md:flex w-full h-full bg-surface-container-lowest rounded-[16px] border border-outline-variant p-base relative overflow-hidden flex-col shadow-sm shrink md:w-5/12">
          <div className="absolute top-sm left-sm z-10 flex gap-xs">
            <div className="bg-tertiary/80 backdrop-blur-sm text-on-tertiary font-label-md text-label-md px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
              <Video className="w-4 h-4" />
              Camera On
              <span className="border-l border-on-tertiary/30 ml-1 pl-2">You</span>
            </div>
          </div>
          <img 
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" 
            className="w-full h-full object-cover rounded-xl" 
            alt="Preview"
          />
          {isRecording && <div className="absolute inset-0 border-4 border-error rounded-xl pointer-events-none transition-all duration-300"></div>}
        </div>

        {/* Question Area & Controls */}
        <div className="w-full bg-surface-container-lowest rounded-[16px] border border-outline-variant shadow-sm flex flex-col md:h-full flex-1 md:w-7/12">
          
          {/* Question Text */}
          <div className="p-md md:p-lg flex-grow flex flex-col items-center md:items-start text-center md:text-left justify-center md:justify-start">
            
            {/* Desktop only context pill */}
            <div className="hidden md:flex items-center justify-between mb-xl w-full">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="font-label-md text-label-md uppercase tracking-wider text-secondary">Behavioural Interview</span>
              </div>
              <div className="bg-surface-container py-1 px-3 rounded-full border border-outline-variant/50">
                <span className="font-label-md text-label-md text-on-surface">Question {currentQuestion} of {TOTAL_QUESTIONS}</span>
              </div>
            </div>

            <div className="md:hidden mb-4 text-secondary">
              <HelpCircle className="w-10 h-10 fill-current text-surface-container-lowest" strokeWidth={1.5} />
            </div>

            <div className="mb-lg flex-grow md:flex-grow-0">
              <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary md:text-on-surface mb-sm text-balance">
                "{question.prompt}"
              </h2>
              <p className="font-body-md md:font-body-lg text-body-md md:text-body-lg text-on-surface-variant text-balance">
                {question.guidance}
              </p>
            </div>
          </div>

          {/* Controls Footer */}
          <div className="p-sm md:p-lg bg-surface border-t border-outline-variant/30 rounded-b-[16px] shrink-0">
            {!isRecording ? (
              <div className="flex flex-col gap-sm">
                <button 
                  onClick={handleStart}
                  className="w-full bg-secondary text-on-secondary font-label-md text-label-md py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-on-secondary-container transition-colors shadow-sm"
                >
                  <Disc className="w-5 h-5 fill-current text-on-secondary" />
                  Start Recording
                </button>
                <p className="hidden md:block text-center font-caption text-caption text-on-surface-variant">
                  Your camera and microphone are ready.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-md">
                <div className="hidden md:flex items-center justify-between bg-surface-container-low p-sm rounded-lg border border-outline-variant/50 mb-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-error animate-pulse"></div>
                    <span className="font-label-md text-label-md text-on-surface flex items-center gap-1">
                      Recording <span className="tabular-nums font-mono">{formatTime(seconds)}</span>
                    </span>
                  </div>
                  <WaveformBars />
                </div>
                <button 
                  onClick={handleStop}
                  disabled={isSubmitting}
                  className={`w-full bg-surface-container-lowest border-2 border-secondary text-on-surface font-label-md text-label-md py-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${isSubmitting ? 'opacity-80 cursor-not-allowed' : 'hover:bg-surface-container-low'}`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-secondary" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <StopCircle className="w-5 h-5 text-secondary fill-current" />
                      Stop & Submit
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
