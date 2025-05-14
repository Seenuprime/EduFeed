'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSwipeable } from 'react-swipeable';
import { AnimatePresence } from 'framer-motion';
import ContentCard from '@/components/ContentCard';
import ContentCardSkeleton from '@/components/ContentCardSkeleton';
import TopicSelector from '@/components/TopicSelector';
import ProgressIndicator from '@/components/ProgressIndicator';
import { Content, Topic } from '@/types/content';
import { useSearchParams } from 'next/navigation';

export default function FeedPage() {
  const searchParams = useSearchParams();
  const [feed, setFeed] = useState<Content[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const topic = (searchParams.get('topic') || 'motivation') as Topic;

  const fetchFeed = useCallback(async (page: number) => {
    try {
      const response = await fetch(`/api/content/feed?topic=${topic}&page=${page}`);
      if (!response.ok) {
        throw new Error('Failed to fetch content');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching feed:', error);
      throw error;
    }
  }, [topic]);

  const loadInitialFeed = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFeed(1);
      setFeed(data);
      setCurrentIndex(0);
      setCurrentPage(1);
    } catch (error) {
      setError('Failed to load content');
    } finally {
      setLoading(false);
    }
  }, [fetchFeed]);

  const loadMoreContent = useCallback(async () => {
    if (isFetchingMore) return;
    
    setIsFetchingMore(true);
    setError(null);
    try {
      const nextPage = currentPage + 1;
      const newContent = await fetchFeed(nextPage);
      if (newContent && newContent.length > 0) {
        setFeed(prev => [...prev, ...newContent]);
        setCurrentPage(nextPage);
      }
    } catch (error) {
      setError('Failed to load more content');
    } finally {
      setIsFetchingMore(false);
    }
  }, [currentPage, fetchFeed, isFetchingMore]);

  // Reset feed when topic changes
  useEffect(() => {
    loadInitialFeed();
  }, [topic, loadInitialFeed]);

  useEffect(() => {
    if (feed.length > 0 && currentIndex >= feed.length - 2) {
      loadMoreContent();
    }
  }, [currentIndex, feed.length, loadMoreContent]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      } else if (e.key === 'ArrowDown' && currentIndex < feed.length - 1) {
        setCurrentIndex(prev => prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, feed.length]);

  const handlers = useSwipeable({
    onSwipedUp: () => {
      if (currentIndex < feed.length - 1) {
        setCurrentIndex(prev => prev + 1);
      }
    },
    onSwipedDown: () => {
      if (currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      }
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const handleLike = (id: string) => {
    setFeed(prev =>
      prev.map(item =>
        item._id === id ? { ...item, likes: item.likes + 1 } : item
      )
    );
  };

  const handleSave = (id: string) => {
    setFeed(prev =>
      prev.map(item =>
        item._id === id ? { ...item, saves: item.saves + 1 } : item
      )
    );
  };

  if (loading) {
    return (
      <div className="h-screen w-full bg-black">
        <TopicSelector />
        <div className="h-full flex items-center justify-center">
          <ContentCardSkeleton />
        </div>
      </div>
    );
  }

  if (!feed.length) {
    return (
      <div className="h-screen w-full bg-black">
        <TopicSelector />
        <div className="h-full flex items-center justify-center text-white text-xl">
          No content found. 😕
        </div>
      </div>
    );
  }

  const currentContent = feed[currentIndex];
  if (!currentContent) {
    return (
      <div className="h-screen w-full bg-black">
        <TopicSelector />
        <div className="h-full flex items-center justify-center text-white text-xl">
          Content not available. Please try again.
        </div>
      </div>
    );
  }

  return (
    <main className="h-screen w-full bg-black overflow-hidden" {...handlers}>
      <TopicSelector />
      <ProgressIndicator currentIndex={currentIndex} totalItems={feed.length} />
      <div className="h-full w-full flex items-center justify-center snap-y snap-mandatory">
        <AnimatePresence mode="wait">
          <ContentCard
            key={currentContent._id}
            content={currentContent}
            onLike={handleLike}
            onSave={handleSave}
          />
        </AnimatePresence>
      </div>

      {isFetchingMore && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm">
          Loading more...
        </div>
      )}

      {error && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-red-500/80 text-white px-4 py-2 rounded-full text-sm">
          {error}
        </div>
      )}

      <div className="fixed bottom-4 right-4 text-xs text-gray-500">
        Use ↑↓ arrows or swipe to navigate
      </div>
    </main>
  );
} 