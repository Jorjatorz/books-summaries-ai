import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import "../../globals.css";

// DEBUG
import data from '../../../public/sample.json'

export function getBookData(slug) {
    return data[slug];
}


export default function BookPage({ book }) {
    return (
        <main className='bg-[#e7e7e9] w-full h-full m-auto'>
            <div className='flex pl-32 py-20 gap-16'>
                <div className='shrink-0'>
                    <Image src={book.image} width="350" height="0" alt="Picture of the book cover" />
                    <Link href="https://www.youtube.com/watch?v=skn2OeY4X9o">
                        <h2 className='text-2xl font-bold text-center m-2 text-amber-500'>Support the Author <br /> Buy it!</h2>
                    </Link>
                </div>
                <div className='grow'>
                    <h1 className='text-6xl font-bold'>{book.title}</h1>
                    <h2 className='text-2xl italic'>by <span className='font-bold'>{book.author}</span></h2>
                    <ul className='flex gap-4 mt-2'>{book.topics.map((topic) =>
                        <li className='bg-emerald-400 py-1 px-2 rounded-lg font-medium'>{topic}</li>)}
                    </ul>
                    <div className='mt-8 text-lg'>{book.description}</div>
                    <div>
                        <h2 className='text-4xl font-bold mt-4'>Key Ideas</h2>
                        <ul>{book.key_ideas.map((idea) =>

                            <li className='flex flex-col justify-center w-100% min-h-[12rem] rounded-md text-center bg-white my-6 shadow-md p-4 hover:scale-[1.02] ease-in duration-300'>
                                <h3 className='text-2xl font-bold italic'>{idea.title}</h3>
                                <p className='text-lg mt-4'>{idea.description}</p>
                            </li>
                        )}
                        </ul>
                    </div>
                </div>
                <div className='basis-1/4'>
                    <h2 className='text-4xl text-center font-bold'>Related books</h2>
                    {book.similar_books.map((sb) =>
                        <Link href={`book/${sb.slug}`}>
                            <div className='relative flex flex-col w-[12rem] h-[18rem] m-auto my-8 py-4 text-center hover:scale-105 ease-in duration-100'>
                                <Image src={sb.image} fill alt={`Picture of a related book with name ${sb.title}`} />
                            </div>
                        </Link>
                    )}
                </div>
            </div>
        </main >
    )
}

export async function getStaticPaths() {
    return {
        paths: Object.keys(data).map(slug => {
            return {
                params: {
                    slug: slug
                }
            }
        }),
        fallback: false
    }
}


export async function getStaticProps({ params }) {
    const bookData = getBookData(params.slug);
    return {
        props: {
            book: bookData,
        },
    };
}