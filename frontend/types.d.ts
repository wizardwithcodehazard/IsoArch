/** @jsxImportSource react */
import React from 'react'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'md-icon': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          slot?: string
        },
        HTMLElement
      >
      'md-icon-button': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          slot?: string
          onClick?: () => void
          disabled?: boolean
        },
        HTMLElement
      >
      'md-filled-button': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          slot?: string
          onClick?: () => void
          disabled?: boolean
        },
        HTMLElement
      >
      'md-outlined-button': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          slot?: string
          onClick?: () => void
          disabled?: boolean
        },
        HTMLElement
      >
      'md-tonal-button': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          slot?: string
          onClick?: () => void
          disabled?: boolean
        },
        HTMLElement
      >
      'md-text-button': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          slot?: string
          onClick?: () => void
          disabled?: boolean
        },
        HTMLElement
      >
      'md-circular-progress': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          indeterminate?: boolean
          value?: number
        },
        HTMLElement
      >
      'md-linear-progress': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          indeterminate?: boolean
          value?: number
        },
        HTMLElement
      >
      'md-dialog': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          open?: boolean
        },
        HTMLElement
      >
      'md-card': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
      'md-chips': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          'single-line'?: boolean
        },
        HTMLElement
      >
      'md-chip-set': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          'aria-label'?: string
        },
        HTMLElement
      >
      'md-assist-chip': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          label?: string
          href?: string
          target?: string
          'trailing-icon'?: boolean
        },
        HTMLElement
      >
      'md-input-chip': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          label?: string
          href?: string
          target?: string
          'trailing-icon'?: boolean
        },
        HTMLElement
      >
      'md-filter-chip': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          label?: string
          selected?: boolean
          removable?: boolean
        },
        HTMLElement
      >
      'md-suggestion-chip': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          label?: string
          href?: string
          target?: string
        },
        HTMLElement
      >
      'md-text-field': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          type?: string
          label?: string
          value?: string
          onchange?: (event: React.ChangeEvent<HTMLElement>) => void
          oninput?: (event: React.FormEvent<HTMLElement>) => void
          disabled?: boolean
          required?: boolean
          error?: boolean
          'error-text'?: string
          'supporting-text'?: string
          'prefix-text'?: string
          'suffix-text'?: string
        },
        HTMLElement
      >
      'md-checkbox': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          checked?: boolean
          onchange?: (event: React.ChangeEvent<HTMLElement>) => void
          disabled?: boolean
          required?: boolean
          value?: string
        },
        HTMLElement
      >
      'md-radio': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          checked?: boolean
          onchange?: (event: React.ChangeEvent<HTMLElement>) => void
          disabled?: boolean
          value?: string
        },
        HTMLElement
      >
      'md-switch': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          selected?: boolean
          onchange?: (event: React.ChangeEvent<HTMLElement>) => void
          disabled?: boolean
        },
        HTMLElement
      >
      'md-select': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          label?: string
          value?: string
          onchange?: (event: React.ChangeEvent<HTMLElement>) => void
          disabled?: boolean
          required?: boolean
        },
        HTMLElement
      >
      'md-select-option': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          value?: string
          selected?: boolean
          disabled?: boolean
          headline?: string
        },
        HTMLElement
      >
      'md-menu': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          open?: boolean
          'quick-open'?: boolean
          positioning?: string
        },
        HTMLElement
      >
      'md-menu-item': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          headline?: string
          type?: string
          disabled?: boolean
        },
        HTMLElement
      >
      'md-navigation-bar': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          'active-tab-index'?: number
        },
        HTMLElement
      >
      'md-navigation-tab': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          label?: string
          href?: string
          'active-icon'?: string
          'inactiveIcon'?: string
        },
        HTMLElement
      >
      'md-navigation-drawer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          open?: boolean
          type?: string
        },
        HTMLElement
      >
      'md-navigation-drawer-header': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >
      'md-tab-bar': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          'active-tab-index'?: number
          scrollable?: boolean
        },
        HTMLElement
      >
      'md-primary-tab': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          href?: string
          'inlineIcon'?: boolean
        },
        HTMLElement
      >
      'md-secondary-tab': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          href?: string
          'inlineIcon'?: boolean
        },
        HTMLElement
      >
      'md-list': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
      'md-list-item': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          type?: string
          href?: string
          target?: string
          'disabled'?: boolean
        },
        HTMLElement
      >
      'md-divider': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
      'md-tabs': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          'active-tab-index'?: number
        },
        HTMLElement
      >
      'md-elevated-card': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
      'md-filled-card': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
      'md-outlined-card': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
      'md-fab': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          variant?: string
          size?: string
          lowered?: boolean
          onClick?: () => void
        },
        HTMLElement
      >
      'md-extended-fab': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          label?: string
          onClick?: () => void
        },
        HTMLElement
      >
      'md-segmented-button': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          'multi-select'?: boolean
        },
        HTMLElement
      >
      'md-segmented-button-set': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          'show-checkmarks'?: boolean
        },
        HTMLElement
      >
      'md-badge': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          value?: string
        },
        HTMLElement
      >
    }
  }
}

export {}
