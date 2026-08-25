import { Link, useLocation } from "wouter";

export default function SignIn() {
  const [, setLocation] = useLocation();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="w-full max-w-[28rem] px-4 sm:px-0">
        {/* Logo Header */}
        <div className="flex justify-center mb-8">
          <Link href="/">
            <span className="font-display-lg text-display-lg text-primary cursor-pointer hover:opacity-90">OutLoud</span>
          </Link>
        </div>

        {/* Auth Card */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-8 sm:p-10 shadow-sm">
          <div className="text-center mb-8">
            <h1 className="font-headline-md text-headline-md text-on-surface mb-2">Welcome back</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Please enter your details to sign in.</p>
          </div>

          {/* SSO Button */}
          <button 
            type="button"
            onClick={handleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-primary text-on-primary font-label-md text-label-md py-3 px-sm rounded-lg hover:opacity-90 transition-opacity mb-6"
          >
            <svg className="w-5 h-5 fill-current bg-white rounded-full p-0.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            Continue with Google
          </button>

          <div className="relative flex items-center py-5">
            <div className="flex-grow border-t border-outline-variant/30"></div>
            <span className="flex-shrink-0 mx-4 font-caption text-caption text-on-surface-variant">or</span>
            <div className="flex-grow border-t border-outline-variant/30"></div>
          </div>

          {/* Email Form */}
          <form className="space-y-6" onSubmit={handleSignIn}>
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="email">Email address</label>
              <input 
                id="email" 
                type="email" 
                placeholder="name@company.com" 
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 transition-all"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block font-label-md text-label-md text-on-surface" htmlFor="password">Password</label>
                <Link href="/signin" className="font-caption text-caption text-primary hover:underline">Forgot password?</Link>
              </div>
              <input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 transition-all"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-surface-container-lowest border border-outline-variant text-primary font-label-md text-label-md py-3 px-sm rounded-lg hover:bg-surface-variant/20 transition-colors"
            >
              Continue with Email
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Don't have an account? <Link href="/signin" className="text-primary font-medium hover:underline">Sign up</Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center flex justify-center gap-4">
          <Link href="/" className="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</Link>
          <span className="font-caption text-caption text-on-surface-variant">•</span>
          <Link href="/" className="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors">Terms of Service</Link>
        </div>
      </div>
    </div>
  );
}
