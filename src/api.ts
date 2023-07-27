/** Utilities for fetching data from the server */

export const getTabs = async () => {
  try {
    const response = await fetch("./tags.txt");
    const body = await response.text();
    const tags = body
      .split("\n")
      .map((x) => x.trim())
      .filter((x) => x.length > 0)
      .map((x) => x.split("--"));
    return tags;
  } catch (err) {
    console.log(err);
  }
};

export interface DataPoint {
  date: Date;
  viewCount: number;
}

const fisherYatesShuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

export const getTagData = async (tag: string): Promise<DataPoint[]> => {
  const MAX_DATA_POINTS = 1000;
  const SAMPLED_ELEMENTS = 1000;
  const LAST_N_ELEMENTS = 100;

  // Under MAX_DATA_POINTS, we just plot everything
  // Over MAX_DATA_POINTS, we do:
  // - most recent LAST_N_ELEMENTS
  // - randomly sampled previous elements up to total count of 500

  const response = await fetch(`./data/${tag}.txt`);

  if (response.status === 404) {
    return [];
  }

  const body = await response.text();
  const records = body.split("\n").filter((x) => x.length > 0);

  let parsedRecords = records.map((record) => {
    const [rawDate, count] = record.split("\t");

    return {
      date: new Date(rawDate),
      viewCount: parseInt(count),
    };
  });

  if (parsedRecords.length < MAX_DATA_POINTS) {
    return parsedRecords;
  }

  const indices = fisherYatesShuffle(
    Array.from(Array(parsedRecords.length - LAST_N_ELEMENTS).keys())
  )
    .slice(0, SAMPLED_ELEMENTS - LAST_N_ELEMENTS)
    .sort((a, b) => a - b);

  return [
    ...indices.map((ix) => parsedRecords[ix]),
    ...parsedRecords.slice(-LAST_N_ELEMENTS),
  ];
};
