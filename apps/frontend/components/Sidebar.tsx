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
    <aside className="w-60 min-h-screen bg-white border-r border-gray-200 text-[#1d1d1b] flex flex-col justify-between font-sans">
      <div className="p-6">
        <h2 className="text-2xl font-extrabold text-[#d61e00] mb-6 tracking-tight">L’Équipe Bot</h2>
        <nav className="space-y-4 text-base font-medium">
          {sports.map((s) => (
            <Link
              key={s}
              href={`/sport/${s}`}
              className="block hover:text-[#d61e00] capitalize transition-colors duration-200"
            >
              {s}
            </Link>
          ))}
          <hr className="my-6 border-t border-gray-300" />
          <Link href="/admin" className="block hover:text-[#d61e00] transition-colors duration-200">
            Admin
          </Link>
        </nav>
      </div>

      <div className="p-6">
        <button
          onClick={handleLogout}
          className="w-full bg-[#d61e00] text-white font-semibold py-2 px-4 rounded hover:bg-[#bb1a00] transition-colors duration-200"
        >
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}
