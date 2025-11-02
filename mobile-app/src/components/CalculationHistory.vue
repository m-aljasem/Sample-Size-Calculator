<template>
  <div class="calculation-history">
    <ion-card>
      <ion-card-header>
        <ion-card-title>📋 Calculation History</ion-card-title>
        <ion-card-subtitle>Save and manage your previous calculations</ion-card-subtitle>
      </ion-card-header>
      <ion-card-content>
        <div v-if="savedCalculations.length === 0" class="empty-state">
          <p>No saved calculations yet. Your calculations will appear here after you save them.</p>
        </div>

        <ion-list v-else>
          <ion-item 
            v-for="(calc, index) in savedCalculations" 
            :key="index"
            lines="full"
            button
            @click="loadCalculation(calc)"
          >
            <ion-label>
              <h2>{{ getCalculatorName(calc.calculatorKey) }}</h2>
              <p>Sample Size: {{ calc.result?.value || 'N/A' }}</p>
              <p class="calc-date">{{ formatDate(calc.timestamp) }}</p>
            </ion-label>
            <ion-button 
              slot="end" 
              fill="clear" 
              color="danger"
              @click.stop="deleteCalculation(index)"
            >
              <ion-icon :icon="trashOutline" slot="icon-only"></ion-icon>
            </ion-button>
          </ion-item>
        </ion-list>

        <ion-button 
          v-if="savedCalculations.length > 0" 
          expand="block" 
          color="danger"
          @click="clearAll"
          class="clear-button"
        >
          Clear All History
        </ion-button>
      </ion-card-content>
    </ion-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  alertController
} from '@ionic/vue';
import { trashOutline } from 'ionicons/icons';
import { estimationCalculators, hypothesisCalculators, ratesCalculators } from '../data/calculators';

const router = useRouter();
const savedCalculations = ref<any[]>([]);

const allCalculators = [
  ...estimationCalculators,
  ...hypothesisCalculators,
  ...ratesCalculators
];

const getCalculatorName = (key: string) => {
  const calc = allCalculators.find(c => c.key === key);
  return calc ? calc.title : key;
};

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

const loadCalculation = (calc: any) => {
  router.push({
    path: `/calculator/${calc.calculatorKey}`,
    query: { load: JSON.stringify(calc.inputs) }
  });
};

const deleteCalculation = async (index: number) => {
  const alert = await alertController.create({
    header: 'Delete Calculation?',
    message: 'This action cannot be undone.',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: 'Delete',
        role: 'destructive',
        handler: () => {
          savedCalculations.value.splice(index, 1);
          localStorage.setItem('calculation-history', JSON.stringify(savedCalculations.value));
        }
      }
    ]
  });
  await alert.present();
};

const clearAll = async () => {
  const alert = await alertController.create({
    header: 'Clear All History?',
    message: 'This will delete all saved calculations.',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: 'Clear All',
        role: 'destructive',
        handler: () => {
          savedCalculations.value = [];
          localStorage.setItem('calculation-history', JSON.stringify([]));
        }
      }
    ]
  });
  await alert.present();
};

onMounted(() => {
  const stored = localStorage.getItem('calculation-history');
  if (stored) {
    try {
      savedCalculations.value = JSON.parse(stored);
    } catch (e) {
      console.error('Error loading calculation history:', e);
    }
  }
});
</script>

<style scoped>
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--ion-color-medium);
}

.calc-date {
  font-size: 0.85rem;
  color: var(--ion-color-medium);
  margin-top: 5px;
}

.clear-button {
  margin-top: 20px;
}
</style>

