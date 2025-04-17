'use client';

import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import AuthForm from '../components/Auth';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      console.log('🔍 Checking initial session');
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('❌ Error getting session:', sessionError);
      }

      if (sessionData?.session) {
        console.log('✅ Session exists → redirecting to /tasks');
        setUser(sessionData.session.user);
        router.push('/sport/rugby');
      } else {
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');
        console.log('🔍 Magic link code found in URL:', code);

        if (code) {
          const { data: exchangeData, error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            console.error('❌ Error exchanging code for session:', exchangeError);
          } else {
            console.log('✅ Code exchanged successfully:', exchangeData);
            router.push('/sport/rugby');
          }
        }

        setLoading(false);
      }
    };

    handleAuth();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  if (loading) return <p>Chargement...</p>;

  if (user)
    return (
      <div className="flex flex-col items-center gap-2">
        <p>Connecté !</p>
        <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded">
          Se déconnecter
        </button>
      </div>
    );

  return (
    <>
      <h1>Connecter vous via OTP Supabase</h1>
      <AuthForm />
    </>
  );
}
