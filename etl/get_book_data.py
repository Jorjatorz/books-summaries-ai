import json
import argparse
import random

import openai
from slugify import slugify

# OpenAI Configuration
MODEL = 'gpt-4'
PROMPT = """
Write the key ideas from the book {title} by {author}. 

The number of key ideas will be at least 3 and at most 10. 
Each key idea will be explained with the following structure: Small title, with no more than 25 words,
and a detailed explanation of the key idea. The explanation will have at least 120 words. 

In addition, you will provide a short summary of the book (between 3 and 5 sentences),
and a list of categories to which the book belongs (e.g. History or Science), with a minimum of 1 and a maximum of 5.

Finally, you will provide a list of similar books that might like to people that have read the book.
Any of the similar books can be equal to the one that has been asked. 
You will provide all these answers in a JSON format with the following structure:
    - summary: string
    - key_ideas: array of objects with keys title and description.
    - topics: array of strings
    - similar_books: array of objects with keys title and author

Please write only the code without any other text and without formatting it as code block.
"""
TEMPERATURE = 0.2

def main():
    # Parse the command line arguments
    parser = argparse.ArgumentParser(
        description="Read the database generated with `get-deepstash-articles.sh`"
                    " script (.ndjson) and print the book info to stdout",
        usage="python get_book_data.py data.ndjson [--line-number N]"
    )
    parser.add_argument('file_path', help='Path to the NDJSON file')
    parser.add_argument("--line-number", type=int, help="Specify the line number to read (default: random)")
    args = parser.parse_args()
    valid = False
    while not valid:
        book, line_number = get_book_from_file(args.file_path, args.line_number)
        valid = is_valid_book(book)
        if not valid:
            if args.line_number is not None:
                raise ValueError("The line does not contain a valid book")
            else:
                print(f"Book '{book['title']}' (Line number: {line_number}) is not valid. Picking a different one...")
    print(f"Reading book '{book['title']}' by '{book['author']}' (Line number: {line_number})")
    book_info = get_book_info(book)
    content = create_content_with_ai(book_info)
    print("Writing content to content.json")
    with open('content.json', 'w') as outfile:
        json.dump(content, outfile, indent=4)

def is_valid_book(book: dict):
    is_valid = (
        book['author'] and
        'youtu.be' not in book['url'] and
        '.' not in book['author']
    )
    return is_valid
    # book['type] == 0?


def get_book_from_file(file_path: str, line_number: int = None):
    with open(file_path, 'r') as f:
        if line_number is not None:
            # read the specified line
            line_number = line_number - 1  # adjust for zero-based indexing
            for i, line in enumerate(f):
                if i == line_number:
                    book = json.loads(line)
                    break
            else:
                # line_number is greater than the number of lines in the file
                raise ValueError(f'Error: line number {line_number} is out of range')
        else:
            # read a random line
            file_size = f.seek(0, 2)  # get the file size
            line_number = random.randint(0, file_size)  # choose a random line number
            f.seek(line_number, 0)  # move the file pointer to the chosen line
            f.readline()  # skip the partial line
            line = f.readline()  # read the full line
            book = json.loads(line)
    return book, line_number

def get_book_info(book: dict) -> dict:
    title = book["title"]
    author = book["author"]
    info = {
        "title": title,
        "author": author,
        "image": book["image"],
        "slug": slugify(title),
        # TODO: Replace by referral URL 
        "stores": 
        [
            {
                "url": f"https://www.amazon.com/s?k={'+'.join(title.split(' ') + author.split(' '))}",
                "name": "Amazon"
            }
        ]
    }
    return info

def create_content_with_ai(book_info: dict) -> dict:
    print(f"Generating content using OpenAI API (Model: '{MODEL}')...")
    completion = openai.ChatCompletion.create(
        model=MODEL,
        messages=[
            {
                "role": "user", 
                "content": PROMPT.format(title=book_info['title'], author=book_info['author'])
            }
        ],
        temperature=TEMPERATURE,
    )
    json_text = completion.choices[0].message.content
    print(json_text)
    ai_content = json.loads(json_text)
    return {
        **book_info,
        **ai_content
    }
    

if __name__ == '__main__':
    main()