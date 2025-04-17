'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { User } from '@supabase/supabase-js';

export default function TasksPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push('/');
      } else {
        setUser(data.session.user);
      }
    });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Bienvenue, {user?.email}</h1>
      <p className="text-blue-600">Ici s’afficheront les tâches...</p>
    </div>
  );
}
