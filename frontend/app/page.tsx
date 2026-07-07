'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { UploadSection } from '@/components/upload-section'
import { ResultsSection } from '@/components/results-section'

interface MTOData {
  drawing_meta: {
    drawing_no: string
    revision: string
    line_number: string
    nps: string
    material_class: string
    service: string
  }
  items: Array<{
    item_no: number
    category: string
    description: string
    size_nps: string
    schedule_rating: string
    material_spec: string
    end_type: string
    quantity: number
    unit: string
    length_m?: number
    confidence?: number
    remarks?: string
  }>
  summary: {
    total_pipe_length_m: number
    fittings: number
    flanges: number
    valves: number
    gaskets: number
    bolt_sets: number
    field_welds: number
  }
}

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [mtoData, setMtoData] = useState<MTOData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Custom API Keys (BYOK)
  const [geminiKey1, setGeminiKey1] = useState('')
  const [geminiKey2, setGeminiKey2] = useState('')
  const [groqKey, setGroqKey] = useState('')

  const handleUpload = (file: File) => {
    setError(null)
    setLoading(true)

    // Create image preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Call actual backend API
    const formData = new FormData()
    formData.append('file', file)
    if (geminiKey1) formData.append('gemini_key_1', geminiKey1)
    if (geminiKey2) formData.append('gemini_key_2', geminiKey2)
    if (groqKey) formData.append('groq_key_custom', groqKey)

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    fetch(`${apiUrl}/api/extract`, {
      method: 'POST',
      body: formData,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then((data: MTOData) => {
        setMtoData(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Extraction error:', err)
        setError('Failed to extract MTO data. Please try again.')
        setLoading(false)
      })
  }

  const handleReset = () => {
    setUploadedImage(null)
    setMtoData(null)
    setError(null)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header onReset={handleReset} />

      <main
        style={{
          flex: 1,
          padding: '24px',
          maxWidth: '1400px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {!uploadedImage && !mtoData ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{
                padding: '24px',
                background: 'linear-gradient(145deg, var(--md-sys-color-surface-container) 0%, var(--md-sys-color-surface-container-high) 100%)',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                border: '1px solid var(--md-sys-color-outline-variant)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    width: '40px', height: '40px', borderRadius: '50%', 
                    background: 'var(--md-sys-color-primary-container)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--md-sys-color-on-primary-container)'
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="md-typescale-title-medium" style={{ margin: 0, fontWeight: 600 }}>Bring Your Own Keys (Optional)</h2>
                    <p className="md-typescale-body-small" style={{ margin: '4px 0 0 0', color: 'var(--md-sys-color-on-surface-variant)' }}>Provide your own API keys to bypass server rate limits.</p>
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  {[
                    { state: geminiKey1, setState: setGeminiKey1, placeholder: "Gemini API Key 1", color: "#4285f4" },
                    { state: geminiKey2, setState: setGeminiKey2, placeholder: "Gemini API Key 2 (Failover)", color: "#34a853" },
                    { state: groqKey, setState: setGroqKey, placeholder: "Groq API Key (Llama-4)", color: "#f56038" }
                  ].map((input, idx) => (
                    <div key={idx} style={{ position: 'relative' }}>
                      <input 
                        type="password" 
                        placeholder={input.placeholder} 
                        value={input.state}
                        onChange={e => input.setState(e.target.value)}
                        style={{ 
                          width: '100%',
                          padding: '16px 16px 16px 16px',
                          borderRadius: '12px', 
                          border: '2px solid transparent',
                          backgroundColor: 'var(--md-sys-color-surface-container-highest)',
                          color: 'var(--md-sys-color-on-surface)',
                          outline: 'none',
                          fontSize: '14px',
                          transition: 'all 0.2s ease',
                          boxSizing: 'border-box'
                        }}
                        onFocus={(e) => {
                          e.target.style.border = `2px solid ${input.color}`;
                          e.target.style.backgroundColor = 'var(--md-sys-color-surface)';
                        }}
                        onBlur={(e) => {
                          e.target.style.border = '2px solid transparent';
                          e.target.style.backgroundColor = 'var(--md-sys-color-surface-container-highest)';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            <UploadSection onUpload={handleUpload} loading={loading} error={error} />
          </div>
        ) : (
          <ResultsSection
            uploadedImage={uploadedImage || ''}
            mtoData={mtoData}
            loading={loading}
            error={error}
          />
        )}
      </main>
    </div>
  )
}
