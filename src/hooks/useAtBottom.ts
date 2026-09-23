import { useCallback, useRef, useState } from 'react'

export interface ScrollMetrics {
  contentHeight: number
  offsetY: number
  viewportHeight: number
}

export function distanceFromBottom(metrics: ScrollMetrics): number {
  return metrics.contentHeight - (metrics.offsetY + metrics.viewportHeight)
}

export function isNearBottom(metrics: ScrollMetrics, threshold: number): boolean {
  return distanceFromBottom(metrics) <= threshold
}

export interface AtBottomState {
  isAtBottom: boolean
  isAtBottomRef: React.RefObject<boolean>
  showScrollToLatest: boolean
  update: (metrics: ScrollMetrics) => void
}

/**
 * Tracks how far the list is scrolled from the end. `threshold` is the
 * follow/hide distance: within it the list follows new content and the latest
 * control hides. `showThreshold`, when greater than `threshold`, adds hysteresis
 * so the control shows only beyond the larger distance and retains its previous
 * visibility between the two.
 */
export function useAtBottom(
  threshold: number,
  onAtBottomChange?: (isAtBottom: boolean) => void,
  showThreshold?: number,
): AtBottomState {
  const [isAtBottom, setIsAtBottom] = useState(true)
  const [showScrollToLatest, setShowScrollToLatest] = useState(false)
  const isAtBottomRef = useRef(true)
  const showScrollToLatestRef = useRef(false)
  const onAtBottomChangeRef = useRef(onAtBottomChange)
  onAtBottomChangeRef.current = onAtBottomChange

  const update = useCallback(
    (metrics: ScrollMetrics) => {
      const distance = distanceFromBottom(metrics)
      const next = distance <= threshold
      if (next !== isAtBottomRef.current) {
        isAtBottomRef.current = next
        setIsAtBottom(next)
        onAtBottomChangeRef.current?.(next)
      }

      const hysteresis = showThreshold !== undefined && showThreshold > threshold
      const nextShow = hysteresis
        ? distance > showThreshold
          ? true
          : distance <= threshold
            ? false
            : showScrollToLatestRef.current
        : !next
      if (nextShow !== showScrollToLatestRef.current) {
        showScrollToLatestRef.current = nextShow
        setShowScrollToLatest(nextShow)
      }
    },
    [threshold, showThreshold],
  )

  return { isAtBottom, isAtBottomRef, showScrollToLatest, update }
}
