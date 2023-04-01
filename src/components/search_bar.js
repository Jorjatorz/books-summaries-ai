import React, { Component } from 'react'
import { BsSearch } from 'react-icons/bs'

export default class SearchBar extends Component {
    render() {
        return (
            <div className={this.props.className}>
                <div className='focus-within:opacity-100 relative w-full p-3 rounded-full shadow-md opacity-80 bg-white'>
                    <div className='flex gap-2'>
                        <BsSearch className='text-[#373738]' size={25} />
                        <input className='w-full outline-none border-none' placeholder='Enter your book title' />
                    </div>
                </div>
            </div>
        )
    }
}
