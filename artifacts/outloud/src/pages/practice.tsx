import { useState, useEffect, useRef } from "react";
import { useLocation, useSearch } from "wouter";
import { useUser } from "@clerk/react";
import { X, Video, Mic, MicOff, StopCircle, HelpCircle, Loader2, Disc, AlertCircle, VideoOff } from "lucide-react";
import { trackEvent, identifyUser } from "@/lib/analytics";

const SCENARIO_TYPE = "behavioural_interview";

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

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
};

function getSpeechRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

// Defined at module scope (not inside the Practice component) so its identity is
// stable across re-renders. If this were declared inside Practice, every re-render
// (e.g. on every live-transcript update) would create a *new* component function,
// forcing React to unmount and remount the <video> element -- which detaches the
// live MediaStream and makes the camera preview go blank while speaking.
function CameraSurface({
  videoRef,
  className,
  mediaError,
  micOnly,
  activeMode,
  onRetry,
  onContinueAudioOnly,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  className: string;
  mediaError: string | null;
  micOnly: boolean;
  activeMode: "av" | "audio";
  onRetry: () => void;
  onContinueAudioOnly: () => void;
}) {
  if (mediaError) {
    return (
      <div className={`${className} flex flex-col items-center justify-center gap-sm p-md text-center bg-surface-container-low`}>
        <AlertCircle className="w-8 h-8 text-error" />
        <p className="font-body-md text-body-md text-on-surface-variant max-w-[20rem]">{mediaError}</p>
        <div className="flex flex-col sm:flex-row gap-2 mt-1">
          <button
            onClick={onRetry}
            className="font-label-md text-label-md bg-primary text-on-primary px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
          {activeMode === "av" && (
            <button
              onClick={onContinueAudioOnly}
              className="font-label-md text-label-md bg-surface-container-lowest border border-outline-variant text-primary px-4 py-2 rounded-lg hover:bg-surface-container transition-colors"
            >
              Continue with Microphone Only
            </button>
          )}
        </div>
      </div>
    );
  }
  if (micOnly) {
    return (
      <div className={`${className} flex flex-col items-center justify-center gap-sm p-md text-center bg-surface-container-low`}>
        <VideoOff className="w-8 h-8 text-on-surface-variant" />
        <p className="font-body-md text-body-md text-on-surface-variant">Camera unavailable &mdash; microphone only</p>
      </div>
    );
  }
  // No transform/mirroring applied -- the feed is shown in its natural (unmirrored) orientation.
  return <video ref={videoRef} autoPlay muted playsInline className={`${className} object-cover`} />;
}

export default function Practice() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const currentQuestion = Math.min(
    Math.max(parseInt(params.get("q") ?? "1", 10) || 1, 1),
    TOTAL_QUESTIONS,
  );
  const requestedMode: "av" | "audio" = params.get("media") === "audio" ? "audio" : "av";
  const question = QUESTIONS[currentQuestion - 1];
  const { user } = useUser();
  const userId = user?.id;

  const [activeMode, setActiveMode] = useState<"av" | "audio">(requestedMode);
  const [retryToken, setRetryToken] = useState(0);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [micOnly, setMicOnly] = useState(requestedMode === "audio");

  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [sttError, setSttError] = useState<string | null>(null);
  const [emptyTranscriptError, setEmptyTranscriptError] = useState(false);

  const speechSupported = !!getSpeechRecognitionCtor();

  // Fires once per visit to a given question's practice screen.
  useEffect(() => {
    identifyUser(userId);
    trackEvent("practice_started", {
      scenario_type: SCENARIO_TYPE,
      question_number: currentQuestion,
      user_id: userId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion]);

  const streamRef = useRef<MediaStream | null>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const finalTranscriptRef = useRef("");
  const isRecordingRef = useRef(false);

  // Acquire camera/microphone for this visit to the practice screen.
  useEffect(() => {
    let cancelled = false;
    setMediaError(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setMediaError("This browser doesn't support camera or microphone access. Please try a modern browser like Chrome.");
      return;
    }

    const constraints: MediaStreamConstraints =
      activeMode === "audio" ? { audio: true } : { video: true, audio: true };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        setMicOnly(activeMode === "audio" || stream.getVideoTracks().length === 0);
        [mobileVideoRef, desktopVideoRef].forEach((ref) => {
          if (ref.current) ref.current.srcObject = stream;
        });
        trackEvent("permissions_granted", {
          scenario_type: SCENARIO_TYPE,
          question_number: currentQuestion,
          user_id: userId,
        });
      })
      .catch((err) => {
        if (cancelled) return;
        const name = err?.name;
        if (name === "NotAllowedError" || name === "PermissionDeniedError") {
          setMediaError(
            activeMode === "av"
              ? "Camera and microphone access was denied. You can try again or continue with microphone only."
              : "Microphone access was denied. Please allow microphone access to continue.",
          );
        } else if (name === "NotFoundError" || name === "DevicesNotFoundError") {
          setMediaError("We couldn't find a camera or microphone on this device.");
        } else {
          setMediaError("We couldn't access your camera or microphone. Please try again.");
        }
      });

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [activeMode, retryToken]);

  // Stop everything if the user navigates away mid-recording.
  useEffect(() => {
    return () => {
      isRecordingRef.current = false;
      try {
        recognitionRef.current?.stop();
      } catch {
        // ignore
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        try {
          mediaRecorderRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRecording) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const retry = () => {
    setMediaError(null);
    setRetryToken((t) => t + 1);
  };

  const continueAudioOnly = () => {
    setMediaError(null);
    setActiveMode("audio");
    setRetryToken((t) => t + 1);
  };

  const handleStart = () => {
    setSeconds(0);
    setEmptyTranscriptError(false);
    setSttError(null);
    finalTranscriptRef.current = "";
    setTranscript("");
    isRecordingRef.current = true;
    setIsRecording(true);
    trackEvent("recording_started", {
      scenario_type: SCENARIO_TYPE,
      question_number: currentQuestion,
      user_id: userId,
    });

    // Real microphone recording via MediaRecorder.
    if (streamRef.current && typeof MediaRecorder !== "undefined") {
      try {
        const audioTracks = streamRef.current.getAudioTracks();
        if (audioTracks.length > 0) {
          const audioStream = new MediaStream(audioTracks);
          const recorder = new MediaRecorder(audioStream);
          mediaRecorderRef.current = recorder;
          recorder.start();
        }
      } catch {
        // Recording indicator still works even if MediaRecorder fails to start.
      }
    }

    // Real browser speech-to-text.
    const Ctor = getSpeechRecognitionCtor();
    if (Ctor) {
      const recognition = new Ctor();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognition.onresult = (event: any) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscriptRef.current += result[0].transcript + " ";
          } else {
            interim += result[0].transcript;
          }
        }
        setTranscript((finalTranscriptRef.current + interim).trim());
      };
      recognition.onerror = (event: any) => {
        if (event?.error === "no-speech" || event?.error === "aborted") return;
        setSttError(
          event?.error === "not-allowed" || event?.error === "service-not-allowed"
            ? "Microphone access is required for speech-to-text."
            : "Speech recognition stopped unexpectedly.",
        );
      };
      recognition.onend = () => {
        if (isRecordingRef.current) {
          try {
            recognition.start();
          } catch {
            // ignore restart failures
          }
        }
      };
      recognitionRef.current = recognition;
      try {
        recognition.start();
      } catch {
        setSttError("Speech recognition couldn't start.");
      }
    }
  };

  const handleStop = () => {
    isRecordingRef.current = false;
    setIsRecording(false);
    setIsSubmitting(true);
    const responseDurationSeconds = seconds;

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // ignore
      }
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }

    setTimeout(() => {
      setIsSubmitting(false);

      // Also hand off the question prompt text so the Feedback screen can
      // request AI feedback without needing its own copy of the question list.
      sessionStorage.setItem(`outloud_question_${currentQuestion}`, question.prompt);

      if (!speechSupported) {
        sessionStorage.setItem(`outloud_transcript_${currentQuestion}`, "");
        sessionStorage.setItem(`outloud_transcript_unsupported_${currentQuestion}`, "1");
        trackEvent("response_submitted", {
          scenario_type: SCENARIO_TYPE,
          question_number: currentQuestion,
          user_id: userId,
          response_duration_seconds: responseDurationSeconds,
        });
        setLocation(`/feedback?q=${currentQuestion}`);
        return;
      }

      const finalText = finalTranscriptRef.current.trim();
      if (!finalText) {
        setEmptyTranscriptError(true);
        return;
      }

      sessionStorage.removeItem(`outloud_transcript_unsupported_${currentQuestion}`);
      sessionStorage.setItem(`outloud_transcript_${currentQuestion}`, finalText);
      trackEvent("response_submitted", {
        scenario_type: SCENARIO_TYPE,
        question_number: currentQuestion,
        user_id: userId,
        response_duration_seconds: responseDurationSeconds,
      });
      setLocation(`/feedback?q=${currentQuestion}`);
    }, 1200);
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

      {!speechSupported && (
        <div className="w-full bg-error-container text-on-error-container px-sm md:px-lg py-2 flex items-center gap-2 justify-center">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p className="font-caption text-caption">
            Speech-to-text isn't available in this browser. Your response will still record, but no transcript will be captured. Try Chrome for the full experience.
          </p>
        </div>
      )}

      {/* Main Layout */}
      <main className="flex-grow w-full max-w-container-max mx-auto px-sm md:px-lg py-md md:py-lg flex flex-col md:flex-row gap-gutter overflow-hidden relative">
        
        {/* Mobile Camera View (Top) */}
        <div className="md:hidden w-full aspect-[3/4] max-h-[353px] bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden relative shadow-sm shrink-0 flex items-center justify-center">
          <CameraSurface
            videoRef={mobileVideoRef}
            className="w-full h-full"
            mediaError={mediaError}
            micOnly={micOnly}
            activeMode={activeMode}
            onRetry={retry}
            onContinueAudioOnly={continueAudioOnly}
          />
          {isRecording && (
            <div className="absolute top-3 right-3 flex items-center gap-2 bg-surface-container-lowest/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-outline-variant">
              <div className="w-2 h-2 rounded-full bg-error animate-pulse"></div>
              <span className="font-caption text-caption font-medium text-on-surface">Live {formatTime(seconds)}</span>
            </div>
          )}
          <div className="absolute bottom-3 right-3 flex gap-2">
            <div className="w-10 h-10 rounded-full bg-surface-container-lowest/80 backdrop-blur-sm border border-outline-variant flex items-center justify-center text-on-surface">
              {micOnly || mediaError ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </div>
            <div className="w-10 h-10 rounded-full bg-surface-container-lowest/80 backdrop-blur-sm border border-outline-variant flex items-center justify-center text-on-surface">
              {micOnly || mediaError ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </div>
          </div>
          {isRecording && <div className="absolute inset-0 border-4 border-error rounded-xl pointer-events-none animate-pulse"></div>}
        </div>

        {/* Desktop Camera View */}
        <div className="hidden md:flex w-full h-full bg-surface-container-lowest rounded-[16px] border border-outline-variant p-base relative overflow-hidden flex-col shadow-sm shrink md:w-5/12">
          <div className="absolute top-sm left-sm z-10 flex gap-xs">
            <div className="bg-tertiary/80 backdrop-blur-sm text-on-tertiary font-label-md text-label-md px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
              {micOnly || mediaError ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
              {micOnly || mediaError ? "Camera Off" : "Camera On"}
              <span className="border-l border-on-tertiary/30 ml-1 pl-2">You</span>
            </div>
          </div>
          <CameraSurface
            videoRef={desktopVideoRef}
            className="w-full h-full rounded-xl"
            mediaError={mediaError}
            micOnly={micOnly}
            activeMode={activeMode}
            onRetry={retry}
            onContinueAudioOnly={continueAudioOnly}
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

            {isRecording && speechSupported && (
              <div className="w-full bg-surface-container-low rounded-lg p-sm border border-outline-variant/50 text-left">
                <p className="font-label-md text-label-md text-secondary mb-1">Live transcript</p>
                <p className="font-body-md text-body-md text-on-surface-variant italic min-h-[1.5em]">
                  {transcript || "Listening..."}
                </p>
              </div>
            )}

            {sttError && (
              <p className="mt-sm font-caption text-caption text-error">{sttError}</p>
            )}

            {emptyTranscriptError && (
              <div className="mt-sm w-full bg-error-container text-on-error-container rounded-lg p-sm flex items-start gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="font-body-md text-body-md">We couldn't capture your response. Please try again.</p>
              </div>
            )}
          </div>

          {/* Controls Footer */}
          <div className="p-sm md:p-lg bg-surface border-t border-outline-variant/30 rounded-b-[16px] shrink-0">
            {!isRecording ? (
              <div className="flex flex-col gap-sm">
                <button 
                  onClick={handleStart}
                  disabled={!!mediaError}
                  className="w-full bg-secondary text-on-secondary font-label-md text-label-md py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-on-secondary-container transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Disc className="w-5 h-5 fill-current text-on-secondary" />
                  Start Recording
                </button>
                <p className="hidden md:block text-center font-caption text-caption text-on-surface-variant">
                  {mediaError ? "Resolve access above to start recording." : "Your camera and microphone are ready."}
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
                      Processing your response...
                    </>
                  ) : (
                    <>
                      <StopCircle className="w-5 h-5 text-secondary fill-current" />
                      Stop Recording
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
