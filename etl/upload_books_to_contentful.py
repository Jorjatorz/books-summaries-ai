import contentful_management
import contentful
import os
from io import BytesIO
import requests
from dotenv import load_dotenv
from slugify import slugify

FIELDS_TO_UPLOAD = [
    "keyIdeas",
    "chaptersSummaries",
    "featuredImage",
    "storesUrls",
    "title",
    "author",
    "topics",
    "description",
    "relatedBooks",
]


def main():
    load_dotenv("./etl/.env.development")
    client_management = contentful_management.Client(os.getenv("CONTENTFUL_TOKEN"))
    space = client_management.spaces().find(os.getenv("CONTENTFUL_SPACE_ID"))
    environment = space.environments().find("master")

    client = contentful.Client(
        os.getenv("CONTENTFUL_SPACE_ID"), os.getenv("REACT_APP_CONTENTFUL_ACCESS_TOKEN")
    )

    data = get_book_data()

    author_entry, image_asset, book_entry = None, None, None
    try:
        # Create author
        author_entry = client.entries(
            {"content_type": "componentAuthor", "fields.internalName": data["author"]}
        )
        if not author_entry:
            author_entry = environment.entries().create(
                None,
                {
                    "content_type_id": "componentAuthor",
                    "fields": {
                        "internalName": {"en-US": data["author"]},
                        "name": {"en-US": data["author"]},
                    },
                },
            )
        else:
            author_entry = author_entry[0]

        # Create image
        image_fields = _get_image_fields(data)
        image_asset = client.assets({"fields.title": image_fields["title"]})
        if not image_asset:
            # Create upload
            image_data = requests.get(image_fields["url"])
            upload = space.uploads().create(BytesIO(image_data.content))
            image_asset = environment.assets().create(
                None,
                {
                    "fields": {
                        "title": {"en-US": image_fields["title"]},
                        "description": {"en-US": image_fields["description"]},
                        "file": {
                            "en-US": {
                                "fileName": image_fields["file_name"],
                                "contentType": image_data.headers["Content-Type"],
                                "uploadFrom": upload.to_link().to_json(),
                            }
                        },
                    }
                },
            )
            image_asset = image_asset.process()
        else:
            image_asset = image_asset[0]

        # Create book
        metadata = {
            "title": {"en-US": data["title"]},
            "subtitle": {"en-US": data["description"]},
            "internalName": {"en-US": data["title"]},
            # "seoFilds": {'en-US': data['title']}, TODO
            "slug": {"en-US": data["slug"]},
            "author": {"en-US": author_entry.to_link().to_json()},
            "keyIdeas": {"en-US": data["key_ideas"]},
            "chaptersSummaries": {"en-US": data["chapter_summaries"]},
            "publishedDate": {"en-US": data["published_at"]},
            "featuredImage": {"en-US": image_asset.to_link().to_json()},
            "bookURL": {"en-US": data["book_url"]},
            "topics": {"en-US": data["topics"]},
            # "relatedBooks": {"en-US": }, TODO,
            "storesUrls": {"en-US": data["stores"]},
        }
        book_entry = client.entries(
            {"content_type": "pageBookIdeas", "fields.slug": data["slug"]}
        )
        if not book_entry:
            book_entry = environment.entries().create(
                None,
                {
                    "content_type_id": "pageBookIdeas",
                    "fields": metadata,
                },
            )
        else:
            pass  # TODO Update
        
        author_entry.publish()
        image_asset.publish()
        book_entry.publish()
    except Exception:
        if author_entry and isinstance(author_entry, contentful_management.Entry):
            if author_entry.is_published:
                author_entry.unpublish()
            author_entry.delete()
        if image_asset and isinstance(image_asset, contentful_management.Asset):
            if image_asset.is_published:
                image_asset.unpublish()
            image_asset.delete()
        if book_entry and isinstance(book_entry, contentful_management.Entry):
            if book_entry.is_published:
                book_entry.unpublish()
            book_entry.delete()
        raise


def get_book_data():
    import json

    with open("./etl/content.json", "r") as f:
        book = json.load(f)

    title = book["title"]
    # related_books = book["related_books"]
    return {
        "slug": slugify(title),
        "title": title,
        "author": book["author"],
        "image": book["image"],
        "description": book["description"],
        "published_at": "2023-08-24",  # TODO Seems like we dont have this content
        "key_ideas": [
            {"title": "Test title 1", "description": "Test description"},
            {"title": "Test title 2", "description": "Test description"},
        ],  # TODO
        "chapter_summaries": [
            {"title": "Test title 1", "description": "Test description"},
            {"title": "Test title 2", "description": "Test description"},
        ],  # TODO
        "topics": ["test_1", "test_2"],  # TODO
        "book_url": book["url"],
        "related_books": [],  # TODO
        "stores": [{"url": book["url"], "name": "google_books"}],
    }
    # return {
    #     "title": {'en-US': title},
    #     'subtitle': {'en-US': ''},
    #     'internalName': {'en-US': ''},
    #     "slug": {'en-US':slugify(title)},
    #     'keyIdeas': {'en-US': {}},
    #     'chapterSummaries': {'en-US': {}},
    #     'publishedDate': {'en-US': ''},
    #     'linkToBook': {'en-US': ''},
    #     'topics': {'en-US': []},
    #     'storeUrls': {'en-US': [{}]},

    # }


def _get_image_fields(data: dict):
    return {
        "title": f"{data['title']} - Book cover",
        "description": f'Book cover of the book "{data["title"]}"',
        "url": data["image"],
        "file_name": f'{data["slug"]}_book_cover_image',
    }


if __name__ == "__main__":
    main()
