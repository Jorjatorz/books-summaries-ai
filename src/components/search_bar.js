import React, { Component } from 'react'
import { BsSearch } from 'react-icons/bs'
import { searchBookByTitle } from "utils/contentful"

export default class SearchBar extends Component {

    constructor(props) {
        super(props);
        this.state = { inputText: "", searchResults: [] };
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    MatchedResultsHighlight({ results, text, className }) {
        // Displays the results using the text

        // Build a styled matching text to display
        const styledMatches = results.map((result) => {
            // Find the position of the match and style it
            const idx = result.search(text)
            const preHighlight = result.slice(0, idx)
            const highlight = result.slice(idx, idx + text.length)
            const postHighlight = result.slice(idx + text.length)
            return <span>{preHighlight}<span className='text-rose-600 font-semibold'>{highlight}</span>{postHighlight}</span>
        })

        return (
            <div className={className}>
                <div className='rounded-b-sm shadow-md bg-white text-left'>
                    <ul className='divide-y'>
                        {styledMatches.map((result) =>
                            <li className='px-4 py-1'>{result}</li>
                        )}
                    </ul>
                </div>
            </div>
        )
    }

    handleInputChange(event) {
        const newText = event.target.value;
        this.setState({
            inputText: newText
        })
        searchBookByTitle(newText).then((books) => this.setState({ searchResults: books }))
    }

    render() {
        return (
            <div className={this.props.className}>
                <div className='relative'>
                    <div className='focus-within:opacity-100 relative w-full p-3 rounded-full shadow-md opacity-80 bg-white'>
                        <div className='flex gap-2'>
                            <BsSearch className='text-[#373738]' size={25} />
                            <input className='w-full outline-none border-none' placeholder='Enter your book title' value={this.state.inputText} onChange={this.handleInputChange} />
                        </div>
                    </div>
                    <this.MatchedResultsHighlight results={this.state.searchResults} text={this.state.inputText} className="absolute left-1/2 -translate-x-1/2 w-[90%]" />
                </div>
            </div>
        )
    }
}
