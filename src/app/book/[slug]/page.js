import { React } from 'react'

import { getBookData } from 'utils/contentful'

import BookPage from './client-page';

// DEBUG used for getStaticPaths
import data from '/public/sample.json'

export default async function Page({ params }) {
    const bookData = await getBookData(params.slug);
    return <BookPage book={bookData} />;
}

export async function generateStaticParams() {
    return Object.keys(data).map(slug => {
        return {
            slug: slug
        }
    })
}