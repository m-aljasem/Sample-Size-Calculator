<template>
  <div class="data-visualization">
    <ion-card>
      <ion-card-header>
        <ion-card-title>📊 Data Visualization</ion-card-title>
        <ion-card-subtitle>Interactive charts and graphs for your statistical analysis</ion-card-subtitle>
      </ion-card-header>
      <ion-card-content>
        <ion-segment v-model="activeTab" @ionChange="updateCharts">
          <ion-segment-button value="power">
            <ion-label>⚡ Power</ion-label>
          </ion-segment-button>
          <ion-segment-button value="sample">
            <ion-label>📏 Sample</ion-label>
          </ion-segment-button>
          <ion-segment-button value="confidence">
            <ion-label>🎯 Confidence</ion-label>
          </ion-segment-button>
        </ion-segment>

        <div class="chart-container">
          <canvas ref="chartRef" :id="activeTab + 'Chart'" style="max-width: 100%; height: 300px;"></canvas>
        </div>

        <ion-item>
          <ion-label position="stacked">Sample Size Range</ion-label>
          <ion-range 
            v-model="sampleSizeRange" 
            :min="10" 
            :max="1000" 
            :step="10"
            @ionChange="updateCharts"
          >
            <ion-label slot="start">10</ion-label>
            <ion-label slot="end">{{ sampleSizeRange }}</ion-label>
          </ion-range>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Effect Size Range</ion-label>
          <ion-range 
            v-model="effectSizeRange" 
            :min="0.1" 
            :max="2.0" 
            :step="0.1"
            @ionChange="updateCharts"
          >
            <ion-label slot="start">0.1</ion-label>
            <ion-label slot="end">{{ effectSizeRange.toFixed(1) }}</ion-label>
          </ion-range>
        </ion-item>
      </ion-card-content>
    </ion-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonItem,
  IonRange
} from '@ionic/vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const activeTab = ref('power');
const sampleSizeRange = ref(100);
const effectSizeRange = ref(0.5);
const chartRef = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

const generatePowerData = () => {
  const labels: number[] = [];
  const data: number[] = [];
  
  for (let n = 10; n <= sampleSizeRange.value; n += 10) {
    labels.push(n);
    const power = Math.min(0.99, Math.max(0.01, 1 - Math.exp(-n * effectSizeRange.value / 10)));
    data.push(power);
  }
  
  return { labels, data };
};

const generateSampleSizeData = () => {
  const labels: string[] = [];
  const data: number[] = [];
  
  for (let d = 0.1; d <= effectSizeRange.value; d += 0.1) {
    labels.push(d.toFixed(1));
    const n = Math.ceil(16 / (d * d));
    data.push(n);
  }
  
  return { labels, data };
};

const generateConfidenceData = () => {
  const labels: number[] = [];
  const data: number[] = [];
  
  for (let n = 10; n <= sampleSizeRange.value; n += 10) {
    labels.push(n);
    const ciWidth = 1.96 * Math.sqrt(0.25 / n);
    data.push(ciWidth);
  }
  
  return { labels, data };
};

const createChart = () => {
  if (!chartRef.value) return;
  
  const ctx = chartRef.value.getContext('2d');
  if (!ctx) return;
  
  // Destroy existing chart
  if (chartInstance) {
    chartInstance.destroy();
  }
  
  let chartData: { labels: number[] | string[], data: number[] };
  let title = '';
  let yLabel = '';
  
  if (activeTab.value === 'power') {
    chartData = generatePowerData();
    title = 'Power Analysis Curve';
    yLabel = 'Statistical Power';
  } else if (activeTab.value === 'sample') {
    chartData = generateSampleSizeData();
    title = 'Sample Size vs Effect Size';
    yLabel = 'Sample Size';
  } else {
    chartData = generateConfidenceData();
    title = 'Confidence Intervals';
    yLabel = 'CI Width';
  }
  
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartData.labels.map(l => String(l)),
      datasets: [{
        label: yLabel,
        data: chartData.data,
        borderColor: 'rgb(0, 123, 255)',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
};

const updateCharts = () => {
  setTimeout(() => {
    createChart();
  }, 100);
};

onMounted(() => {
  setTimeout(() => {
    createChart();
  }, 300);
});

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});

watch(activeTab, () => {
  updateCharts();
});
</script>

<style scoped>
.chart-container {
  margin: 20px 0;
  height: 300px;
}

.data-visualization {
  padding: 0;
}
</style>

