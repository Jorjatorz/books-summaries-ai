import data from '../../public/sample.json'
import Image from 'next/image'


function SampleBook() {
  return (
    <div>
      <h1>{data.title} by {data.author} </h1>
      <Image src={data.image_compressed} alt="Book Image" width={500} height={500} />
      <h2>Key Ideas</h2>
      <ul>
        {data.key_ideas.map((key_idea) => (
          <li key={key_idea.title}>
            <b>{key_idea.title}</b> : {key_idea.description}
          </li>
        ))}
      </ul>
      <h2>Topics:</h2>
      <ul>
        {data.topics.map((topic) => (
          <li key={topic}>{topic}</li>
        ))}
      </ul>
      <h2>Similar Books:</h2>
      <ul>
        {data.similar_books.map((book) => (
          <li key={book.title}>
            {book.title} by {book.author}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SampleBook
