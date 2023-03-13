import React, { Component } from 'react'
import { BsSearch } from 'react-icons/bs'

export default class SearchBar extends Component {
    render() {
        return (
            <div className='relative flex justify-center text-center m-auto w-1/4'>
                <input className='w-full p-2 rounded-md shadow-md' placeholder='Enter your book title' />
                <BsSearch className='absolute right-4 bottom-1/2 translate-y-1/2' />
            </div>
        )
    }
}
