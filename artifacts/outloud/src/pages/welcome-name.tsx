import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useUser } from "@clerk/react";
import { Mic, Loader2, AlertCircle } from "lucide-react";
import { useGetMe, useUpdateMe } from "@workspace/api-client-react";

export default function WelcomeName() {
  const [, setLocation] = useLocation();
  const { user } = useUser();
  const { data, isLoading } = useGetMe();
  const updateMe = useUpdateMe();
  const [name, setName] = useState("");
  const [prefilled, setPrefilled] = useState(false);

  // Prefill from the Clerk profile once, but keep it fully editable.
  useEffect(() => {
    if (prefilled) return;
    if (data?.name) {
      setLocation("/dashboard", { replace: true });
      return;
    }
    if (!isLoading) {
      setName(user?.fullName ?? user?.firstName ?? "");
      setPrefilled(true);
    }
  }, [data, isLoading, prefilled, user, setLocation]);

  const trimmed = name.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trimmed) return;
    updateMe.mutate(
      { data: { name: trimmed } },
      { onSuccess: () => setLocation("/dashboard", { replace: true }) },
    );
  };

  if (isLoading || !prefilled) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background min-h-screen flex items-center justify-center p-md">
      <div className="w-full max-w-[440px] bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-lg md:p-xl flex flex-col gap-lg">
        <div className="flex flex-col items-center text-center gap-sm">
          <div className="w-14 h-14 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
            <Mic className="w-7 h-7" />
          </div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
            What's your name?
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-[26rem]">
            We'll use this to personalise your dashboard and practice sessions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-sm">
          <label htmlFor="name" className="font-label-md text-label-md text-on-surface-variant">
            Your name
          </label>
          <input
            id="name"
            type="text"
            required
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alex Morgan"
            className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {updateMe.isError && (
            <div className="flex items-center gap-2 text-error font-caption text-caption">
              <AlertCircle className="w-4 h-4 shrink-0" />
              We couldn't save your name. Please try again.
            </div>
          )}

          <button
            type="submit"
            disabled={!trimmed || updateMe.isPending}
            className="mt-sm w-full bg-primary text-on-primary font-label-md text-label-md py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {updateMe.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
