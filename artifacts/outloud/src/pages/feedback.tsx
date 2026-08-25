import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { 
  LayoutDashboard, 
  Mic, 
  History, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Bell, 
  ChevronRight,
  CheckCircle2,
  Sliders,
  FileEdit,
  MicOff,
  Lightbulb,
  ArrowDown,
  Quote,
  MessageSquare,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useGenerateFeedback } from "@workspace/api-client-react";

const TOTAL_QUESTIONS = 3;

export default function Feedback() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const currentQuestion = Math.min(
    Math.max(parseInt(new URLSearchParams(search).get("q") ?? "1", 10) || 1, 1),
    TOTAL_QUESTIONS,
  );
  const isLastQuestion = currentQuestion >= TOTAL_QUESTIONS;

  const sttUnsupported = sessionStorage.getItem(`outloud_transcript_unsupported_${currentQuestion}`) === "1";
  const transcript = sessionStorage.getItem(`outloud_transcript_${currentQuestion}`) ?? "";
  const questionText =
    sessionStorage.getItem(`outloud_question_${currentQuestion}`) ?? "Tell me about your response.";

  // Real AI feedback via the backend's Gemini-backed /api/feedback endpoint.
  const feedbackMutation = useGenerateFeedback();
  const requestedForRef = useRef<number | null>(null);

  useEffect(() => {
    if (requestedForRef.current === currentQuestion) return;
    requestedForRef.current = currentQuestion;
    feedbackMutation.mutate({ data: { question: questionText, transcript } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion]);

  const handleRetryFeedback = () => {
    feedbackMutation.mutate({ data: { question: questionText, transcript } });
  };

  const feedback = feedbackMutation.data;
  const isFeedbackLoading = feedbackMutation.isPending;
  const isFeedbackError = feedbackMutation.isError;

  const handleTryAgain = () => setLocation(`/practice?q=${currentQuestion}`);
  const handleNext = () => {
    if (isLastQuestion) {
      setLocation("/complete");
    } else {
      setLocation(`/practice?q=${currentQuestion + 1}`);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col md:flex-row antialiased">
      {/* SideNavBar (Desktop) */}
      <nav className="hidden md:flex flex-col h-screen p-md gap-sm docked left-0 w-64 border-r border-surface-variant bg-surface-container-low sticky top-0 shrink-0">
        <div className="mb-lg">
          <h1 className="font-headline-md text-headline-md font-bold text-primary">OutLoud</h1>
          <p className="font-caption text-caption text-on-surface-variant mt-1">Speak with Confidence</p>
        </div>
        
        <button 
          onClick={() => setLocation("/practice")}
          className="bg-primary text-on-primary w-full py-2 rounded-lg font-label-md text-label-md mb-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <Mic className="w-4 h-4" /> Start Practice
        </button>

        <div className="flex flex-col gap-2 flex-grow">
          <Link href="/dashboard" className="text-on-surface-variant px-4 py-2 hover:bg-surface-variant rounded-lg flex items-center gap-3 transition-colors duration-200 font-label-md text-label-md">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link href="/practice" className="bg-secondary-container text-on-secondary-container rounded-lg px-4 py-2 font-medium flex items-center gap-3 scale-[0.99] transition-transform font-label-md text-label-md">
            <Mic className="w-5 h-5" /> Practice
          </Link>
          <Link href="/dashboard" className="text-on-surface-variant px-4 py-2 hover:bg-surface-variant rounded-lg flex items-center gap-3 transition-colors duration-200 font-label-md text-label-md">
            <History className="w-5 h-5" /> History
          </Link>
          <button
            onClick={() => setSettingsOpen(true)}
            className="text-on-surface-variant px-4 py-2 hover:bg-surface-variant rounded-lg flex items-center gap-3 transition-colors duration-200 font-label-md text-label-md text-left"
          >
            <Settings className="w-5 h-5" /> Settings
          </button>
        </div>

        <div className="flex flex-col gap-2 mt-auto pt-md border-t border-surface-variant">
          <button
            onClick={() => setHelpOpen(true)}
            className="text-on-surface-variant px-4 py-2 hover:bg-surface-variant rounded-lg flex items-center gap-3 transition-colors duration-200 font-label-md text-label-md text-left"
          >
            <HelpCircle className="w-5 h-5" /> Help
          </button>
          <Link href="/signin" className="text-on-surface-variant px-4 py-2 hover:bg-surface-variant rounded-lg flex items-center gap-3 transition-colors duration-200 font-label-md text-label-md">
            <LogOut className="w-5 h-5" /> Sign Out
          </Link>
          <div className="flex items-center gap-3 px-4 py-2 mt-2">
            <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xs">
              S
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* TopNavBar (Mobile Fallback) */}
        <header className="md:hidden flex justify-between items-center w-full px-md max-w-container-max mx-auto h-16 bg-surface border-b border-surface-variant sticky top-0 z-10 shrink-0">
          <div className="font-headline-md text-headline-md font-bold text-primary">OutLoud</div>
          <nav className="flex gap-4">
            <Link href="/practice" className="text-primary border-b-2 border-primary pb-1 font-label-md text-label-md opacity-80 scale-[0.98]">Practice</Link>
            <Link href="/dashboard" className="text-on-surface-variant font-label-md text-label-md">History</Link>
          </nav>
          <div className="flex items-center gap-3">
            <button className="text-on-surface-variant hover:text-primary">
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xs">S</div>
          </div>
        </header>

        <div className="flex-1 p-md md:p-lg max-w-container-max mx-auto w-full">
          {/* Header Section */}
          <div className="mb-xl max-w-3xl">
            <div className="flex items-center gap-2 mb-sm text-on-surface-variant font-label-md text-label-md">
              <Link href="/practice" className="hover:text-primary transition-colors">Practice</Link>
              <ChevronRight className="w-4 h-4" />
              <span>Behavioural Interview · Question {currentQuestion} of {TOTAL_QUESTIONS}</span>
            </div>
            <h2 className="font-display-lg text-display-lg text-primary tracking-tight">Your feedback</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm max-w-2xl">Here's what went well and what you can improve in your next attempt.</p>
          </div>

          {/* Your transcript */}
          <div className="mb-xl max-w-3xl bg-surface-container-lowest rounded-xl border border-surface-variant p-md">
            <span className="font-label-md text-label-md uppercase tracking-wider text-secondary block mb-xs">Your transcript</span>
            {sttUnsupported ? (
              <p className="font-body-md text-body-md text-on-surface-variant italic">
                Speech-to-text isn't available in this browser, so no transcript could be captured. Your response was still recorded. Try Chrome for a full transcript.
              </p>
            ) : transcript ? (
              <p className="font-body-lg text-body-lg text-on-surface">"{transcript}"</p>
            ) : (
              <p className="font-body-md text-body-md text-on-surface-variant italic">
                No transcript available for this question yet.
              </p>
            )}
          </div>

          {/* Bento Grid Layout */}
          {isFeedbackLoading ? (
            <div className="mb-xl bg-surface-container-lowest rounded-xl border border-surface-variant p-xl flex flex-col items-center justify-center gap-sm text-center min-h-[240px]">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="font-headline-md text-headline-md text-primary">Analyzing your response...</p>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-[28rem]">
                Our AI coach is reviewing your transcript for clarity, structure, and delivery.
              </p>
            </div>
          ) : isFeedbackError ? (
            <div className="mb-xl bg-error-container text-on-error-container rounded-xl border border-error-container p-lg flex flex-col items-center text-center gap-sm">
              <AlertCircle className="w-8 h-8" />
              <p className="font-headline-md text-headline-md">We couldn't generate feedback right now. Please try again.</p>
              <button
                onClick={handleRetryFeedback}
                className="mt-sm bg-primary text-on-primary px-lg py-sm rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity"
              >
                Try Again
              </button>
            </div>
          ) : feedback ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-xl">

              {/* Section 1: What went well */}
              <div className="md:col-span-4 bg-surface-container-lowest rounded-xl border border-surface-variant p-md transition-transform hover:-translate-y-0.5 hover:shadow-sm flex flex-col">
                <div className="flex items-center gap-3 mb-sm">
                  <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                    <CheckCircle2 className="w-6 h-6 fill-current text-surface-container-lowest" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-headline-md text-headline-md text-primary">What went well</h3>
                </div>
                <div className="flex-1">
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    {feedback.whatWentWell.summary}
                  </p>
                </div>
                {feedback.whatWentWell.tags.length > 0 && (
                  <div className="mt-md pt-md border-t border-surface-variant flex flex-wrap gap-2">
                    {feedback.whatWentWell.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-surface-container rounded font-label-md text-caption text-on-surface-variant border border-surface-variant"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Section 2: Focus on */}
              <div className="md:col-span-8 bg-surface-container-lowest rounded-xl border border-surface-variant p-md transition-transform hover:-translate-y-0.5 hover:shadow-sm flex flex-col">
                <div className="flex items-center gap-3 mb-md">
                  <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant">
                    <Sliders className="w-5 h-5 fill-current" />
                  </div>
                  <h3 className="font-headline-md text-headline-md text-primary">Focus on</h3>
                </div>

                {feedback.focusOn.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    {feedback.focusOn.map((item, index) => (
                      <div key={item.title + index} className="bg-background rounded-lg p-sm border border-surface-variant">
                        <div className="flex items-center gap-2 mb-xs">
                          {index === 0 ? (
                            <FileEdit className="w-4 h-4 text-on-surface-variant" />
                          ) : (
                            <MicOff className="w-4 h-4 text-on-surface-variant" />
                          )}
                          <h4 className="font-label-md text-label-md text-primary">{item.title}</h4>
                        </div>
                        <p className="font-body-md text-caption text-on-surface-variant mb-sm">{item.description}</p>
                        <div className="space-y-2">
                          <div className="p-2 bg-surface-container-low rounded border border-error-container border-opacity-50 line-through text-on-surface-variant font-body-md text-caption opacity-70">
                            "{item.example.youSaid}"
                          </div>
                          <div className="flex justify-center">
                            <ArrowDown className="w-4 h-4 text-outline" />
                          </div>
                          <div className="p-2 bg-secondary-container bg-opacity-20 rounded border border-secondary-container text-primary font-body-md text-caption font-medium">
                            "{item.example.tryInstead}"
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-background rounded-lg p-sm border border-surface-variant flex gap-3 items-start">
                    <Lightbulb className="w-5 h-5 text-on-surface-variant mt-1" />
                    <p className="font-body-md text-caption text-on-surface-variant">
                      Nothing specific to flag this time — keep practicing to build on what's working.
                    </p>
                  </div>
                )}
              </div>

              {/* Section 3: Try saying it this way */}
              <div className="col-span-1 md:col-span-12 bg-primary-container text-on-primary-container rounded-xl p-lg relative overflow-hidden transition-transform hover:-translate-y-0.5 hover:shadow-sm">
                <div className="absolute right-0 top-0 opacity-5 pointer-events-none">
                  <Quote className="w-48 h-48 fill-current translate-x-4 -translate-y-4" />
                </div>
                <h3 className="font-headline-md text-headline-md mb-md relative z-10 text-on-primary">Try saying it this way</h3>
                <div className="relative z-10 space-y-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-label-md font-bold text-on-primary opacity-70">You said:</span>
                    <p className="font-body-md text-primary-fixed-dim">
                      {transcript ? `"${transcript}"` : "No transcript was captured for this attempt."}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 p-md bg-secondary-container rounded-lg border border-secondary-container">
                    <span className="text-label-md font-bold text-primary">Try:</span>
                    <p className="font-body-lg font-medium text-primary">{feedback.trySayingItThisWay.suggestion}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-label-md font-bold text-on-primary opacity-70">Why:</span>
                    <p className="font-body-md text-primary-fixed-dim">{feedback.trySayingItThisWay.why}</p>
                  </div>
                  <p className="pt-md font-label-md text-on-primary opacity-80 italic">Now try answering the question again in your own words.</p>
                </div>
              </div>

            </div>
          ) : null}

          {/* Action Area */}
          <div className="flex flex-col sm:flex-row items-center gap-sm mt-lg pt-lg border-t border-surface-variant">
            <button 
              onClick={handleTryAgain}
              className="w-full sm:w-auto bg-surface-container-lowest border border-surface-variant text-primary px-lg py-sm rounded-lg font-label-md text-label-md hover:bg-surface-container transition-colors"
            >
              Try Again
            </button>
            <button 
              onClick={handleNext}
              className="w-full sm:w-auto bg-primary text-on-primary px-lg py-sm rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity"
            >
              {isLastQuestion ? "Complete Session" : "Next Question"}
            </button>
          </div>
          
          <div className="mt-md flex justify-center">
            <button className="text-caption font-label-md text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 opacity-70 hover:opacity-100">
              <MessageSquare className="w-4 h-4" /> Help us improve OutLoud
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full py-md px-md md:px-lg mt-auto flex flex-col md:flex-row justify-between items-center gap-sm bg-surface-container border-t border-surface-variant">
          <div className="font-label-md text-label-md font-bold text-primary">
            OutLoud
          </div>
          <div className="font-body-md text-caption text-on-surface-variant text-center md:text-left">
            © 2024 OutLoud Studio. Precision in every word.
          </div>
          <div className="flex gap-4 font-body-md text-caption text-on-surface-variant">
            <Link href="/" className="hover:text-primary underline">Privacy Policy</Link>
            <Link href="/" className="hover:text-primary underline">Terms of Service</Link>
            <Link href="/" className="hover:text-primary underline">Contact Support</Link>
          </div>
        </footer>
      </main>

      {/* Settings coming soon */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="bg-surface-container-lowest border-outline-variant">
          <DialogHeader>
            <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center mb-sm">
              <Settings className="w-6 h-6 text-primary" />
            </div>
            <DialogTitle className="font-headline-md text-headline-md text-primary">Settings coming soon</DialogTitle>
            <DialogDescription className="font-body-md text-body-md text-on-surface-variant">
              We're still building account and notification settings. Check back in a future update.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Help coming soon */}
      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent className="bg-surface-container-lowest border-outline-variant">
          <DialogHeader>
            <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center mb-sm">
              <HelpCircle className="w-6 h-6 text-primary" />
            </div>
            <DialogTitle className="font-headline-md text-headline-md text-primary">Help & Support coming soon</DialogTitle>
            <DialogDescription className="font-body-md text-body-md text-on-surface-variant">
              A dedicated help center is on the way. In the meantime, reach out via the footer contact link.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
