# tiktok-hashtag-tracker

A GitHub actions-based TikTok hashtag tracker. An action runs on a cronjob to check the number of views for one or more tags specified in the `tags.txt` file. 

[View an example live here](https://marginalhours.github.io/tiktok-hashtag-tracker/)

## Usage

Clone this repository and delete whatever you want from the `data` directory. Then populate `tags.txt`.

Entries in the tag file look like: 

```
<tag name> -- <list of tag categories>
```
For example, to track the tag `hello` in categories `#experiment`, you would use:

```
hello -- #experiment 
```

GitHub actions should start adding datapoints within an hour or two. 
