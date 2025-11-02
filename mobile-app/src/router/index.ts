import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue';
import CalculatorListPage from '../views/CalculatorListPage.vue';
import CalculatorPage from '../views/CalculatorPage.vue';
import FeaturePage from '../views/FeaturePage.vue';
import AdvancedFeaturesPage from '../views/tabs/AdvancedFeaturesPage.vue';
import CalculatorsPage from '../views/tabs/CalculatorsPage.vue';
import AboutPage from '../views/tabs/AboutPage.vue';
import EducationPage from '../views/tabs/EducationPage.vue';
import SettingsPage from '../views/tabs/SettingsPage.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/calculators'
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/calculators'
      },
      {
        path: 'advanced',
        name: 'tab1',
        component: AdvancedFeaturesPage
      },
      {
        path: 'about',
        name: 'tab2',
        component: AboutPage
      },
      {
        path: 'calculators',
        name: 'tab3',
        component: CalculatorsPage
      },
      {
        path: 'education',
        name: 'tab4',
        component: EducationPage
      },
      {
        path: 'settings',
        name: 'tab5',
        component: SettingsPage
      }
    ]
  },
  {
    path: '/calculators/:type',
    name: 'CalculatorList',
    component: CalculatorListPage
  },
  {
    path: '/calculator/:key',
    name: 'Calculator',
    component: CalculatorPage
  },
  {
    path: '/feature/:featureId',
    name: 'Feature',
    component: FeaturePage
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
