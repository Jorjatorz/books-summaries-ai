#!/bin/bash

# function to print the help message
function print_help {
  echo "Usage: $0 [OPTIONS]"
  echo "Paginates over all pages of Deepstash API and downloads the results in JSON format, one file per page."
  echo
  echo "Options:"
  echo "  -h, --help                Print this help message"
  echo "  -m, --max-pages N         Limit the number of pages to process to N (default: -1, which means process all pages)"
  echo "  -p, --page-size PAGE_SIZE Number of records per page (default: 10)"
  echo
  echo "Example:"
  echo "$0 --max-pages 10 --page-size 20"
}

# set default values for command line arguments
max_pages=-1
page_size=10

# parse command line arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    -h|--help)
      print_help
      exit 0
      ;;
    -m|--max-pages)
      max_pages=$2
      shift
      ;;
    -p|--page-size)
      page_size=$2
      shift
      ;;
    *)
      echo "Unrecognized option: $1"
      echo
      print_help
      exit 1
      ;;
  esac
  shift
done

# set the initial offset to 0
offset=0

# set the base URL
base_url="https://api.deepstash.com/v1/article/"
url="${base_url}?limit=${page_size}&offset=${offset}"
header="Authorization: Bearer U5uKgfrMQk4aWp6mhQhvMDpAtEwFeU"

# loop over all the pages
while true; do
  # send a GET request to the current page URL and save the response in a file
  filename="offset_${offset}.json"
  curl --request GET \
  --url "${url}" \
  --header "${header}" \
  -o "${filename}"

  # check if there are more pages to download
  objects=$(jq -r '.objects | length' "${filename}")
  if [[ ${objects} -eq 0 ]]; then
    echo "All pages downloaded"
    break
  fi

  # increment the offset and check if we've reached the maximum number of pages
  echo $page_size
  offset=$((offset + page_size))
  if [[ ${max_pages} -ne -1 && ${offset} -ge ${max_pages}*$page_size ]]; then
    echo "Maximum number of pages processed"
    break
  fi

  # set the next page URL
  url="${base_url}?limit=${page_size}&offset=${offset}"
done

# extract the objects array from the file and pipe it to jq to print each object on a separate line
for file in *.json; do
  jq -c '.objects[]' "$file" | while read -r line; do
    echo "$line" >> data.ndjson
  done
done
rm -rf *.json
