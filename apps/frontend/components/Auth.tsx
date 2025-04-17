'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("📩 Un lien magique t'a été envoyé à ton adresse email.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#f8f8f8]">
      <form
        onSubmit={handleLogin}
        className="bg-white border border-gray-200 shadow-md p-8 rounded-lg w-full max-w-sm text-[#1d1d1b]"
      >
        <h1 className="text-2xl font-extrabold text-[#d61e00] mb-6 text-center">Connexion</h1>

        <label htmlFor="email" className="block mb-2 font-medium">
          Adresse email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ex: fan@lequipe.fr"
          required
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#d61e00]"
        />

        <button
          type="submit"
          className="w-full bg-[#d61e00] hover:bg-[#bb1a00] text-white font-bold py-2 px-4 rounded transition-colors duration-200"
        >
          Se connecter
        </button>

        {message && (
          <p className="mt-4 text-sm text-center text-gray-700 bg-gray-100 px-4 py-2 rounded">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
