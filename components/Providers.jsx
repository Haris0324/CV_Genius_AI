'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function SessionTimeoutTracker({ children }) {
  const { status } = useSession();
  const router = useRouter();
  const [wasLoggedIn, setWasLoggedIn] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      setWasLoggedIn(true);
    } else if (status === 'unauthenticated' && wasLoggedIn) {
      router.push('/login?message=SessionExpired');
      setWasLoggedIn(false);
    }
  }, [status, wasLoggedIn, router]);

  return <>{children}</>;
}

export function NextAuthProvider({ children }) {
  return (
    <SessionProvider refetchInterval={60}>
      <SessionTimeoutTracker>
        {children}
      </SessionTimeoutTracker>
    </SessionProvider>
  );
}
