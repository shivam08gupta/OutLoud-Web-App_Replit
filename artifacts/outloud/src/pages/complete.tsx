import { useLocation } from "wouter";
import { CheckCircle2, Target, Calendar } from "lucide-react";

export default function SessionComplete() {
  const [, setLocation] = useLocation();

  return (
    <div className="bg-background text-on-surface antialiased min-h-screen flex items-center justify-center p-md md:p-lg">
      <main className="w-full max-w-[540px] bg-surface-container-lowest rounded-xl border border-outline-variant shadow-[0_10px_20px_-10px_rgba(0,0,0,0.04)] p-md md:p-xl flex flex-col gap-lg animate-fade-up">
        
        {/* Header Section */}
        <header className="flex flex-col items-center text-center gap-sm">
          <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center mb-xs animate-pulse-subtle">
            <CheckCircle2 className="w-8 h-8 text-on-secondary-container fill-current text-secondary-container" />
          </div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Practice complete! 🎉</h1>
          <p className="font-body-md md:font-body-lg text-body-md md:text-body-lg text-on-surface-variant max-w-[24rem]">Great job stepping into the studio today. Here is a summary of your session.</p>
        </header>

        {/* Metrics Bento Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-sm">
          <div className="flex flex-row md:flex-col items-center justify-between md:justify-center p-sm md:p-md bg-surface-container-low rounded-lg border border-surface-variant">
            <span className="font-headline-md text-headline-md text-primary">3</span>
            <span className="font-label-md text-label-md text-on-surface-variant md:mt-base">Questions</span>
          </div>
          <div className="flex flex-row md:flex-col items-center justify-between md:justify-center p-sm md:p-md bg-surface-container-low rounded-lg border border-surface-variant relative overflow-hidden">
            <div className="absolute inset-0 bg-secondary/5"></div>
            <span className="font-headline-md text-headline-md text-secondary relative z-10">2</span>
            <span className="font-label-md text-label-md text-on-surface-variant md:mt-base text-center relative z-10">Improvements</span>
          </div>
          <div className="flex flex-row md:flex-col items-center justify-between md:justify-center p-sm md:p-md bg-surface-container-low rounded-lg border border-surface-variant">
            <span className="font-headline-md text-headline-md text-on-primary-fixed-variant">1</span>
            <span className="font-label-md text-label-md text-on-surface-variant md:mt-base">Retry</span>
          </div>
        </section>

        {/* Context & Next Steps */}
        <section className="flex flex-col gap-md border-t border-surface-variant pt-lg">
          <div className="flex items-start gap-md p-sm bg-surface rounded-lg">
            <div className="mt-xs">
              <Target className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h3 className="font-label-md text-label-md text-on-surface-variant mb-base">Today's Focus</h3>
              <p className="font-body-md text-body-md text-on-surface font-medium">Vocabulary + Fluency</p>
            </div>
          </div>
          <div className="flex items-start gap-md p-sm">
            <div className="mt-xs">
              <Calendar className="w-5 h-5 text-primary-container fill-current text-surface" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="font-label-md text-label-md text-on-surface-variant mb-base">Next Practice</h3>
              <p className="font-body-md text-body-md text-on-surface font-medium">Tomorrow: Unexpected follow-up questions</p>
            </div>
          </div>
        </section>

        {/* Actions */}
        <footer className="flex flex-col gap-sm mt-xs">
          <button 
            onClick={() => setLocation("/feedback")}
            className="w-full bg-primary text-on-primary font-label-md text-label-md py-sm px-md rounded-lg hover:bg-on-primary-fixed transition-colors duration-200"
          >
            See Feedback
          </button>
          <button 
            onClick={() => setLocation("/dashboard")}
            className="w-full bg-surface-container-lowest border border-outline-variant text-primary font-label-md text-label-md py-sm px-md rounded-lg hover:bg-surface transition-colors duration-200"
          >
            Done
          </button>
        </footer>
      </main>
    </div>
  );
}
