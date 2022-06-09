import dayjs from "dayjs"
import { formatToTwoDigits, Statistics } from "app/feeds/lib/status"

const StatusTable = (statistics: Statistics) => {
  return (
    <table className="w-full">
      <tbody>
        <tr>
          <th className="text-left" scope="row">
            Time since last load
          </th>
          <td className="text-right">{dayjs().diff(dayjs(statistics.firstLoad), "minutes")} min</td>
        </tr>
        <tr>
          <th className="text-left" scope="row">
            Average Duration of Load
          </th>
          <td className="text-right">
            {formatToTwoDigits(statistics.sumLoadDuration / statistics.count)} ms
          </td>
        </tr>
        <tr>
          <th className="text-left" scope="row">
            Average Time since previous load
          </th>
          <td className="text-right">
            {formatToTwoDigits(statistics.sumLoadDuration / (statistics.count - 1))} min
          </td>
        </tr>
        <tr>
          <th className="text-left" scope="row">
            number of warnings / errors
          </th>
          <td className="text-right">
            {statistics.countWarnings} / {statistics.countErrors}
          </td>
        </tr>
        <tr>
          <th className="text-left" scope="row">
            fraction with warnings / errors
          </th>
          <td className="text-right">
            {(statistics.countWarnings / statistics.count) * 100}% /{" "}
            {(statistics.countErrors / statistics.count) * 100}%
          </td>
        </tr>
        <tr>
          <th className="text-left" scope="row">
            amount of inserts / updates
          </th>
          <td className="text-right">
            {statistics.sumInsertCount} / {statistics.sumUpdateCount}
          </td>
        </tr>
        <tr>
          <th className="text-left" scope="row">
            inserts / updates per Update
          </th>
          <td className="text-right">
            {(statistics.sumInsertCount / statistics.count) * 100} /{" "}
            {(statistics.sumUpdateCount / statistics.count) * 100}
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export default StatusTable
