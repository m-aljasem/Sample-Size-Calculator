<template>
  <div class="educational-tutorials">
    <ion-card>
      <ion-card-header>
        <ion-card-title>🎓 Educational Tutorials</ion-card-title>
        <ion-card-subtitle>Interactive guides to help you understand statistical concepts</ion-card-subtitle>
      </ion-card-header>
      <ion-card-content>
        <ion-list>
          <ion-item 
            v-for="tutorial in tutorials" 
            :key="tutorial.id"
            button
            @click="openTutorial(tutorial)"
            lines="full"
          >
            <ion-icon :icon="bookOutline" slot="start" color="primary"></ion-icon>
            <ion-label>
              <h2>{{ tutorial.title }}</h2>
              <p>{{ tutorial.description }}</p>
              <p class="tutorial-meta">
                <span>⏱️ {{ tutorial.duration }}</span>
                <span class="difficulty" :class="tutorial.difficulty">{{ tutorial.difficulty }}</span>
              </p>
            </ion-label>
          </ion-item>
        </ion-list>

        <ion-modal :is-open="isModalOpen" @willDismiss="closeTutorial">
          <ion-header>
            <ion-toolbar>
              <ion-title>{{ selectedTutorial?.title }}</ion-title>
              <ion-buttons slot="end">
                <ion-button @click="closeTutorial">Close</ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
          <ion-content class="ion-padding">
            <div v-if="selectedTutorial">
              <div v-for="(step, index) in selectedTutorial.steps" :key="index" class="tutorial-step">
                <h3>{{ index + 1 }}. {{ step.title }}</h3>
                <p>{{ step.content }}</p>
                <ion-card v-if="step.example" color="light">
                  <ion-card-content>
                    <strong>Example:</strong> {{ step.example }}
                  </ion-card-content>
                </ion-card>
              </div>
            </div>
          </ion-content>
        </ion-modal>
      </ion-card-content>
    </ion-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent
} from '@ionic/vue';
import { bookOutline } from 'ionicons/icons';

interface TutorialStep {
  title: string;
  content: string;
  example?: string;
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  steps: TutorialStep[];
}

const tutorials = ref<Tutorial[]>([
  {
    id: 'sample-size-basics',
    title: 'Understanding Sample Size',
    description: 'Learn the fundamentals of sample size calculation',
    duration: '10 min',
    difficulty: 'Beginner',
    steps: [
      {
        title: 'What is Sample Size?',
        content: 'Sample size is the number of participants or observations needed in a study to achieve reliable results. It balances statistical power, precision, and practical constraints.',
        example: 'For a survey estimating prevalence, a larger sample size gives more precise estimates.'
      },
      {
        title: 'Why Does It Matter?',
        content: 'Too small a sample may miss important effects (low power), while too large wastes resources. Proper sample size ensures valid, efficient research.',
        example: 'A clinical trial needs enough participants to detect if a treatment works.'
      }
    ]
  },
  {
    id: 'estimation-vs-testing',
    title: 'Estimation vs Hypothesis Testing',
    description: 'Know when to use each approach',
    duration: '15 min',
    difficulty: 'Intermediate',
    steps: [
      {
        title: 'Estimation Studies',
        content: 'Use estimation when you want to determine a population parameter (like mean or proportion) with a specific level of precision.',
        example: 'Estimating the prevalence of diabetes in a city with ±3% margin of error.'
      },
      {
        title: 'Hypothesis Testing',
        content: 'Use hypothesis testing when you want to compare groups or test if an effect exists, requiring both significance level and power.',
        example: 'Testing if a new drug has a different success rate than the standard treatment.'
      }
    ]
  },
  {
    id: 'power-analysis',
    title: 'Statistical Power Explained',
    description: 'Master the concept of power in statistical testing',
    duration: '20 min',
    difficulty: 'Intermediate',
    steps: [
      {
        title: 'What is Power?',
        content: 'Statistical power (1-β) is the probability of detecting a true effect when it exists. Higher power reduces false negatives.',
        example: '80% power means you have an 80% chance of detecting an effect if it truly exists.'
      },
      {
        title: 'Factors Affecting Power',
        content: 'Power increases with: larger sample size, larger effect size, higher alpha, and one-tailed tests. Balance these for optimal study design.',
        example: 'Detecting a large effect requires fewer participants than detecting a small effect.'
      }
    ]
  }
]);

const isModalOpen = ref(false);
const selectedTutorial = ref<Tutorial | null>(null);

const openTutorial = (tutorial: Tutorial) => {
  selectedTutorial.value = tutorial;
  isModalOpen.value = true;
};

const closeTutorial = () => {
  isModalOpen.value = false;
  selectedTutorial.value = null;
};
</script>

<style scoped>
.tutorial-meta {
  display: flex;
  gap: 15px;
  font-size: 0.85rem;
  color: var(--ion-color-medium);
  margin-top: 5px;
}

.difficulty {
  text-transform: capitalize;
  font-weight: 600;
}

.difficulty.Beginner {
  color: var(--ion-color-success);
}

.difficulty.Intermediate {
  color: var(--ion-color-warning);
}

.difficulty.Advanced {
  color: var(--ion-color-danger);
}

.tutorial-step {
  margin-bottom: 30px;
}

.tutorial-step h3 {
  color: var(--ion-color-primary);
  margin-bottom: 10px;
}

.tutorial-step p {
  line-height: 1.6;
  margin-bottom: 15px;
}
</style>

