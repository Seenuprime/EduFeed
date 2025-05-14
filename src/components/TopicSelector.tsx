'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';
import { Topic } from '@/types/content';

const topics: { value: Topic; label: string }[] = [
  { value: 'motivation', label: 'Motivation' },
  { value: 'history', label: 'History' },
  { value: 'science', label: 'Science' },
  { value: 'space', label: 'Space' },
  { value: 'for_you', label: 'For You' },
  { value: 'technology', label: 'Technology' },
  { value: 'nature', label: 'Nature' },
  { value: 'health', label: 'Health' },
  { value: 'computer_science', label: 'Computer Science' },
];

export default function TopicSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTopic = (searchParams.get('topic') as Topic) || 'motivation';
  const [modalOpen, setModalOpen] = useState(false);

  const handleTopicChange = (topic: Topic) => {
    router.push(`/feed?topic=${topic}`);
    setModalOpen(false);
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-20 w-[90vw] max-w-[448px] px-4">
      {/* Mobile: Burger button */}
      <div className="flex sm:hidden justify-between items-center">
        <span className="text-lg font-bold text-white">Categories</span>
        <button
          className="p-2 rounded-md bg-black/60 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onClick={() => setModalOpen(true)}
          aria-label="Open category menu"
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      </div>
      {/* Desktop: pill bar */}
      <div className="hidden sm:flex gap-2 justify-center p-2 rounded-full">
        {topics.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => handleTopicChange(value)}
            className={`px-4 py-2 min-w-[110px] rounded-full text-sm font-medium transition-all whitespace-nowrap relative
              ${currentTopic === value
                ? 'bg-indigo-600 text-white scale-105 shadow-md'
                : 'text-white hover:bg-white/10'}
            `}
            aria-current={currentTopic === value ? 'true' : 'false'}
            aria-label={`Select ${label} topic`}
          >
            {label}
            {currentTopic === value && (
              <span className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-8 h-1 bg-indigo-400 rounded-full" />
            )}
          </button>
        ))}
      </div>
      {/* Modal for mobile */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-gray-900 rounded-2xl p-6 w-[90vw] max-w-xs mx-auto flex flex-col gap-4 shadow-2xl border border-gray-700">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-bold text-white">Select Category</span>
              <button
                className="p-1 rounded-full text-gray-400 hover:text-white focus:outline-none"
                onClick={() => setModalOpen(false)}
                aria-label="Close category menu"
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6"/></svg>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {topics.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => handleTopicChange(value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap relative
                    ${currentTopic === value
                      ? 'bg-indigo-600 text-white scale-105 shadow-md'
                      : 'text-gray-200 hover:bg-gray-700/50 hover:text-white'}
                  `}
                  aria-current={currentTopic === value ? 'true' : 'false'}
                  aria-label={`Select ${label} topic`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}