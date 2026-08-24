"use client"

import * as React from "react"
import { setOptions, importLibrary } from "@googlemaps/js-api-loader"
import { MapPin, Search, Crosshair, RefreshCw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface AdminLocationPickerProps {
  latitude?: number
  longitude?: number
  zoom?: number
  city?: string
  country?: string
  onChange: (updates: { latitude?: number; longitude?: number; addressLine1?: string; city?: string; country?: string; placeId?: string; googleMapsUrl?: string }) => void
}

export default function AdminLocationPicker({
  latitude = 8.7514,
  longitude = 80.4971,
  zoom = 14,
  city = "Vavuniya",
  country = "Sri Lanka",
  onChange,
}: AdminLocationPickerProps) {
  const mapRef = React.useRef<HTMLDivElement>(null)
  const searchInputRef = React.useRef<HTMLInputElement>(null)

  const [mapInstance, setMapInstance] = React.useState<any>(null)
  const [markerInstance, setMarkerInstance] = React.useState<any>(null)
  const [loadError, setLoadError] = React.useState<string | null>(null)
  const [isLoaded, setIsLoaded] = React.useState(false)

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY

  React.useEffect(() => {
    if (!apiKey) {
      setLoadError("NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY is missing. Interactive map preview & search are limited to manual coordinates.")
      return
    }

    let isMounted = true

    setOptions({
      key: apiKey,
      v: "weekly",
    })

    Promise.all([importLibrary("maps"), importLibrary("places"), importLibrary("marker")])
      .then(([mapsLib, placesLib, markerLib]) => {
        if (!isMounted || !mapRef.current) return

        const map = new mapsLib.Map(mapRef.current, {
          center: { lat: latitude, lng: longitude },
          zoom,
          disableDefaultUI: false,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
        })

        const marker = new markerLib.Marker({
          position: { lat: latitude, lng: longitude },
          map,
          draggable: true,
          title: "Drag to set company location",
        })


        // Drag marker event
        marker.addListener("dragend", () => {
          const pos = marker.getPosition()
          if (pos) {
            const newLat = Number(pos.lat().toFixed(6))
            const newLng = Number(pos.lng().toFixed(6))
            onChange({
              latitude: newLat,
              longitude: newLng,
              googleMapsUrl: `https://maps.google.com/?q=${newLat},${newLng}`,
            })
          }
        })

        // Map click event
        map.addListener("click", (e: any) => {
          if (e.latLng) {
            const newLat = Number(e.latLng.lat().toFixed(6))
            const newLng = Number(e.latLng.lng().toFixed(6))
            marker.setPosition({ lat: newLat, lng: newLng })
            onChange({
              latitude: newLat,
              longitude: newLng,
              googleMapsUrl: `https://maps.google.com/?q=${newLat},${newLng}`,
            })
          }
        })

        // Places Autocomplete
        if (searchInputRef.current && placesLib) {
          const autocomplete = new placesLib.Autocomplete(searchInputRef.current, {
            fields: ["address_components", "geometry", "name", "place_id", "formatted_address"],
          })

          autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace()
            if (!place.geometry || !place.geometry.location) return

            const newLat = Number(place.geometry.location.lat().toFixed(6))
            const newLng = Number(place.geometry.location.lng().toFixed(6))

            map.setCenter({ lat: newLat, lng: newLng })
            map.setZoom(15)
            marker.setPosition({ lat: newLat, lng: newLng })

            let detectedCity = ""
            let detectedCountry = ""
            let address1 = place.name || ""

            if (place.address_components) {
              for (const comp of place.address_components) {
                if (comp.types.includes("locality") || comp.types.includes("administrative_area_level_2")) {
                  detectedCity = comp.long_name
                }
                if (comp.types.includes("country")) {
                  detectedCountry = comp.long_name
                }
              }
            }

            onChange({
              latitude: newLat,
              longitude: newLng,
              addressLine1: address1,
              city: detectedCity || city,
              country: detectedCountry || country,
              placeId: place.place_id,
              googleMapsUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
            })
          })
        }

        setMapInstance(map)
        setMarkerInstance(marker)
        setIsLoaded(true)
      })
      .catch((err: any) => {
        console.warn("[ADMIN MAP] Load error:", err)
        if (isMounted) setLoadError(err?.message || "Failed to load Google Maps script")
      })



    return () => {
      isMounted = false
    }
  }, [apiKey])

  // Sync marker when prop coordinates change manually via input boxes
  React.useEffect(() => {
    if (mapInstance && markerInstance && isLoaded) {
      const currentPos = markerInstance.getPosition()
      if (!currentPos || currentPos.lat() !== latitude || currentPos.lng() !== longitude) {
        const newPos = { lat: latitude, lng: longitude }
        markerInstance.setPosition(newPos)
        mapInstance.setCenter(newPos)
      }
    }
  }, [latitude, longitude, mapInstance, markerInstance, isLoaded])

  return (
    <div className="space-y-4">
      {/* Search Input for Places API */}
      {apiKey && (
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search address or place (e.g. Vavuniya, Sri Lanka)..."
            className="pl-9 text-xs"
          />
        </div>
      )}

      {/* Map Preview Container */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden rounded-lg border border-neutral-200 bg-neutral-900 dark:border-neutral-800">
        {!apiKey || loadError ? (
          <div className="flex h-full flex-col items-center justify-center p-6 text-center text-white space-y-3">
            <MapPin className="h-8 w-8 text-neutral-500" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold">Manual Coordinate Preview Mode</h4>
              <p className="text-xs text-neutral-400 max-w-sm">
                Coordinates: <span className="font-mono text-white">{latitude}, {longitude}</span> ({city}, {country})
              </p>
              {loadError && (
                <p className="text-[11px] font-mono text-amber-400 pt-2">{loadError}</p>
              )}
            </div>
          </div>
        ) : (
          <div ref={mapRef} className="h-full w-full" />
        )}

        <div className="absolute top-3 right-3 z-10 rounded bg-neutral-950/80 px-2.5 py-1 text-[10px] font-mono text-neutral-300 backdrop-blur border border-neutral-800">
          Click map or drag marker to move pin
        </div>
      </div>
    </div>
  )
}
