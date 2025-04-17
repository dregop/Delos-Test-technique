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
        'max-w-[80%] p-3 rounded-lg mb-2 text-sm',
        isUser ? 'ml-auto bg-blue-500 text-white' : 'mr-auto bg-gray-200 text-gray-800',
      )}
    >
      {text}
    </div>
  );
}
