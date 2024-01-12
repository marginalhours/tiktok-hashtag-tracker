#! /usr/bin/env python
"""
Core CLI for data scraping. 

Commands:

- add-tag <tag>
- remove-tag <tag>
- scrape

"""
import sys
import time
import httpx
from pathlib import Path
from datetime import datetime
from bs4 import BeautifulSoup

from typing import Set

BASE_URL = "https://tiktok.com/tag"

TAG_FILE = Path(__file__).parent / "tags.txt"
DATA_DIR = Path(__file__).parent / "data"

# Tweak to tradeoff how hard we hit the API vs. how long the action takes to run
REQUEST_WAIT_TIME = 0.5


def get_existing_tags() -> Set[str]:
    with TAG_FILE.open() as tag_file:
        return {t.split("--")[0].strip() for t in tag_file.readlines()}


def write_out_tags(tags: Set[str]):
    with TAG_FILE.open("w") as tag_file:
        for tag in sorted(tags):
            tag_file.write(tag + "\n")


def add_tag_record(tag: str, timestamp: str, view_count: int):
    with (DATA_DIR / f"{tag}.txt").open("a+") as tag_record_file:
        tag_record_file.write(f"{timestamp}\t{view_count}\n")


def delete_tag_record_file(tag: str):
    (DATA_DIR / f"{tag}.txt").unlink(missing_ok=True)


def add_tag_record_file(tag: str):
    (DATA_DIR / f"{tag}.txt").touch(exist_ok=True)


def views_as_number(views: str):
    """
    Convert TikTok view text to an integer
    """
    number, _ = views.split(" ")

    # K: thousand
    # M: million
    # B: billion
    SUFFIX = "KMB"

    if number[-1] not in SUFFIX:
        return int(number)
    else:
        return int(float(number[:-1]) * (1000 ** (SUFFIX.index(number[-1]) + 1)))


def scrape_tag(tag: str, client: httpx.Client):
    """
    Scrape a single tag and write out a record
    """
    tag_url = f"{BASE_URL}/{tag}"

    print(f"Fetching {tag_url} ...")

    headers = {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    response = client.get(tag_url, follow_redirects=True, headers=headers, timeout=30.0)

    if response.status_code != 200:
        print(f"Unable to fetch page for tag {tag}: {response.status_code}")
        return

    soup = BeautifulSoup(response.text, "html.parser")
    count_element = soup.find("h2", attrs={"data-e2e": "challenge-vvcount"})
    
    if count_element is None:
        print(f"Unable to find count element on page")
        sys.exit(1)

    view_count = views_as_number(count_element.text)
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    print(f"{timestamp} - {tag}: {view_count} views")

    add_tag_record(tag, timestamp, view_count)


def scrape_tags():
    """
    Fetch the latest view counts for the list of tracked
    tags and store in the per-tag stats files
    """
    tags_to_scrape = get_existing_tags()

    with httpx.Client() as client:
        for tag in tags_to_scrape:
            scrape_tag(tag, client)
            time.sleep(REQUEST_WAIT_TIME)


def add_tag(tag_name: str):
    """Add a tag to the list of tags being tracked

    Args:
        tag_name (str): Tag name to track
    """
    existing_tags = get_existing_tags()

    if tag_name in existing_tags:
        return

    existing_tags.add(tag_name)

    write_out_tags(existing_tags)
    add_tag_record_file(tag_name)

    print(f"Added tag {tag_name}")


def remove_tag(tag_name: str):
    existing_tags = get_existing_tags()

    existing_tags -= {tag_name}

    write_out_tags(existing_tags)
    delete_tag_record_file(tag_name)

    print(f"Removed tag {tag_name}")


if __name__ == "__main__":
    command = sys.argv[1]

    if command == "scrape":
        scrape_tags()
    elif command == "add-tag":
        add_tag(sys.argv[2])
    elif command == "remove-tag":
        remove_tag(sys.argv[2])
    else:
        print(f"Unknown command {command}")
