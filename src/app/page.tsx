"use client"

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Calculator from '../../components/Calculator';

export default function Home() {
  const [theme, setTheme] = useState<'dark' | 'gray' | 'purple'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'gray' | 'purple';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const handleThemeChange = (newTheme: 'dark' | 'gray' | 'purple') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center">
      <Head>
        <title>Calculator App</title>
        <meta name="description" content="A calculator built with Next.js and TypeScript" />
      </Head>
      <div className="w-full max-w-md">
        <div className="mb-4 flex justify-center">
          <select
            value={theme}
            onChange={(e) => handleThemeChange(e.target.value as 'dark' | 'gray' | 'purple')}
            className="p-2 border rounded bg-gray-700"
          >
            <option value="dark">Dark</option>
            <option value="gray">Gray</option>
            <option value="purple">Dark Purple</option>
          </select>
        </div>
        <Calculator theme={theme} />
      </div>
    </div>
  );
}