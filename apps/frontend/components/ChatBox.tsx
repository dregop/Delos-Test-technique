'use client';

import { useState, useRef, useEffect } from 'react';
import Message from './Message';
import { supabase } from '../lib/supabase';

export default function ChatBox({ sport }: { sport: string }) {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const question = input;
    setInput('');

    // Ajoute la question de l’utilisateur
    setMessages((prev) => [...prev, { role: 'user', text: question }, { role: 'bot', text: '' }]);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      alert('Utilisateur non connecté');
      return;
    }

    console.log('Session:', session);

    const res = await fetch(`/api/chat?sport=${sport}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({ question }),
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();

    let partial = '';

    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;

      partial += decoder.decode(value);

      // MAJ progressive du dernier message (bot)
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'bot', text: partial };
        return updated;
      });
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full max-h-screen p-4">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((m, i) => (
          <Message key={i} role={m.role} text={m.text} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-3 py-2"
          placeholder="Posez votre question..."
        />
        <button onClick={handleSend} className="bg-red-600 text-white px-4 py-2 rounded">
          Envoyer
        </button>
      </div>
    </div>
  );
}
