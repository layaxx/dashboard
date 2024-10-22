import Button, { ButtonProps } from "./Button"

type Props = Partial<ButtonProps> & { width?: string }

const SkeletonButton: React.FC<Props> = ({ width, size, variant, ...rest }) => {
  return (
    <Button
      size={size ?? "sm"}
      variant={variant ?? "secondary"}
      className={width ?? "w-24"}
      {...rest}
    >
      &nbsp;
    </Button>
  )
}

export default SkeletonButton
