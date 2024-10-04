import React, { PropsWithChildren } from "react"
import clsx from "clsx"

const Heading: React.FC<PropsWithChildren<{ level: "h1" | "h2" | "h3" | "h4" }>> = ({
  children,
  level,
}) => {
  const className = clsx("font-bold", "mb-2", "mt-6")
  if (level === "h1") {
    return <h1 className={clsx(className, "text-6xl", "text-center")}>{children}</h1>
  }
  if (level === "h2") {
    return <h2 className={clsx(className, "text-4xl", "text-center")}>{children}</h2>
  }
  if (level === "h3") {
    return <h3 className={clsx(className, "text-3xl")}>{children}</h3>
  }

  return <h4 className={clsx(className, "text-2xl")}>{children}</h4>
}

export default Heading
