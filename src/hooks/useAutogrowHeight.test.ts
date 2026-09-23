import { describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useAutogrowHeight } from './useAutogrowHeight'

describe('useAutogrowHeight', () => {
  it('starts at minHeight', () => {
    const { result } = renderHook(() => useAutogrowHeight({ minHeight: 44, maxHeight: 160 }))
    expect(result.current.height).toBe(44)
  })

  it('grows with content up to maxHeight', () => {
    const { result } = renderHook(() => useAutogrowHeight({ minHeight: 44, maxHeight: 160 }))
    act(() => {
      result.current.handleContentSizeChange(100)
    })
    expect(result.current.height).toBe(100)
    act(() => {
      result.current.handleContentSizeChange(160)
    })
    expect(result.current.height).toBe(160)
  })

  it('clamps at maxHeight so the input scrolls internally', () => {
    const { result } = renderHook(() => useAutogrowHeight({ minHeight: 44, maxHeight: 160 }))
    act(() => {
      result.current.handleContentSizeChange(500)
    })
    expect(result.current.height).toBe(160)
  })

  it('does not go below minHeight', () => {
    const { result } = renderHook(() => useAutogrowHeight({ minHeight: 44, maxHeight: 160 }))
    act(() => {
      result.current.handleContentSizeChange(10)
    })
    expect(result.current.height).toBe(44)
  })

  it('uses a larger layout measurement when content-size events are unavailable', () => {
    const { result } = renderHook(() => useAutogrowHeight({ minHeight: 44, maxHeight: 160 }))
    act(() => {
      result.current.handleLayout({ nativeEvent: { layout: { height: 120 } } })
    })
    expect(result.current.height).toBe(120)
  })

  it('does not shrink after a content-size measurement', () => {
    const { result } = renderHook(() => useAutogrowHeight({ minHeight: 44, maxHeight: 160 }))
    act(() => {
      result.current.handleContentSizeChange(120)
      result.current.handleLayout({ nativeEvent: { layout: { height: 60 } } })
    })
    expect(result.current.height).toBe(120)
  })
})
