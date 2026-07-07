'use client'

import { useRef, useState } from 'react'

interface UploadSectionProps {
  onUpload: (file: File) => void
  loading: boolean
  error: string | null
}

export function UploadSection({ onUpload, loading, error }: UploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleFile = (file: File) => {
    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'application/pdf']
    if (!validTypes.includes(file.type)) {
      alert('Please upload a PNG, JPG, or PDF file')
      return
    }

    // Validate file size (20MB)
    if (file.size > 20 * 1024 * 1024) {
      alert('File size must be less than 20MB')
      return
    }

    onUpload(file)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        height: '100%',
        justifyContent: 'center',
      }}
    >
      {/* Hero Section */}
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <h1
          className="md-typescale-headline-large"
          style={{
            color: 'var(--md-sys-color-on-background)',
            marginBottom: '12px',
          }}
        >
          Extract Materials from Isometric Drawings
        </h1>
        <p
          className="md-typescale-body-large"
          style={{
            color: 'var(--md-sys-color-on-surface-variant)',
            marginBottom: '24px',
          }}
        >
          Upload a piping isometric drawing and our AI vision pipeline will automatically generate a comprehensive Material Take-Off (MTO) with all components, quantities, and specifications.
        </p>
      </div>

      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragActive ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline)'}`,
          borderRadius: '12px',
          padding: '48px 24px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          backgroundColor: dragActive
            ? 'var(--md-sys-color-primary-container)'
            : 'var(--md-sys-color-surface-container-low)',
          maxWidth: '600px',
          margin: '0 auto',
          width: '100%',
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.pdf"
          onChange={handleChange}
          style={{ display: 'none' }}
          disabled={loading}
        />

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <md-circular-progress indeterminate></md-circular-progress>
            <p className="md-typescale-body-medium" style={{ color: 'var(--md-sys-color-on-surface)' }}>
              Processing drawing with AI vision...
            </p>
          </div>
        ) : (
          <>
            <md-icon style={{ fontSize: '48px', color: 'var(--md-sys-color-primary)', marginBottom: '12px' }}>
              cloud_upload
            </md-icon>
            <p className="md-typescale-headline-small" style={{ color: 'var(--md-sys-color-on-background)', marginBottom: '8px' }}>
              Drag and drop your isometric
            </p>
            <p className="md-typescale-body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginBottom: '16px' }}>
              or click to browse
            </p>
            <p className="md-typescale-body-small" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
              Supported formats: PNG, JPG, PDF (Max 20MB)
            </p>
          </>
        )}
      </div>

      {error && (
        <div
          style={{
            backgroundColor: 'var(--md-sys-color-error-container)',
            borderRadius: '8px',
            padding: '16px',
            maxWidth: '600px',
            margin: '0 auto',
            width: '100%',
          }}
        >
          <p className="md-typescale-body-small" style={{ color: 'var(--md-sys-color-on-error-container)', margin: 0 }}>
            {error}
          </p>
        </div>
      )}

      {/* Info Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px',
          maxWidth: '800px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {[
          {
            icon: 'description',
            title: 'Supports Multiple Formats',
            description: 'PNG, JPG, and PDF isometric drawings from any design tool',
          },
          {
            icon: 'psychology',
            title: 'AI-Powered Extraction',
            description: 'Vision LLM analyzes geometry, components, and specifications',
          },
          {
            icon: 'table_chart',
            title: 'Structured Output',
            description: 'Professional MTO with full ASME/ASTM specifications',
          },
        ].map((card, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: 'var(--md-sys-color-surface)',
              borderRadius: '12px',
              padding: '16px',
              border: `1px solid var(--md-sys-color-outline-variant)`,
            }}
          >
            <md-icon style={{ color: 'var(--md-sys-color-primary)', marginBottom: '8px' }}>
              {card.icon}
            </md-icon>
            <h3 className="md-typescale-title-small" style={{ margin: '8px 0' }}>
              {card.title}
            </h3>
            <p className="md-typescale-body-small" style={{ color: 'var(--md-sys-color-on-surface-variant)', margin: 0 }}>
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
