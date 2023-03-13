"use client"

import React from 'react';
import "../globals.css";
import SearchBar from './components/search_bar';

export default function Home() {
  return (
    <main>
      <div className="w-full h-screen bg-amber-300 flex flex-col justify-center text-center m-auto">
        <SearchBar />
      </div>
    </main>
  )
}
