<template>
  <ion-modal :is-open="showExport" @willDismiss="$emit('close')">
    <ion-header>
      <ion-toolbar>
        <ion-title>Export Results</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="$emit('close')">
            <ion-icon :icon="closeOutline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-list>
        <ion-item button @click="exportToPDF" lines="full">
          <ion-icon :icon="documentTextOutline" slot="start" color="primary"></ion-icon>
          <ion-label>
            <h2>PDF Report</h2>
            <p>Generate printable PDF document</p>
          </ion-label>
        </ion-item>

        <ion-item button @click="exportToCSV" lines="full">
          <ion-icon :icon="documentOutline" slot="start" color="primary"></ion-icon>
          <ion-label>
            <h2>CSV Data</h2>
            <p>Export as CSV file</p>
          </ion-label>
        </ion-item>

        <ion-item button @click="copyToClipboard" lines="full">
          <ion-icon :icon="copyOutline" slot="start" color="primary"></ion-icon>
          <ion-label>
            <h2>Copy Text</h2>
            <p>Copy to clipboard</p>
          </ion-label>
        </ion-item>

        <ion-item button @click="saveCalculation" lines="full">
          <ion-icon :icon="saveOutline" slot="start" color="primary"></ion-icon>
          <ion-label>
            <h2>Save Calculation</h2>
            <p>Save for later access</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  toastController
} from '@ionic/vue';
import {
  closeOutline,
  documentTextOutline,
  documentOutline,
  copyOutline,
  saveOutline
} from 'ionicons/icons';
// @ts-ignore - KaTeX types
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { formulas } from '../data/formulas';

const props = defineProps<{
  showExport: boolean;
  calculatorData: any;
  calculatorKey: string;
  inputValues: Record<string, number>;
  result: any;
}>();

const emit = defineEmits<{
  close: [];
}>();

const formulaData = computed(() => {
  return formulas[props.calculatorKey] || null;
});

const exportToPDF = () => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  
  const formulaHTML = formulaData.value && formulaData.value.formulaLaTeX 
    ? katex.renderToString(formulaData.value.formulaLaTeX, { displayMode: true, throwOnError: false })
    : '';
  
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
          <h1>🧬 Sample Size Calculator</h1>
          <h2>${props.calculatorData.title}</h2>
        </div>
        <div class="section">
          <h3>Input Parameters:</h3>
          ${(props.calculatorData.inputs || []).map((input: any) => 
            `<div><span class="label">${input.label}:</span><span class="value">${props.inputValues[input.name] !== undefined && props.inputValues[input.name] !== null ? props.inputValues[input.name] : 'N/A'}</span></div>`
          ).join('')}
        </div>
        ${formulaData.value && formulaData.value.formulaLaTeX ? `
        <div class="section">
          <h3>Mathematical Formula:</h3>
          <div class="formula-box">
            ${formulaHTML}
          </div>
          <h4 style="margin-top: 20px;">Variables:</h4>
          ${formulaData.value.variables.map((v: any) => `
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
  `;
  
  printWindow.document.write(content);
  printWindow.document.close();
  
  // Wait for CSS and fonts to load before printing
  printWindow.onload = function() {
    // Wait for KaTeX fonts to load
    const checkFonts = setInterval(function() {
      if (printWindow.document.fonts && printWindow.document.fonts.ready) {
        printWindow.document.fonts.ready.then(function() {
          clearInterval(checkFonts);
          setTimeout(function() {
            printWindow.print();
          }, 300);
        });
      } else {
        clearInterval(checkFonts);
        setTimeout(function() {
          printWindow.print();
        }, 1000);
      }
    }, 100);
    
    // Fallback timeout
    setTimeout(function() {
      clearInterval(checkFonts);
      printWindow.print();
    }, 2000);
  };
};

const exportToCSV = async () => {
  const escapeCSV = (value: any) => {
    if (value === null || value === undefined) return '';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvRows = [
    ['Parameter', 'Value'],
    ['Calculator', props.calculatorData.title],
    ...(props.calculatorData.inputs || []).map((input: any) => 
      [input.label, props.inputValues[input.name] !== undefined && props.inputValues[input.name] !== null ? props.inputValues[input.name] : 'N/A']
    ),
    []
  ];

  if (formulaData.value) {
    csvRows.push(['Formula', formulaData.value.formula]);
    if (formulaData.value.formulaDetail) {
      csvRows.push(['Formula Detail', formulaData.value.formulaDetail]);
    }
    csvRows.push([]);
    csvRows.push(['Variables', 'Description']);
    formulaData.value.variables.forEach((v: any) => {
      csvRows.push([v.symbol, `${v.name}: ${v.description}`]);
    });
    csvRows.push([]);
  }

  if (props.result.isMulti) {
    csvRows.push([props.result.label1 || 'Group 1', props.result.value]);
    if (props.result.value2) {
      csvRows.push([props.result.label2 || 'Group 2', props.result.value2]);
    }
  } else {
    csvRows.push([props.result.label || 'Sample Size', props.result.value !== null && props.result.value !== undefined ? props.result.value : 'N/A']);
  }
  if (props.result.note) {
    csvRows.push(['Note', props.result.note]);
  }
  csvRows.push(['Generated', new Date().toLocaleString()]);

  const csvContent = csvRows.map(row => row.map(escapeCSV).join(',')).join('\n');
  
  try {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sample-size-calculation-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    const toast = await toastController.create({
      message: 'CSV file downloaded successfully',
      duration: 2000,
      color: 'success'
    });
    await toast.present();
  } catch (err) {
    console.error('Export failed:', err);
  }
};

const copyToClipboard = async () => {
  let text = `
Sample Size Calculation Report
=============================
Calculator: ${props.calculatorData.title}
Generated: ${new Date().toLocaleString()}

Input Parameters:
${(props.calculatorData.inputs || []).map((input: any) => 
  `${input.label}: ${props.inputValues[input.name] !== undefined && props.inputValues[input.name] !== null ? props.inputValues[input.name] : 'N/A'}`
).join('\n')}

`;

  if (formulaData.value) {
    text += `Mathematical Formula:
${formulaData.value.formula}
${formulaData.value.formulaDetail ? formulaData.value.formulaDetail + '\n' : ''}

Variables:
${formulaData.value.variables.map((v: any) => `  ${v.symbol} - ${v.name}: ${v.description}`).join('\n')}

`;
  }

  text += `Results:
`;
  if (props.result.isMulti) {
    text += `${props.result.label1 || 'Group 1'}: ${props.result.value}
${props.result.value2 ? `${props.result.label2 || 'Group 2'}: ${props.result.value2}\n` : ''}`;
  } else {
    text += `${props.result.label || 'Sample Size'}: ${props.result.value !== null && props.result.value !== undefined ? props.result.value : 'N/A'}
`;
  }
  text += props.result.note ? `Note: ${props.result.note}` : '';

  try {
    await navigator.clipboard.writeText(text.trim());
    const toast = await toastController.create({
      message: 'Results copied to clipboard!',
      duration: 2000,
      color: 'success'
    });
    await toast.present();
  } catch (err) {
    console.error('Failed to copy:', err);
    const toast = await toastController.create({
      message: 'Failed to copy to clipboard',
      duration: 2000,
      color: 'danger'
    });
    await toast.present();
  }
};

const saveCalculation = async () => {
  const savedCalculations = JSON.parse(localStorage.getItem('saved-calculations') || '[]');
  const calculation = {
    id: Date.now(),
    calculatorKey: props.calculatorKey,
    calculator: props.calculatorData.title,
    inputs: props.inputValues,
    result: props.result,
    timestamp: new Date().toISOString()
  };

  savedCalculations.unshift(calculation);
  if (savedCalculations.length > 50) {
    savedCalculations.splice(50);
  }

  localStorage.setItem('saved-calculations', JSON.stringify(savedCalculations));
  
  const toast = await toastController.create({
    message: 'Calculation saved successfully!',
    duration: 2000,
    color: 'success'
  });
  await toast.present();
};
</script>

<style scoped>
ion-item {
  --padding-start: 16px;
  --padding-end: 16px;
}
</style>

