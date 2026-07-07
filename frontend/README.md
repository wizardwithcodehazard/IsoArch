# isoarch – Isometric to MTO Generator

A modern, responsive web application for extracting Material Take-Off (MTO) data from piping isometric drawings using AI vision technology. Built with Next.js 16 and Material Design 3.

**Live Demo**: Visit `/demo` to see a complete sample MTO extraction result.

## 🎯 Features

- **Drag-and-Drop Upload**: Intuitive file upload with support for PNG, JPG, and PDF
- **AI-Powered Extraction**: Vision LLM processes isometric drawings and extracts structured MTO data
- **Live Drawing Preview**: Side-by-side view of uploaded drawing and extracted metadata
- **Professional MTO Table**: 
  - Color-coded component categories (Pipe, Fitting, Flange, Valve, Gasket, Bolt, Support)
  - Sortable columns by any field
  - Confidence scores for each extracted item
  - Full ASME/ASTM material specifications
  
- **Summary Dashboard**: 
  - Total pipe length, fitting count, flange count, valve count
  - Gasket and bolt set summaries
  - Field weld tracking
  
- **Data Export**: Download results as CSV for Excel/enterprise systems
- **Dark Mode**: Full light/dark theme support with persistent storage
- **Responsive Design**: Mobile-optimized interface that works on all devices
- **Material Design 3**: Professional Material Web component system with semantic tokens

## 🏗️ Architecture

### Frontend Stack
- **Framework**: Next.js 16 (App Router)
- **React**: 19.0
- **UI System**: Material Design 3 (@material/web v2.4.1)
- **Styling**: Material Design tokens with CSS custom properties
- **Typography**: Roboto font via Next.js font optimization

### Component Structure
```
app/
├── page.tsx                 # Main application
├── demo/page.tsx            # Demo page with sample MTO
└── layout.tsx               # Root layout with theme setup
components/
├── header.tsx               # Navigation & theme toggle
├── upload-section.tsx       # Drag-drop upload UI
├── results-section.tsx      # Results display container
├── mto-table.tsx            # Sortable MTO table
├── summary-cards.tsx        # Summary statistics
└── metadata-panel.tsx       # Drawing metadata display
```

## 🎨 Design System

### Color Scheme (Material Design 3)
**Light Mode**:
- Primary: Steel Blue (#0066cc) – Actions and highlights
- Surface: White (#ffffff) – Card backgrounds
- Background: Soft Gray (#f5f7fa) – Page background
- Secondary: Dark Gray (#555555) – Text and support

**Dark Mode**:
- Primary: Bright Blue (#99ccff) – Primary actions
- Surface: Deep Gray (#101419) – Card backgrounds
- Background: Almost Black (#0a0e14) – Page background
- Secondary: Light Gray (#cccccc) – Text and support

### Typography
- Headline Large: 32px for page titles
- Title Medium: 18px for section headers
- Body Medium/Small: 14-16px for content
- Label Small: 12px for captions and metadata

### Spacing & Layout
- Uses Material Design spacing scale (4px, 8px, 12px, 16px, 24px, 32px)
- Grid-based responsive layout with flexbox/CSS Grid
- 12px border-radius for modern rounded corners
- 1px borders with outline-variant tokens for subtle separation

## 📝 Data Model

### MTO Schema

```typescript
interface MTOData {
  drawing_meta: {
    drawing_no: string          // e.g., "ISO-1501-01"
    revision: string            // e.g., "2"
    line_number: string         // e.g., "6"-P-1501-A1A-IH"
    nps: string                 // Nominal Pipe Size
    material_class: string      // ASME/ASTM material class
    service: string             // e.g., "Process", "Utility"
  }
  items: Array<{
    item_no: number
    category: "PIPE" | "FITTING" | "FLANGE" | "VALVE" | "GASKET" | "BOLT" | "SUPPORT"
    description: string         // Full engineering description
    size_nps: string            // Size or size range
    schedule_rating: string     // SCH 40, CL150, etc.
    material_spec: string       // ASTM grade
    end_type: string            // BW, SW, THD, FLGD, NA
    quantity: number
    unit: string                // M, EA, SET
    length_m?: number           // For pipe only
    confidence?: number         // 0-1 extraction confidence
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
```

### Component Categories & Colors
- **PIPE** (Blue #e3f2fd): Straight pipe segments, quantified by total length
- **FITTING** (Purple #f3e5f5): Elbows, tees, reducers, caps, couplings
- **FLANGE** (Orange #fff3e0): WN, SO, BL, SW flanges per ASME B16.5
- **VALVE** (Pink #fce4ec): Gate, globe, check, ball, butterfly valves
- **GASKET** (Green #e8f5e9): Spiral wound, ring type, etc. (1 per flanged joint)
- **BOLT** (Yellow #f0f4c3): Stud bolts with nuts (counted in sets)
- **SUPPORT** (Purple #ede7f6): Shoes, guides, anchors, hangers

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (LTS recommended)
- pnpm 8+ (or npm/yarn)

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Open browser
open http://localhost:3000
```

### Deployment

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## 📱 Usage

### Upload Workflow
1. **Navigate to Home**: The app opens with the upload interface
2. **Upload Drawing**: 
   - Click the upload area or drag-and-drop a PNG, JPG, or PDF file
   - Maximum file size: 20MB
3. **Processing**: AI pipeline analyzes the drawing (simulated 2-second processing)
4. **View Results**:
   - See the original drawing preview
   - Review extracted metadata from title block
   - Browse summary statistics
   - Examine detailed MTO table
5. **Export Data**: Click "Export as CSV" to download for Excel

### Table Interactions
- **Sort**: Click column headers to sort ascending/descending
- **Category Badges**: Color-coded labels show component type
- **Confidence Scores**: Green (>85%), Yellow (70-85%), Red (<70%)
- **Responsive**: On mobile, table scrolls horizontally; core columns always visible

### Theme Toggle
- Click the theme icon (🌙/☀️) in the header to switch light/dark mode
- Selection is saved in localStorage and persists across sessions

### Demo Page
- Visit `/demo` for a pre-populated example with 7 extracted items
- Use this to explore the full results UI without uploading

## 🔌 Backend Integration (Placeholder)

This frontend currently uses **mock data** for demonstration. To connect a real AI pipeline backend:

1. **Create API Route** in `app/api/mto/upload.ts`:
   ```typescript
   export async function POST(req: Request) {
     const formData = await req.formData()
     const file = formData.get('file') as File
     
     // Send to backend AI pipeline
     const response = await fetch('YOUR_BACKEND/api/extract', {
       method: 'POST',
       body: formData,
     })
     return response.json()
   }
   ```

2. **Update Upload Handler** in `app/page.tsx`:
   ```typescript
   const formData = new FormData()
   formData.append('file', file)
   const result = await fetch('/api/mto/upload', { method: 'POST', body: formData })
   const mto = await result.json()
   setMtoData(mto)
   ```

3. **Backend Requirements**:
   - POST `/api/extract` endpoint
   - Accept multipart file upload
   - Return JSON matching the MTOData schema
   - Handle errors gracefully with descriptive messages

## 🎨 Customization

### Theme Customization
Edit `app/globals.css` to modify Material Design 3 tokens:

```css
:root {
  --md-sys-color-primary: #0066cc;              /* Primary action color */
  --md-sys-color-secondary: #555555;            /* Secondary color */
  /* ... other tokens ... */
}

.dark {
  --md-sys-color-primary: #99ccff;              /* Dark mode primary */
  /* ... other dark tokens ... */
}
```

### Component Styling
- Material Web components use inherited CSS custom properties
- Override component-specific tokens in component files
- Example: `--md-filled-button-container-color` for button background

### Typography
- Adjust font sizes in component usage
- Use Material Design typescale classes:
  - `md-typescale-headline-large` → 32px bold
  - `md-typescale-body-medium` → 16px regular
  - `md-typescale-label-small` → 12px uppercase

## 📊 Features Showcase

### 1. Professional MTO Table
- **Sortable columns**: Click any header to sort
- **Color-coded categories**: Visual component identification
- **Confidence indicators**: Green/yellow/red based on extraction accuracy
- **Responsive scrolling**: Horizontal scroll on narrow viewports
- **Full specs**: ASME/ASTM material grades, schedules, end types

### 2. Summary Dashboard
- **6-card layout**: Pipe length, fittings, flanges, valves, gaskets, bolts
- **Color-coded icons**: Material Symbols for visual recognition
- **Large numbers**: Easy scanning for project overview
- **Units display**: M, EA, SET clearly labeled

### 3. Metadata Panel
- **Extracted title block data**: Drawing number, revision, line number
- **Piping specs**: NPS, material class, service type
- **Icon associations**: Each field has a related Material Symbol icon
- **Monospace fonts**: Technical specifications in readable typeface

### 4. Drawing Preview
- **Full-width preview**: Original uploaded drawing alongside metadata
- **Responsive grid**: Stacks vertically on mobile
- **Border styling**: Clean card design with subtle borders
- **Background contrast**: Drawing visibility on any theme

## 🛠️ Technical Details

### Material Web Integration
- **No top-level imports**: All `@material/web` elements registered dynamically in `components/material-web-loader.tsx`
- **React 19 event handling**: Using lowercase props (`onchange`, `oninput`) for web components
- **Hydration-safe**: Server components for static markup, `"use client"` for interactive elements
- **Custom element types**: Defined in `types/material-web.d.ts` for TypeScript support

### Performance Optimizations
- **Next.js Image Optimization**: Roboto font loaded via `next/font`
- **CSS Custom Properties**: Runtime theme switching without reload
- **Responsive CSS Grid**: Efficient layout without media queries
- **Lightweight Bundle**: Material Web core is ~25KB gzipped

### Accessibility
- **Semantic HTML**: `<main>`, `<header>`, `<table>` elements
- **ARIA Labels**: All icon buttons have descriptive labels
- **Color Contrast**: WCAG AAA compliant on both themes
- **Keyboard Navigation**: Full keyboard support for all interactions
- **Screen Reader Support**: Material Symbols icons with text labels

## 📦 Build & Deployment

### Production Build
```bash
pnpm build        # Creates .next directory
pnpm start        # Runs production server
```

### Vercel Deployment
```bash
vercel            # Deploy to Vercel
# or via Git push to connected repository
```

### Docker Support (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN pnpm install && pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

## 🗂️ Project Structure

```
.
├── app/
│   ├── page.tsx                 # Main upload/results flow
│   ├── demo/page.tsx            # Demo with sample data
│   ├── layout.tsx               # Root layout + theme setup
│   ├── globals.css              # Theme tokens & globals
│   └── api/                     # (Future) Backend routes
├── components/
│   ├── header.tsx               # Header + theme toggle
│   ├── upload-section.tsx       # Drag-drop upload
│   ├── results-section.tsx      # Results container
│   ├── mto-table.tsx            # Data table
│   ├── summary-cards.tsx        # Statistics cards
│   ├── metadata-panel.tsx       # Metadata display
│   └── material-web-loader.tsx  # Web components registration
├── types/
│   └── material-web.d.ts        # Material Web JSX typings
├── public/
│   └── test-isometric.png       # Sample drawing
├── package.json
├── tsconfig.json
├── next.config.mjs
└── README.md
```

## 🎓 Domain Knowledge

### Isometric Drawings
- **Axes**: X, Y, Z at 120° angles; vertical lines stay vertical
- **Orientation**: North arrow indicates plant direction
- **Dimensions**: Written on drawing, not measured from it
- **Symbols**: Standardized per ASME B31.3, B16.5, B16.9, B16.11

### Material Take-Off
- **Pipe**: Quantified by **total length** in meters
- **Discrete items**: Quantified by **count** (EA = each)
- **Bolts/Gaskets**: **1 set per flanged joint** (SET unit)
- **Specifications**: Full ASME/ASTM material grades for fabrication
- **Line Number**: Encodes size, service, material class, insulation

### Common Component Standards
- **ASME B36.10M**: Carbon/stainless steel seamless pipe dimensions
- **ASME B16.9**: Butt-weld fittings (elbows, tees, reducers)
- **ASME B16.5**: Pressure ratings for flanges (150, 300, 600 CL)
- **ASME B16.11**: Socket-weld and threaded forged fittings
- **ASME B16.20**: Gaskets (spiral wound, ring type)
- **ASTM A106**: Carbon steel seamless pipe material
- **ASTM A234**: Carbon steel butt-weld fitting material

## 🔮 Future Enhancements

1. **Backend Integration**: Real AI vision pipeline via Google Gemini API
2. **Multi-Sheet PDFs**: Process entire isometric packages
3. **Confidence Visualization**: Bounding boxes on drawing showing detected symbols
4. **Excel Export**: Formatted worksheets with embedded drawing previews
5. **Project Management**: Save/load extraction history, compare revisions
6. **BOM Reconciliation**: Verify extracted data against existing BOM tables
7. **Advanced Filtering**: Filter by component type, material, size
8. **Annotations**: Add notes/flags to specific items during review
9. **Weld Tracking**: Detailed shop vs. field weld analysis
10. **Batch Processing**: Upload multiple isometrics for bulk MTO generation

## 📄 License

MIT – Feel free to use this as a starting point for your own MTO extraction tools.

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- Additional component symbol recognition
- Material specification database
- Domain-specific validation rules
- Performance optimization for large drawings
- Internationalization (i18n) support

## 📞 Support

For questions or issues:
1. Check the `/demo` page for working example
2. Review component JSDoc comments in code
3. Consult Material Design 3 docs at material-web.dev
4. Open an issue with clear reproduction steps

---

**Built with ❤️ for engineering teams who need better, faster MTO extraction.**
