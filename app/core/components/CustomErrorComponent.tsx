import clsx from "clsx"

const CustomErrorComponent: React.FC<{ statusCode: number; message: string }> = ({
  statusCode,
  message,
}) => (
  <div className="w-full">
    <h2 className={clsx("font-bold", "text-4xl", "text-center")}>
      {statusCode} - {message}
    </h2>
  </div>
)

export default CustomErrorComponent
