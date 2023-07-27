import React from "react";

interface TabListProps {
  tabNames: string[];
  currentTab: string;
  changeTab: (arg0: string) => void;
}

export function TabList({ tabNames, currentTab, changeTab }: TabListProps) {
  return (
    <div className="TabNames__outer">
      {tabNames.map((tab) => (
        <span
          className={
            "TabName__inner " + (tab === currentTab ? "TabName__active" : "")
          }
          onClick={() => changeTab(tab)}
        >
          {tab}
        </span>
      ))}
    </div>
  );
}
