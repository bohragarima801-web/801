'use client'

import React, { useState, useEffect } from 'react'
import {
  CalendarDays,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Search,
  RefreshCw,
  FileSpreadsheet,
  Info,
  Sparkles,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

export default function AdminPanchangPage() {
  const [sheetUrl, setSheetUrl] = useState('/drik_panchang_5_years_2026_2031.csv')

  const [isImporting, setIsImporting] = useState(false)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [dateRange, setDateRange] = useState({ min: '', max: '' })

  const fetchRecords = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/panchang?page=${page}&limit=20&search=${encodeURIComponent(search)}`)
      const data = await res.json()
      if (data.success) {
        setItems(data.items || [])
        setTotalPages(data.pages || 1)
        setTotalRecords(data.total || 0)
        if (data.stats) {
          setDateRange({
            min: data.stats.minDate ? new Date(data.stats.minDate).toISOString().split('T')[0] : '',
            max: data.stats.maxDate ? new Date(data.stats.maxDate).toISOString().split('T')[0] : '',
          })
        }
      }
    } catch (err) {
      toast.error('Failed to load Panchang records')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecords()
  }, [page, search])

  // Handle Google Sheet Link Import
  const handleImportLink = async () => {
    if (!sheetUrl) {
      toast.error('Please enter a valid Google Sheet URL')
      return
    }
    setIsImporting(true)
    const toastId = toast.loading('Connecting to Google Sheet & importing Panchang data...')

    try {
      const res = await fetch('/api/admin/panchang/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvUrl: sheetUrl }),
      })
      const data = await res.json()

      if (data.success) {
        toast.success(data.message || `Imported ${data.successCount} rows!`, { id: toastId })
        fetchRecords()
      } else {
        toast.error(data.error || 'Import failed. Ensure Google Sheet is shared as "Anyone with link can view".', {
          id: toastId,
          duration: 6000,
        })
      }
    } catch (err: any) {
      toast.error('Import error: ' + err.message, { id: toastId })
    } finally {
      setIsImporting(false)
    }
  }

  // Handle CSV File Drag & Drop / File Selection
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    const toastId = toast.loading(`Parsing "${file.name}" & saving to database...`)

    try {
      const text = await file.text()
      const res = await fetch('/api/admin/panchang/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawCsvText: text }),
      })
      const data = await res.json()

      if (data.success) {
        toast.success(data.message || `Successfully imported ${data.successCount} rows!`, { id: toastId })
        fetchRecords()
      } else {
        toast.error(data.error || 'Failed to process file', { id: toastId })
      }
    } catch (err: any) {
      toast.error('File import error: ' + err.message, { id: toastId })
    } finally {
      setIsImporting(false)
      e.target.value = ''
    }
  }

  // Handle Delete Item
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this Panchang record?')) return
    try {
      const res = await fetch(`/api/admin/panchang?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        toast.success('Record deleted')
        fetchRecords()
      } else {
        toast.error(data.error)
      }
    } catch (err) {
      toast.error('Failed to delete')
    }
  }

  // Handle Clear All
  const handleClearAll = async () => {
    if (!confirm('WARNING: Are you sure you want to CLEAR ALL Panchang data from database?')) return
    try {
      const res = await fetch('/api/admin/panchang?clearAll=true', { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        toast.success('All Panchang data cleared')
        fetchRecords()
      } else {
        toast.error(data.error)
      }
    } catch (err) {
      toast.error('Failed to clear data')
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            5-Year Sanatan Panchang Database
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">📅 Panchang Manager</h1>
          <p className="text-sm text-slate-500">
            Upload & import your 5-year Panchang Google Sheet or CSV file into the website database.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/panchang"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow"
          >
            <ExternalLink className="w-4 h-4" /> Live Website Panchang View 🌐
          </a>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-amber-700 uppercase tracking-wider">Total Panchang Days</p>
                <p className="text-3xl font-extrabold text-amber-950 mt-1">{totalRecords.toLocaleString()}</p>
              </div>
              <CalendarDays className="w-8 h-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-blue-700 uppercase tracking-wider">Date Range Start</p>
                <p className="text-lg font-bold text-blue-950 mt-1">{dateRange.min || 'N/A'}</p>
              </div>
              <CheckCircle2 className="w-7 h-7 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-emerald-700 uppercase tracking-wider">Date Range End</p>
                <p className="text-lg font-bold text-emerald-950 mt-1">{dateRange.max || 'N/A'}</p>
              </div>
              <Info className="w-7 h-7 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Import Methods Card */}
      <Card className="border-amber-200 shadow-md">
        <CardHeader className="bg-amber-50/50 border-b border-amber-100">
          <CardTitle className="text-lg text-amber-950 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-amber-600" />
            Google Sheet & File Upload
          </CardTitle>
          <CardDescription>
            Import data directly via your Google Sheet link or upload a <code>.csv</code> file.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Method 1: Google Sheet Link */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-amber-600" /> Google Sheet Published / Viewer Link
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/1bbi1hRZvv-ZeQYqzqSmSabMSr4_Gi8pM8BODqe7zywM/edit?gid=1857856167"
                className="flex-1 bg-white border-slate-300"
              />
              <Button
                onClick={handleImportLink}
                disabled={isImporting}
                className="bg-amber-600 hover:bg-amber-700 text-white font-semibold min-w-[170px]"
              >
                {isImporting ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                Import From Link
              </Button>
            </div>
            <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
              <Info className="w-4 h-4 shrink-0 text-amber-600" />
              <span>
                <strong>Tip:</strong> Ensure your Google Sheet permission is set to <strong>"Anyone with the link can view"</strong> (File ➔ Share) or published as CSV.
              </span>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-xs font-semibold uppercase text-slate-400">OR</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Method 2: CSV File Upload */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <Upload className="w-4 h-4 text-amber-600" /> Upload CSV / Excel File Directly
            </label>
            <div className="border-2 border-dashed border-amber-300 hover:border-amber-500 rounded-xl p-6 text-center bg-amber-50/30 transition cursor-pointer relative">
              <input
                type="file"
                accept=".csv, .txt"
                onChange={handleFileUpload}
                disabled={isImporting}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <FileSpreadsheet className="w-10 h-10 text-amber-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">Click to select or drag & drop your Panchang CSV file here</p>
              <p className="text-xs text-slate-500 mt-1">Supports CSV file formats with columns: Date, Day, Tithi, Nakshatra, Sunrise, Sunset, Rahu Kaal, etc.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Panchang Records Table */}
      <Card className="shadow-md">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b">
          <div>
            <CardTitle className="text-lg">Uploaded Panchang Records ({totalRecords})</CardTitle>
            <CardDescription>View, search, or manage stored 5-year Panchang entries</CardDescription>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search date, tithi, nakshatra..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-60 text-xs"
              />
            </div>
            {totalRecords > 0 && (
              <Button onClick={handleClearAll} variant="outline" className="text-rose-600 border-rose-200 hover:bg-rose-50 text-xs">
                <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear All Data
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-amber-600" />
              <span>Loading Panchang database...</span>
            </div>
          ) : items.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-2">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
              <p className="font-semibold text-slate-700">No Panchang Records Found</p>
              <p className="text-xs text-slate-500">Paste your Google Sheet URL above or upload a CSV file to populate the database.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Day (वार)</th>
                    <th className="p-3">Paksha & Month</th>
                    <th className="p-3">Tithi (तिथि)</th>
                    <th className="p-3">Nakshatra (नक्षत्र)</th>
                    <th className="p-3">Sunrise / Sunset</th>
                    <th className="p-3">Rahu Kaal</th>
                    <th className="p-3">Festival / Vrat</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-800">
                  {items.map((row) => (
                    <tr key={row.id} className="hover:bg-amber-50/40 transition">
                      <td className="p-3 font-semibold text-amber-950">
                        {new Date(row.date).toISOString().split('T')[0]}
                      </td>
                      <td className="p-3">
                        <div>{row.dayHi || row.day}</div>
                        <div className="text-[10px] text-slate-400">{row.day}</div>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                          {row.pakshaHi || row.paksha} - {row.hinduMonthHi || row.hinduMonth}
                        </Badge>
                      </td>
                      <td className="p-3 font-medium">{row.tithiHi || row.tithi}</td>
                      <td className="p-3">{row.nakshatraHi || row.nakshatra}</td>
                      <td className="p-3 text-slate-600">
                        🌅 {row.sunrise || '--'} | 🌇 {row.sunset || '--'}
                      </td>
                      <td className="p-3 text-rose-700 font-mono text-[11px]">{row.rahuKaal || '--'}</td>
                      <td className="p-3">
                        {row.specialFestival ? (
                          <span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-900 rounded text-[11px] font-medium">
                            🎉 {row.specialFestivalHi || row.specialFestival}
                          </span>
                        ) : (
                          <span className="text-slate-400">--</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <Button
                          onClick={() => handleDelete(row.id)}
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Page {page} of {totalPages} ({totalRecords} records)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
