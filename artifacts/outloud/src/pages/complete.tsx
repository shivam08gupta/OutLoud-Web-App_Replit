import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle2 } from "lucide-react";
import { useCreateSession } from "@workspace/api-client-react";
import type { FeedbackResponse } from "@workspace/api-client-react";

const TOTAL_QUESTIONS = 3;

function collectAnswers(): { question: string; transcript: string; feedback: FeedbackResponse }[] {
  const answers: { question: string; transcript: string; feedback: FeedbackResponse }[] = [];
  for (let q = 1; q <= TOTAL_QUESTIONS; q++) {
    const feedbackRaw = sessionStorage.getItem(`outloud_feedback_${q}`);
    if (!feedbackRaw) continue;
    const question = sessionStorage.getItem(`outloud_question_${q}`) ?? "Tell me about your response.";
    const transcript = sessionStorage.getItem(`outloud_transcript_${q}`) ?? "";
    try {
      const feedback = JSON.parse(feedbackRaw) as FeedbackResponse;
      answers.push({ question, transcript, feedback });
    } catch {
      // Skip malformed entries rather than failing the whole session save.
    }
  }
  return answers;
}

export default function SessionComplete() {
  const [, setLocation] = useLocation();
  const createSessionMutation = useCreateSession();
  const persistedRef = useRef(false);
  const [answeredCount, setAnsweredCount] = useState(0);

  // Persist the whole practice flow (every question with feedback) as a
  // single practice session, once, when this screen is reached.
  useEffect(() => {
    if (persistedRef.current) return;
    persistedRef.current = true;
    const answers = collectAnswers();
    setAnsweredCount(answers.length);
    if (answers.length === 0) return;
    createSessionMutation.mutate(
      { data: { answers } },
      {
        onSuccess: () => {
          for (let q = 1; q <= TOTAL_QUESTIONS; q++) {
            sessionStorage.removeItem(`outloud_feedback_${q}`);
            sessionStorage.removeItem(`outloud_transcript_${q}`);
            sessionStorage.removeItem(`outloud_transcript_unsupported_${q}`);
            sessionStorage.removeItem(`outloud_question_${q}`);
          }
        },
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

        {/* Session Summary */}
        <section className="flex flex-col gap-md border-t border-surface-variant pt-lg">
          <div className="flex items-center justify-center gap-md p-sm md:p-md bg-surface-container-low rounded-lg border border-surface-variant">
            <span className="font-headline-md text-headline-md text-primary">{answeredCount}</span>
            <span className="font-label-md text-label-md text-on-surface-variant">
              of {TOTAL_QUESTIONS} questions answered with feedback
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant text-center">
            Your feedback for each question is saved to your history — review it anytime from the dashboard.
          </p>
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
