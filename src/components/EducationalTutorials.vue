<template>
  <div class="educational-tutorials">
    <div class="tutorials-header">
      <h3>🎓 Educational Tutorials</h3>
      <p>Interactive guides to help you understand statistical concepts and choose the right methods</p>
    </div>
    
    <div class="tutorial-categories">
      <div 
        v-for="category in tutorialCategories" 
        :key="category.id"
        class="category-card"
        @click="selectCategory(category.id)">
        <div class="category-icon">{{ category.icon }}</div>
        <h4>{{ category.name }}</h4>
        <p>{{ category.description }}</p>
        <div class="tutorial-count">{{ category.tutorials.length }} tutorials</div>
      </div>
    </div>
    
    <div v-if="selectedCategory" class="tutorial-content">
      <div class="tutorial-nav">
        <button @click="selectedCategory = null" class="back-button">← Back to Categories</button>
        <h4>{{ getCategoryName(selectedCategory) }}</h4>
      </div>
      
      <div class="tutorial-list">
        <div 
          v-for="tutorial in getCategoryTutorials(selectedCategory)" 
          :key="tutorial.id"
          class="tutorial-item"
          @click="startTutorial(tutorial)">
          <div class="tutorial-icon">{{ tutorial.icon }}</div>
          <div class="tutorial-info">
            <h5>{{ tutorial.title }}</h5>
            <p>{{ tutorial.description }}</p>
            <div class="tutorial-meta">
              <span class="duration">⏱️ {{ tutorial.duration }}</span>
              <span class="difficulty" :class="tutorial.difficulty">{{ tutorial.difficulty }}</span>
            </div>
          </div>
          <div class="tutorial-actions">
            <button class="start-button">Start Tutorial</button>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="activeTutorial" class="tutorial-player">
      <div class="player-header">
        <button @click="closeTutorial" class="close-button">✕</button>
        <h4>{{ activeTutorial.title }}</h4>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: tutorialProgress + '%' }"></div>
        </div>
      </div>
      
      <div class="tutorial-steps">
        <div 
          v-for="(step, index) in activeTutorial.steps" 
          :key="index"
          class="tutorial-step"
          :class="{ 
            active: currentStep === index,
            completed: currentStep > index 
          }">
          <div class="step-number">{{ index + 1 }}</div>
          <div class="step-content">
            <h5>{{ step.title }}</h5>
            <div class="step-body">
              <p v-if="step.text">{{ step.text }}</p>
              <div v-if="step.interactive" class="interactive-element">
                <component 
                  :is="step.component" 
                  v-bind="step.props"
                  @next="nextStep"
                  @previous="previousStep" />
              </div>
              <div v-if="step.example" class="example-box">
                <h6>Example:</h6>
                <p>{{ step.example }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="tutorial-controls">
        <button 
          @click="previousStep" 
          :disabled="currentStep === 0"
          class="control-button">
          ← Previous
        </button>
        <button 
          @click="nextStep" 
          :disabled="currentStep >= activeTutorial.steps.length - 1"
          class="control-button primary">
          Next →
        </button>
        <button 
          v-if="currentStep === activeTutorial.steps.length - 1"
          @click="completeTutorial"
          class="control-button success">
          Complete Tutorial
        </button>
      </div>
    </div>
    
    <!-- Interactive Components -->
    <div class="interactive-components">
      <!-- Sample Size Quiz -->
      <div v-if="showQuiz" class="quiz-component">
        <h5>Quick Quiz</h5>
        <div class="quiz-question">
          <p>{{ currentQuizQuestion.question }}</p>
          <div class="quiz-options">
            <button 
              v-for="(option, index) in currentQuizQuestion.options" 
              :key="index"
              @click="selectAnswer(index)"
              :class="{ selected: selectedAnswer === index }"
              class="quiz-option">
              {{ option }}
            </button>
          </div>
          <div v-if="quizFeedback" class="quiz-feedback" :class="quizFeedback.correct ? 'correct' : 'incorrect'">
            {{ quizFeedback.text }}
          </div>
        </div>
      </div>
      
      <!-- Interactive Calculator -->
      <div v-if="showCalculator" class="calculator-component">
        <h5>Try It Yourself</h5>
        <div class="calculator-inputs">
          <div class="input-group">
            <label>Alpha (α):</label>
            <input 
              type="number" 
              v-model="quizInputs.alpha"
              step="0.01"
              min="0.01"
              max="0.1">
          </div>
          <div class="input-group">
            <label>Power (1-β):</label>
            <input 
              type="number" 
              v-model="quizInputs.power"
              step="0.01"
              min="0.5"
              max="0.99">
          </div>
          <div class="input-group">
            <label>Effect Size:</label>
            <input 
              type="number" 
              v-model="quizInputs.effectSize"
              step="0.01">
          </div>
        </div>
        <div class="calculator-result">
          <p>Required Sample Size: <strong>{{ calculateSampleSize() }}</strong></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'EducationalTutorials',
  setup() {
    const selectedCategory = ref(null)
    const activeTutorial = ref(null)
    const currentStep = ref(0)
    const tutorialProgress = ref(0)
    
    const showQuiz = ref(false)
    const showCalculator = ref(false)
    const currentQuizQuestion = ref(null)
    const selectedAnswer = ref(null)
    const quizFeedback = ref(null)
    
    const quizInputs = ref({
      alpha: 0.05,
      power: 0.8,
      effectSize: 0.5
    })
    
    const tutorialCategories = ref([
      {
        id: 'basics',
        name: 'Statistical Basics',
        icon: '📚',
        description: 'Fundamental concepts in statistics and research design',
        tutorials: [
          {
            id: 'sample-size-intro',
            title: 'Introduction to Sample Size',
            description: 'Learn why sample size matters in research',
            icon: '📏',
            duration: '10 min',
            difficulty: 'beginner',
            steps: [
              {
                title: 'What is Sample Size?',
                text: 'Sample size is the number of participants or observations needed in your study to detect a meaningful effect with sufficient statistical power.',
                example: 'If you want to test a new drug, you need enough patients to be confident in your results.'
              },
              {
                title: 'Why Does Sample Size Matter?',
                text: 'Too small: You might miss real effects (Type II error). Too large: Wastes resources and may detect trivial effects.',
                interactive: true,
                component: 'quiz-component'
              },
              {
                title: 'Key Factors Affecting Sample Size',
                text: 'Effect size, statistical power, significance level, and variability all influence how many participants you need.',
                example: 'A larger effect size requires fewer participants to detect.'
              }
            ]
          },
          {
            id: 'power-analysis',
            title: 'Understanding Statistical Power',
            description: 'Master the concept of statistical power',
            icon: '⚡',
            duration: '15 min',
            difficulty: 'intermediate',
            steps: [
              {
                title: 'What is Statistical Power?',
                text: 'Statistical power is the probability of correctly rejecting a false null hypothesis.',
                example: '80% power means you have an 80% chance of detecting a real effect if it exists.'
              },
              {
                title: 'The Four Pillars of Power',
                text: 'Effect size, sample size, significance level, and statistical power are interconnected.',
                interactive: true,
                component: 'calculator-component'
              }
            ]
          }
        ]
      },
      {
        id: 'study-design',
        name: 'Study Design',
        icon: '🔬',
        description: 'Choosing the right study design for your research',
        tutorials: [
          {
            id: 'estimation-vs-testing',
            title: 'Estimation vs Hypothesis Testing',
            description: 'Understand when to use each approach',
            icon: '🎯',
            duration: '12 min',
            difficulty: 'intermediate',
            steps: [
              {
                title: 'Estimation Studies',
                text: 'Use estimation when you want to determine the value of a population parameter with a specific precision.',
                example: 'Estimating the prevalence of diabetes in a city with ±3% accuracy.'
              },
              {
                title: 'Hypothesis Testing',
                text: 'Use hypothesis testing when you want to compare groups or test specific claims.',
                example: 'Testing whether a new treatment is better than the current standard.'
              }
            ]
          }
        ]
      },
      {
        id: 'advanced-methods',
        name: 'Advanced Methods',
        icon: '🧠',
        description: 'Bayesian analysis, sequential designs, and other advanced techniques',
        tutorials: [
          {
            id: 'bayesian-intro',
            title: 'Introduction to Bayesian Analysis',
            description: 'Learn the basics of Bayesian statistics',
            icon: '🧠',
            duration: '20 min',
            difficulty: 'advanced',
            steps: [
              {
                title: 'Bayesian vs Frequentist',
                text: 'Bayesian statistics incorporates prior knowledge and provides probability statements about parameters.',
                example: 'Instead of "95% confidence interval," Bayesian gives "95% credible interval."'
              }
            ]
          }
        ]
      }
    ])
    
    const getCategoryName = (categoryId) => {
      const category = tutorialCategories.value.find(c => c.id === categoryId)
      return category ? category.name : ''
    }
    
    const getCategoryTutorials = (categoryId) => {
      const category = tutorialCategories.value.find(c => c.id === categoryId)
      return category ? category.tutorials : []
    }
    
    const selectCategory = (categoryId) => {
      selectedCategory.value = categoryId
    }
    
    const startTutorial = (tutorial) => {
      activeTutorial.value = tutorial
      currentStep.value = 0
      tutorialProgress.value = 0
    }
    
    const nextStep = () => {
      if (currentStep.value < activeTutorial.value.steps.length - 1) {
        currentStep.value++
        updateProgress()
      }
    }
    
    const previousStep = () => {
      if (currentStep.value > 0) {
        currentStep.value--
        updateProgress()
      }
    }
    
    const updateProgress = () => {
      tutorialProgress.value = ((currentStep.value + 1) / activeTutorial.value.steps.length) * 100
    }
    
    const completeTutorial = () => {
      alert('Congratulations! You completed the tutorial!')
      closeTutorial()
    }
    
    const closeTutorial = () => {
      activeTutorial.value = null
      currentStep.value = 0
      tutorialProgress.value = 0
    }
    
    const selectAnswer = (index) => {
      selectedAnswer.value = index
      // Simple quiz logic
      const correct = index === 0 // Assuming first option is correct
      quizFeedback.value = {
        correct,
        text: correct ? 'Correct! Well done!' : 'Not quite. Try again!'
      }
    }
    
    const calculateSampleSize = () => {
      const { alpha, power, effectSize } = quizInputs.value
      if (!alpha || !power || !effectSize) return 'Enter values above'
      
      // Simplified sample size calculation
      const zAlpha = 1.96 // Simplified
      const zBeta = 0.84 // Simplified
      const n = Math.ceil(Math.pow((zAlpha + zBeta) / effectSize, 2))
      return n
    }
    
    onMounted(() => {
      // Initialize quiz questions
      currentQuizQuestion.value = {
        question: 'What happens if your sample size is too small?',
        options: [
          'You might miss real effects (Type II error)',
          'You will definitely find significant results',
          'Your study will be more accurate',
          'You will save money'
        ]
      }
    })
    
    return {
      selectedCategory,
      activeTutorial,
      currentStep,
      tutorialProgress,
      tutorialCategories,
      showQuiz,
      showCalculator,
      currentQuizQuestion,
      selectedAnswer,
      quizFeedback,
      quizInputs,
      getCategoryName,
      getCategoryTutorials,
      selectCategory,
      startTutorial,
      nextStep,
      previousStep,
      completeTutorial,
      closeTutorial,
      selectAnswer,
      calculateSampleSize
    }
  }
}
</script>

<style scoped>
.educational-tutorials {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
}

.tutorials-header h3 {
  color: #007BFF;
  margin: 0 0 8px 0;
  font-size: 24px;
}

.tutorials-header p {
  color: #666;
  margin: 0 0 30px 0;
}

.tutorial-categories {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.category-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.category-card:hover {
  background: #e3f2fd;
  border-color: #007BFF;
  transform: translateY(-2px);
}

.category-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.category-card h4 {
  color: #333;
  margin: 0 0 12px 0;
  font-size: 20px;
}

.category-card p {
  color: #666;
  margin: 0 0 16px 0;
  line-height: 1.6;
}

.tutorial-count {
  background: #007BFF;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
}

.tutorial-content {
  margin-top: 30px;
}

.tutorial-nav {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
}

.back-button {
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.tutorial-nav h4 {
  color: #333;
  margin: 0;
}

.tutorial-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tutorial-item {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tutorial-item:hover {
  background: #e3f2fd;
  transform: translateX(4px);
}

.tutorial-icon {
  font-size: 32px;
  width: 48px;
  text-align: center;
}

.tutorial-info {
  flex: 1;
}

.tutorial-info h5 {
  color: #333;
  margin: 0 0 8px 0;
  font-size: 18px;
}

.tutorial-info p {
  color: #666;
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.tutorial-meta {
  display: flex;
  gap: 16px;
}

.duration {
  color: #666;
  font-size: 14px;
}

.difficulty {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.difficulty.beginner {
  background: #d4edda;
  color: #155724;
}

.difficulty.intermediate {
  background: #fff3cd;
  color: #856404;
}

.difficulty.advanced {
  background: #f8d7da;
  color: #721c24;
}

.start-button {
  background: #007BFF;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}

.tutorial-player {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.player-header {
  background: #007BFF;
  color: white;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.close-button {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.player-header h4 {
  margin: 0;
  flex: 1;
}

.progress-bar {
  width: 200px;
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: white;
  transition: width 0.3s ease;
}

.tutorial-steps {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
}

.tutorial-step {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.tutorial-step.active {
  opacity: 1;
}

.tutorial-step.completed {
  opacity: 0.8;
}

.step-number {
  width: 40px;
  height: 40px;
  background: #007BFF;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-content h5 {
  color: #333;
  margin: 0 0 16px 0;
  font-size: 20px;
}

.step-body p {
  color: #666;
  margin: 0 0 16px 0;
  line-height: 1.6;
  font-size: 16px;
}

.example-box {
  background: #e3f2fd;
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
}

.example-box h6 {
  color: #007BFF;
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
}

.example-box p {
  margin: 0;
  color: #333;
  font-style: italic;
}

.tutorial-controls {
  padding: 20px 30px;
  background: #f8f9fa;
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.control-button {
  background: #6c757d;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.control-button:disabled {
  background: #adb5bd;
  cursor: not-allowed;
}

.control-button.primary {
  background: #007BFF;
}

.control-button.success {
  background: #28a745;
}

.control-button:hover:not(:disabled) {
  opacity: 0.9;
}

.interactive-components {
  margin-top: 30px;
}

.quiz-component,
.calculator-component {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.quiz-component h5,
.calculator-component h5 {
  color: #333;
  margin: 0 0 16px 0;
}

.quiz-question p {
  color: #666;
  margin: 0 0 16px 0;
  font-size: 16px;
}

.quiz-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.quiz-option {
  background: white;
  border: 2px solid #e1e5e9;
  padding: 12px 16px;
  border-radius: 6px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
}

.quiz-option:hover {
  border-color: #007BFF;
  background: #f8f9fa;
}

.quiz-option.selected {
  border-color: #007BFF;
  background: #e3f2fd;
}

.quiz-feedback {
  padding: 12px 16px;
  border-radius: 6px;
  font-weight: 600;
}

.quiz-feedback.correct {
  background: #d4edda;
  color: #155724;
}

.quiz-feedback.incorrect {
  background: #f8d7da;
  color: #721c24;
}

.calculator-inputs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.calculator-inputs .input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.calculator-inputs label {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.calculator-inputs input {
  padding: 8px 12px;
  border: 2px solid #e1e5e9;
  border-radius: 6px;
  font-size: 14px;
}

.calculator-result {
  background: white;
  border-radius: 6px;
  padding: 16px;
  border-left: 4px solid #007BFF;
}

.calculator-result p {
  margin: 0;
  color: #333;
  font-size: 16px;
}

@media (max-width: 768px) {
  .tutorial-categories {
    grid-template-columns: 1fr;
  }
  
  .tutorial-item {
    flex-direction: column;
    text-align: center;
  }
  
  .tutorial-meta {
    justify-content: center;
  }
  
  .tutorial-player {
    position: relative;
  }
  
  .tutorial-controls {
    flex-direction: column;
  }
  
  .calculator-inputs {
    grid-template-columns: 1fr;
  }
}
</style>
