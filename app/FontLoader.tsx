"use client";
import { useEffect } from 'react';
import { loadRetroFonts } from './font-loader';

export default function FontLoader() {
  useEffect(() => {
    loadRetroFonts();
  }, []);
  
  return null;
} 