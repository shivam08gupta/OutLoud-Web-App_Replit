import { useState } from "react";
import { useLocation } from "wouter";
import { Mic, ArrowRight, ArrowLeft, Briefcase, Presentation, MessageSquare, LayoutGrid, Lightbulb, Code, BarChart, Megaphone, MoreHorizontal, Check } from "lucide-react";

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const [selection, setSelection] = useState({
    goal: "job",
    role: "",
    timing: ""
  });

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Persist the chosen role so the practice screen can select a
      // role-specific question bank.
      localStorage.setItem("outloud_role", selection.role);
      setLocation("/permissions");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md selection:bg-surface-variant">
      {/* Header */}
      <header className="w-full py-md px-md md:px-lg max-w-container-max mx-auto flex justify-center items-center">
        <div className="font-headline-md text-headline-md font-bold text-primary flex items-center gap-2">
          <Mic className="w-6 h-6 fill-current" />
          OutLoud
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow flex flex-col items-center justify-start w-full max-w-3xl mx-auto px-sm md:px-md mt-lg gap-xl relative pb-24">
        
        {/* Progress Indicator */}
        <div className="w-full max-w-[36rem] flex items-center justify-between gap-sm mb-sm px-sm">
          <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${currentStep >= 1 ? 'bg-secondary' : 'bg-surface-variant'}`}></div>
          <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${currentStep >= 2 ? 'bg-secondary' : 'bg-surface-variant'}`}></div>
          <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${currentStep >= 3 ? 'bg-secondary' : 'bg-surface-variant'}`}></div>
        </div>

        {/* Step 1: Goal */}
        {currentStep === 1 && (
          <div className="w-full flex flex-col gap-lg animate-fade-in">
            <div className="text-center px-sm">
              <h1 className="font-headline-lg text-headline-lg text-on-background mb-base">What are you preparing for?</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">Select your primary focus to tailor the studio environment.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
              <button 
                onClick={() => setSelection({...selection, goal: "job"})}
                className={`flex flex-col items-start p-md bg-surface-container-lowest border-2 rounded-xl text-left transition-all duration-200 focus:outline-none ${selection.goal === 'job' ? 'border-secondary bg-surface-container-low' : 'border-outline-variant hover:border-secondary'}`}
              >
                <Briefcase className={`w-8 h-8 mb-sm ${selection.goal === 'job' ? 'text-secondary' : 'text-on-surface-variant'}`} />
                <span className="font-headline-md text-headline-md text-on-surface mb-base">Job Interview</span>
                <span className="font-body-md text-body-md text-on-surface-variant">Practice technical, behavioral, or case study questions.</span>
              </button>

              <div className="flex flex-col items-start p-md bg-surface-container-lowest border-2 border-outline-variant rounded-xl text-left opacity-50 cursor-not-allowed relative">
                <span className="absolute top-2 right-2 bg-surface-variant text-on-surface-variant text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Coming soon</span>
                <Presentation className="w-8 h-8 mb-sm text-on-surface-variant" />
                <span className="font-headline-md text-headline-md text-on-surface mb-base">Presentation</span>
                <span className="font-body-md text-body-md text-on-surface-variant">Rehearse public speaking, pitches, or internal reviews.</span>
              </div>

              <div className="flex flex-col items-start p-md bg-surface-container-lowest border-2 border-outline-variant rounded-xl text-left opacity-50 cursor-not-allowed relative">
                <span className="absolute top-2 right-2 bg-surface-variant text-on-surface-variant text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Coming soon</span>
                <MessageSquare className="w-8 h-8 mb-sm text-on-surface-variant" />
                <span className="font-headline-md text-headline-md text-on-surface mb-base">Difficult Conversation</span>
                <span className="font-body-md text-body-md text-on-surface-variant">Roleplay performance reviews or negotiations.</span>
              </div>

              <div className="flex flex-col items-start p-md bg-surface-container-lowest border-2 border-outline-variant rounded-xl text-left opacity-50 cursor-not-allowed relative">
                <span className="absolute top-2 right-2 bg-surface-variant text-on-surface-variant text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Coming soon</span>
                <LayoutGrid className="w-8 h-8 mb-sm text-on-surface-variant" />
                <span className="font-headline-md text-headline-md text-on-surface mb-base">Other</span>
                <span className="font-body-md text-body-md text-on-surface-variant">General confidence building and articulation practice.</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Role */}
        {currentStep === 2 && (
          <div className="w-full flex flex-col gap-lg animate-fade-in">
            <div className="text-center px-sm">
              <h1 className="font-headline-lg text-headline-lg text-on-background mb-base">What role are you preparing for?</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">This helps us curate industry-specific prompts.</p>
            </div>

            <div className="flex flex-col gap-sm max-w-[36rem] mx-auto w-full">
              {[
                { id: "pm", icon: Lightbulb, label: "Product Manager" },
                { id: "swe", icon: Code, label: "Software Engineer" },
                { id: "data", icon: BarChart, label: "Data Analyst" },
                { id: "marketing", icon: Megaphone, label: "Marketing" },
                { id: "other", icon: MoreHorizontal, label: "Other" },
              ].map(role => (
                <button
                  key={role.id}
                  onClick={() => setSelection({...selection, role: role.id})}
                  className={`flex items-center p-sm bg-surface-container-lowest border-2 rounded-xl text-left transition-all duration-200 group focus:outline-none ${selection.role === role.id ? 'border-secondary bg-surface-container-low' : 'border-outline-variant hover:border-secondary hover:bg-surface-container-low'}`}
                >
                  <role.icon className={`mr-sm w-6 h-6 ${selection.role === role.id ? 'text-secondary' : 'text-on-surface-variant group-hover:text-secondary'}`} />
                  <span className="font-headline-md text-headline-md text-on-surface">{role.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Timing */}
        {currentStep === 3 && (
          <div className="w-full flex flex-col gap-lg animate-fade-in">
            <div className="text-center px-sm">
              <h1 className="font-headline-lg text-headline-lg text-on-background mb-base">When is your interview?</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">We'll help pace your preparation schedule.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm max-w-2xl mx-auto w-full">
              {[
                { id: "week", label: "This week" },
                { id: "two-weeks", label: "1-2 weeks" },
                { id: "more", label: "More than 2 weeks" },
                { id: "unscheduled", label: "Not scheduled yet" },
              ].map(time => (
                <button
                  key={time.id}
                  onClick={() => setSelection({...selection, timing: time.id})}
                  className={`flex items-center justify-center p-md bg-surface-container-lowest border-2 rounded-xl text-center transition-all duration-200 focus:outline-none ${selection.timing === time.id ? 'border-secondary bg-surface-container-low' : 'border-outline-variant hover:border-secondary hover:bg-surface-container-low'}`}
                >
                  <span className="font-headline-md text-headline-md text-on-surface">{time.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Actions */}
        <div className="fixed bottom-0 w-full max-w-3xl left-1/2 -translate-x-1/2 bg-background/95 backdrop-blur py-md border-t border-surface-variant px-sm flex justify-between items-center z-10">
          <button 
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 ${currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <button 
            onClick={handleNext}
            className="bg-primary text-on-primary font-label-md text-label-md px-lg py-3 rounded-lg hover:bg-on-primary-fixed-variant transition-colors flex items-center gap-2 shadow-sm"
          >
            {currentStep === totalSteps ? 'Finish' : 'Continue'}
            {currentStep === totalSteps ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </main>
    </div>
  );
}
