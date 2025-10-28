<template>
  <div v-if="showExport" class="export-results">
    <div class="export-content">
      <h3>{{ $t('export.title') }}</h3>
      <div class="export-options">
        <button class="export-button" @click="exportToPDF">
          📄 {{ $t('export.pdf') }}
        </button>
        <button class="export-button" @click="exportToCSV">
          📊 {{ $t('export.csv') }}
        </button>
        <button class="export-button" @click="copyToClipboard">
          📋 {{ $t('export.copy') }}
        </button>
        <button class="export-button" @click="saveCalculation">
          💾 {{ $t('export.save') }}
        </button>
      </div>
      <button class="close-button" @click="$emit('close')">✕</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'ExportResults',
  props: {
    showExport: {
      type: Boolean,
      default: false
    },
    calculatorData: {
      type: Object,
      required: true
    },
    result: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  setup(props) {
    const exportToPDF = () => {
      // Simple PDF export using browser print
      const printWindow = window.open('', '_blank')
      const content = `
        <html>
          <head>
            <title>Sample Size Calculation Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .section { margin-bottom: 20px; }
              .label { font-weight: bold; }
              .value { margin-left: 10px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Biomedical Sample Size Calculator</h1>
              <h2>${props.calculatorData.title}</h2>
            </div>
            <div class="section">
              <h3>Input Parameters:</h3>
              ${Object.entries(props.calculatorData.inputs || {}).map(([key, input]) => 
                `<div><span class="label">${input.label}:</span><span class="value">${props.calculatorData[key] || 'N/A'}</span></div>`
              ).join('')}
            </div>
            <div class="section">
              <h3>Results:</h3>
              <div><span class="label">Sample Size:</span><span class="value">${props.result.value}</span></div>
              ${props.result.note ? `<div><span class="label">Note:</span><span class="value">${props.result.note}</span></div>` : ''}
            </div>
            <div class="section">
              <p><em>Generated on ${new Date().toLocaleString()}</em></p>
            </div>
          </body>
        </html>
      `
      printWindow.document.write(content)
      printWindow.document.close()
      printWindow.print()
    }
    
    const exportToCSV = () => {
      const csvContent = [
        ['Parameter', 'Value'],
        ['Calculator', props.calculatorData.title],
        ...Object.entries(props.calculatorData.inputs || {}).map(([key, input]) => 
          [input.label, props.calculatorData[key] || 'N/A']
        ),
        ['Sample Size', props.result.value],
        ['Note', props.result.note || ''],
        ['Generated', new Date().toLocaleString()]
      ].map(row => row.join(',')).join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `sample-size-calculation-${Date.now()}.csv`
      a.click()
      URL.revokeObjectURL(url)
    }
    
    const copyToClipboard = async () => {
      const text = `
Sample Size Calculation Report
=============================
Calculator: ${props.calculatorData.title}
Generated: ${new Date().toLocaleString()}

Input Parameters:
${Object.entries(props.calculatorData.inputs || {}).map(([key, input]) => 
  `${input.label}: ${props.calculatorData[key] || 'N/A'}`
).join('\n')}

Results:
Sample Size: ${props.result.value}
${props.result.note ? `Note: ${props.result.note}` : ''}
      `.trim()
      
      try {
        await navigator.clipboard.writeText(text)
        alert('Results copied to clipboard!')
      } catch (err) {
        console.error('Failed to copy: ', err)
      }
    }
    
    const saveCalculation = () => {
      const savedCalculations = JSON.parse(localStorage.getItem('saved-calculations') || '[]')
      const calculation = {
        id: Date.now(),
        calculator: props.calculatorData.title,
        inputs: props.calculatorData.inputs,
        result: props.result,
        timestamp: new Date().toISOString()
      }
      
      savedCalculations.unshift(calculation)
      if (savedCalculations.length > 50) {
        savedCalculations.splice(50) // Keep only last 50
      }
      
      localStorage.setItem('saved-calculations', JSON.stringify(savedCalculations))
      alert('Calculation saved successfully!')
    }
    
    return {
      exportToPDF,
      exportToCSV,
      copyToClipboard,
      saveCalculation
    }
  }
}
</script>

<style scoped>
.export-results {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.export-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  position: relative;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.export-content h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #343A40;
  text-align: center;
}

.export-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.export-button {
  background: #F8F9FA;
  border: 2px solid #E9ECEF;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Inter', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.export-button:hover {
  background: #007BFF;
  color: white;
  border-color: #007BFF;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #6C757D;
  padding: 0.5rem;
}

.close-button:hover {
  color: #343A40;
}

@media (max-width: 768px) {
  .export-options {
    grid-template-columns: 1fr;
  }
  
  .export-content {
    padding: 1.5rem;
  }
}
</style>
