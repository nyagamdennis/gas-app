// @ts-nocheck
import React, { useEffect, useState } from 'react'
import { DateTime } from 'luxon'

const SubscriptionCountdownTimer = ({ expiryDate }: { expiryDate: string | Date }) => {
  const [timeLeft, setTimeLeft] = useState({})

  const sanitizeExpiry = (rawDate: string | Date) => {
    if (rawDate instanceof Date) {
      return DateTime.fromJSDate(rawDate)
    }

    if (typeof rawDate === 'string') {
      // Remove "(East Africa Time)" or any bracketed TZ name
      const cleaned = rawDate.replace(/\s*\(.*?\)\s*$/, '')
      const parsed = DateTime.fromFormat(cleaned, "EEE MMM dd yyyy HH:mm:ss 'GMT'ZZ", { zone: 'utc' })
      return parsed
    }

    console.error('Invalid expiryDate input:', rawDate)
    return DateTime.invalid("Invalid input")
  }

  const calculateTimeLeft = () => {
    const now = DateTime.now()
    const expiry = sanitizeExpiry(expiryDate)

    if (!expiry.isValid) return {}

    const diff = expiry.diff(now, ['days', 'hours', 'minutes', 'seconds'])

    if (diff.toMillis() <= 0) return {}

    const { days, hours, minutes, seconds } = diff.toObject()
    return {
      days: Math.floor(days),
      hours: Math.floor(hours),
      minutes: Math.floor(minutes),
      seconds: Math.floor(seconds),
    }
  }

  useEffect(() => {
    setTimeLeft(calculateTimeLeft()) // initial set
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [expiryDate])

  if (!timeLeft || Object.keys(timeLeft).length === 0) {
    return <span className="text-red-600 font-bold">Expired</span>
  }

  return (
    <span className="font-mono text-sm text-blue-700 font-semibold">
      {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
    </span>
  )
}

export default SubscriptionCountdownTimer
