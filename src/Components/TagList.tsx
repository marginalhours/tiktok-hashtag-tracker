import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";

import { useDebouncedCallback } from "../hooks";
import { TagChart } from "./TagChart";
import { FixedSizeList } from "react-window";

const TagFilter = ({ setValue }) => {
  const [filter, setFilter] = useState("");

  const onFilter = useDebouncedCallback(() => {
    setValue(filter);
  }, 300);

  const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  useEffect(() => {
    onFilter();
  }, [filter, onFilter]);

  return (
    <input
      className="TagList__tagFilterInput"
      type="text"
      value={filter}
      onChange={handleFilterChange}
      placeholder="Filter charts by name..."
    ></input>
  );
};

export function TagList({ tags }) {
  const [dateRange, setDateRange] = useState<Date[]>([null, null]);
  const [tagFilter, setTagFilter] = useState("");

  const filteredTags = useMemo(
    () => (tags || []).filter((tag) => tag.includes(tagFilter)),
    [tags, tagFilter]
  );

  const [startDate, endDate] = dateRange;

  return (
    <>
      <div className="TagList__tagFilter">
        <TagFilter setValue={setTagFilter} />
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
        <FixedSizeList
          itemData={filteredTags}
          itemCount={filteredTags.length}
          height={800}
          width={"100%"}
          itemSize={400}
        >
          {({ data, index, style }) => (
            <div style={style}>
              <TagChart
                tag={data[index]}
                startDate={startDate}
                endDate={endDate}
              />
            </div>
          )}
        </FixedSizeList>
        {/* {filteredTags.map((tag, index) => (
          <TagChart
            key={tag}
            tag={tag}
            startDate={startDate}
            endDate={endDate}
          />
        ))} */}
      </div>
    </>
  );
}
