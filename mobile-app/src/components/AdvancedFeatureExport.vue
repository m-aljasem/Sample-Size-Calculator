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

const props = defineProps<{
  showExport: boolean;
  featureName: string;
  inputs: Record<string, any>;
  results: Record<string, any>;
}>();

const emit = defineEmits<{
  close: [];
}>();

const exportToPDF = () => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  
  const content = `
    <html>
      <head>
        <title>${props.featureName} Report</title>
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
          <h1>${props.featureName}</h1>
        </div>
        <div class="section">
          <h3>Input Parameters:</h3>
          ${Object.entries(props.inputs).map(([key, value]) => 
            `<div><span class="label">${key}:</span><span class="value">${value !== undefined && value !== null ? value : 'N/A'}</span></div>`
          ).join('')}
        </div>
        <div class="section">
          <h3>Results:</h3>
          ${Object.entries(props.results).map(([key, value]) => 
            `<div><span class="label">${key}:</span><span class="value">${value !== undefined && value !== null ? value : 'N/A'}</span></div>`
          ).join('')}
        </div>
        <div class="section">
          <p><em>Generated on ${new Date().toLocaleString()}</em></p>
        </div>
      </body>
    </html>
  `;
  
  printWindow.document.write(content);
  printWindow.document.close();
  printWindow.print();
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
    ['Feature', props.featureName],
    ...Object.entries(props.inputs).map(([key, value]) => 
      [key, value !== undefined && value !== null ? value : 'N/A']
    ),
    [],
    ...Object.entries(props.results).map(([key, value]) => 
      [key, value !== undefined && value !== null ? value : 'N/A']
    ),
    ['Generated', new Date().toLocaleString()]
  ];

  const csvContent = csvRows.map(row => row.map(escapeCSV).join(',')).join('\n');
  
  try {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${props.featureName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.csv`;
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
${props.featureName} Report
${'='.repeat(props.featureName.length + 7)}
Generated: ${new Date().toLocaleString()}

Input Parameters:
${Object.entries(props.inputs).map(([key, value]) => 
  `${key}: ${value !== undefined && value !== null ? value : 'N/A'}`
).join('\n')}

Results:
${Object.entries(props.results).map(([key, value]) => 
  `${key}: ${value !== undefined && value !== null ? value : 'N/A'}`
).join('\n')}
  `.trim();

  try {
    await navigator.clipboard.writeText(text);
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
  const savedCalculations = JSON.parse(localStorage.getItem('saved-advanced-calculations') || '[]');
  const calculation = {
    id: Date.now(),
    featureName: props.featureName,
    inputs: props.inputs,
    results: props.results,
    timestamp: new Date().toISOString()
  };

  savedCalculations.unshift(calculation);
  if (savedCalculations.length > 50) {
    savedCalculations.splice(50);
  }

  localStorage.setItem('saved-advanced-calculations', JSON.stringify(savedCalculations));
  
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
