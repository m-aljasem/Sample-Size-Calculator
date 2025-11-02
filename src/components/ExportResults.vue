<template>
  <div v-if="showExport" class="export-results">
    <div class="export-content">
      <h3>{{ $t('app.export.title') }}</h3>
      <div class="export-options">
        <button class="export-button" @click="exportToPDF">
          📄 {{ $t('app.export.pdf') }}
        </button>
        <button class="export-button" @click="exportToCSV">
          📊 {{ $t('app.export.csv') }}
        </button>
        <button class="export-button" @click="copyToClipboard">
          📋 {{ $t('app.export.copy') }}
        </button>
        <button class="export-button" @click="saveCalculation">
          💾 {{ $t('app.export.save') }}
        </button>
        <button class="export-button" @click="generateGrantText">
          📝 Grant Proposal Text
        </button>
        <button class="export-button" @click="generateMethodologyText">
          📚 Methodology Text
        </button>
      </div>
      <button class="close-button" @click="$emit('close')">✕</button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { formulas } from '../data/formulas.js'

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
    calculatorKey: {
      type: String,
      required: true
    },
    inputValues: {
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
    const formulaData = computed(() => {
      return formulas[props.calculatorKey] || null
    })
    
    const exportToPDF = () => {
      // Simple PDF export using browser print
      const printWindow = window.open('', '_blank')
      if (!printWindow) return
      
      const formulaHTML = formulaData.value && formulaData.value.formulaLaTeX 
        ? katex.renderToString(formulaData.value.formulaLaTeX, { displayMode: true, throwOnError: false })
        : ''
      
      const content = `
        <html>
          <head>
            <title>Sample Size Calculation Report</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" crossorigin="anonymous">
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .section { margin-bottom: 20px; }
              .label { font-weight: bold; }
              .value { margin-left: 10px; }
              .formula-box { padding: 15px; background: #f5f5f5; border-radius: 5px; margin: 10px 0; text-align: center; overflow-x: auto; }
              .formula-box .katex { font-size: 1.2rem; display: block !important; }
              .formula-box .katex-display { margin: 0; }
              .formula-box .katex-html { display: inline-block !important; }
              .formula-box .katex-mathml { display: none !important; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1> Sample Size Calculator</h1>
              <h2>${props.calculatorData.title}</h2>
            </div>
            <div class="section">
              <h3>Input Parameters:</h3>
              ${Object.entries(props.calculatorData.inputs || {}).map(([key, input]) => 
                `<div><span class="label">${input.label}:</span><span class="value">${props.inputValues[key] !== undefined && props.inputValues[key] !== null ? props.inputValues[key] : 'N/A'}</span></div>`
              ).join('')}
            </div>
            ${formulaData.value && formulaData.value.formulaLaTeX ? `
            <div class="section">
              <h3>Mathematical Formula:</h3>
              <div class="formula-box">
                ${formulaHTML}
              </div>
              <h4 style="margin-top: 20px;">Variables:</h4>
              ${formulaData.value.variables.map(v => `
                <div style="margin: 10px 0; padding-left: 20px;">
                  <strong>${v.symbol}</strong> - ${v.name}: ${v.description}
                </div>
              `).join('')}
            </div>
            ` : ''}
            <div class="section">
              <h3>Results:</h3>
              ${props.result.isMulti ? `
                <div><span class="label">${props.result.label1 || 'Group 1'}:</span><span class="value">${props.result.value}</span></div>
                ${props.result.value2 ? `<div><span class="label">${props.result.label2 || 'Group 2'}:</span><span class="value">${props.result.value2}</span></div>` : ''}
              ` : `
                <div><span class="label">${props.result.label || 'Sample Size'}:</span><span class="value">${props.result.value !== null && props.result.value !== undefined ? props.result.value : 'N/A'}</span></div>
              `}
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
      
      // Wait for CSS and fonts to load before printing
      printWindow.onload = function() {
        // Wait for KaTeX fonts to load
        const checkFonts = setInterval(function() {
          if (printWindow.document.fonts && printWindow.document.fonts.ready) {
            printWindow.document.fonts.ready.then(function() {
              clearInterval(checkFonts)
              setTimeout(function() {
                printWindow.print()
              }, 300)
            })
          } else {
            clearInterval(checkFonts)
            setTimeout(function() {
              printWindow.print()
            }, 1000)
          }
        }, 100)
        
        // Fallback timeout
        setTimeout(function() {
          clearInterval(checkFonts)
          printWindow.print()
        }, 2000)
      }
    }
    
    const exportToCSV = () => {
      const csvRows = [
        ['Parameter', 'Value'],
        ['Calculator', props.calculatorData.title],
        ...Object.entries(props.calculatorData.inputs || {}).map(([key, input]) => 
          [input.label, props.inputValues[key] !== undefined && props.inputValues[key] !== null ? props.inputValues[key] : 'N/A']
        ),
        []
      ]
      
      // Add formula section
      if (formulaData.value) {
        csvRows.push(['Formula', formulaData.value.formula])
        if (formulaData.value.formulaDetail) {
          csvRows.push(['Formula Detail', formulaData.value.formulaDetail])
        }
        csvRows.push([])
        csvRows.push(['Variables', 'Description'])
        formulaData.value.variables.forEach(v => {
          csvRows.push([v.symbol, `${v.name}: ${v.description}`])
        })
        csvRows.push([])
      }
      
      // Add results
      if (props.result.isMulti) {
        csvRows.push([props.result.label1 || 'Group 1', props.result.value])
        if (props.result.value2) {
          csvRows.push([props.result.label2 || 'Group 2', props.result.value2])
        }
      } else {
        csvRows.push([props.result.label || 'Sample Size', props.result.value !== null && props.result.value !== undefined ? props.result.value : 'N/A'])
      }
      if (props.result.note) {
        csvRows.push(['Note', props.result.note])
      }
      csvRows.push(['Generated', new Date().toLocaleString()])
      
      const escapeCSV = (value) => {
        if (value === null || value === undefined) return ''
        const str = String(value)
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`
        }
        return str
      }
      
      const csvContent = csvRows.map(row => row.map(escapeCSV).join(',')).join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `sample-size-calculation-${Date.now()}.csv`
      a.click()
      URL.revokeObjectURL(url)
    }
    
    const copyToClipboard = async () => {
      let text = `
Sample Size Calculation Report
=============================
Calculator: ${props.calculatorData.title}
Generated: ${new Date().toLocaleString()}

Input Parameters:
${Object.entries(props.calculatorData.inputs || {}).map(([key, input]) => 
  `${input.label}: ${props.inputValues[key] !== undefined && props.inputValues[key] !== null ? props.inputValues[key] : 'N/A'}`
).join('\n')}

`
      
      // Add formula section
      if (formulaData.value) {
        text += `Mathematical Formula:
${formulaData.value.formula}
${formulaData.value.formulaDetail ? formulaData.value.formulaDetail + '\n' : ''}

Variables:
${formulaData.value.variables.map(v => `  ${v.symbol} - ${v.name}: ${v.description}`).join('\n')}

`
      }
      
      // Add results
      text += `Results:
`
      if (props.result.isMulti) {
        text += `${props.result.label1 || 'Group 1'}: ${props.result.value}
${props.result.value2 ? `${props.result.label2 || 'Group 2'}: ${props.result.value2}\n` : ''}`
      } else {
        text += `${props.result.label || 'Sample Size'}: ${props.result.value !== null && props.result.value !== undefined ? props.result.value : 'N/A'}
`
      }
      text += props.result.note ? `Note: ${props.result.note}` : ''
      
      text = text.trim()
      
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
        calculatorKey: props.calculatorKey,
        calculator: props.calculatorData.title,
        inputs: props.inputValues,
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

    const generateGrantText = () => {
      const sampleSize = props.result.valueAdjusted || props.result.value || props.result.total
      const dropoutText = props.result.dropoutRate 
        ? `, accounting for an expected dropout rate of ${(props.result.dropoutRate * 100).toFixed(0)}%`
        : ''
      
      const testTypeText = props.inputValues.twoTailed === false || props.inputValues.twoTailed === 0
        ? ' one-tailed'
        : ' two-tailed'
      
      const alphaText = props.inputValues.alpha || '0.05'
      const powerText = props.inputValues.beta 
        ? `with ${((1 - props.inputValues.beta) * 100).toFixed(0)}% power`
        : 'with standard statistical power'

      let grantText = `Sample Size Justification

The sample size for this study was calculated using established statistical methods. We determined that a sample size of ${sampleSize} participants${dropoutText} is required to detect the expected effect size${testTypeText} test at α = ${alphaText} ${powerText}.

Calculation Method:
We used the ${props.calculatorData.title} calculator based on the following assumptions:
`

      Object.entries(props.calculatorData.inputs || {}).forEach(([key, input]) => {
        const value = props.inputValues[key]
        if (value !== undefined && value !== null) {
          grantText += `- ${input.label}: ${value}\n`
        }
      })

      grantText += `
This sample size ensures adequate statistical power to detect meaningful effects while maintaining Type I error control at the specified significance level. The calculation accounts for the expected variability in the outcome measures and the magnitude of the effect we aim to detect.

`

      if (props.result.dropoutRate) {
        grantText += `We have adjusted the sample size upward to account for expected attrition, ensuring sufficient power even if some participants drop out during the study.\n\n`
      }

      grantText += `References:
- Cohen, J. (1988). Statistical Power Analysis for the Behavioral Sciences. Lawrence Erlbaum Associates.
- Kraemer, H. C., & Thiemann, S. (1987). How Many Subjects? Statistical Power Analysis in Research. Sage Publications.
`

      const textarea = document.createElement('textarea')
      textarea.value = grantText
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      try {
        document.execCommand('copy')
        alert('Grant proposal text copied to clipboard!')
      } catch (err) {
        navigator.clipboard.writeText(grantText).then(() => {
          alert('Grant proposal text copied to clipboard!')
        })
      }
      document.body.removeChild(textarea)
    }

    const generateMethodologyText = () => {
      const sampleSize = props.result.valueAdjusted || props.result.value || props.result.total
      const alphaText = props.inputValues.alpha || '0.05'
      
      let methodologyText = `Sample Size Determination

The sample size for this study was determined a priori based on statistical power analysis. We conducted sample size calculations to ensure adequate power to detect the hypothesized effect.

Statistical Analysis:
We will conduct a${props.inputValues.twoTailed === false || props.inputValues.twoTailed === 0 ? ' one-tailed' : ' two-tailed'} test with α = ${alphaText}. 

Sample Size Calculation:
Using the ${props.calculatorData.title} method, we calculated that ${sampleSize} participants are required. This calculation was based on the following parameters:
`

      Object.entries(props.calculatorData.inputs || {}).forEach(([key, input]) => {
        const value = props.inputValues[key]
        if (value !== undefined && value !== null) {
          methodologyText += `- ${input.label}: ${value}\n`
        }
      })

      if (props.result.dropoutRate) {
        methodologyText += `\nTo account for anticipated attrition (${(props.result.dropoutRate * 100).toFixed(0)}%), we plan to recruit ${props.result.valueAdjusted} participants to ensure sufficient sample size at study completion.\n\n`
      }

      methodologyText += `The sample size ensures that the study has adequate statistical power to detect the expected effect size while controlling Type I error at the specified significance level.\n`

      const textarea = document.createElement('textarea')
      textarea.value = methodologyText
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      try {
        document.execCommand('copy')
        alert('Methodology text copied to clipboard!')
      } catch (err) {
        navigator.clipboard.writeText(methodologyText).then(() => {
          alert('Methodology text copied to clipboard!')
        })
      }
      document.body.removeChild(textarea)
    }
    
    return {
      formulaData,
      exportToPDF,
      exportToCSV,
      copyToClipboard,
      saveCalculation,
      generateGrantText,
      generateMethodologyText
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
  color: #333;
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
