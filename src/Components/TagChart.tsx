import React, { useMemo } from "react";

import moment from "moment";

import {
  TimeScale,
  LinearScale,
  Chart,
  PointElement,
  LineElement,
  ChartOptions,
  Tooltip,
} from "chart.js";

import "chartjs-adapter-moment";

Chart.register(TimeScale, LinearScale, PointElement, LineElement, Tooltip);

import { Line } from "react-chartjs-2";
import { useTag } from "../hooks";

interface Props {
  tag: string;
  startDate?: Date;
  endDate?: Date;
}

export function TagChart({ tag, startDate, endDate }: Props) {
  const { tagData, tagTabs, loading, error } = useTag(tag);

  const filteredData = useMemo(() => {
    let data = tagData || [];

    if (startDate !== null) {
      const start = moment(startDate).utcOffset(0).startOf("day");
      data = data.filter((d) => moment(d.date).utcOffset(0).isAfter(start));
    }

    if (endDate !== null) {
      const end = moment(endDate).utcOffset(0).endOf("day");
      data = data.filter((d) => moment(d.date).utcOffset(0).isBefore(end));
    }

    return data;
  }, [tagData, startDate, endDate]);

  const labels = filteredData.map((point) => point.date);
  const data = filteredData.map((point) => point.viewCount);

  const lineData = {
    labels: labels.map((l) => l.toISOString()),
    datasets: [
      {
        label: `Views`,
        data,
        fill: true,
        borderColor: "#E45780",
        backgroundColor: "#E45780",
      },
    ],
  };

  const minDate = useMemo(() => {
    if (startDate !== null) {
      return moment(startDate).utcOffset(0).startOf("day");
    }

    const firstDate = labels?.[0] ? new Date(labels?.[0]) : new Date();
    return moment(firstDate).startOf("day");
  }, [labels]);

  const maxDate = useMemo(() => {
    if (endDate !== null) {
      return moment(endDate).utcOffset(0).endOf("day");
    }

    const lastIndex = (labels?.length || 0) - 1;
    const lastDate = labels?.[lastIndex]
      ? new Date(labels?.[lastIndex])
      : new Date();

    return moment(lastDate).endOf("day");
  }, [labels, endDate]);

  const options: ChartOptions = {
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
        },
        min: minDate,
        max: maxDate,
        display: true,
        text: "Date",
      },
      y: {
        min: 0,
      },
    },
    maintainAspectRatio: false,
    showToolTips: true,
  };

  const showChart = !error && !loading && labels && labels.length;

  return (
    <div className="TagChart__outer">
      <h2 className="TagChart__title">
        Views for{" "}
        <a
          key={tag}
          className="TagChart__link"
          target="_blank"
          href={`https://tiktok.com/tag/${tag}`}
        >
          {`${tag}`}
        </a>
        {tagTabs?.map((tab) => (
          <span className="TagChart__TabName">{tab}</span>
        ))}
      </h2>
      <div className="TagChart__canvasWrapper">
        {showChart ? (
          <Line data={lineData} options={options} height={320} />
        ) : (
          <div className="TagChart__noData">No data (yet)</div>
        )}
      </div>
      <hr className="TagChart__ruler" />
    </div>
  );
}
