/** Utilities for fetching data from the server */

export const getTags = async (): Promise<string[]> => {
  const response = await fetch("./tags.txt");
  const body = await response.text();
  const tags = body.split("\n").filter((x) => x.length > 0);

  return tags;
};

export interface DataPoint {
  date: Date;
  viewCount: number;
}

export const getTagData = async (tag: string): Promise<DataPoint[]> => {
  const response = await fetch(`./data/${tag}.txt`);

  if (response.status === 404) {
    return [];
  }

  const body = await response.text();
  const records = body.split("\n").filter((x) => x.length > 0);

  const parsedRecords = records.map((record) => {
    const [rawDate, count] = record.split("\t");

    return {
      date: new Date(rawDate),
      viewCount: parseInt(count),
    };
  });

  return parsedRecords;
};
