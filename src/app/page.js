import React from 'react';
import { getSuggestedBooks } from 'utils/contentful'

import Home from './client-page';

export default async function Page({ params }) {
  const suggestedBooks = await getSuggestedBooks(4)
  return <Home suggestedBooks={suggestedBooks} />;
}