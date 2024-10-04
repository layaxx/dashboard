import React, { ReactNode } from "react"
import clsx from "clsx"

const SettingsTable: React.FC<{ rows: [string, ReactNode][] }> = ({ rows }) => {
  return (
    <table className={clsx("border", "border-collapse", "border-gray-200", "w-full")}>
      <tbody>
        {rows.map(([name, value]) => (
          <tr className={clsx("border-b", "border-gray-200")} key={name}>
            <td className={clsx("border-gray-200", "border-r", "p-2")}>{name}</td>
            <td className="p-2">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default SettingsTable
