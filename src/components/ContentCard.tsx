import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Content } from '@/types/content';

interface ContentCardProps {
  content: Content;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
}

export default function ContentCard({ content, onLike, onSave }: ContentCardProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsError, setTtsError] = useState<string | null>(null);
  const [showCopied, setShowCopied] = useState(false);
  const [showShared, setShowShared] = useState(false);

  useEffect(() => {
    return () => {
      // Cleanup TTS on unmount
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleSpeak = () => {
    if (!window.speechSynthesis) {
      setTtsError('Text-to-speech is not supported in your browser');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(`${content.title}. ${content.content}`);
      utterance.lang = 'en-US';
      
      // Try to find a good voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang === 'en-US' && voice.name.includes('Female')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => {
        setTtsError('Failed to read content');
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
      setTtsError(null);
    } catch (error) {
      setTtsError('Failed to initialize text-to-speech');
      setIsSpeaking(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${content.title}\n\n${content.content}`);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy content:', error);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: content.title,
          text: content.content,
          url: window.location.href,
        });
      } else {
        await handleCopy();
      }
      setShowShared(true);
      setTimeout(() => setShowShared(false), 2000);
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Failed to share content:', error);
      }
    }
  };

  return (
    <motion.article
      role="article"
      className="relative w-full max-w-[448px] h-screen bg-gradient-to-b from-gray-900/80 to-black/80 backdrop-blur-sm flex flex-col items-center justify-center px-2 sm:px-6 py-4 sm:py-6"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="w-full max-h-[60vh] overflow-y-auto">
        <div className="text-xs sm:text-xs text-gray-400 mb-2">
          {content.topic} • {content.author}
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-center mb-4">{content.title}</h2>
        <p className="text-sm sm:text-base text-gray-200 text-center">{content.content}</p>
      </div>

      <div className="absolute bottom-24 sm:bottom-16 left-1/2 -translate-x-1/2 flex flex-row gap-2 sm:gap-4">
        <button
          onClick={() => onLike(content._id)}
          className="min-w-[48px] min-h-[48px] w-12 h-12 flex items-center justify-center rounded-full hover:bg-red-500/20 transition-colors group"
          aria-label="Like"
        >
          <span className="text-2xl group-hover:scale-110 transition-transform">❤️</span>
          <span className="text-xs sm:text-sm ml-1">{content.likes}</span>
        </button>

        <button
          onClick={handleSpeak}
          className="min-w-[48px] min-h-[48px] w-12 h-12 flex items-center justify-center rounded-full hover:bg-indigo-500/20 transition-colors group"
          aria-label={isSpeaking ? 'Stop reading' : 'Read aloud'}
        >
          <span className="text-2xl group-hover:scale-110 transition-transform">
            {isSpeaking ? '⏹️' : '🔊'}
          </span>
        </button>

        <button
          onClick={() => onSave(content._id)}
          className="min-w-[48px] min-h-[48px] w-12 h-12 flex items-center justify-center rounded-full hover:bg-yellow-500/20 transition-colors group"
          aria-label="Save"
        >
          <span className="text-2xl group-hover:scale-110 transition-transform">🔖</span>
          <span className="text-xs sm:text-sm ml-1">{content.saves}</span>
        </button>

        <button
          onClick={handleShare}
          className="min-w-[48px] min-h-[48px] w-12 h-12 flex items-center justify-center rounded-full hover:bg-blue-500/20 transition-colors group"
          aria-label="Share"
        >
          <span className="text-2xl group-hover:scale-110 transition-transform">📤</span>
        </button>

        <button
          onClick={handleCopy}
          className="min-w-[48px] min-h-[48px] w-12 h-12 flex items-center justify-center rounded-full hover:bg-green-500/20 transition-colors group"
          aria-label="Copy to clipboard"
        >
          <span className="text-2xl group-hover:scale-110 transition-transform">📋</span>
        </button>
      </div>

      {ttsError && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-500/80 text-white px-4 py-2 rounded-full text-sm">
          {ttsError}
        </div>
      )}

      {showCopied && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-green-500/80 text-white px-4 py-2 rounded-full text-sm">
          Copied to clipboard!
        </div>
      )}

      {showShared && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-500/80 text-white px-4 py-2 rounded-full text-sm">
          Content shared!
        </div>
      )}
    </motion.article>
  );
} 