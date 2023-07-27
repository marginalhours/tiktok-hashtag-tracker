import useSWR from "swr";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getTabs, getTagData } from "./api";

/** Load all tags */
export const useTags = () => {
  const { data, error } = useSWR("tags", getTabs);
  const [currentTab, setCurrentTab] = useState("#uncategorized");

  const tagsWithTabs = useMemo(() => {
    const tabbedTags = data?.map(([tag, tabs]) => {
      return [
        tag.trim(),
        (tabs || "#uncategorized")
          .split(" ")
          .map((tab) => tab.trim())
          .filter((tab) => tab.length > 0),
      ];
    });

    const byTagName =
      tabbedTags?.reduce((acc, tag) => {
        return {
          ...acc,
          [tag[0] as string]: tag[1],
        };
      }, {}) || {};

    return byTagName;
  }, [data]);

  const tabs = useMemo(() => {
    const tabs = {};

    Object.keys(tagsWithTabs)?.forEach((tag) => {
      const tagTabs = tagsWithTabs[tag];

      (tagTabs || []).forEach((tab) => {
        tabs[tab] = [...(tabs[tab] || []), tag];
      });
    });

    return tabs;
  }, [tagsWithTabs]);

  const tabNames = useMemo(() => {
    return Object.keys(tabs);
  }, [tabs]);

  useEffect(() => {
    setCurrentTab(tabNames[0]);
  }, [tabNames]);

  return {
    tabNames,
    currentTab,
    setCurrentTab,
    tabs,
    tagsWithTabs,
    error,
    loading: !data && !error,
  };
};

/** Load data for a single tag */
export const useTag = (tag: string) => {
  const { data, error } = useSWR(["tags", tag], () => getTagData(tag));
  const { tagsWithTabs } = useTags();

  const tagTabs = useMemo(() => {
    return tagsWithTabs[tag];
  }, [tagsWithTabs]);

  return { tagData: data, tagTabs, error, loading: !data && !error };
};

export const useDebouncedCallback = (func, wait) => {
  // Use a ref to store the timeout between renders
  // and prevent changes to it from causing re-renders
  const timeout = useRef<number>();

  return useCallback(
    (...args) => {
      const later = () => {
        clearTimeout(timeout.current);
        func(...args);
      };

      clearTimeout(timeout.current);
      timeout.current = setTimeout(later, wait);
    },
    [func, wait]
  );
};
