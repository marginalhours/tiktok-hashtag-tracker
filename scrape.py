#! /usr/bin/env python
"""
Second iteration of scraping CLI using fancier techniques.

Only scrapes, doesn't add/remove
"""
from pathlib import Path
from typing import Set
from tiktokapipy.api import TikTokAPI
import random
import time
from datetime import datetime
import tqdm

TAG_FILE = Path(__file__).parent / "tags.txt"
DATA_DIR = Path(__file__).parent / "data"
REQUEST_WAIT_TIME = 0.5


def add_tag_record(tag: str, timestamp: str, view_count: int):
    with (DATA_DIR / f"{tag}.txt").open("a+") as tag_record_file:
        tag_record_file.write(f"{timestamp}\t{view_count}\n")


def get_existing_tags() -> Set[str]:
    with TAG_FILE.open() as tag_file:
        return {t.split("--")[0].strip() for t in tag_file.readlines()}


def lookup_tags():
    tag_list = list(get_existing_tags())
    # shuffle in case later failures are more likely (cheers TikTok)
    random.shuffle(tag_list)

    with TikTokAPI() as api:
        progress = tqdm.tqdm(tag_list)
        for tag in progress:
            progress.set_description(tag)
            try:
                tag_entry = api.challenge(tag)
                views = tag_entry.stats.view_count
                timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

                add_tag_record(tag, timestamp, int(views))
                time.sleep(REQUEST_WAIT_TIME)
            except Exception as err:
                print(f"Couldn't scrape tag: {tag} - {err}")


if __name__ == "__main__":
    lookup_tags()
