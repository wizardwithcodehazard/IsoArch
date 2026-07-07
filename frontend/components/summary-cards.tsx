'use client'

interface SummaryCardProps {
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

interface StatCard {
  label: string
  value: string | number
  unit: string
  icon: string
  color: string
}

export function SummaryCards({ summary }: SummaryCardProps) {
  const stats: StatCard[] = [
    {
      label: 'Total Pipe Length',
      value: summary.total_pipe_length_m.toFixed(2),
      unit: 'm',
      icon: 'straighten',
      color: '#0066cc',
    },
    {
      label: 'Fittings',
      value: summary.fittings,
      unit: 'EA',
      icon: 'miscellaneous_services',
      color: '#6f42c1',
    },
    {
      label: 'Flanges',
      value: summary.flanges,
      unit: 'EA',
      icon: 'donut_large',
      color: '#ff6f00',
    },
    {
      label: 'Valves',
      value: summary.valves,
      unit: 'EA',
      icon: 'valve',
      color: '#c2185b',
    },
    {
      label: 'Gaskets',
      value: summary.gaskets,
      unit: 'EA',
      icon: 'circle',
      color: '#2e7d32',
    },
    {
      label: 'Bolt Sets',
      value: summary.bolt_sets,
      unit: 'SET',
      icon: 'settings',
      color: '#558b2f',
    },
  ]

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
      }}
    >
      {stats.map((stat, idx) => (
        <div
          key={idx}
          style={{
            backgroundColor: 'var(--md-sys-color-surface)',
            borderRadius: '12px',
            border: `1px solid var(--md-sys-color-outline-variant)`,
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <p
              className="md-typescale-label-medium"
              style={{
                margin: 0,
                color: 'var(--md-sys-color-on-surface-variant)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {stat.label}
            </p>
            <md-icon style={{ color: stat.color, fontSize: '20px' }}>
              {stat.icon}
            </md-icon>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span
              style={{
                fontSize: '28px',
                fontWeight: '700',
                color: 'var(--md-sys-color-primary)',
                letterSpacing: '-1px',
              }}
            >
              {stat.value}
            </span>
            <span
              style={{
                fontSize: '12px',
                color: 'var(--md-sys-color-on-surface-variant)',
                textTransform: 'uppercase',
                fontWeight: '600',
                letterSpacing: '0.5px',
              }}
            >
              {stat.unit}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
