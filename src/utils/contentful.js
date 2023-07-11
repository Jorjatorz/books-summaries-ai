const contentful = require('contentful')


const client = contentful.createClient({
    "space": process.env.REACT_APP_CONTENTFUL_SPACE_ID,
    "accessToken": process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN,
}
)


function unpackBookFields(book) {
    // Auxiliary func to expand nested contentful content
    if (book.author)
        book.author = book.author.fields
    if (book.featuredImage)
        book.featuredImage = book.featuredImage.fields
    if (book.relatedBooks)
        book.relatedBooks = book.relatedBooks.map((e) => e.fields)
    return book
}

export const getBookData = async (slug) => {
    const response = await client.getEntries({
        content_type: 'pageBookIdeas',
        'fields.slug': slug
    });
    console.assert(response.total === 1, `Just one Book entry is expected to be returned for slug: ${slug}`)
    if (response.total !== 1) return null

    const book = response.items[0].fields

    unpackBookFields(book)

    return book
};

export const getSuggestedBooks = async (number = 4) => {
    // Retrieves a `number` of randomly selected books. Duplicates can exist

    // First get the total number of books
    const response = await client.getEntries({
        content_type: 'pageBookIdeas',
        limit: 0
    });
    const numBooks = response.total

    const selectedBooks = []
    // Get a random number inside the valid range and fetch the book by it
    for (var i = 0; i < number; i++) {
        const index = Math.floor(Math.random() * numBooks);
        const response = await client.getEntries({
            content_type: 'pageBookIdeas',
            select: 'fields.slug, fields.featuredImage',
            skip: index,
            limit: 1
        });
        const book = response.items[0].fields
        unpackBookFields(book)
        selectedBooks.push(book)
    }

    return selectedBooks
};

export const searchBookByTitle = async (title, results_limit = 4, title_min_length = 4) => {
    title = String(title) // Safe guard
    if (title.length < title_min_length) return []

    const response = await client.getEntries({
        content_type: 'pageBookIdeas',
        select: 'fields.slug, fields.title',
        'fields.title[match]': title,
        limit: results_limit
    });
    if (response.total === 0) return []

    const books = response.items.map((e) => unpackBookFields(e.fields))
    return books
};