# tiktok-hashtag-tracker

A Rube Goldberg github actions-based TikTok hashtag tracker

[View live here](https://marginalhours.github.io/tiktok-hashtag-tracker/)

## Usage

Interacting with this can be handled purely by GitHub actions:

- `add-tag.yml`: workflow dispatch, takes tag as name
- `remove-tag.yml`: workflow dispatch, takes tag as name
- `update-stats.yml`: cron dispatch every 6 hours
