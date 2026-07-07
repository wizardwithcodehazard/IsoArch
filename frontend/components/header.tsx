'use client'

import { useEffect, useState } from 'react'

interface HeaderProps {
  onReset: () => void
}

export function Header({ onReset }: HeaderProps) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check current theme on mount
    const isDarkMode = document.documentElement.classList.contains('dark')
    setIsDark(isDarkMode)
  }, [])

  const toggleTheme = () => {
    const isDarkMode = document.documentElement.classList.contains('dark')
    if (isDarkMode) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setIsDark(false)
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setIsDark(true)
    }
  }

  return (
    <header
      style={{
        borderBottom: `1px solid var(--md-sys-color-outline-variant)`,
        backgroundColor: 'var(--md-sys-color-surface)',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div
          style={{
            fontSize: '24px',
            fontWeight: '700',
            letterSpacing: '-0.5px',
            color: 'var(--md-sys-color-primary)',
          }}
        >
          isoarch
        </div>
        <div
          style={{
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: 'var(--md-sys-color-on-surface-variant)',
            marginLeft: '8px',
          }}
        >
          Isometric MTO Generator
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <md-icon-button onClick={toggleTheme} aria-label="Toggle dark mode">
          <md-icon>{isDark ? 'light_mode' : 'dark_mode'}</md-icon>
        </md-icon-button>
        <md-outlined-button onClick={onReset}>
          <md-icon slot="icon">upload</md-icon>
          New Upload
        </md-outlined-button>
      </div>
    </header>
  )
}
