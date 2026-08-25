import { Link, useLocation } from "wouter";
import { LogoutLink } from "@/components/logout-link";
import { 
  LayoutDashboard, 
  Mic, 
  History, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Bell, 
  Menu,
  Brain,
  Timer,
  MessageSquare,
  ArrowRight,
  ChevronRight,
  Plus
} from "lucide-react";
import { useGetMe, useListSessions } from "@workspace/api-client-react";
import { formatRelativeDate, initialFor } from "@/lib/utils";

export default function ReturningUser() {
  const [, setLocation] = useLocation();

  const { data: me } = useGetMe();
  const { data: sessionsData } = useListSessions();
  const sessions = sessionsData?.sessions ?? [];
  const sessionCount = sessions.length;
  const lastSession = sessions[0];
  const recentSessions = sessions.slice(0, 2);

  const name = me?.name ?? "";
  const initial = initialFor(name);
  const lastFocusTag = lastSession?.answers[0]?.feedback.whatWentWell.tags[0];
  const subtitle = lastSession
    ? `You last practised ${formatRelativeDate(new Date(lastSession.completedAt))}. Ready to get back into practice?`
    : "Ready for your first practice?";

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col md:flex-row antialiased">
      {/* Mobile Top Navigation Bar */}
      <header className="md:hidden flex justify-between items-center w-full px-sm h-16 bg-surface border-b border-surface-variant sticky top-0 z-50">
        <div className="flex items-center gap-xs">
          <span className="font-headline-md text-headline-lg-mobile font-bold text-primary">OutLoud</span>
        </div>
        <div className="flex items-center gap-sm">
          <button className="p-2 text-on-surface-variant hover:text-primary transition-colors duration-200">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 text-on-surface-variant hover:text-primary transition-colors duration-200">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Side Navigation Bar (Desktop) */}
      <aside className="hidden md:flex flex-col h-screen w-64 bg-surface-container-low border-r border-surface-variant p-md gap-sm sticky top-0">
        <div className="flex flex-col gap-xs mb-lg">
          <div className="flex items-center gap-sm">
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-headline-md text-headline-md">{initial}</div>
            <div>
              <h1 className="font-headline-md text-headline-md font-bold text-primary">OutLoud</h1>
              <p className="font-caption text-caption text-on-surface-variant">Speak with Confidence</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-xs">
          <Link href="/dashboard" className="flex items-center gap-sm bg-secondary-container text-on-secondary-container rounded-lg px-4 py-2 font-medium scale-[0.99] transition-transform">
            <LayoutDashboard className="w-5 h-5 fill-current" />
            <span className="font-label-md text-label-md">Dashboard</span>
          </Link>
          <Link href="/practice" className="flex items-center gap-sm text-on-surface-variant px-4 py-2 hover:bg-surface-variant rounded-lg transition-colors duration-200">
            <Mic className="w-5 h-5" />
            <span className="font-label-md text-label-md">Practice</span>
          </Link>
          <Link href="/dashboard" className="flex items-center gap-sm text-on-surface-variant px-4 py-2 hover:bg-surface-variant rounded-lg transition-colors duration-200">
            <History className="w-5 h-5" />
            <span className="font-label-md text-label-md">History</span>
          </Link>
          <Link href="/" className="flex items-center gap-sm text-on-surface-variant px-4 py-2 hover:bg-surface-variant rounded-lg transition-colors duration-200">
            <Settings className="w-5 h-5" />
            <span className="font-label-md text-label-md">Settings</span>
          </Link>
        </nav>

        <div className="mb-sm">
          <button 
            onClick={() => setLocation("/onboarding")}
            className="w-full bg-primary text-on-primary font-label-md text-label-md py-sm rounded-lg hover:bg-on-primary-fixed-variant transition-colors duration-200 flex items-center justify-center gap-xs"
          >
            <Plus className="w-4 h-4" /> Start Practice
          </button>
        </div>

        <div className="flex flex-col gap-xs mt-auto pt-sm border-t border-surface-variant">
          <Link href="/" className="flex items-center gap-sm text-on-surface-variant px-4 py-2 hover:bg-surface-variant rounded-lg transition-colors duration-200">
            <HelpCircle className="w-5 h-5" />
            <span className="font-label-md text-label-md">Help</span>
          </Link>
          <LogoutLink className="flex items-center gap-sm text-on-surface-variant px-4 py-2 hover:bg-surface-variant rounded-lg transition-colors duration-200 w-full text-left">
            <LogOut className="w-5 h-5" />
            <span className="font-label-md text-label-md">Sign Out</span>
          </LogoutLink>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="flex-1 flex flex-col min-h-screen">
        <div className="flex-1 px-sm md:px-lg py-lg max-w-container-max mx-auto w-full">
          
          {/* Page Header */}
          <div className="mb-lg">
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-xs">Welcome back{name ? `, ${name}` : ""} 👋</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">{subtitle}</p>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            
            {/* Main Column (Left) */}
            <div className="lg:col-span-8 flex flex-col gap-gutter">
              {/* Featured Practice Card */}
              <div className="bg-surface-container-lowest border border-surface-variant rounded-xl p-md shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow duration-300">
                <div className="absolute -right-16 -top-16 w-64 h-64 bg-secondary-container rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-sm">
                    <div className="flex items-center gap-xs text-secondary mb-2">
                      <Brain className="w-5 h-5" />
                      <span className="font-label-md text-label-md uppercase tracking-wider">Today's Challenge</span>
                    </div>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-primary mb-xs">Unexpected Questions</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-md max-w-2xl">Perfect for getting back into the flow. Practise thinking on your feet with randomized questions.</p>
                  <div className="flex items-center gap-sm mb-lg">
                    <div className="flex items-center gap-xs text-on-surface-variant bg-surface-container-low px-3 py-1.5 rounded-lg">
                      <Timer className="w-4 h-4" />
                      <span className="font-caption text-caption">5 min</span>
                    </div>
                    <div className="flex items-center gap-xs text-on-surface-variant bg-surface-container-low px-3 py-1.5 rounded-lg">
                      <MessageSquare className="w-4 h-4" />
                      <span className="font-caption text-caption">3 questions</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setLocation("/onboarding")}
                    className="bg-primary text-on-primary font-label-md text-label-md px-lg py-sm rounded-lg hover:bg-on-primary-fixed-variant transition-colors duration-200 inline-flex items-center gap-xs"
                  >
                    Start Today's Practice
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="font-label-md text-label-md text-primary uppercase tracking-wider mb-sm">Recent History</h3>
                {recentSessions.length === 0 ? (
                  <div className="bg-surface-container-lowest border border-surface-variant rounded-xl p-lg flex flex-col items-center text-center gap-sm">
                    <History className="w-8 h-8 text-on-surface-variant" />
                    <p className="font-body-md text-body-md text-on-surface-variant max-w-[22rem]">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                    {recentSessions.map((session) => (
                      <div
                        key={session.id}
                        onClick={() => setLocation("/dashboard")}
                        className="bg-surface-container-lowest border border-surface-variant rounded-xl p-md shadow-sm hover:border-outline-variant transition-colors duration-200 cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-sm">
                          <h4 className="font-label-md text-label-md text-primary">Completed session</h4>
                          <ChevronRight className="w-5 h-5 text-on-surface-variant" />
                        </div>
                        <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 mb-md">{session.answers[0]?.question ?? `${session.answers.length} question${session.answers.length === 1 ? "" : "s"} practiced`}</p>
                        <div className="flex justify-between items-center text-caption font-caption text-on-surface-variant">
                          <span>{formatRelativeDate(new Date(session.completedAt))}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Secondary Column (Right) */}
            <div className="lg:col-span-4 flex flex-col gap-gutter mt-6 lg:mt-0">
              <div className="bg-surface-container-lowest border border-surface-variant rounded-xl p-md shadow-sm">
                <h3 className="font-label-md text-label-md text-primary uppercase tracking-wider mb-md">Your Progress</h3>
                <div className="flex flex-col gap-md">
                  <div>
                    <p className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-1">{sessionCount}</p>
                    <p className="font-body-md text-body-md text-on-surface-variant">sessions completed</p>
                  </div>
                  <div className="h-px bg-surface-variant w-full"></div>
                  <div>
                    <p className="font-label-md text-label-md text-on-surface-variant mb-1">Last focus</p>
                    <p className="font-body-md text-body-md text-primary font-medium">{lastFocusTag ?? "Not available yet"}</p>
                  </div>
                  <div className="h-px bg-surface-variant w-full"></div>
                  <div>
                    <p className="font-label-md text-label-md text-on-surface-variant mb-1">Today's challenge</p>
                    <p className="font-body-md text-body-md text-primary font-medium">Unexpected questions</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <footer className="w-full bg-surface-container py-md px-sm md:px-lg mt-auto border-t border-surface-variant flex flex-col md:flex-row justify-between items-center gap-sm">
          <span className="font-label-md text-label-md font-bold text-primary">OutLoud</span>
          <div className="flex flex-wrap gap-sm justify-center">
            <Link href="/" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors duration-200">Privacy Policy</Link>
            <Link href="/" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors duration-200">Terms of Service</Link>
            <Link href="/" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors duration-200">Contact Support</Link>
          </div>
          <p className="font-caption text-caption text-on-surface-variant">© 2024 OutLoud Studio. Precision in every word.</p>
        </footer>
      </main>
    </div>
  );
}
