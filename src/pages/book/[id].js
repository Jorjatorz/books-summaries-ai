import React from 'react'
import Image from 'next/image'

// DEBUG
import data from '../../../public/sample.json'

export function getBookData(id) {
    return data[id];
}


export default function BookPage({ book }) {
    console.log(book)
    return (
        <main>
            <div className='bg-amber-300 w-full h-screen m-auto'>
                <div className='flex justify-center'>
                    <h3>{book.title}</h3>
                    <Image src={book.image_compressed} width="300" height="200" alt="Picture of the book cover" />
                </div>
            </div>
        </main>
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