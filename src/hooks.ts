import useSWR from "swr";
import { getTags, getTagData } from "./api";

/** Load all tags */
export const useTags = () => {
  const { data, error } = useSWR("tags", getTags);

  return { tags: data, error, loading: !data && !error };
};

/** Load data for a single tag */
export const useTag = (tag: string) => {
  const { data, error } = useSWR(["tags", tag], () => getTagData(tag));

  return { tagData: data, error, loading: !data && !error };
};
