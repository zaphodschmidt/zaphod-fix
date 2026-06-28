/** Local YYYY-MM-DD for a given ISO timestamp. */
export function localDayOf(iso?: string): string {
  const d = iso ? new Date(iso) : new Date()
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 10)
}

/** Today's date as a local YYYY-MM-DD string. */
export function todayISO(): string {
  return localDayOf(new Date().toISOString())
}

/** 24-hour clock time, e.g. "13:10". */
export function formatTime(iso?: string): string {
  return new Date(iso ?? Date.now()).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

/** A day heading from a YYYY-MM-DD, e.g. "Saturday, June 14". */
export function formatDayHeading(ymd: string): string {
  return new Date(ymd + "T00:00:00").toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
}

/** Minutes -> compact "1h 30m" / "45m" string. */
export function formatMinutes(minutes: number | null | undefined): string {
  if (minutes == null) return ""
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h && m) return `${h}h ${m}m`
  if (h) return `${h}h`
  return `${m}m`
}

/** Add (or subtract) days to a local YYYY-MM-DD, returning a local YYYY-MM-DD. */
export function addDays(ymd: string, days: number): string {
  const d = new Date(ymd + "T00:00:00")
  d.setDate(d.getDate() + days)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

/** ISO timestamp for the given local day at the current wall-clock time. */
export function dateTimeOnDayISO(ymd: string): string {
  const now = new Date()
  const d = new Date(ymd + "T00:00:00")
  d.setHours(
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
    now.getMilliseconds()
  )
  return d.toISOString()
}
