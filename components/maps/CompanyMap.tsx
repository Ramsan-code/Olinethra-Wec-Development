"use client"

import * as React from "react"
import { MapPin, Navigation, ExternalLink, AlertTriangle } from "lucide-react"
import { setOptions, importLibrary } from "@googlemaps/js-api-loader"
import { LocationSettings } from "@/lib/cms"

interface CompanyMapProps {
  location?: LocationSettings
  className?: string
  height?: string
}

export default function CompanyMap({ location, className = "", height = "h-[360px] sm:h-[420px]" }: CompanyMapProps) {
  const mapRef = React.useRef<HTMLDivElement>(null)
  const [loadError, setLoadError] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  const lat = location?.latitude ?? 8.7514
  const lng = location?.longitude ?? 80.4971
  const zoom = location?.zoom ?? 14
  const locName = location?.name || "Olinethra"
  const city = location?.city || "Vavuniya"
  const country = location?.country || "Sri Lanka"
  const addressLine1 = location?.addressLine1 || "Kandy Road"
  const googleMapsUrl =
    location?.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
  const showMap = location?.showMap ?? true

  React.useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY

    if (!apiKey) {
      setIsLoading(false)
      setLoadError("API Key not configured")
      return
    }

    if (!showMap) {
      setIsLoading(false)
      return
    }

    let isMounted = true
    const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAP_ID || undefined

    setOptions({
      key: apiKey,
      v: "weekly",
    })

    Promise.all([importLibrary("maps"), importLibrary("marker")])
      .then(([mapsLib, markerLib]) => {
        if (!isMounted || !mapRef.current) return

        const mapOptions: google.maps.MapOptions = {
          center: { lat, lng },
          zoom,
          mapId,
          disableDefaultUI: false,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
          styles: [
            {
              featureType: "all",
              elementType: "labels.text.fill",
              stylers: [{ color: "#747474" }],
            },
            {
              featureType: "administrative",
              elementType: "country",
              stylers: [{ visibility: "on" }],
            },
          ],
        }

        const map = new mapsLib.Map(mapRef.current, mapOptions)

        if (markerLib.AdvancedMarkerElement) {
          const markerElement = document.createElement("div")
          markerElement.className =
            "flex h-9 w-9 items-center justify-center rounded-full bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-lg border-2 border-white dark:border-neutral-900 font-bold"
          markerElement.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`

          new markerLib.AdvancedMarkerElement({
            map,
            position: { lat, lng },
            title: `${locName} - ${city}`,
            content: markerElement,
          })
        } else {
          new markerLib.Marker({
            map,
            position: { lat, lng },
            title: `${locName} - ${city}`,
          })
        }


        const infoWindow = new mapsLib.InfoWindow({
          content: `
            <div style="padding: 8px; font-family: system-ui, sans-serif;">
              <strong style="font-size: 14px; color: #111;">${locName}</strong>
              <p style="margin: 4px 0 8px 0; font-size: 12px; color: #555;">${addressLine1}, ${city}, ${country}</p>
              <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer" style="font-size: 12px; color: #000; font-weight: 600; text-decoration: underline;">Get Directions &rarr;</a>
            </div>
          `,
        })

        map.addListener("click", () => {
          infoWindow.open(map)
        })

        setIsLoading(false)
      })
      .catch((err: any) => {
        console.warn("[GOOGLE MAPS] Failed to load interactive map:", err)
        if (isMounted) {
          setLoadError(err?.message || "Failed to load Google Maps")
          setIsLoading(false)
        }
      })



    return () => {
      isMounted = false
    }
  }, [lat, lng, zoom, locName, city, country, addressLine1, googleMapsUrl, showMap])

  if (!showMap) {
    return null
  }

  // Fallback Card if API key is missing or load failed
  if (loadError || !process.env.NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY) {
    return (
      <div
        className={`relative flex flex-col justify-between overflow-hidden rounded-xl border border-neutral-200 bg-neutral-900 p-6 text-white dark:border-neutral-800 ${height} ${className}`}
      >
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-800/80 px-3 py-1 text-xs font-mono uppercase tracking-wider text-neutral-300 backdrop-blur-sm">
            <MapPin className="h-3.5 w-3.5 text-emerald-400" />
            <span>{locName} Location</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold tracking-tight">{city}, {country}</h3>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-sm">
            {addressLine1 ? `${addressLine1}, ` : ""}{city}, {country}
          </p>
          {location?.note && (
            <p className="text-xs text-neutral-400 font-mono italic border-l-2 border-neutral-700 pl-2 mt-2">
              Note: {location.note}
            </p>
          )}
        </div>

        <div className="relative z-10 pt-6">
          {location?.showDirections !== false && (
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-2.5 text-xs font-bold text-neutral-950 transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-md"
            >
              <Navigation className="h-4 w-4" />
              <span>Open in Google Maps</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-70" />
            </a>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 ${height} ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-neutral-900 text-neutral-400 space-y-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
          <span className="font-mono text-xs uppercase tracking-widest">Loading Google Maps...</span>
        </div>
      )}

      <div ref={mapRef} className="h-full w-full" />

      {/* Floating Directions Banner */}
      {location?.showDirections !== false && (
        <div className="absolute bottom-4 left-4 right-4 z-10 sm:left-auto sm:right-4 max-w-xs">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 rounded-lg border border-neutral-800 bg-neutral-950/90 px-4 py-2.5 text-xs font-medium text-white backdrop-blur-md transition-all hover:bg-neutral-900 shadow-xl"
          >
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-400 shrink-0" />
              <span className="font-mono text-[11px] truncate">{locName} &bull; {city}</span>
            </div>
            <span className="inline-flex items-center gap-1 font-bold text-emerald-400 shrink-0">
              Directions <ExternalLink className="h-3 w-3" />
            </span>
          </a>
        </div>
      )}
    </div>
  )
}
