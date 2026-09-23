import { useEffect, useState } from 'react'
import { AccessibilityInfo } from 'react-native'

/** Tracks whether a screen reader is enabled. Used for explicit-activation announcements. */
export function useScreenReaderEnabled(): boolean {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    let mounted = true
    void AccessibilityInfo.isScreenReaderEnabled().then((value) => {
      if (mounted) setEnabled(value)
    })
    const subscription = AccessibilityInfo.addEventListener('screenReaderChanged', (value) => {
      if (mounted) setEnabled(value)
    })
    return () => {
      mounted = false
      subscription?.remove?.()
    }
  }, [])

  return enabled
}
