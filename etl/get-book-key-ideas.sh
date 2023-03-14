#!/bin/bash

function usage {
    echo "Usage: $0 [--help] [--title <title>] [--author <author>]"
    echo "Retrieve key ideas from a book using ChatGPT API"
    echo ""
    echo "Options:"
    echo "-h, --help                 Show this help message and exit"
    echo "-t, --title <title>        Title of the book (required)"
    echo "-a, --author <author>      Author of the book (required)"
    echo ""
    echo "Example:"
    echo "$0 --title \"The Miracle Morning\" --author \"Hal Elrod\""
}

while [[ $# -gt 0 ]]
do
key="$1"

case $key in
    -h|--help)
    usage
    exit 0
    ;;
    -t|--title)
    title="$2"
    shift
    shift
    ;;
    -a|--author)
    author="$2"
    shift
    shift
    ;;
    *)    # unknown option
    echo "Unknown option: $key"
    usage
    exit 1
    ;;
esac
done

if [ -z "$title" ]; then
    echo "Title is required."
    usage
    exit 1
fi

if [ -z "$author" ]; then
    echo "Author is required."
    usage
    exit 1
fi

url="https://api.openai.com/v1/chat/completions"
model="gpt-3.5-turbo"
prompt="Write the key ideas from the book "$title" by $author. The number of key ideas will be at least 3 and at most 10. Each key idea will be explained with the following structure: Small title, with no more than 25 words, and a detailed explanation of the key idea. The explanation will have at least 120 words. In addition, you will provide a list of categories to which the book belongs (e.g. History or Science), with a minimum of 1 and a maximum of 5. Finally, you will provide a list of similar books that might like to people that have read the book. Any of the similar books can be equal to the one that has been asked. You will provide all these answers in a JSON format with the following structure:\\n- key_ideas: array of objects with keys title and description.\\n- topics: array of strings\\n- similar_books: array of objects with keys title and author\\n\\nPlease write only the code without any other text and without formatting it as code block."
body="{\"model\":\"$model\", \"messages\":[{\"role\": \"user\", \"content\": \"$prompt\"}]}"
auth="Authorization: Bearer ${OPENAI_API_KEY}"
headers="Content-Type: application/json"
curl -s -H "$headers" -H "$auth" -d "$body" "$url" | jq -r '.choices[0].message.content'
