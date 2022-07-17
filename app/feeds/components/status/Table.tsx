import dayjs from "dayjs"
import { formatToTwoDigits, Statistics } from "lib/status"

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
            number / fraction of warnings
          </th>
          <td className="text-right">
            {statistics.countWarnings} /{" "}
            {formatToTwoDigits((statistics.countWarnings / statistics.count) * 100)}%
          </td>
        </tr>
        <tr>
          <th className="text-left" scope="row">
            number / fraction of errors
          </th>
          <td className="text-right">
            {statistics.countErrors} /{" "}
            {formatToTwoDigits((statistics.countErrors / statistics.count) * 100)}%
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
            {formatToTwoDigits(statistics.sumInsertCount / statistics.count)} /{" "}
            {formatToTwoDigits(statistics.sumUpdateCount / statistics.count)}
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export default StatusTable
