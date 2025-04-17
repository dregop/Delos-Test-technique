'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';

const sports = ['football', 'rugby', 'tennis', 'volley', 'cyclisme'];

export default function Sidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <aside className="w-48 bg-red-600 text-white min-h-screen p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-4">L’Équipe Bot</h2>
        <nav className="space-y-2">
          {sports.map((s) => (
            <Link key={s} href={`/sport/${s}`} className="block hover:underline capitalize">
              {s}
            </Link>
          ))}
          <hr className="my-4" />
          <Link href="/admin" className="block hover:underline">
            Admin
          </Link>
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 bg-white text-red-600 px-3 py-1 rounded hover:bg-gray-100"
      >
        Se déconnecter
      </button>
    </aside>
  );
}
