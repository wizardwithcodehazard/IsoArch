'use client'

interface MetadataPanelProps {
  meta: {
    drawing_no: string
    revision: string
    line_number: string
    nps: string
    material_class: string
    service: string
  }
}

export function MetadataPanel({ meta }: MetadataPanelProps) {
  const fields = [
    { label: 'Drawing Number', value: meta.drawing_no, icon: 'assignment' },
    { label: 'Revision', value: meta.revision, icon: 'history' },
    { label: 'Line Number', value: meta.line_number, icon: 'label' },
    { label: 'Nominal Pipe Size', value: meta.nps, icon: 'straighten' },
    { label: 'Material Class', value: meta.material_class, icon: 'layers' },
    { label: 'Service Type', value: meta.service, icon: 'category' },
  ]

  return (
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
          Drawing Metadata
        </p>
        <p
          className="md-typescale-body-small"
          style={{
            color: 'var(--md-sys-color-on-surface-variant)',
            margin: '4px 0 0 0',
          }}
        >
          Extracted from title block
        </p>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {fields.map((field, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <md-icon
              style={{
                color: 'var(--md-sys-color-primary)',
                marginTop: '2px',
                fontSize: '20px',
              }}
            >
              {field.icon}
            </md-icon>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                className="md-typescale-label-small"
                style={{
                  margin: 0,
                  color: 'var(--md-sys-color-on-surface-variant)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {field.label}
              </p>
              <p
                className="md-typescale-body-medium"
                style={{
                  margin: '4px 0 0 0',
                  color: 'var(--md-sys-color-on-surface)',
                  fontFamily: 'var(--font-roboto), monospace',
                  fontWeight: '500',
                  wordBreak: 'break-all',
                }}
              >
                {field.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
