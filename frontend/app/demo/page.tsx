'use client'

import { Header } from '@/components/header'
import { ResultsSection } from '@/components/results-section'

export default function DemoPage() {
  const mockMTO = {
    drawing_meta: {
      drawing_no: 'ISO-1501-01',
      revision: '2',
      line_number: '6"-P-1501-A1A-IH',
      nps: '6"',
      material_class: 'A1A',
      service: 'Process',
    },
    items: [
      {
        item_no: 1,
        category: 'PIPE',
        description: 'Pipe, Seamless, BE, ASME B36.10',
        size_nps: '6"',
        schedule_rating: 'SCH 40',
        material_spec: 'ASTM A106 Gr.B',
        end_type: 'BW',
        quantity: 1,
        unit: 'M',
        length_m: 12.45,
        confidence: 0.92,
        remarks: '',
      },
      {
        item_no: 2,
        category: 'FITTING',
        description: 'Elbow 90 Deg LR, BW, ASME B16.9',
        size_nps: '6"',
        schedule_rating: 'SCH 40',
        material_spec: 'ASTM A234 WPB',
        end_type: 'BW',
        quantity: 4,
        unit: 'EA',
        confidence: 0.88,
      },
      {
        item_no: 3,
        category: 'FITTING',
        description: 'Tee Equal, BW, ASME B16.9',
        size_nps: '6"',
        schedule_rating: 'SCH 40',
        material_spec: 'ASTM A234 WPB',
        end_type: 'BW',
        quantity: 1,
        unit: 'EA',
        confidence: 0.85,
      },
      {
        item_no: 4,
        category: 'FLANGE',
        description: 'Flange WN, ASME B16.5',
        size_nps: '6"',
        schedule_rating: 'CL150',
        material_spec: 'ASTM A105',
        end_type: 'BW',
        quantity: 2,
        unit: 'EA',
        confidence: 0.91,
      },
      {
        item_no: 5,
        category: 'VALVE',
        description: 'Gate Valve, Flanged, ASME',
        size_nps: '6"',
        schedule_rating: 'CL150',
        material_spec: 'ASTM A351 CF8M',
        end_type: 'FLGD',
        quantity: 1,
        unit: 'EA',
        confidence: 0.89,
      },
      {
        item_no: 6,
        category: 'GASKET',
        description: 'Gasket, Spiral Wound, ASME B16.20',
        size_nps: '6"',
        schedule_rating: 'CL150',
        material_spec: 'SS 316 / Graphite',
        end_type: 'NA',
        quantity: 2,
        unit: 'EA',
        confidence: 0.87,
      },
      {
        item_no: 7,
        category: 'BOLT',
        description: 'Stud Bolt w/ Nut, ASTM A193 B7',
        size_nps: '1"',
        schedule_rating: 'CL150',
        material_spec: 'ASTM A193 B7 / A194 2H',
        end_type: 'NA',
        quantity: 2,
        unit: 'SET',
        confidence: 0.86,
      },
    ],
    summary: {
      total_pipe_length_m: 12.45,
      fittings: 5,
      flanges: 2,
      valves: 1,
      gaskets: 2,
      bolt_sets: 2,
      field_welds: 1,
    },
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header onReset={() => window.location.href = '/'} />

      <main
        style={{
          flex: 1,
          padding: '24px',
          maxWidth: '1400px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <ResultsSection
          uploadedImage="/test-isometric.png"
          mtoData={mockMTO}
          loading={false}
          error={null}
        />
      </main>
    </div>
  )
}
