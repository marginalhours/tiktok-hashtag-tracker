import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import enGB from "date-fns/locale/en-GB";
registerLocale("en-GB", enGB);

import { useTags } from "../hooks";
import { TagChart } from "./TagChart";

export function TagList() {
  const { tags, loading } = useTags();
  const [tagFilter, setTagFilter] = useState("");
  const [dateRange, setDateRange] = useState<Date[]>([null, null]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  const [startDate, endDate] = dateRange;

  const filteredTags = tags.filter((tag) => tag.includes(tagFilter));

  return (
    <div className="TagList__outer">
      <div className="TagList__title">
        <h1>TikTok Tag Analytics</h1>
      </div>
      <div className="TagList__tagFilter">
        <input
          className="TagList__tagFilterInput"
          type="text"
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          placeholder="Filter charts by name..."
        ></input>
        <div className="TagList__tagDateFilter">
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            locale="en-GB"
            dateFormat="dd/MM/yyyy"
            placeholderText="Filter between dates..."
            onChange={(update) => {
              setDateRange(update);
            }}
            isClearable={true}
          />
        </div>
      </div>
      <div className="TagList__tagCharts">
        {filteredTags.map((tag, index) => (
          <TagChart
            key={tag}
            tag={tag}
            startDate={startDate}
            endDate={endDate}
          />
        ))}
      </div>
    </div>
  );
}
