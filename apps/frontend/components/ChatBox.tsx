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

    setMessages((prev) => [...prev, { role: 'user', text: question }, { role: 'bot', text: '' }]);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      alert('Utilisateur non connecté');
      return;
    }

    const res = await fetch(`/api/chat?sport=${sport}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
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
    <div className="flex flex-col h-full p-6 bg-[#f8f8f8]">
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((m, i) => (
          <Message key={i} role={m.role} text={m.text} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-4 border-t border-gray-300 pt-4 flex gap-2 items-center">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault(); // empêche saut de ligne
              handleSend(); // envoie le message
            }
          }}
          className="flex-1 border border-gray-400 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d61e00]"
          placeholder="Posez votre question..."
        />
        <button
          onClick={handleSend}
          className="bg-[#d61e00] hover:bg-[#bb1a00] text-white font-semibold px-5 py-2 rounded-full transition-colors"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}
