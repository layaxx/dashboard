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
  },
  scales: {
    x: {
      type: "time" as const,
      max: dayjs().toISOString(),
    },
    y: {
      display: false,
    },
  },
}

type Props = {
  data: { x: Date; y: number; color: string }[]
}
export default function StatusChart({ data }: Props) {
  return (
    <Bar
      options={options}
      height={80}
      data={{
        datasets: [
          {
            backgroundColor: data.map((status) => status.color + "aa"),
            data,
          },
        ],
      }}
    />
  )
}
