import React from "react"
import { useSession } from "blitz"
import clsx from "clsx"

const greeting = ((hour: number) => {
  let greetings: string[]

  const allGreetings = {
    morning: ["Good morning", "Guten Morgen", "Rise and shine", "Morning", "Have a great day"], // eslint-disable-next-line sort-keys
    day: ["Guten Tag", "Good afternoon", "Howdy", "Buenos dias", "G'day", "Hello there"],
    evening: ["Good evening", "Nice to see you", "Fancy seeing you here", "Hi there"],
  }

  if (hour > 4 && hour < 12) {
    greetings = allGreetings.morning
  } else if (hour < 18) {
    greetings = allGreetings.day
  } else {
    greetings = allGreetings.evening
  }
  return greetings[Math.floor(Math.random() * greetings.length)]
})(new Date().getHours())

const DashboardGreeting = React.memo(() => {
  const session = useSession()

  return (
    <h1 className={clsx("font-bold", "text-2xl", "text-primary")}>
      {greeting}, {session.userName}!
    </h1>
  )
})

export default DashboardGreeting
