<template>
  <div class="about-page">
    <ion-card>
      <ion-card-header>
        <ion-card-title>🧬 About This Project</ion-card-title>
        <ion-card-subtitle>Statistical Sample Size Calculator for Research Excellence</ion-card-subtitle>
      </ion-card-header>
      <ion-card-content>
        <ion-item lines="none">
          <ion-label>
            <h2>📊 Project Overview</h2>
            <p>
              This comprehensive statistical sample size calculator is designed to empower researchers, 
              clinicians, and healthcare professionals with the tools they need to conduct robust and 
              reliable studies. Built by medical professionals with expertise in public health, digital 
              health, and AI, and supervised by Prof. Alipasha Meysamie (Full Professor at Tehran 
              University of Medical Sciences).
            </p>
          </ion-label>
        </ion-item>

        <ion-card color="light">
          <ion-card-header>
            <ion-card-title>👥 Our Team</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div class="team-member">
              <div class="member-icon">👨‍⚕️</div>
              <h3>Mohammad AlJasem</h3>
              <p class="member-role">MD, MPH, MSc | Digital Health Specialist</p>
              <p class="member-description">
                Medical doctor and public health specialist from Syria with advanced degrees in 
                public health and digital health. Full-stack developer passionate about AI and 
                digital health innovations.
              </p>
            </div>

            <div class="team-member" style="margin-top: 20px;">
              <div class="member-icon">👨‍🏫</div>
              <h3>Prof. Alipasha Meysamie</h3>
              <p class="member-role">MD, MPH | Full Professor & Project Supervisor</p>
              <p class="member-description">
                Full Professor at Tehran University of Medical Sciences, Department of Community Medicine. 
                Distinguished researcher and author of multiple books on statistical analysis.
              </p>
            </div>
          </ion-card-content>
        </ion-card>

        <ion-card color="primary">
          <ion-card-header>
            <ion-card-title>💡 Our Motivation</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-list>
              <ion-item lines="none">
                <ion-icon :icon="medicalOutline" slot="start" color="light"></ion-icon>
                <ion-label>
                  <h3>Healthcare Research Impact</h3>
                  <p>Empowering researchers with accurate statistical tools for better patient outcomes</p>
                </ion-label>
              </ion-item>
              <ion-item lines="none">
                <ion-icon :icon="globeOutline" slot="start" color="light"></ion-icon>
                <ion-label>
                  <h3>Global Accessibility</h3>
                  <p>Free, accessible tools for researchers worldwide</p>
                </ion-label>
              </ion-item>
              <ion-item lines="none">
                <ion-icon :icon="schoolOutline" slot="start" color="light"></ion-icon>
                <ion-label>
                  <h3>Educational Impact</h3>
                  <p>Helping researchers understand statistical principles</p>
                </ion-label>
              </ion-item>
            </ion-list>
          </ion-card-content>
        </ion-card>

        <ion-card>
          <ion-card-header>
            <ion-card-title>🎯 Project Objectives</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-list>
              <ion-item lines="none">
                <ion-label>
                  <h3>01. Comprehensive Coverage</h3>
                  <p>Sample size calculations for all major statistical methods</p>
                </ion-label>
              </ion-item>
              <ion-item lines="none">
                <ion-label>
                  <h3>02. Accuracy & Validation</h3>
                  <p>Mathematically correct calculations validated against established software</p>
                </ion-label>
              </ion-item>
              <ion-item lines="none">
                <ion-label>
                  <h3>03. User Experience</h3>
                  <p>Intuitive interface for users with varying statistical expertise</p>
                </ion-label>
              </ion-item>
            </ion-list>
          </ion-card-content>
        </ion-card>

        <ion-card color="light">
          <ion-card-content>
            <p class="footer-text">
              <strong>Made with ❤️ for the medical and healthcare research community</strong>
            </p>
            <p class="footer-text">
              Developed by medical professionals, for medical professionals - ensuring accuracy, 
              reliability, and academic excellence in statistical sample size calculations.
            </p>
          </ion-card-content>
        </ion-card>
      </ion-card-content>
    </ion-card>
  </div>
</template>

<script setup lang="ts">
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonList,
  IonIcon
} from '@ionic/vue';
import { medicalOutline, globeOutline, schoolOutline } from 'ionicons/icons';
</script>

<style scoped>
.about-page {
  padding: 0;
}

.team-member {
  text-align: center;
  padding: 10px 0;
}

.member-icon {
  font-size: 3rem;
  margin-bottom: 10px;
}

.team-member h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--ion-color-primary);
  margin: 10px 0 5px 0;
}

.member-role {
  font-weight: 600;
  color: var(--ion-color-medium);
  font-size: 0.9rem;
  margin: 5px 0;
}

.member-description {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--ion-color-dark);
  margin-top: 10px;
}

.footer-text {
  text-align: center;
  line-height: 1.6;
  margin: 10px 0;
}

ion-item h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 5px;
}

ion-item p {
  font-size: 0.9rem;
  color: var(--ion-color-medium);
  line-height: 1.4;
}
</style>

