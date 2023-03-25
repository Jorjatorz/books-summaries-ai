const POST_GRAPHQL_FIELDS = `
title
slug
subtitle
author {
    name
}
keyIdeas
featuredImage {
    url
}
bookUrl
topics
`

async function fetchGraphQL(query, preview = false) {
    return fetch(
      `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${
            preview
              ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
              : process.env.CONTENTFUL_ACCESS_TOKEN
          }`,
        },
        body: JSON.stringify({ query }),
      }
    ).then((response) => response.json())
  }

  export async function getBookAndMoreBooks(slug, preview) {
    const entry = await fetchGraphQL(
      `query {
        pageBookIdeasCollection(where: { slug: "${slug}" }, preview: ${
        preview ? 'true' : 'false'
      }, limit: 1) {
          items {
            ${POST_GRAPHQL_FIELDS}
          }
        }
      }`,
      preview
    )
    const entries = await fetchGraphQL(
      `query {
        pageBookIdeasCollection(where: { slug_not_in: "${slug}" }, order: date_DESC, preview: ${
        preview ? 'true' : 'false'
      }, limit: 2) {
          items {
            ${POST_GRAPHQL_FIELDS}
          }
        }
      }`,
      preview
    )
    return {
      post: extractPost(entry),
      morePosts: extractPostEntries(entries),
    }
  }