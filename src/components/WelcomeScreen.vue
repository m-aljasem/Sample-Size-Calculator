<template>
  <div class="welcome-screen">
    <div class="welcome-content">
      <div class="welcome-header">
        <h2>{{ $t('app.welcome.title') }}</h2>
        <p>{{ $t('app.welcome.subtitle') }}</p>
      </div>

      <div class="calculator-categories">
        <div class="category-card">
          <div class="category-icon">📊</div>
          <h3>{{ $t('app.welcome.estimation') }}</h3>
          <p>{{ $t('app.welcome.estimationDesc') }}</p>
          <div class="category-options">
            <button 
              v-for="calc in estimationCalculators" 
              :key="calc.key"
              class="option-button"
              @click="$emit('select-calculator', calc.key)">
              {{ calc.emoji }} {{ calc.title }}
            </button>
          </div>
        </div>

        <div class="category-card">
          <div class="category-icon">🔬</div>
          <h3>{{ $t('app.welcome.hypothesis') }}</h3>
          <p>{{ $t('app.welcome.hypothesisDesc') }}</p>
          <div class="category-options">
            <button 
              v-for="calc in hypothesisCalculators" 
              :key="calc.key"
              class="option-button"
              @click="$emit('select-calculator', calc.key)">
              {{ calc.emoji }} {{ calc.title }}
            </button>
          </div>
        </div>

        <div class="category-card">
          <div class="category-icon">⏱️</div>
          <h3>{{ $t('app.welcome.rates') }}</h3>
          <p>{{ $t('app.welcome.ratesDesc') }}</p>
          <div class="category-options">
            <button 
              v-for="calc in ratesCalculators" 
              :key="calc.key"
              class="option-button"
              @click="$emit('select-calculator', calc.key)">
              {{ calc.emoji }} {{ calc.title }}
            </button>
          </div>
        </div>
      </div>

      <!-- Advanced Features Section -->
      <div class="advanced-features">
        <h3>🚀 Advanced Features</h3>
        <div class="advanced-grid">
          <div class="advanced-card" @click="$emit('open-feature', 'tutorials')">
            <div class="advanced-icon">🎓</div>
            <h4>Educational Tutorials</h4>
            <p>Interactive guides to help you understand statistical concepts and choose the right methods</p>
          </div>
          
          <div class="advanced-card" @click="$emit('open-feature', 'visualization')">
            <div class="advanced-icon">📊</div>
            <h4>Data Visualization & Charts</h4>
            <p>Interactive charts and graphs for power curves, sample size analysis, and confidence intervals</p>
          </div>
          
          <div class="advanced-card" @click="$emit('open-feature', 'power')">
            <div class="advanced-icon">⚡</div>
            <h4>Power Analysis</h4>
            <p>Advanced power analysis tools and visualizations for your statistical studies</p>
          </div>
          
          <div class="advanced-card" @click="$emit('open-feature', 'bayesian')">
            <div class="advanced-icon">🧠</div>
            <h4>Bayesian Analysis</h4>
            <p>Bayesian methods for sample size calculation and power analysis with prior distributions</p>
          </div>
          
          <div class="advanced-card" @click="$emit('open-feature', 'sequential')">
            <div class="advanced-icon">📈</div>
            <h4>Sequential Analysis</h4>
            <p>Advanced methods for adaptive and sequential study designs with interim analyses</p>
          </div>
          
          <div class="advanced-card" @click="$emit('open-feature', 'history')">
            <div class="advanced-icon">📋</div>
            <h4>Calculation History</h4>
            <p>Save and manage your previous calculations for easy reference and comparison</p>
          </div>
          
          <!-- PWA Features temporarily hidden
          <div class="advanced-card" @click="$emit('open-feature', 'pwa')">
            <div class="advanced-icon">📱</div>
            <h4>PWA Features</h4>
            <p>Install the app on your device for offline access and enhanced mobile experience</p>
          </div>
          -->
          
          <div class="advanced-card" @click="$emit('open-feature', 'reporting')">
            <div class="advanced-icon">📄</div>
            <h4>Professional Reporting Templates</h4>
            <p>Generate comprehensive reports and documentation for your research studies</p>
          </div>
          
          <div class="advanced-card" @click="$emit('open-feature', 'pwa')">
            <div class="advanced-icon">📱</div>
            <h4>PWA Features</h4>
            <p>Install the app on your device for offline access and enhanced mobile experience</p>
          </div>
          
          <div class="advanced-card" @click="$emit('open-feature', 'about')">
            <div class="advanced-icon">ℹ️</div>
            <h4>About This Project</h4>
            <p>Learn about our team, motivation, and the objectives behind this statistical tool</p>
          </div>
        </div>
      </div>

      <!-- Citation Box -->
      <div class="citation-box-section">
        <div class="citation-box">
          <div class="citation-icon">📖</div>
          <div class="citation-content">
            <h4>📚 How to Cite This Work</h4>
            <p>Proper citation helps us track the impact of our work and supports continued development.</p>
            <button class="citation-button" @click="showCitationModal = true">
              📋 View Citation Formats
            </button>
          </div>
        </div>
      </div>

      <div class="welcome-footer">
        <p>{{ $t('app.welcome.help') }}</p>
      </div>
    </div>
    
    <!-- Citation Modal -->
    <CitationModal 
      :is-open="showCitationModal" 
      @close="showCitationModal = false" 
    />
  </div>
</template>

<script>
import { estimationCalculators, hypothesisCalculators, ratesCalculators } from '../data/calculators.js'
import CitationModal from './CitationModal.vue'

export default {
  name: 'WelcomeScreen',
  components: {
    CitationModal
  },
  data() {
    return {
      estimationCalculators,
      hypothesisCalculators,
      ratesCalculators,
      showCitationModal: false
    }
  },
  emits: ['select-calculator', 'open-feature']
}
</script>

<style scoped>
.welcome-screen {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.welcome-content {
  max-width: 1200px;
  width: 100%;
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.welcome-header {
  text-align: center;
  margin-bottom: 40px;
}

.welcome-header h2 {
  color: #333;
  font-size: 2.5rem;
  margin: 0 0 16px 0;
  font-weight: 700;
}

.welcome-header p {
  color: #666;
  font-size: 1.2rem;
  margin: 0;
  line-height: 1.6;
}

.calculator-categories {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  margin-bottom: 50px;
}

.category-card {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 30px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.category-card:hover {
  border-color: #007BFF;
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 123, 255, 0.15);
}

.category-icon {
  font-size: 3rem;
  margin-bottom: 20px;
  text-align: center;
}

.category-card h3 {
  color: #333;
  font-size: 1.5rem;
  margin: 0 0 16px 0;
  font-weight: 600;
  text-align: center;
}

.category-card p {
  color: #666;
  margin: 0 0 24px 0;
  line-height: 1.6;
  text-align: center;
}

.category-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-button {
  background: white;
  border: 2px solid #e1e5e9;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  transition: all 0.2s ease;
  text-align: left;
}

.option-button:hover {
  background: #007BFF;
  color: white;
  border-color: #007BFF;
  transform: translateX(4px);
}

.advanced-features {
  margin-top: 50px;
  padding-top: 40px;
  border-top: 2px solid #e1e5e9;
}

.advanced-features h3 {
  color: #333;
  font-size: 1.8rem;
  margin: 0 0 30px 0;
  font-weight: 600;
  text-align: center;
}

.advanced-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.advanced-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  text-align: center;
}

.advanced-card:hover {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-color: #007BFF;
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 123, 255, 0.2);
}

.advanced-icon {
  font-size: 2.5rem;
  margin-bottom: 16px;
}

.advanced-card h4 {
  color: #333;
  font-size: 1.2rem;
  margin: 0 0 12px 0;
  font-weight: 600;
}

.advanced-card p {
  color: #666;
  margin: 0;
  line-height: 1.5;
  font-size: 14px;
}

/* Citation Box Section */
.citation-box-section {
  margin-top: 50px;
  padding-top: 40px;
  border-top: 2px solid #e1e5e9;
}

.citation-box {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  color: white;
}

.citation-box:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
}

.citation-icon {
  font-size: 3rem;
  flex-shrink: 0;
}

.citation-content {
  flex: 1;
}

.citation-content h4 {
  margin: 0 0 0.5rem 0;
  color: white;
  font-size: 1.4rem;
  font-weight: 600;
}

.citation-content p {
  margin: 0 0 1rem 0;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
}

.citation-button {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.2s ease;
  backdrop-filter: blur(5px);
}

.citation-button:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-1px);
}

.welcome-footer {
  text-align: center;
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #e1e5e9;
}

.welcome-footer p {
  color: #666;
  margin: 0;
  font-style: italic;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .welcome-content {
    padding: 20px;
  }
  
  .welcome-header h2 {
    font-size: 2rem;
  }
  
  .calculator-categories {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .advanced-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .category-card,
  .advanced-card {
    padding: 20px;
  }
  
  .citation-box {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }
  
  .citation-icon {
    font-size: 2.5rem;
  }
  
  .citation-content h4 {
    font-size: 1.2rem;
  }
}
</style>
