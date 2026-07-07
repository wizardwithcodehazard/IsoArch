'use client'

import { MTOTable } from './mto-table'
import { SummaryCards } from './summary-cards'
import { MetadataPanel } from './metadata-panel'
import * as XLSX from 'xlsx'
import { useState } from 'react'

interface MTOItem {
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
}

interface MTOData {
  drawing_meta: {
    drawing_no: string
    revision: string
    line_number: string
    nps: string
    material_class: string
    service: string
  }
  items: MTOItem[]
  summary: {
    total_pipe_length_m: number
    fittings: number
    flanges: number
    valves: number
    gaskets: number
    bolt_sets: number
    field_welds: number
  }
  processed_image_base64?: string
}

interface ResultsSectionProps {
  uploadedImage: string
  mtoData: MTOData | null
  loading: boolean
  error: string | null
}

export function ResultsSection({
  uploadedImage,
  mtoData,
  loading,
  error,
}: ResultsSectionProps) {
  const [filterCategory, setFilterCategory] = useState<string>('All')
  const handleExportCSV = () => {
    if (!mtoData) return

    const headers = [
      'Item No',
      'Category',
      'Description',
      'Size (NPS)',
      'Schedule/Rating',
      'Material Spec',
      'End Type',
      'Quantity',
      'Unit',
      'Length (m)',
      'Confidence',
      'Remarks',
    ]

    const rows = mtoData.items.map((item) => [
      item.item_no,
      item.category,
      item.description,
      item.size_nps,
      item.schedule_rating,
      item.material_spec,
      item.end_type,
      item.quantity,
      item.unit,
      item.length_m || '',
      item.confidence ? (item.confidence * 100).toFixed(0) + '%' : '',
      item.remarks || '',
    ])

    const csv = [
      headers.join(','),
      ...rows.map((row) =>
        row
          .map((cell) => {
            if (typeof cell === 'string' && cell.includes(',')) {
              return `"${cell}"`
            }
            return cell
          })
          .join(',')
      ),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${mtoData.drawing_meta.drawing_no || 'Unknown'}-MTO.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const handleExportExcel = () => {
    if (!mtoData) return

    const rows = mtoData.items.map((item) => ({
      'Item No': item.item_no,
      'Category': item.category,
      'Description': item.description,
      'Size (NPS)': item.size_nps,
      'Schedule/Rating': item.schedule_rating,
      'Material Spec': item.material_spec,
      'End Type': item.end_type,
      'Quantity': item.quantity,
      'Unit': item.unit,
      'Length (m)': item.length_m || '',
      'Confidence': item.confidence ? (item.confidence * 100).toFixed(0) + '%' : '',
      'Remarks': item.remarks || '',
    }))

    const worksheet = XLSX.utils.json_to_sheet(rows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'MTO Items')
    XLSX.writeFile(workbook, `${mtoData.drawing_meta.drawing_no || 'Unknown'}-MTO.xlsx`)
  }

  const uniqueCategories = mtoData ? ['All', ...Array.from(new Set(mtoData.items.map(item => item.category)))] : ['All']
  
  const filteredItems = mtoData?.items.filter(item => 
    filterCategory === 'All' ? true : item.category === filterCategory
  ) || []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header with Export Button */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <h1 className="md-typescale-headline-medium">Material Take-Off Results</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <md-filled-button onClick={handleExportCSV} disabled={!mtoData || loading}>
            <md-icon slot="icon">download</md-icon>
            Export CSV
          </md-filled-button>
          <md-filled-button onClick={handleExportExcel} disabled={!mtoData || loading} style={{ '--md-filled-button-container-color': '#1d6f42' } as React.CSSProperties}>
            <md-icon slot="icon">table_view</md-icon>
            Export Excel
          </md-filled-button>
        </div>
      </div>

      {loading && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '48px 24px',
            gap: '16px',
          }}
        >
          <md-circular-progress indeterminate></md-circular-progress>
          <p className="md-typescale-body-medium">Processing your drawing...</p>
        </div>
      )}

      {error && (
        <div
          style={{
            backgroundColor: 'var(--md-sys-color-error-container)',
            borderRadius: '8px',
            padding: '16px',
          }}
        >
          <p className="md-typescale-body-small" style={{ color: 'var(--md-sys-color-on-error-container)', margin: 0 }}>
            {error}
          </p>
        </div>
      )}

      {mtoData && !loading && (
        <>
          {/* Drawing Preview & Metadata */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '16px',
            }}
          >
            {/* Drawing Preview */}
            <div
              style={{
                backgroundColor: 'var(--md-sys-color-surface)',
                borderRadius: '12px',
                border: `1px solid var(--md-sys-color-outline-variant)`,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  padding: '16px',
                  borderBottom: `1px solid var(--md-sys-color-outline-variant)`,
                }}
              >
                <p className="md-typescale-title-medium" style={{ margin: 0 }}>
                  Uploaded Drawing
                </p>
              </div>
              <div
                style={{
                  flex: 1,
                  minHeight: '300px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px',
                  backgroundColor: 'var(--md-sys-color-surface-container-low)',
                  overflow: 'auto',
                  position: 'relative',
                }}
              >
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <img
                    src={mtoData.processed_image_base64 || uploadedImage}
                    alt="Processed isometric drawing"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      borderRadius: '8px',
                      display: 'block',
                    }}
                  />
                  {filteredItems.map(item => {
                    if (item.bounding_box && item.bounding_box.length === 4) {
                      const [ymin, xmin, ymax, xmax] = item.bounding_box;
                      return (
                        <div
                          key={`bbox-${item.item_no}`}
                          title={`Item ${item.item_no}: ${item.description}`}
                          style={{
                            position: 'absolute',
                            top: `${ymin * 100}%`,
                            left: `${xmin * 100}%`,
                            width: `${(xmax - xmin) * 100}%`,
                            height: `${(ymax - ymin) * 100}%`,
                            border: '2px solid var(--md-sys-color-primary)',
                            backgroundColor: 'rgba(0, 100, 255, 0.1)',
                            pointerEvents: 'none',
                          }}
                        >
                          <span style={{
                            position: 'absolute',
                            top: '-18px',
                            left: '0',
                            backgroundColor: 'var(--md-sys-color-primary)',
                            color: 'white',
                            fontSize: '10px',
                            padding: '2px 4px',
                            borderRadius: '2px',
                            whiteSpace: 'nowrap'
                          }}>
                            {item.item_no}
                          </span>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>

            {/* Metadata */}
            <MetadataPanel meta={mtoData.drawing_meta} />
          </div>

          {/* Summary Cards */}
          <SummaryCards summary={mtoData.summary} />

          {/* MTO Table */}
          <div
            style={{
              backgroundColor: 'var(--md-sys-color-surface)',
              borderRadius: '12px',
              border: `1px solid var(--md-sys-color-outline-variant)`,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '16px',
                borderBottom: `1px solid var(--md-sys-color-outline-variant)`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h2 className="md-typescale-title-large" style={{ margin: 0 }}>
                  Material Line Items
                </h2>
                <p className="md-typescale-body-small" style={{ color: 'var(--md-sys-color-on-surface-variant)', margin: '8px 0 0 0' }}>
                  {filteredItems.length} items extracted {filterCategory !== 'All' && `(filtered by ${filterCategory})`}
                </p>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="md-typescale-body-medium">Filter:</span>
                <select 
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  style={{
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid var(--md-sys-color-outline)',
                    backgroundColor: 'var(--md-sys-color-surface)',
                    color: 'var(--md-sys-color-on-surface)'
                  }}
                >
                  {uniqueCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <MTOTable items={filteredItems} />
          </div>
        </>
      )}
    </div>
  )
}
