"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Check, Upload } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getSupabaseClient } from "@/lib/supabase-client"

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [faviconUrl, setFaviconUrl] = useState(
    "https://uenczyfmsqiafcjrlial.supabase.co/storage/v1/object/public/favicons//watercolor-sun-transparent.ico",
  )
  const [faviconFile, setFaviconFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch("/api/admin/settings")
        const data = await response.json()

        if (data.settings) {
          setSettings(data.settings)
          setFaviconUrl(data.settings.favicon_url || "")
        }
      } catch (err) {
        setError("Failed to load settings")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const saveSetting = async (key: string, value: string) => {
    setError(null)
    setSuccess(null)
    setSaving(true)

    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key, value }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to save setting")
      }

      // Update local state
      setSettings((prev) => ({
        ...prev,
        [key]: value,
      }))

      setSuccess(`Setting "${key}" updated successfully`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleFaviconSave = () => {
    saveSetting("favicon_url", faviconUrl)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFaviconFile(file)

      // Create preview URL
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)

      // Clean up preview URL when component unmounts
      return () => URL.revokeObjectURL(objectUrl)
    }
  }

  const uploadFavicon = async () => {
    if (!faviconFile) {
      setError("Please select a file first")
      return
    }

    setUploading(true)
    setError(null)
    setSuccess(null)

    try {
      const supabase = getSupabaseClient()

      // Upload file to Supabase Storage
      const fileName = `favicon-${Date.now()}.${faviconFile.name.split(".").pop()}`
      const { data, error } = await supabase.storage.from("public").upload(fileName, faviconFile, {
        cacheControl: "3600",
        upsert: true,
      })

      if (error) throw error

      // Get public URL
      const { data: publicUrlData } = supabase.storage.from("public").getPublicUrl(fileName)

      // Update favicon URL
      setFaviconUrl(publicUrlData.publicUrl)

      // Save setting
      await saveSetting("favicon_url", publicUrlData.publicUrl)

      setSuccess("Favicon uploaded and saved successfully")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload favicon")
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading settings...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Site Settings</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
          <Check className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="appearance">
        <TabsList className="mb-6">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Favicon</CardTitle>
                <CardDescription>
                  Upload and manage the favicon for your site. This will be displayed in browser tabs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Current Favicon */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Current Favicon</h3>
                    <div className="flex items-center gap-4">
                      <div className="border rounded p-2 bg-muted">
                        <img
                          src={faviconUrl || "/placeholder.svg?height=48&width=48&query=icon"}
                          alt="Current favicon"
                          className="w-10 h-10 object-contain"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = "/generic-app-icon.png"
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          value={faviconUrl}
                          onChange={(e) => setFaviconUrl(e.target.value)}
                          placeholder="https://example.com/favicon.png"
                        />
                      </div>
                      <Button onClick={handleFaviconSave} disabled={saving || faviconUrl === settings.favicon_url}>
                        {saving ? "Saving..." : "Save URL"}
                      </Button>
                    </div>
                  </div>

                  {/* Upload New Favicon */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Upload New Favicon</h3>
                    <div className="grid gap-4">
                      <div className="flex items-center gap-4">
                        {previewUrl && (
                          <div className="border rounded p-2 bg-muted">
                            <img
                              src={previewUrl || "/placeholder.svg"}
                              alt="Favicon preview"
                              className="w-10 h-10 object-contain"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <Input
                            type="file"
                            accept="image/png,image/x-icon,image/ico,image/svg+xml"
                            onChange={handleFileChange}
                          />
                        </div>
                      </div>
                      <Button onClick={uploadFavicon} disabled={uploading || !faviconFile} className="w-full sm:w-auto">
                        {uploading ? "Uploading..." : "Upload & Save Favicon"}
                        {!uploading && <Upload className="ml-2 h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
              <CardDescription>Basic information about your website</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <label htmlFor="site-name" className="text-sm font-medium">
                    Site Name
                  </label>
                  <Input
                    id="site-name"
                    value={settings.site_name || ""}
                    onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                    placeholder="My Awesome Site"
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="site-description" className="text-sm font-medium">
                    Site Description
                  </label>
                  <Input
                    id="site-description"
                    value={settings.site_description || ""}
                    onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                    placeholder="A brief description of your site"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => {
                  saveSetting("site_name", settings.site_name || "")
                  saveSetting("site_description", settings.site_description || "")
                }}
              >
                Save Site Information
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
