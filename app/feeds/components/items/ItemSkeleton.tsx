import React from "react"
import clsx from "clsx"

const ItemSkeleton = () => (
  <div
    className={clsx(
      "animate-pulse",
      "bg-slate-200",
      "border-b-2",
      "border-slate-100",
      "h-16",
      "top-0",
      "w-full",
    )}
  />
)

export default ItemSkeleton
