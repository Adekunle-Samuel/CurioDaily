
import { useState, useEffect } from 'react';

export interface Fact {
  id: number;
  title: string;
  blurb: string;
  body: string;
  topic: string;
  image: string;
  sources: string[];
}

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
