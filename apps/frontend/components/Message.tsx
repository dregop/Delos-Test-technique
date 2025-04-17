'use client';

import clsx from 'clsx';

interface MessageProps {
  role: 'user' | 'bot';
  text: string;
}

export default function Message({ role, text }: MessageProps) {
  const isUser = role === 'user';

  return (
    <div
      className={clsx(
        'max-w-[75%] px-4 py-2 rounded-lg text-sm leading-relaxed shadow',
        isUser
          ? 'ml-auto bg-[#3873b8] text-white rounded-br-none'
          : 'mr-auto bg-[#f1f1f1] text-[#1d1d1b] rounded-bl-none',
      )}
    >
      {text}
    </div>
  );
}
