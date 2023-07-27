import React, { useMemo, useState } from "react";
import { registerLocale } from "react-datepicker";
import enGB from "date-fns/locale/en-GB";
registerLocale("en-GB", enGB);

import { useTags } from "../hooks";
import { TagList } from "./TagList";
import { TabList } from "./TabList";

export function TagTabs() {
  const { tabNames, currentTab, setCurrentTab, tabs, loading } = useTags();

  const currentTags = useMemo(
    () => (loading ? [] : tabs[currentTab]),
    [tabs, currentTab]
  );

  const [dateRange] = useState<Date[]>([null, null]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  const [startDate, endDate] = dateRange;

  return (
    <div className="TagList__outer">
      <div className="TagList__title">
        <h1>TikTok Tag Analytics</h1>
      </div>
      <TabList
        tabNames={tabNames}
        currentTab={currentTab}
        changeTab={setCurrentTab}
      />
      <TagList tags={currentTags} />
    </div>
  );
}
