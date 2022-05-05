import { useEffect, useMemo, useState } from 'react'

export const useVoteRestricter = () => {
  const [storageDate, setStorageDate] = useState<Date | undefined>()
  useEffect(() => {
    const storageValue = localStorage.getItem('LastVoteDate')
    if (storageValue) {
      setStorageDate(new Date(Number(storageValue)))
    }
  }, [])

  const setLastVoteDate = () => {
    const now = Date.now()
    setStorageDate(new Date(now))
    if (typeof window !== 'undefined') {
      localStorage.setItem('LastVoteDate', Date.now().toString())
    }
  }

  const canVote = () => {
    if (!storageDate) return true
    const midnight = new Date(storageDate)
    midnight.setHours(24)
    midnight.setMinutes(0)
    midnight.setSeconds(0)
    return new Date(Date.now()) > midnight
  }

  return {
    canVote,
    setLastVoteDate,
  }
}
