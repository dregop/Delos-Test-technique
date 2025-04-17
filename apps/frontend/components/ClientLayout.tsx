'use client';

import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { supabase } from '../lib/supabase';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setIsConnected(!!data.session);
    };

    checkSession();

    // 🔄 S'abonner aux changements de session
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsConnected(!!session);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  if (!isConnected) return <>{children}</>;

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
