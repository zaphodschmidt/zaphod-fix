import * as React from "react"

const MOBILE_BREAKPOINT_PX = 768

/**
 * Returns `true` when viewport width is below the mobile breakpoint.
 * Client-only: relies on `window.matchMedia`.
 */
export function useIsMobile(breakpointPx: number = MOBILE_BREAKPOINT_PX) {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpointPx - 1}px)`)

    const onChange = () => setIsMobile(mql.matches)

    // Set initial value
    onChange()

    // Subscribe
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", onChange)
      return () => mql.removeEventListener("change", onChange)
    }

    // Safari fallback
    // eslint-disable-next-line deprecation/deprecation
    mql.addListener(onChange)
    // eslint-disable-next-line deprecation/deprecation
    return () => mql.removeListener(onChange)
  }, [breakpointPx])

  return isMobile
}

