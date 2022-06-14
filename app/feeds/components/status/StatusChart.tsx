import React from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  LinearScale,
  ChartOptions,
} from "chart.js"
import dayjs from "dayjs"
import { Bar } from "react-chartjs-2"
import "chartjs-adapter-dayjs-3"

ChartJS.register(CategoryScale, LinearScale, TimeScale, BarElement, Title, Tooltip, Legend)

const options: ChartOptions<"bar"> = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: ({ raw, formattedValue }) => {
          return !(raw as { hidden?: boolean; title: string } | undefined)?.hidden
            ? (raw as { title: string }).title + " " + formattedValue
            : ""
        },
      },
    },
  },
  animation: false,
  scales: {
    x: {
      type: "time" as const,
      max: dayjs().toISOString(),
      stacked: true,
    },
    y: {
      display: false,
      stacked: true,
    },
  },
}

type Props = {
  data: { x: Date; color: string; insertCount: number; updateCount: number }[]
}
export default function StatusChart({ data }: Props) {
  const borderProps = { borderWidth: 1, borderColor: "#222" }
  const maxCountSum = data.reduce(
    (previous, { insertCount, updateCount }) =>
      insertCount + updateCount > previous ? insertCount + updateCount : previous,
    0
  )

  return (
    <Bar
      options={options}
      height={80}
      data={{
        datasets: [
          {
            ...borderProps,
            backgroundColor: data.map((status) => status.color),
            data: data.map((d) => ({ x: d.x, y: d.insertCount, title: "insert Count:" })),
          },
          {
            ...borderProps,
            backgroundColor: data.map((status) => status.color + "77"),
            data: data.map((d) => ({ x: d.x, y: d.updateCount, title: "update Count:" })),
          },
          {
            backgroundColor: data.map((status) => status.color + "11"),
            data: data.map((d) => ({
              x: d.x,
              y: maxCountSum - (d.insertCount + d.updateCount),
              title: "combined",
              hidden: true,
            })),
          },
        ],
      }}
    />
  )
}
