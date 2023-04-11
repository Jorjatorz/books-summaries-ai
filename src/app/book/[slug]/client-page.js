'use client'

import { React, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import SearchBar from 'components/search_bar';
import { BsFillInfoCircleFill } from 'react-icons/bs'


import "globals.css";

function AIToolTip(props) {
    return (
        <div className={props.className}>
            <div className='flex gap-2 relative'>
                <h2 className='text-4xl font-bold'>{props.children}</h2>
                <div className='group flex items-center'>
                    <h3 className='text-base font-bold text-yellow-500'>AI generated</h3>
                    <BsFillInfoCircleFill className='text-yellow-500 ml-1' />
                    <h3 className='absolute left-0 -bottom-1 translate-y-full group-hover:opacity-100 transition-opacity opacity-0 bg-gray-800 p-1 text-sm text-gray-100 rounded-sm ml-2'>This element has been generated by an AI based on its knowledge of the book.</h3>
                </div>
            </div>
        </div>
    )
}

function KeyIdeas(props) {
    const book = props.book
    return (
        <div>
            <ul>{book.keyIdeas.map((idea) =>
                <li className='flex flex-col justify-center w-100% min-h-[12rem] rounded-md text-center bg-white my-6 shadow-md p-4 hover:scale-[1.02] ease-in duration-300'>
                    <AIToolTip className='flex justify-end' />
                    <h3 className='text-2xl font-bold italic'>{idea.title}</h3>
                    <p className='text-lg mt-4'>{idea.description}</p>
                </li>
            )}
            </ul>
        </div>
    )
}

function ChapterSummaries(props) {
    const book = props.book
    if (book.chaptersSummaries) {
        return (
            <div>
                <ul>{book.chaptersSummaries.map((chapter) =>
                    <li className='flex flex-col justify-center w-100% min-h-[12rem] rounded-md text-center bg-white my-6 shadow-md p-4 hover:scale-[1.02] ease-in duration-300'>
                        <AIToolTip className='flex justify-end' />
                        <h3 className='text-2xl font-bold italic'>{chapter.title}</h3>
                        <p className='text-lg mt-4'>{chapter.description}</p>
                    </li>
                )}
                </ul>
            </div>
        )
    }
    else {
        return (
            <div>
                <ul>
                    <li className='flex flex-col justify-center w-100% min-h-[12rem] rounded-md text-center bg-white my-6 shadow-md p-4 hover:scale-[1.02] ease-in duration-300'>
                        <h3 className='text-2xl font-bold italic'>This book doesn't have Chapters Summaries generated.</h3>
                        <p className='text-lg mt-4'>This is probably because the AI doesn't have deep knowledge of the book. <br /> Give it time :)</p>
                    </li>
                </ul>
            </div>)
    }
}

function ValueAddedTabs(props) {
    const titles = props.titles
    const bodies = props.bodies
    const [index, setIndex] = useState(0);

    return (
        <div>
            <ul className='flex items-center justify-center text-center m-auto gap-8'>
                {titles.map((title, idx) =>
                    <li className={`min-w-[12rem] text-lg font-bold ${idx === index ? "opacity-100" : "opacity-70"} bg-[#4A4A4A] text-white rounded-lg p-2 cursor-pointer hover:scale-105 duration-150`} onClick={() => setIndex(idx)}>{title}</li>
                )}
            </ul>
            {bodies[index]}
        </div>
    )

}

export default function BookPage({ book }) {
    return (
        <main className={`bg-gradient-to-b from-[#76a4ca] to-[24rem] to-[#F0EFE2] w-full h-full m-auto pt-4`}>
            <div className='flex items-center text-center justify-center m-auto'><SearchBar className='w-[40%]' /></div>
            <div className='flex pl-32 py-12 gap-16'>
                <div className='shrink-0 max-w-[200px]'>
                    <div className={`bg-gray-50 p-4 rounded-lg shadow-xl`}>
                        <Image src={'https:' + book.featuredImage.file.url} width="200" height="0" alt="Picture of the book cover" />
                    </div>
                    {
                        book.storesUrls &&
                        <Link href={book.storesUrls[0].url} target='_blank'>
                            <h2 className='text-2xl font-bold text-center m-2 text-[#4A4A4A]'>Support the Author <br /> Buy it here!</h2>
                        </Link>
                    }
                </div>
                <div className='grow h-screen mb-8'>
                    <h1 className='text-5xl font-bold'>{book.title}</h1>
                    <h2 className='text-2xl italic'>by <span className='font-bold'>{book.author.name}</span></h2>
                    <ul className='flex gap-4 mt-2'>{book.topics.map((topic) =>
                        <li className='bg-[#00a67f] py-1 px-2 rounded-lg font-medium text-white'>{topic}</li>)}
                    </ul>
                    <div className='my-8 text-lg'>{book.description}</div>
                    <ValueAddedTabs titles={["Key Ideas", "Chapter Summaries"]} bodies={[<KeyIdeas book={book} />, <ChapterSummaries book={book} />]} />
                </div>

                <div className='shrink-0 w-[10%] mr-4'>
                    {book.relatedBooks && <div>
                        <h2 className='text-2xl text-center font-semibold'>More like this</h2>
                        <ul className='flex flex-col gap-8 mt-4'>
                            {book.relatedBooks.map((sb) =>
                                <Link href={`book/${sb.slug}`}>
                                    <li>
                                        <div className='p-2 bg-white rounded-lg hover:scale-105 ease-in duration-100'>
                                            <div className='relative flex flex-col h-[150px] w-[100px] m-auto text-center'>
                                                <Image src={sb.image} fill alt={`Picture of a related book with name ${sb.title}`} />
                                            </div>
                                        </div>
                                    </li>
                                </Link>
                            )}
                        </ul>
                    </div>}
                </div>
            </div>
        </main >
    )
}