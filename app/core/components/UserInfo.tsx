import { useMutation, Link, Routes } from "blitz"
import clsx from "clsx"
import { useCurrentUser } from "../hooks/useCurrentUser"
import logout from "app/auth/mutations/logout"

const UserInfo = () => {
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout)

  return currentUser ? (
    <button
      className={clsx("border-4", "border-primary", "font-medium", "px-4", "py-2")}
      onClick={async () => {
        await logoutMutation()
      }}
    >
      Logout
    </button>
  ) : (
    <>
      <Link href={Routes.SignupPage()}>
        <a className={clsx("button", "small")}>
          <strong>Sign Up</strong>
        </a>
      </Link>
      <Link href={Routes.LoginPage()}>
        <a className={clsx("button", "small")}>
          <strong>Login</strong>
        </a>
      </Link>
    </>
  )
}

export default UserInfo
