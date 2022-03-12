import React, { useMemo } from "react";

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
}

export function TagChart({ tag }: Props) {
  const { tagData, loading } = useTag(tag);

  const labels = tagData?.map((point) => point.date) || [];
  const data = tagData?.map((point) => point.viewCount) || [];

  const lineData = {
    labels: labels.map((l) => l.toISOString()),
    datasets: [
      {
        label: `Views`,
        data,
        fill: false,
        borderColor: "#E45780",
        backgroundColor: "#E45780",
      },
    ],
  };

  const minDate = useMemo(() => {
    const firstDate = labels?.[0] ? new Date(labels?.[0]) : new Date();
    firstDate.setDate(firstDate.getDate() - 1);

    return firstDate;
  }, [labels]);

  const maxDate = useMemo(() => {
    const lastIndex = (labels?.length || 0) - 1;
    const lastDate = labels?.[lastIndex]
      ? new Date(labels?.[lastIndex])
      : new Date();
    lastDate.setDate(lastDate.getDate() + 1);

    return lastDate;
  }, [labels]);

  const options: ChartOptions = {
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
        },
        min: minDate.toDateString(),
        max: maxDate.toDateString(),
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

  return (
    <div className="TagChart__outer">
      <h2 className="TagChart__title">
        Views for{" "}
        <a key={tag} href={`https://tiktok.com/tag/${tag}`}>
          {`#${tag}`}
        </a>
      </h2>
      <div className="TagChart__canvasWrapper">
        {labels && labels.length ? (
          <Line data={lineData} options={options} height={320} />
        ) : (
          <div className="TagChart__noData">No data (yet)</div>
        )}
      </div>
      <hr className="TagChart__ruler" />
    </div>
  );
}
