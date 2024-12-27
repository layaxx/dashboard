import { createContext, FC, ReactElement } from "react"
import { ButtonRoundedValue } from "./Button"

export const ButtonGroupContext = createContext<ButtonRoundedValue | undefined>(undefined)

const getRoundedValue = (index: number, length: number): ButtonRoundedValue => {
  if (length === 1) return "all" // only one element, should be rounded

  switch (index) {
    case 0:
      return "left" // first, i.e. left-most element, should be rounded on the left side
    case length - 1:
      return "right" // last, i.e. right-most element, should be rounded on the right side
    default:
      return "none" // middle elements should not be rounded
  }
}

const ButtonGroup: FC<{
  children: Array<ReactElement | undefined | string>
  notRounded?: boolean
}> = ({ children, notRounded }) => {
  if (notRounded) {
    return <ButtonGroupContext.Provider value="none">{children}</ButtonGroupContext.Provider>
  }

  const elementCount = children.filter(Boolean).length

  return (
    <>
      {children.map((child, index) => (
        <ButtonGroupContext.Provider value={getRoundedValue(index, elementCount)} key={index}>
          {child}
        </ButtonGroupContext.Provider>
      ))}
    </>
  )
}

export default ButtonGroup
