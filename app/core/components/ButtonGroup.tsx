import { FC, ReactElement } from "react"
import clsx from "clsx"
import { twMerge } from "tailwind-merge"

const ButtonGroup: FC<{ children: Array<ReactElement>; notRounded?: boolean }> = ({
  children,
  notRounded,
}) => {
  children = children.map((child, index) => {
    return {
      ...child,
      props: {
        ...child.props,
        className: twMerge(
          clsx(
            "border-0",
            "grow",
            "sm:ml-0",
            "mx-0",
            !notRounded && [
              index === 0 && "rounded-l",
              index === children.length - 1 && "rounded-r",
            ]
          ),
          child.props.className
        ),
        notRounded: true,
      },
    }
  })
  return <>{children}</>
}

export default ButtonGroup
