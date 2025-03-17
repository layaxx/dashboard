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
import { Bar } from "react-chartjs-2"
import "chartjs-adapter-dayjs-3"
import resolveConfig from "tailwindcss/resolveConfig"
import tailwindConfig from "tailwind.config"

ChartJS.register(CategoryScale, LinearScale, TimeScale, BarElement, Title, Tooltip, Legend)

const { colors } = resolveConfig(tailwindConfig).theme

type Data = Array<{
  x: Date
  color: "default" | "error" | "warning"
  insertCount: number
  updateCount: number
}>

function buildColors(data: Data, isDarkMode: boolean, opacity = ""): string[] {
  return data.map((dat) => {
    let color = isDarkMode ? colors.violet["700"] : colors.primary

    if (dat.color === "error") {
      color = isDarkMode ? colors.red["700"] : colors.error
    }

    if (dat.color === "warning") {
      color = isDarkMode ? colors.amber["700"] : colors.warning
    }

    return color + opacity
  })
}

type Props = {
  data: Data
  isDarkMode: boolean
}
export default function StatusChart({ data, isDarkMode }: Props) {
  const borderProps = {
    borderWidth: 1,
    borderColor: colors.slate[isDarkMode ? "600" : "800"] + "90",
  }
  const maxCountSum = data.reduce(
    (previous, { insertCount, updateCount }) => Math.max(insertCount + updateCount, previous),
    1 // minimal value
  )

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        displayColors: false,
        callbacks: {
          label: ({ raw, formattedValue, parsed }) => {
            if (parsed._stacks && parsed._stacks.y) {
              const { 0: created, 1: updated } = parsed._stacks.y

              return `inserts: ${created}, updates: ${updated}`
            }

            return (raw as { hidden?: boolean; title: string } | undefined)?.hidden
              ? ""
              : (raw as { title: string }).title + " " + formattedValue
          },
        },
      },
    },
    animation: false,
    scales: {
      x: {
        type: "time" as const,
        stacked: true,
        ticks: {
          color: isDarkMode ? colors.slate["400"] : undefined,
        },
        grid: {
          color: isDarkMode ? colors.slate["700"] : undefined,
        },
      },
      y: {
        type: "linear",
        display: false,
        stacked: true,
        bounds: "data",
      },
    },
  }

  return (
    <Bar
      options={options}
      height={80}
      data={{
        datasets: [
          {
            ...borderProps,
            backgroundColor: buildColors(data, isDarkMode),
            data: data.map((d) => ({ x: d.x, y: d.insertCount, title: "insert Count:" })),
          },
          {
            ...borderProps,
            backgroundColor: buildColors(data, isDarkMode, "77"),
            data: data.map((d) => ({ x: d.x, y: d.updateCount, title: "update Count:" })),
          },
          {
            backgroundColor: buildColors(data, isDarkMode, "11"),
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
