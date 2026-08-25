import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Mic,
  History,
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  Info,
  Zap,
  ArrowRight,
  TrendingUp,
  Timer,
  MessageSquare,
  ChevronRight,
  User,
  BarChart,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { LogoutLink } from "@/components/logout-link";
import { useGetMe, useListSessions } from "@workspace/api-client-react";
import { formatRelativeDate, initialFor } from "@/lib/utils";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const { data: me } = useGetMe();
  const { data: sessionsData } = useListSessions();
  const sessions = sessionsData?.sessions ?? [];
  const sessionCount = sessions.length;
  const lastSession = sessions[0];
  const recentSessions = sessions.slice(0, 2);

  const name = me?.name ?? "";
  const initial = initialFor(name);
  const lastPracticedLabel = lastSession
    ? `You last practised ${formatRelativeDate(new Date(lastSession.completedAt))}. Ready to continue?`
    : "Ready for your first practice?";
  const lastFocusTags = lastSession?.answers[0]?.feedback.whatWentWell.tags.slice(0, 2) ?? [];

  return (
    <div className="bg-background text-on-background flex flex-col md:flex-row min-h-screen">
      {/* TopNavBar (Mobile Only) */}
      <nav className="md:hidden flex justify-between items-center w-full px-sm h-16 bg-surface border-b border-surface-variant sticky top-0 z-50">
        <div className="font-headline-md text-headline-md font-bold text-primary">OutLoud</div>
        <div className="flex items-center gap-sm">
          <button className="text-on-surface-variant p-2 hover:bg-surface-variant rounded-full transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">
            {initial}
          </div>
        </div>
      </nav>

      {/* SideNavBar (Desktop Only) */}
      <aside className="hidden md:flex flex-col h-screen p-md gap-sm w-64 docked left-0 bg-surface-container-low border-r border-surface-variant sticky top-0 z-40">
        <div className="flex flex-col mb-xl">
          <div className="font-headline-md text-headline-md font-bold text-primary">OutLoud</div>
          <div className="font-caption text-caption text-on-surface-variant mt-1">Speak with Confidence</div>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          <Link href="/dashboard" className="flex items-center gap-3 bg-secondary-container text-on-secondary-container rounded-lg px-4 py-2 font-medium scale-[0.99] transition-transform">
            <LayoutDashboard className="w-5 h-5 fill-current" />
            <span className="font-label-md text-label-md">Dashboard</span>
          </Link>
          <Link href="/onboarding" className="flex items-center gap-3 text-on-surface-variant px-4 py-2 hover:bg-surface-variant rounded-lg hover:text-primary transition-colors duration-200">
            <Mic className="w-5 h-5" />
            <span className="font-label-md text-label-md">Practice</span>
          </Link>
          <Link href="/returning" className="flex items-center gap-3 text-on-surface-variant px-4 py-2 hover:bg-surface-variant rounded-lg hover:text-primary transition-colors duration-200">
            <History className="w-5 h-5" />
            <span className="font-label-md text-label-md">History</span>
          </Link>
          <button
            onClick={() => setSettingsOpen(true)}
            className="flex items-center gap-3 text-on-surface-variant px-4 py-2 hover:bg-surface-variant rounded-lg hover:text-primary transition-colors duration-200 text-left"
          >
            <Settings className="w-5 h-5" />
            <span className="font-label-md text-label-md">Settings</span>
          </button>
        </nav>

        <div className="mt-auto flex flex-col gap-4">
          <button 
            onClick={() => setLocation("/onboarding")}
            className="w-full bg-primary text-on-primary py-2 px-4 rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity"
          >
            Start Practice
          </button>
          
          <div className="flex flex-col gap-2 pt-4 border-t border-surface-variant">
            <button
              onClick={() => setHelpOpen(true)}
              className="flex items-center gap-3 text-on-surface-variant px-4 py-2 hover:bg-surface-variant rounded-lg hover:text-primary transition-colors duration-200 text-left"
            >
              <HelpCircle className="w-5 h-5" />
              <span className="font-label-md text-label-md">Help</span>
            </button>
            <LogoutLink className="flex items-center gap-3 text-on-surface-variant px-4 py-2 hover:bg-surface-variant rounded-lg hover:text-primary transition-colors duration-200 w-full text-left">
              <LogOut className="w-5 h-5" />
              <span className="font-label-md text-label-md">Sign Out</span>
            </LogoutLink>
          </div>

          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
              {initial}
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-primary">{name || "Your account"}</span>
              <span className="font-caption text-caption text-on-surface-variant">Free Plan</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="flex-1 p-sm md:p-lg md:ml-0 max-w-container-max mx-auto w-full mb-16 md:mb-0">
        <header className="mb-xl hidden md:block">
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-2">Good morning{name ? `, ${name}` : ""} 👋</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-4">Ready for today's practice?</p>
          <div className="inline-flex items-center gap-2 bg-surface-variant text-primary-container px-3 py-1.5 rounded-full font-caption text-caption">
            <Info className="w-4 h-4" />
            {lastPracticedLabel}
          </div>
        </header>

        <header className="mb-md md:hidden mt-2">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">Good morning{name ? `, ${name}` : ""} 👋</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Primary Action Card (Bento Large) */}
          <section className="lg:col-span-8">
            <div className="bg-surface-container-lowest rounded-xl border border-surface-variant md:border-outline-variant p-sm md:p-md shadow-sm h-full flex flex-col justify-between relative overflow-hidden group hover:border-primary-fixed-dim transition-colors">
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-container opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none hidden md:block"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-surface-container/30 to-transparent pointer-events-none md:hidden"></div>
              
              <div className="z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="hidden md:flex p-2 bg-surface-container-low rounded-lg text-secondary">
                    <Zap className="w-5 h-5 fill-current" />
                  </div>
                  <Mic className="w-5 h-5 text-secondary md:hidden" />
                  <span className="font-label-md text-label-md text-secondary uppercase tracking-wider hidden md:inline">Recommended Module</span>
                  <h2 className="font-headline-md text-headline-md text-on-surface md:hidden">Unexpected Interview Questions</h2>
                </div>
                
                <h2 className="font-headline-md text-headline-md text-primary mb-3 hidden md:block">Unexpected Interview Questions</h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-[28rem] mb-6 md:mb-6">
                  <span className="hidden md:inline">Practise answering questions you haven't prepared for. Focus on structuring thoughts quickly under pressure.</span>
                  <span className="md:hidden">Practice thinking on your feet with randomized behavioral questions to build executive presence.</span>
                </p>

                <div className="flex items-center gap-4 mb-6 md:mb-8">
                  <div className="flex items-center gap-1.5 text-on-surface-variant">
                    <Timer className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="font-caption text-caption">5 min</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-outline-variant hidden md:block"></div>
                  <div className="flex items-center gap-1.5 text-on-surface-variant hidden md:flex">
                    <MessageSquare className="w-5 h-5" />
                    <span className="font-caption text-caption">3 questions</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-on-surface-variant md:hidden">
                    <BarChart className="w-4 h-4" />
                    <span className="font-caption text-caption">Intermediate</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setLocation("/onboarding")}
                className="bg-primary text-on-primary font-label-md text-label-md py-3 px-6 rounded-lg w-full md:w-fit hover:bg-on-primary-fixed-variant transition-colors flex items-center justify-center gap-2 z-10"
              >
                Start Practice
                <ArrowRight className="w-4 h-4 hidden md:block" />
              </button>
            </div>
          </section>

          {/* Progress Summary (Desktop / Mobile variations) */}
          <section className="lg:col-span-4 flex flex-col gap-sm md:gap-gutter">
            {/* Desktop Progress */}
            <div className="hidden md:block bg-surface-container-lowest rounded-xl border border-outline-variant p-md shadow-sm h-full">
              <h3 className="font-label-md text-label-md text-primary mb-4 flex items-center justify-between">
                Your Progress
                <TrendingUp className="w-5 h-5 text-on-surface-variant" />
              </h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="font-display-lg text-display-lg text-primary">{sessionCount}</span>
                <span className="font-body-md text-body-md text-on-surface-variant">sessions completed</span>
              </div>
              {lastFocusTags.length > 0 ? (
                <div className="space-y-4">
                  <div>
                    <div className="font-caption text-caption text-on-surface-variant mb-1 uppercase tracking-wide">Last Focus</div>
                    <div className="flex flex-wrap gap-2">
                      {lastFocusTags.map((tag: string) => (
                        <span key={tag} className="px-2.5 py-1 bg-surface-container-low border border-outline-variant text-primary rounded-md font-caption text-caption">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Complete a practice session to see your focus areas here.
                </p>
              )}
            </div>

            {/* Mobile Progress Stack */}
            <div className="md:hidden flex justify-between items-end mt-2">
              <h3 className="font-headline-md text-headline-md text-on-surface">Your Progress</h3>
              <Link href="/returning" className="font-label-md text-label-md text-secondary hover:underline">View All</Link>
            </div>

            <div className="md:hidden bg-surface-container-lowest rounded-lg border border-surface-variant p-sm flex items-center justify-between">
              <div className="flex items-center gap-sm">
                <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface">Sessions completed</p>
                  <p className="font-caption text-caption text-on-surface-variant">{lastPracticedLabel}</p>
                </div>
              </div>
              <span className="font-headline-md text-headline-md text-primary">{sessionCount}</span>
            </div>
          </section>

          {/* Recent History List (Desktop) & Feedback Snippet (Mobile) */}
          <section className="lg:col-span-12 mt-4 md:mt-4">
            <div className="hidden md:flex items-center justify-between mb-4">
              <h3 className="font-headline-md text-[20px] font-semibold text-primary">Recent History</h3>
              {sessionCount > 0 && (
                <Link href="/returning" className="font-label-md text-label-md text-primary hover:underline">View All</Link>
              )}
            </div>

            <h3 className="font-headline-md text-headline-md text-on-surface mb-sm md:hidden">Recent Feedback</h3>

            {recentSessions.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-xl border border-surface-variant p-lg flex flex-col items-center text-center gap-sm">
                <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant">
                  <History className="w-6 h-6" />
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-[24rem]">
                  Your practice history will appear here after your first session.
                </p>
                <button
                  onClick={() => setLocation("/onboarding")}
                  className="mt-xs bg-primary text-on-primary font-label-md text-label-md px-lg py-sm rounded-lg hover:opacity-90 transition-opacity"
                >
                  Start Practising
                </button>
              </div>
            ) : (
              <>
                {/* Desktop History Table */}
                <div className="hidden md:block bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
                  <div className="divide-y divide-surface-variant">
                    {recentSessions.map((session) => {
                      const firstAnswer = session.answers[0];
                      const focusTag = firstAnswer?.feedback.whatWentWell.tags[0];
                      return (
                        <div key={session.id} className="p-sm md:px-md md:py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-surface-container-low transition-colors cursor-pointer group">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary-container shrink-0 group-hover:bg-primary-container group-hover:text-on-primary transition-colors">
                              <Mic className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-label-md text-label-md text-primary mb-1 line-clamp-1 max-w-[24rem]">{firstAnswer?.question ?? "Practice session"}</div>
                              <div className="flex items-center gap-2 font-caption text-caption text-on-surface-variant">
                                <span>{formatRelativeDate(new Date(session.completedAt))}</span>
                                <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                                <span>{session.answers.length} question{session.answers.length === 1 ? "" : "s"}</span>
                                {focusTag && (
                                  <>
                                    <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                                    <span>Focus: {focusTag}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 self-end md:self-auto">
                            <ChevronRight className="w-5 h-5 text-outline-variant group-hover:text-primary transition-colors" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Mobile Feedback Snippet */}
                <div className="md:hidden bg-surface-container-lowest rounded-xl border border-surface-variant p-sm">
                  <div className="flex justify-between items-start mb-sm">
                    <div>
                      <p className="font-label-md text-label-md text-on-surface line-clamp-1">{recentSessions[0].answers[0]?.question ?? "Practice session"}</p>
                      <p className="font-caption text-caption text-on-surface-variant">{formatRelativeDate(new Date(recentSessions[0].completedAt))}</p>
                    </div>
                    <span className="bg-surface-variant text-on-surface-variant px-2 py-1 rounded-full font-caption text-caption">Completed</span>
                  </div>
                  {(recentSessions[0].answers[0]?.feedback.whatWentWell.tags.length ?? 0) > 0 && (
                    <div className="flex flex-wrap gap-xs">
                      {recentSessions[0].answers[0].feedback.whatWentWell.tags.slice(0, 2).map((tag: string) => (
                        <span key={tag} className="bg-secondary/10 text-secondary border border-secondary/20 px-3 py-1 rounded-[8px] font-label-md text-[12px]">{tag}</span>
                      ))}
                    </div>
                  )}
                  <p className="font-body-md text-[14px] text-on-surface-variant mt-sm leading-relaxed border-t border-surface-variant pt-sm">
                    "{recentSessions[0].answers[0]?.feedback.whatWentWell.summary}"
                  </p>
                </div>
              </>
            )}
          </section>
        </div>

        {/* Footer (Desktop) */}
        <footer className="hidden md:flex mt-xl pt-md border-t border-surface-variant justify-between items-center gap-4 text-caption font-caption text-on-surface-variant">
          <div>© 2024 OutLoud Studio. Precision in every word.</div>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="/" className="hover:text-primary transition-colors">Contact Support</Link>
          </div>
        </footer>
      </main>

      {/* Bottom Navigation Shell (Mobile Only) */}
      <nav className="fixed bottom-0 w-full bg-surface border-t border-surface-variant px-sm py-2 flex justify-between items-center z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:hidden">
        <Link href="/dashboard" className="flex flex-col items-center gap-1 p-2 min-w-[64px] text-primary transition-colors">
          <div className="w-16 h-8 bg-secondary-container rounded-full flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 fill-current" />
          </div>
          <span className="font-label-md text-[10px] font-bold">Dashboard</span>
        </Link>
        <Link href="/onboarding" className="flex flex-col items-center gap-1 p-2 min-w-[64px] text-on-surface-variant hover:text-primary transition-colors">
          <Mic className="w-5 h-5" />
          <span className="font-label-md text-[10px]">Practice</span>
        </Link>
        <Link href="/dashboard" className="flex flex-col items-center gap-1 p-2 min-w-[64px] text-on-surface-variant hover:text-primary transition-colors">
          <History className="w-5 h-5" />
          <span className="font-label-md text-[10px]">History</span>
        </Link>
        <Link href="/" className="flex flex-col items-center gap-1 p-2 min-w-[64px] text-on-surface-variant hover:text-primary transition-colors">
          <User className="w-5 h-5" />
          <span className="font-label-md text-[10px]">Profile</span>
        </Link>
      </nav>

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
