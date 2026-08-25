import { type ReactNode } from 'react';
import { useClerk } from '@clerk/react';

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

/**
 * Renders a sign-out control that looks like the app's existing nav
 * links but actually ends the Clerk session (rather than merely
 * navigating to a page).
 */
export function LogoutLink({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const { signOut } = useClerk();

  return (
    <button
      type="button"
      onClick={() => signOut({ redirectUrl: basePath || '/' })}
      className={className}
    >
      {children}
    </button>
  );
}
