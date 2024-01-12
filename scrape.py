#! /usr/bin/env python
"""
Second iteration of scraping CLI using fancier techniques.

Only scrapes, doesn't add/remove
"""
from pathlib import Path
from typing import Set
from TikTokApi import TikTokApi
import asyncio
import os
from datetime import datetime

TAG_FILE = Path(__file__).parent / "tags.txt"
DATA_DIR = Path(__file__).parent / "data"

ms_token = os.environ.get("MS_TOKEN", None)

print(ms_token)


def add_tag_record(tag: str, timestamp: str, view_count: int):
    with (DATA_DIR / f"{tag}.txt").open("a+") as tag_record_file:
        tag_record_file.write(f"{timestamp}\t{view_count}\n")


def get_existing_tags() -> Set[str]:
    with TAG_FILE.open() as tag_file:
        return {t.split("--")[0].strip() for t in tag_file.readlines()}


async def lookup_tags():
    async with TikTokApi() as api:
        await api.create_sessions(
            ms_tokens=[ms_token], num_sessions=1, sleep_after=3, headless=True
        )

        for tag in list(get_existing_tags())[0:2]:
            tag = api.hashtag(tag)
            info = await tag.info()
            views = info["challengeInfo"]["stats"]["viewCount"]
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            add_tag_record(tag.name, timestamp, int(views))


if __name__ == "__main__":
    asyncio.run(lookup_tags())
