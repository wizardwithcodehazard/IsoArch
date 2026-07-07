'use client'

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

interface MTOTableProps {
  items: MTOItem[]
}

const categoryColors: Record<string, string> = {
  PIPE: '#e3f2fd',
  FITTING: '#f3e5f5',
  FLANGE: '#fff3e0',
  VALVE: '#fce4ec',
  GASKET: '#e8f5e9',
  BOLT: '#f0f4c3',
  SUPPORT: '#ede7f6',
}

const categoryTextColors: Record<string, string> = {
  PIPE: '#0052cc',
  FITTING: '#6f42c1',
  FLANGE: '#ff6f00',
  VALVE: '#c2185b',
  GASKET: '#2e7d32',
  BOLT: '#558b2f',
  SUPPORT: '#4527a0',
}

export function MTOTable({ items }: MTOTableProps) {
  const [sortBy, setSortBy] = useState<keyof MTOItem>('item_no')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const sortedItems = [...items].sort((a, b) => {
    const aVal = a[sortBy]
    const bVal = b[sortBy]

    if (aVal === undefined || bVal === undefined) return 0

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    }

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
    }

    return 0
  })

  const handleSort = (column: keyof MTOItem) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('asc')
    }
  }

  const SortableHeader = ({
    label,
    column,
  }: {
    label: string
    column: keyof MTOItem
  }) => (
    <th
      onClick={() => handleSort(column)}
      style={{
        cursor: 'pointer',
        userSelect: 'none',
        padding: '12px',
        textAlign: 'left',
        backgroundColor: 'var(--md-sys-color-surface-container)',
        borderBottom: `1px solid var(--md-sys-color-outline-variant)`,
        fontSize: '12px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        color: 'var(--md-sys-color-on-surface)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {label}
        {sortBy === column && (
          <span
            style={{
              color: 'var(--md-sys-color-primary)',
              fontSize: '16px',
              lineHeight: '1',
            }}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </th>
  )

  return (
    <div style={{ overflowX: 'auto' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '14px',
        }}
      >
        <thead>
          <tr>
            <SortableHeader label="Item" column="item_no" />
            <SortableHeader label="Category" column="category" />
            <SortableHeader label="Description" column="description" />
            <SortableHeader label="Size" column="size_nps" />
            <SortableHeader label="Schedule" column="schedule_rating" />
            <SortableHeader label="Material" column="material_spec" />
            <SortableHeader label="End Type" column="end_type" />
            <SortableHeader label="Qty" column="quantity" />
            <SortableHeader label="Unit" column="unit" />
            {items.some((item) => item.length_m) && (
              <SortableHeader label="Length (m)" column="length_m" />
            )}
            {items.some((item) => item.confidence) && (
              <SortableHeader label="Confidence" column="confidence" />
            )}
            {items.some((item) => item.remarks) && (
              <SortableHeader label="Remarks" column="remarks" />
            )}
          </tr>
        </thead>
        <tbody>
          {sortedItems.map((item) => (
            <tr
              key={item.item_no}
              style={{
                borderBottom: `1px solid var(--md-sys-color-outline-variant)`,
                '&:hover': {
                  backgroundColor: 'var(--md-sys-color-surface-container-low)',
                },
              }}
            >
              <td
                style={{
                  padding: '12px',
                  color: 'var(--md-sys-color-on-surface)',
                  fontWeight: '500',
                }}
              >
                {item.item_no}
              </td>
              <td style={{ padding: '12px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: categoryColors[item.category] || '#f5f5f5',
                    color: categoryTextColors[item.category] || '#333',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {item.category}
                </span>
              </td>
              <td
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => { item.description = e.currentTarget.textContent || '' }}
                style={{
                  padding: '12px',
                  color: 'var(--md-sys-color-on-surface)',
                  maxWidth: '250px',
                  wordBreak: 'break-word',
                  fontSize: '13px',
                  outlineColor: 'var(--md-sys-color-primary)',
                }}
              >
                {item.description}
              </td>
              <td contentEditable suppressContentEditableWarning onBlur={(e) => { item.size_nps = e.currentTarget.textContent || '' }} style={{ padding: '12px', color: 'var(--md-sys-color-on-surface)', outlineColor: 'var(--md-sys-color-primary)' }}>
                {item.size_nps}
              </td>
              <td contentEditable suppressContentEditableWarning onBlur={(e) => { item.schedule_rating = e.currentTarget.textContent || '' }} style={{ padding: '12px', color: 'var(--md-sys-color-on-surface)', outlineColor: 'var(--md-sys-color-primary)' }}>
                {item.schedule_rating}
              </td>
              <td contentEditable suppressContentEditableWarning onBlur={(e) => { item.material_spec = e.currentTarget.textContent || '' }} style={{ padding: '12px', color: 'var(--md-sys-color-on-surface)', fontSize: '13px', outlineColor: 'var(--md-sys-color-primary)' }}>
                {item.material_spec}
              </td>
              <td contentEditable suppressContentEditableWarning onBlur={(e) => { item.end_type = e.currentTarget.textContent || '' }} style={{ padding: '12px', color: 'var(--md-sys-color-on-surface)', outlineColor: 'var(--md-sys-color-primary)' }}>
                {item.end_type}
              </td>
              <td
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => { item.quantity = Number(e.currentTarget.textContent) || 0 }}
                style={{
                  padding: '12px',
                  color: 'var(--md-sys-color-on-surface)',
                  fontWeight: '600',
                  textAlign: 'right',
                  outlineColor: 'var(--md-sys-color-primary)',
                }}
              >
                {item.quantity}
              </td>
              <td contentEditable suppressContentEditableWarning onBlur={(e) => { item.unit = e.currentTarget.textContent || '' }} style={{ padding: '12px', color: 'var(--md-sys-color-on-surface)', fontWeight: '600', outlineColor: 'var(--md-sys-color-primary)' }}>
                {item.unit}
              </td>
              {items.some((i) => i.length_m) && (
                <td
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => { item.length_m = Number(e.currentTarget.textContent) || 0 }}
                  style={{
                    padding: '12px',
                    color: 'var(--md-sys-color-on-surface)',
                    textAlign: 'right',
                    minWidth: '100px',
                    outlineColor: 'var(--md-sys-color-primary)',
                  }}
                >
                  {item.length_m ? item.length_m.toFixed(2) : '—'}
                </td>
              )}
              {items.some((i) => i.confidence) && (
                <td
                  style={{
                    padding: '12px',
                    color:
                      item.confidence && item.confidence > 0.85
                        ? '#2e7d32'
                        : item.confidence && item.confidence > 0.7
                          ? '#f57f17'
                          : '#c62828',
                    fontWeight: '600',
                    textAlign: 'center',
                    minWidth: '90px',
                  }}
                >
                  {item.confidence ? (item.confidence * 100).toFixed(0) + '%' : '—'}
                </td>
              )}
              {items.some((i) => i.remarks) && (
                <td style={{ padding: '12px', color: 'var(--md-sys-color-on-surface-variant)', fontSize: '13px' }}>
                  {item.remarks || '—'}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
