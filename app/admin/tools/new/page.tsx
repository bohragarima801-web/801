'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PageHeader } from '@/components/admin/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Loader2, Play, Code2, Eye, Sparkles, BookOpen, Layers } from 'lucide-react'
import { slugify } from '@/lib/slugify'
import { ToolMapper } from '@/components/tools/ToolMapper'

const STARTER_TEMPLATES: Record<string, { name: string; html: string; css: string; js: string }> = {
  calculator: {
    name: 'Vedic Calculator Template (वैदिक कैलकुलेटर)',
    html: `<div class="card max-w-lg mx-auto p-6 bg-white rounded-2xl shadow-lg border border-orange-200">
  <div class="text-center mb-6">
    <span class="inline-block p-3 bg-orange-100 text-orange-600 rounded-2xl mb-2 text-2xl">🕉️</span>
    <h2 class="text-2xl font-bold text-slate-800">शुभ गणना कैलकुलेटर</h2>
    <p class="text-xs text-slate-500">अपना विवरण दर्ज करें और तुरंत परिणाम देखें</p>
  </div>
  
  <div class="space-y-4">
    <div>
      <label class="block text-xs font-bold text-slate-700 mb-1">आपका नाम (Full Name)</label>
      <input type="text" id="userName" placeholder="e.g. राहुल शर्मा" class="w-full p-3 border rounded-xl" />
    </div>

    <div>
      <label class="block text-xs font-bold text-slate-700 mb-1">जन्म तिथि (Date of Birth)</label>
      <input type="date" id="userDob" class="w-full p-3 border rounded-xl" />
    </div>

    <button id="calcBtn" class="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl shadow-md transition-all">
      गणना करें (Calculate) ➔
    </button>
  </div>

  <div id="resultBox" class="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-xl hidden">
    <h4 class="font-bold text-orange-800 text-sm mb-1">✦ वैदिक परिणाम</h4>
    <p id="resultText" class="text-xs text-slate-700"></p>
  </div>
</div>`,
    css: `#userName:focus, #userDob:focus { border-color: #ea580c; outline: none; }`,
    js: `document.getElementById('calcBtn').addEventListener('click', function() {
  const name = document.getElementById('userName').value.trim();
  const dob = document.getElementById('userDob').value;
  if (!name) { alert('कृपया अपना नाम दर्ज करें'); return; }
  
  const box = document.getElementById('resultBox');
  const txt = document.getElementById('resultText');
  
  const luckyNumbers = [1, 3, 5, 7, 9];
  const luckyNum = luckyNumbers[name.length % luckyNumbers.length];
  
  txt.innerHTML = 'श्री <strong>' + name + '</strong> जी, आपकी नामांक ऊर्जा <strong>' + luckyNum + '</strong> है। आपके लिए आज का दिन अत्यंत शुभ और फलदायी है।';
  box.classList.remove('hidden');
});`
  },
  prashnavali: {
    name: 'Prashnavali / Oracle Grid Template (प्रश्नावली)',
    html: `<div class="container max-w-xl mx-auto p-6 bg-slate-900 text-white rounded-3xl shadow-2xl border border-amber-500/30 text-center">
  <h2 class="text-2xl font-bold text-amber-400 mb-1">✦ श्री सिद्ध प्रश्नावली ✦</h2>
  <p class="text-xs text-amber-200/80 mb-6">ईश्वर का ध्यान कर किसी एक संख्या पर क्लिक करें</p>

  <div class="grid grid-cols-4 gap-3 mb-6" id="beadGrid">
    <div class="bead p-4 bg-gradient-to-br from-amber-600 to-orange-700 rounded-2xl font-black text-xl cursor-pointer hover:scale-105 transition-all shadow-md">01</div>
    <div class="bead p-4 bg-gradient-to-br from-amber-600 to-orange-700 rounded-2xl font-black text-xl cursor-pointer hover:scale-105 transition-all shadow-md">02</div>
    <div class="bead p-4 bg-gradient-to-br from-amber-600 to-orange-700 rounded-2xl font-black text-xl cursor-pointer hover:scale-105 transition-all shadow-md">03</div>
    <div class="bead p-4 bg-gradient-to-br from-amber-600 to-orange-700 rounded-2xl font-black text-xl cursor-pointer hover:scale-105 transition-all shadow-md">04</div>
  </div>

  <div id="oracleResult" class="p-4 bg-amber-950/80 border border-amber-500/50 rounded-2xl text-left hidden">
    <h4 id="oracleHeading" class="font-bold text-amber-400 text-sm mb-1"></h4>
    <p id="oracleMessage" class="text-xs text-amber-100 leading-relaxed"></p>
  </div>
</div>`,
    css: `.bead:hover { background: #f59e0b; color: #1e1b4b; }`,
    js: `const answers = {
  "01": "आपका कार्य निश्चित रूप से सफल होगा। धैर्य रखें और शुभ कार्य आरंभ करें।",
  "02": "कार्य में थोड़ा विलंब हो सकता है, परंतु परिणाम आपके पक्ष में रहेगा।",
  "03": "ईष्ट देव की आराधना करें, रुका हुआ धन व मार्ग शीघ्र प्रशस्त होगा।",
  "04": "शुभ समय प्रारंभ हो चुका है, बड़े निर्णय लेने के लिए यह अनुकूल समय है।"
};

document.querySelectorAll('.bead').forEach(function(el) {
  el.addEventListener('click', function() {
    const num = el.innerText.trim();
    const box = document.getElementById('oracleResult');
    document.getElementById('oracleHeading').innerText = 'कोष्ठक ' + num + ' का ईश्वरीय संकेत:';
    document.getElementById('oracleMessage').innerText = answers[num] || 'आपकी मनोकामना पूर्ण होगी।';
    box.classList.remove('hidden');
  });
});`
  }
}

export default function NewToolPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('id')

  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor')

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [isFree, setIsFree] = useState(true)
  const [price, setPrice] = useState('0')
  const [trialDays, setTrialDays] = useState('0')
  const [htmlCode, setHtmlCode] = useState('')
  const [cssCode, setCssCode] = useState('')
  const [jsCode, setJsCode] = useState('')
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (editId) {
      setLoadingData(true)
      fetch(`/api/admin/tools?id=${editId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.ok && data.data) {
            const tool = data.data
            setName(tool.name || '')
            setSlug(tool.slug || '')
            setDescription(tool.description || '')
            setIsFree(tool.isFree !== undefined ? tool.isFree : true)
            setPrice(tool.price?.toString() || '0')
            setTrialDays(tool.trialDays?.toString() || '0')
            setHtmlCode(tool.htmlCode || '')
            setCssCode(tool.cssCode || '')
            setJsCode(tool.jsCode || '')
            setIsActive(tool.isActive !== undefined ? tool.isActive : true)
          } else {
            toast.error('Tool not found')
          }
        })
        .catch(() => toast.error('Failed to load tool'))
        .finally(() => setLoadingData(false))
    }
  }, [editId])

  const handleNameChange = (val: string) => {
    setName(val)
    if (!editId) {
      setSlug(slugify(val))
    }
  }

  const applyTemplate = (key: string) => {
    const tpl = STARTER_TEMPLATES[key]
    if (tpl) {
      setHtmlCode(tpl.html)
      setCssCode(tpl.css)
      setJsCode(tpl.js)
      toast.success(`${tpl.name} कोड टेम्प्लेट लागू किया गया!`)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Tool Name is required')
      return
    }

    const finalSlug = slug && slug.trim() ? slugify(slug) : slugify(name)

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/tools${editId ? `?id=${editId}` : ''}`, {
        method: editId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          slug: finalSlug,
          description: description.trim(),
          isFree,
          price: parseFloat(price) || 0,
          trialDays: parseInt(trialDays) || 0,
          htmlCode,
          cssCode,
          jsCode,
          isActive
        })
      })

      const data = await res.json()
      if (data.ok) {
        toast.success(editId ? 'Tool updated successfully' : 'Tool created successfully')
        router.push('/admin/tools')
      } else {
        toast.error(data.error || 'Failed to save tool')
      }
    } catch (err) {
      toast.error('Network error')
    } finally {
      setLoading(false)
    }
  }

  const mockToolForPreview = {
    id: editId || 'preview-tool',
    name: name || 'Preview Tool',
    slug: slug || 'preview-slug',
    description: description || 'Live tool preview mode',
    htmlCode,
    cssCode,
    jsCode,
    isFree: true
  }

  if (loadingData) {
    return (
      <div className="p-20 text-center flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title={editId ? 'Edit Vedic Tool' : 'Create New Vedic Tool'}
          description="Build, code & preview custom interactive HTML/JS spiritual calculators or Vedic tools."
          breadcrumbs={[{ label: 'Tools', href: '/admin/tools' }, { label: editId ? 'Edit' : 'New' }]}
        />

        {/* Editor vs Live Preview Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'editor' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="h-3.5 w-3.5" /> Code Editor
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'preview' ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Play className="h-3.5 w-3.5" /> Live Interactive Preview
          </button>
        </div>
      </div>

      {activeTab === 'preview' ? (
        /* ── Live Interactive Tool Preview Container */
        <div className="space-y-4">
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-orange-600" />
              <div>
                <h4 className="font-bold text-sm text-orange-950">Live Tool Preview Mode</h4>
                <p className="text-xs text-orange-800">
                  यह लाइव प्रीव्यू है जैसा कि उपयोगकर्ता फ्रंटेंड में देखेगा। आप इसे सीधे टेस्ट कर सकते हैं।
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('editor')}
              className="bg-white border-orange-300 text-orange-700"
            >
              Back to Code Editor ➔
            </Button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <ToolMapper tool={mockToolForPreview} isPremiumUnlocked={true} />
          </div>
        </div>
      ) : (
        /* ── Code Editor & Settings Form */
        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Tool Identity Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tool Identity & URL</CardTitle>
                <CardDescription>टूल का नाम व यूआरएल स्लग सेट करें (हिंदी या अंग्रेजी)।</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-700">टूल का नाम (Tool Name) *</Label>
                    <Input
                      placeholder="e.g. श्री गणेश सिद्ध प्रश्नावली या Kundli Milan"
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-700">URL Slug (Auto Generated) *</Label>
                    <Input
                      placeholder="shree-ganesh-siddha-prashnavali"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      required
                    />
                    <p className="text-[11px] text-slate-500">
                      Live URL: <code className="text-orange-600">/tools/{slug || 'your-slug'}</code>
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-700">विवरण (Description)</Label>
                  <Textarea
                    rows={2}
                    placeholder="इस टूल का संक्षिप्त विवरण जो कार्ड व सर्च में दिखाई देगा..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Code Injector Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Code2 className="h-5 w-5 text-orange-600" />
                    Tool Code (HTML / CSS / JS)
                  </CardTitle>
                  <CardDescription>
                    आप पूरा Standalone HTML डॉक्यूमेंट या अलग-अलग HTML, CSS, JS डाल सकते हैं।
                  </CardDescription>
                </div>

                {/* Quick Templates Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 hidden sm:inline">Templates:</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => applyTemplate('calculator')}
                    className="text-xs h-8"
                  >
                    Calculator
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => applyTemplate('prashnavali')}
                    className="text-xs h-8"
                  >
                    Prashnavali
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs font-bold text-slate-700">HTML Code / Full Document</Label>
                    <span className="text-[10px] text-slate-400">Can include &lt;!DOCTYPE html&gt; or snippet</span>
                  </div>
                  <Textarea
                    rows={8}
                    className="font-mono text-xs bg-slate-950 text-green-400 leading-relaxed"
                    value={htmlCode}
                    onChange={(e) => setHtmlCode(e.target.value)}
                    placeholder="<div class='tool-card'>...</div>"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-700">Custom CSS (Optional)</Label>
                  <Textarea
                    rows={4}
                    className="font-mono text-xs bg-slate-950 text-sky-400 leading-relaxed"
                    value={cssCode}
                    onChange={(e) => setCssCode(e.target.value)}
                    placeholder=".tool-card { border: 1px solid #ea580c; }"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs font-bold text-slate-700">JavaScript Logic (Optional)</Label>
                    <span className="text-[10px] text-slate-400">Auto polyfilled for onload & DOM events</span>
                  </div>
                  <Textarea
                    rows={7}
                    className="font-mono text-xs bg-slate-950 text-amber-300 leading-relaxed"
                    value={jsCode}
                    onChange={(e) => setJsCode(e.target.value)}
                    placeholder="document.getElementById('btn').addEventListener('click', () => { ... });"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar: Publishing & Pricing */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Publishing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border">
                  <div>
                    <Label className="font-bold text-sm">Active (Public)</Label>
                    <p className="text-[11px] text-slate-500">टूल फ्रंटेंड में सक्रिय दिखाई देगा</p>
                  </div>
                  <Switch checked={isActive} onCheckedChange={setIsActive} />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold h-11 rounded-xl shadow-md"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {editId ? 'Update Tool' : 'Save & Publish Tool'}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab('preview')}
                  className="w-full rounded-xl border-orange-200 text-orange-700 hover:bg-orange-50"
                >
                  <Eye className="mr-2 h-4 w-4" /> Preview Live
                </Button>
              </CardContent>
            </Card>

            <Card className="border-amber-200">
              <CardHeader className="bg-amber-50/70 rounded-t-xl pb-3">
                <CardTitle className="text-amber-900 text-base flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                  Access & Monetization
                </CardTitle>
                <CardDescription className="text-amber-800/80 text-xs">
                  Configure free vs paid paywall.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="flex items-center justify-between p-3 border rounded-xl">
                  <div>
                    <Label className="font-bold text-sm">100% Free Tool</Label>
                    <p className="text-[11px] text-slate-500">सभी यूजर्स के लिए पूरी तरह मुफ्त</p>
                  </div>
                  <Switch checked={isFree} onCheckedChange={setIsFree} />
                </div>

                {!isFree && (
                  <div className="space-y-3 p-3 bg-amber-50/40 rounded-xl border border-amber-200">
                    <div>
                      <Label className="text-xs font-bold text-slate-700">Unlock Price (₹)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-bold text-slate-700">Free Trial Days (0 = No Trial)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={trialDays}
                        onChange={(e) => setTrialDays(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </form>
      )}
    </div>
  )
}
