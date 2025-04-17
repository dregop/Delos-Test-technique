'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminPage() {
  const [stats, setStats] = useState<{ user_id: string; question_count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch('/api/admin', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await res.json();
      setStats(Array.isArray(data) ? data : []);
      setLoading(false);
    };

    fetchStats();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-[#d61e00]">Statistiques des utilisateurs</h1>

      {loading ? (
        <p>Chargement...</p>
      ) : stats.length === 0 ? (
        <p className="text-gray-600 italic">Aucune question posée pour le moment 🤷‍♂️</p>
      ) : (
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left py-2 px-4 border-b">Utilisateur (ID)</th>
              <th className="text-left py-2 px-4 border-b">Nombre de questions</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s) => (
              <tr key={s.user_id}>
                <td className="py-2 px-4 border-b">{s.user_id}</td>
                <td className="py-2 px-4 border-b">{s.question_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
