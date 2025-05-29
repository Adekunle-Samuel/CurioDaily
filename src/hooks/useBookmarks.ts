
import { useState, useEffect } from 'react';
import { Fact } from '@/data/facts';

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Fact[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('curio-bookmarks');
    if (stored) {
      setBookmarks(JSON.parse(stored));
    }
  }, []);

  const addBookmark = (fact: Fact) => {
    const updated = [...bookmarks, fact];
    setBookmarks(updated);
    localStorage.setItem('curio-bookmarks', JSON.stringify(updated));
  };

  const removeBookmark = (factId: number) => {
    const updated = bookmarks.filter(f => f.id !== factId);
    setBookmarks(updated);
    localStorage.setItem('curio-bookmarks', JSON.stringify(updated));
  };

  const isBookmarked = (factId: number) => {
    return bookmarks.some(f => f.id === factId);
  };

  return { bookmarks, addBookmark, removeBookmark, isBookmarked };
};
