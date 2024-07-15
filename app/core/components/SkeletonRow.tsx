import React from "react"
import clsx from "clsx"

type Props = {
  size?: "lg" | "md" | "sm"
}

const SkeletonRow = ({ size }: Props) => (
  <p
    className={clsx(
      "animate-pulse",
      "bg-slate-200",
      size === "sm" && "h-4",
      (size === undefined || size === "md") && "h-6",
      size === "lg" && "h-8",
      "mb-2",
      "w-full",
    )}
  />
)

export default SkeletonRow
