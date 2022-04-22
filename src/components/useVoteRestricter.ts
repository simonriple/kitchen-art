import { useEffect, useMemo, useState } from 'react'

export const useVoteRestricter = () => {
  const [storageDate, setStorageDate] = useState<Date | undefined>()
  useEffect(() => {
    const storageValue = localStorage.getItem('LastVoteDate')
    if (storageValue) {
      setStorageDate(new Date(storageValue))
    }
  }, [])

  const setLastVoteDate = () => {
    const now = Date.now()
    setStorageDate(new Date(now))
    if (typeof window !== 'undefined') {
      localStorage.setItem('LastVoteDate', Date.now().toString())
    }
  }

  const canVote = useMemo(() => {
    if (!storageDate) return true
    const msDelta = storageDate.setHours(24).valueOf() - storageDate.valueOf()
    return msDelta < 0
  }, [storageDate])

  return {
    canVote,
    setLastVoteDate,
  }
}
