"use client";

import { useState, useEffect, useCallback } from 'react';
import type { ScanHistoryItem } from '@/lib/types';

const STORAGE_KEY = 'aegisai_scan_history';

export function useScanHistory() {
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(STORAGE_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error('Failed to load scan history from localStorage', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addScan = useCallback((newItem: ScanHistoryItem) => {
    setHistory(prevHistory => {
      const updatedHistory = [newItem, ...prevHistory];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
      } catch (error) {
        console.error('Failed to save scan history to localStorage', error);
      }
      return updatedHistory;
    });
  }, []);
  
  const getScanById = useCallback((id: string): ScanHistoryItem | undefined => {
    return history.find(item => item.id === id);
  }, [history]);

  return { history, addScan, getScanById, loading };
}
