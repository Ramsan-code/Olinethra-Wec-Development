"use client"

import * as React from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import { Settings, Save, CheckCircle2, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { SiteSettings, CmsStore } from "@/lib/cms"
import AdminLocationPicker from "@/components/maps/AdminLocationPicker"


export default function SettingsAdminPage() {
  const [settings, setSettings] = React.useState<SiteSettings | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [isSaving, setIsSaving] = React.useState(false)
  const [savedSuccess, setSavedSuccess] = React.useState(false)

  React.useEffect(() => {
    fetch("/api/admin/cms")
      .then((res) => res.json())
      .then((data: CmsStore) => {
        setSettings(data.siteSettings)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!settings) return
    setIsSaving(true)
    setSavedSuccess(false)

    try {
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateSettings",
          data: settings,
        }),
      })

      if (res.ok) {
        setSavedSuccess(true)
        setTimeout(() => setSavedSuccess(false), 3000)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  if (loading || !settings) {
    return (
      <AdminLayout>
        <div className="py-12 text-center font-mono text-xs text-neutral-500 uppercase">Loading Site Settings...</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6 dark:border-neutral-800">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-neutral-500">
              [ GLOBAL CONFIGURATION ]
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-neutral-50">
              Website Content Settings
            </h1>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
              Manage global hero copy, company contacts, footer statements, and social links.
            </p>
          </div>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-neutral-950 text-white dark:bg-neutral-50 dark:text-neutral-950 shrink-0"
          >
            <Save className="h-4 w-4 mr-1.5" />
            {isSaving ? "Saving Settings..." : "Save Settings"}
          </Button>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-600 font-mono">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Site Settings updated successfully! All pages &amp; AI Chatbot synced.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          {/* Hero Section Copy */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-950 dark:text-neutral-50">
              01. Hero Section Copy
            </h2>

            <div className="space-y-1">
              <Label className="text-xs font-mono">Hero Badge Text</Label>
              <Input
                value={settings.heroBadgeText}
                onChange={(e) => setSettings({ ...settings, heroBadgeText: e.target.value })}
                className="text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-mono">Main Hero Heading</Label>
              <Input
                value={settings.heroHeading}
                onChange={(e) => setSettings({ ...settings, heroHeading: e.target.value })}
                className="text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-mono">Hero Subheading Description</Label>
              <Textarea
                rows={3}
                value={settings.heroSubheading}
                onChange={(e) => setSettings({ ...settings, heroSubheading: e.target.value })}
                className="text-xs"
              />
            </div>
          </div>

          {/* About Section Copy */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-950 dark:text-neutral-50">
              02. About Section Copy
            </h2>

            <div className="space-y-1">
              <Label className="text-xs font-mono">About Heading</Label>
              <Input
                value={settings.aboutHeading}
                onChange={(e) => setSettings({ ...settings, aboutHeading: e.target.value })}
                className="text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-mono">About Summary</Label>
              <Textarea
                rows={3}
                value={settings.aboutDescription}
                onChange={(e) => setSettings({ ...settings, aboutDescription: e.target.value })}
                className="text-xs"
              />
            </div>
          </div>

          {/* Company Contact Details */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-950 dark:text-neutral-50">
              03. Company Contact Info
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs font-mono">Public Contact Email</Label>
                <Input
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-mono">Contact Phone Number</Label>
                <Input
                  value={settings.contactPhone}
                  onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                  className="text-xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-mono">Office Address / Location</Label>
              <Input
                value={settings.contactAddress}
                onChange={(e) => setSettings({ ...settings, contactAddress: e.target.value })}
                className="text-xs"
              />
            </div>
          </div>

          {/* Footer & Socials */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-950 dark:text-neutral-50">
              04. Footer &amp; Social Links
            </h2>

            <div className="space-y-1">
              <Label className="text-xs font-mono">Footer Tagline</Label>
              <Input
                value={settings.footerTagline}
                onChange={(e) => setSettings({ ...settings, footerTagline: e.target.value })}
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label className="text-xs font-mono">LinkedIn URL</Label>
                <Input
                  value={settings.linkedinUrl || ""}
                  onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value })}
                  className="text-xs font-mono"
                  placeholder="https://linkedin.com/company/..."
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-mono">GitHub URL</Label>
                <Input
                  value={settings.githubUrl || ""}
                  onChange={(e) => setSettings({ ...settings, githubUrl: e.target.value })}
                  className="text-xs font-mono"
                  placeholder="https://github.com/..."
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-mono">Twitter / X URL</Label>
                <Input
                  value={settings.twitterUrl || ""}
                  onChange={(e) => setSettings({ ...settings, twitterUrl: e.target.value })}
                  className="text-xs font-mono"
                  placeholder="https://x.com/..."
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-mono">Facebook URL</Label>
                <Input
                  value={settings.facebookUrl || ""}
                  onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                  className="text-xs font-mono"
                  placeholder="https://facebook.com/..."
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-mono">Instagram URL</Label>
                <Input
                  value={settings.instagramUrl || ""}
                  onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                  className="text-xs font-mono"
                  placeholder="https://instagram.com/..."
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-mono">YouTube URL</Label>
                <Input
                  value={settings.youtubeUrl || ""}
                  onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })}
                  className="text-xs font-mono"
                  placeholder="https://youtube.com/@..."
                />
              </div>
            </div>
          </div>

          {/* Company Location & Google Maps Configuration */}

          <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-950 dark:text-neutral-50 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-500" />
                05. Company Location &amp; Google Maps
              </h2>
              <span className="font-mono text-[10px] text-neutral-500 uppercase">[ Database Source of Truth ]</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1 sm:col-span-1">
                <Label className="text-xs font-mono">Location Name</Label>
                <Input
                  value={settings.location?.name || "Olinethra"}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      location: {
                        ...(settings.location || {
                          name: "Olinethra",
                          country: "Sri Lanka",
                          zoom: 14,
                          showMap: true,
                          showAddress: true,
                          showDirections: true,
                        }),
                        name: e.target.value,
                      },
                    })
                  }
                  className="text-xs"
                />
              </div>

              <div className="space-y-1 sm:col-span-1">
                <Label className="text-xs font-mono">City / Municipality</Label>
                <Input
                  value={settings.location?.city || "Vavuniya"}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      location: {
                        ...(settings.location || {
                          name: "Olinethra",
                          country: "Sri Lanka",
                          zoom: 14,
                          showMap: true,
                          showAddress: true,
                          showDirections: true,
                        }),
                        city: e.target.value,
                      },
                    })
                  }
                  className="text-xs"
                />
              </div>

              <div className="space-y-1 sm:col-span-1">
                <Label className="text-xs font-mono">Country</Label>
                <Input
                  value={settings.location?.country || "Sri Lanka"}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      location: {
                        ...(settings.location || {
                          name: "Olinethra",
                          country: "Sri Lanka",
                          zoom: 14,
                          showMap: true,
                          showAddress: true,
                          showDirections: true,
                        }),
                        country: e.target.value,
                      },
                    })
                  }
                  className="text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1 sm:col-span-2">
                <Label className="text-xs font-mono">Address Line 1</Label>
                <Input
                  value={settings.location?.addressLine1 || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      location: {
                        ...(settings.location || {
                          name: "Olinethra",
                          country: "Sri Lanka",
                          zoom: 14,
                          showMap: true,
                          showAddress: true,
                          showDirections: true,
                        }),
                        addressLine1: e.target.value,
                      },
                    })
                  }
                  className="text-xs"
                  placeholder="e.g. Kandy Road"
                />
              </div>

              <div className="space-y-1 sm:col-span-1">
                <Label className="text-xs font-mono">Postal Code</Label>
                <Input
                  value={settings.location?.postalCode || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      location: {
                        ...(settings.location || {
                          name: "Olinethra",
                          country: "Sri Lanka",
                          zoom: 14,
                          showMap: true,
                          showAddress: true,
                          showDirections: true,
                        }),
                        postalCode: e.target.value,
                      },
                    })
                  }
                  className="text-xs font-mono"
                  placeholder="43000"
                />
              </div>
            </div>

            {/* Latitude, Longitude & Zoom controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1">
                <Label className="text-xs font-mono">Latitude (-90 to 90)</Label>
                <Input
                  type="number"
                  step="0.0001"
                  value={settings.location?.latitude ?? 8.7514}
                  onChange={(e) => {
                    const lat = parseFloat(e.target.value) || 0
                    setSettings({
                      ...settings,
                      location: {
                        ...(settings.location || {
                          name: "Olinethra",
                          country: "Sri Lanka",
                          zoom: 14,
                          showMap: true,
                          showAddress: true,
                          showDirections: true,
                        }),
                        latitude: lat,
                        googleMapsUrl: `https://maps.google.com/?q=${lat},${settings.location?.longitude ?? 80.4971}`,
                      },
                    })
                  }}
                  className="text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-mono">Longitude (-180 to 180)</Label>
                <Input
                  type="number"
                  step="0.0001"
                  value={settings.location?.longitude ?? 80.4971}
                  onChange={(e) => {
                    const lng = parseFloat(e.target.value) || 0
                    setSettings({
                      ...settings,
                      location: {
                        ...(settings.location || {
                          name: "Olinethra",
                          country: "Sri Lanka",
                          zoom: 14,
                          showMap: true,
                          showAddress: true,
                          showDirections: true,
                        }),
                        longitude: lng,
                        googleMapsUrl: `https://maps.google.com/?q=${settings.location?.latitude ?? 8.7514},${lng}`,
                      },
                    })
                  }}
                  className="text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-mono">Map Zoom Level ({settings.location?.zoom ?? 14})</Label>
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={settings.location?.zoom ?? 14}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      location: {
                        ...(settings.location || {
                          name: "Olinethra",
                          country: "Sri Lanka",
                          zoom: 14,
                          showMap: true,
                          showAddress: true,
                          showDirections: true,
                        }),
                        zoom: parseInt(e.target.value, 10),
                      },
                    })
                  }
                  className="w-full accent-neutral-950 dark:accent-neutral-50 h-8 cursor-pointer"
                />
              </div>
            </div>

            {/* Visibility Toggles */}
            <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-mono">
                <input
                  type="checkbox"
                  checked={settings.location?.showMap ?? true}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      location: {
                        ...(settings.location || {
                          name: "Olinethra",
                          country: "Sri Lanka",
                          zoom: 14,
                          showMap: true,
                          showAddress: true,
                          showDirections: true,
                        }),
                        showMap: e.target.checked,
                      },
                    })
                  }
                  className="rounded border-neutral-300 accent-neutral-950 dark:accent-neutral-50 h-4 w-4"
                />
                <span>Show Map Component</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-mono">
                <input
                  type="checkbox"
                  checked={settings.location?.showAddress ?? true}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      location: {
                        ...(settings.location || {
                          name: "Olinethra",
                          country: "Sri Lanka",
                          zoom: 14,
                          showMap: true,
                          showAddress: true,
                          showDirections: true,
                        }),
                        showAddress: e.target.checked,
                      },
                    })
                  }
                  className="rounded border-neutral-300 accent-neutral-950 dark:accent-neutral-50 h-4 w-4"
                />
                <span>Show Text Address</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-mono">
                <input
                  type="checkbox"
                  checked={settings.location?.showDirections ?? true}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      location: {
                        ...(settings.location || {
                          name: "Olinethra",
                          country: "Sri Lanka",
                          zoom: 14,
                          showMap: true,
                          showAddress: true,
                          showDirections: true,
                        }),
                        showDirections: e.target.checked,
                      },
                    })
                  }
                  className="rounded border-neutral-300 accent-neutral-950 dark:accent-neutral-50 h-4 w-4"
                />
                <span>Show Directions Button</span>
              </label>
            </div>

            {/* Interactive Admin Map Preview */}
            <div className="pt-2">
              <Label className="text-xs font-mono block mb-2">Interactive Location Picker &amp; Preview</Label>
              <AdminLocationPicker
                latitude={settings.location?.latitude ?? 8.7514}
                longitude={settings.location?.longitude ?? 80.4971}
                zoom={settings.location?.zoom ?? 14}
                city={settings.location?.city || "Vavuniya"}
                country={settings.location?.country || "Sri Lanka"}
                onChange={(updates) => {
                  setSettings({
                    ...settings,
                    location: {
                      ...(settings.location || {
                        name: "Olinethra",
                        country: "Sri Lanka",
                        zoom: 14,
                        showMap: true,
                        showAddress: true,
                        showDirections: true,
                      }),
                      ...updates,
                    },
                  })
                }}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-neutral-950 text-white dark:bg-neutral-50 dark:text-neutral-950"
            >
              <Save className="h-4 w-4 mr-1.5" />
              {isSaving ? "Saving Settings..." : "Save Settings"}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}

