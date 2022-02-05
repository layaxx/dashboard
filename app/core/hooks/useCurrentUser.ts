import { useQuery } from "blitz"
import getCurrentUser from "app/users/queries/getCurrentUser"

export const useCurrentUser = () => {
  // eslint-disable-next-line unicorn/no-null
  const [user] = useQuery(getCurrentUser, null)
  return user
}
