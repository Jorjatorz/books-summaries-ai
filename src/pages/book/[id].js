import React from 'react'
import Image from 'next/image'

import "../../globals.css";

// DEBUG
import data from '../../../public/sample.json'

export function getBookData(id) {
    return data[id];
}


export default function BookPage({ book }) {
    return (
        <main className='bg-amber-300 w-full h-full m-auto'>
            <div className='flex px-32 py-20 gap-16'>
                <div className='shrink-0'>
                    <Image src={book.image} width="350" height="0" alt="Picture of the book cover" />
                </div>
                <div className='grow'>
                    <h1 className='text-6xl font-bold'>{book.title}</h1>
                    <h2 className='text-2xl italic'>by <span className='font-bold'>{book.author}</span></h2>
                    <ul className='flex gap-4 mt-2'>{book.topics.map((topic) =>
                        <li className='bg-orange-500 py-1 px-2 rounded-lg'>{topic}</li>)}
                    </ul>
                    <div className='mt-8'>{book.description}</div>
                    <div>
                        <h2 className='text-4xl font-bold mt-4'>Key Ideas</h2>
                        <ul>{book.key_ideas.map((idea) =>

                            <li className='w-100% min-h-[12rem] rounded-md bg-slate-200 my-6 shadow-md p-4'>
                                <h3 className='text-xl font-bold italic'>{idea.title}</h3>
                                <p className='text-lg mt-4'>{idea.description}</p>
                            </li>
                        )}
                        </ul>
                    </div>
                </div>
                <div className='basis-1/4'>
                    <h2 className='text-2xl text-center'>Related books</h2>
                    {book.similar_books.map((sb) =>
                        <div className='bg-red-300 w-[16rem] h-[22rem] my-8 py-4 text-center'>{sb.title}</div>)}
                </div>
            </div>
        </main >
    )
}

export async function getStaticPaths() {
    return {
        paths: Object.keys(data).map(id => {
            return {
                params: {
                    id: id
                }
            }
        }),
        fallback: false
    }
}


export async function getStaticProps({ params }) {
    const bookData = getBookData(params.id);
    return {
        props: {
            book: bookData,
        },
    };
}