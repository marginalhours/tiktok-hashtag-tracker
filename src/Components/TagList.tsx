import React, { useState } from "react";

import { useTags } from "../hooks";
import { TagChart } from "./TagChart";

export function TagList() {
  const { tags, loading } = useTags();
  const [tagFilter, setTagFilter] = useState("");

  if (loading) {
    return <h1>Loading...</h1>;
  }

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
          placeholder="Filter tag charts..."
        ></input>
      </div>
      <div className="TagList__tagCharts">
        {filteredTags.map((tag, index) => (
          <TagChart key={tag} tag={tag} />
        ))}
      </div>
    </div>
  );
}
