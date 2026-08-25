import { type ReactNode, useEffect, useRef } from 'react';
import { QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { ClerkProvider, Show, useClerk } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { useGetMe } from '@workspace/api-client-react';
import { Loader2 } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { queryClient } from '@/lib/queryClient';
import { clerkAppearance } from '@/lib/clerk-appearance';
import NotFound from '@/pages/not-found';
import {
  Route,
  Switch,
  Redirect,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

import Landing from '@/pages/landing';
import SignInPage from '@/pages/sign-in';
import SignUpPage from '@/pages/sign-up';
import WelcomeName from '@/pages/welcome-name';
import Dashboard from '@/pages/dashboard';
import Onboarding from '@/pages/onboarding';
import Permissions from '@/pages/permissions';
import Practice from '@/pages/practice';
import Complete from '@/pages/complete';
import Feedback from '@/pages/feedback';
import Returning from '@/pages/returning';

// REQUIRED — copy verbatim. Resolves the key from window.location.hostname so the
// same build serves multiple Clerk custom domains. Do not inline the env var, leave
// publishableKey undefined, or replace publishableKeyFromHost with anything else.
const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

// REQUIRED — copy verbatim. Empty in dev (Clerk hits dev FAPI directly), auto-set
// in prod. Do NOT gate on import.meta.env.PROD / NODE_ENV — the empty dev value
// is intentional, and any branching breaks the prod proxy.
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

// Clerk passes full paths to routerPush/routerReplace, but wouter's
// setLocation prepends the base — strip it to avoid doubling.
function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || '/'
    : path;
}

if (!clerkPubKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in .env file');
}

function FullScreenSpinner() {
  return (
    <div className="bg-background min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
    </div>
  );
}

/** Wraps a page that requires an authenticated user with a saved name.
 * Signed-out visitors are sent to the public landing page; signed-in users
 * without a saved name are sent to the name-capture step first. */
function RequireAuth({ children }: { children: ReactNode }) {
  return (
    <>
      <Show when="signed-in">
        <RequireProfileName>{children}</RequireProfileName>
      </Show>
      <Show when="signed-out">
        <Redirect to="/" />
      </Show>
    </>
  );
}

function RequireProfileName({ children }: { children: ReactNode }) {
  const { data, isLoading } = useGetMe();
  if (isLoading) return <FullScreenSpinner />;
  if (!data?.name) return <Redirect to="/welcome-name" />;
  return <>{children}</>;
}

/** The base path ("/") must stay public for signed-out visitors and send
 * signed-in users straight into the app (or to the name-capture step first). */
function HomeRedirect() {
  return (
    <>
      <Show when="signed-in">
        <PostAuthRedirect />
      </Show>
      <Show when="signed-out">
        <Landing />
      </Show>
    </>
  );
}

function PostAuthRedirect() {
  const { data, isLoading } = useGetMe();
  if (isLoading) return <FullScreenSpinner />;
  return <Redirect to={data?.name ? "/dashboard" : "/welcome-name"} />;
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={HomeRedirect} />
        <Route path="/sign-in/*?" component={SignInPage} />
        <Route path="/sign-up/*?" component={SignUpPage} />
        <Route path="/welcome-name">
          <Show when="signed-in">
            <WelcomeName />
          </Show>
          <Show when="signed-out">
            <Redirect to="/" />
          </Show>
        </Route>
        <Route path="/dashboard">
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        </Route>
        <Route path="/onboarding">
          <RequireAuth>
            <Onboarding />
          </RequireAuth>
        </Route>
        <Route path="/permissions">
          <RequireAuth>
            <Permissions />
          </RequireAuth>
        </Route>
        <Route path="/practice">
          <RequireAuth>
            <Practice />
          </RequireAuth>
        </Route>
        <Route path="/complete">
          <RequireAuth>
            <Complete />
          </RequireAuth>
        </Route>
        <Route path="/feedback">
          <RequireAuth>
            <Feedback />
          </RequireAuth>
        </Route>
        <Route path="/returning">
          <RequireAuth>
            <Returning />
          </RequireAuth>
        </Route>
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

// Helps the user's webview stay up-to-date when the signed-in user changes by
// invalidating the QueryClient cache.
function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (
        prevUserIdRef.current !== undefined &&
        prevUserIdRef.current !== userId
      ) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);

  return null;
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: {
          start: {
            title: 'Welcome back',
            subtitle: 'Sign in to continue practising with OutLoud',
          },
        },
        signUp: {
          start: {
            title: 'Create your account',
            subtitle: 'Start practising and speak with confidence',
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ClerkQueryClientCacheInvalidator />
          <Router />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
