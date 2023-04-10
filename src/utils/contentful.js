import { createClient } from 'contentful';

const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});
//var contentful = require('contentful');

// DEBUG Retuns the list of available book slugs
// It is debug because contentful only return 1k elements
export const getBooksSlugs = async () => {
    const response = await client.getEntries({
        content_type: 'pageBookIdeas',
        select: 'fields.slug'
    });

    return response.items.map((e) => e.fields.slug)
};

export const getBookData = async (slug) => {
    const response = await client.getEntries({
        content_type: 'pageBookIdeas',
        'fields.slug': slug
    });
    console.assert(response.total === 1, `Just one Book entry is expected to be returned for slug: ${slug}`)
    const items = response.items[0].fields

    // Unpack references
    items.author = items.author.fields
    items.featuredImage = items.featuredImage.fields
    if (items.relatedBooks)
        items.relatedBooks = items.relatedBooks.map((e) => e.fields)

    return items
};