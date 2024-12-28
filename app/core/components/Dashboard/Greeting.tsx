import React from "react"
import clsx from "clsx"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"

const greeting = ((hour: number) => {
  let greetings: string[]

  const allGreetings = {
    morning: ["Good morning", "Guten Morgen", "Rise and shine", "Morning", "Have a great day"],
    day: ["Guten Tag", "Good afternoon", "Howdy", "Buenos dias", "G'day", "Hello there"],
    evening: ["Good evening", "Nice to see you", "Fancy seeing you here", "Hi there"],
  }

  // eslint-disable-next-line no-magic-numbers
  if (hour > 4 && hour < 12) {
    greetings = allGreetings.morning
    // eslint-disable-next-line no-magic-numbers
  } else if (hour < 18) {
    greetings = allGreetings.day
  } else {
    greetings = allGreetings.evening
  }
  return greetings[Math.floor(Math.random() * greetings.length)]
})(new Date().getHours())

// Prevent chrome on mobile from converting email to a link
const sanitizeEmail = (email?: string) => (email ? <a>{email}</a> : "Anon")

const DashboardGreeting = () => {
  const user = useCurrentUser()

  return (
    <h1
      className={clsx("font-bold", "text-2xl", "text-primary", "dark:text-violet-400", "truncate")}
    >
      {greeting}, {user?.name ?? sanitizeEmail(user?.email)}!
    </h1>
  )
}

export default React.memo(DashboardGreeting)
