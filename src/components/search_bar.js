import React, { Component } from 'react'
import { BsSearch } from 'react-icons/bs'

export default class SearchBar extends Component {
    render() {
        return (
            <div className='relative w-[40%]'>
                <input className='w-full p-4 rounded-md shadow-md' placeholder='Enter your book title' />
                <BsSearch className='absolute right-4 bottom-1/2 translate-y-1/2 text-emerald-500 font-bold' size={25} />
            </div>
        )
    }
}
