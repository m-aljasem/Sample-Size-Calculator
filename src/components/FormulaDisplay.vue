<template>
  <div class="formula-display" v-if="formulaData">
    <div class="formula-header">
      <h3>📐 Mathematical Formula</h3>
    </div>
    
    <div class="formula-box">
      <div class="formula-equation">
        <div ref="formulaElement" class="formula-text"></div>
        <div v-if="formulaData.formulaDetail" ref="formulaDetailElement" class="formula-detail"></div>
      </div>
    </div>

    <div class="variables-section">
      <h4 class="variables-title">Variables</h4>
      <div class="variables-list">
        <div 
          v-for="variable in formulaData.variables" 
          :key="variable.symbol"
          class="variable-item"
        >
          <div class="variable-header">
            <span class="variable-symbol">{{ variable.symbol }}</span>
            <span class="variable-name">{{ variable.name }}</span>
          </div>
          <p class="variable-description">{{ variable.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { render } from 'katex'
import 'katex/dist/katex.min.css'

export default {
  name: 'FormulaDisplay',
  props: {
    calculatorKey: {
      type: String,
      required: true
    }
  },
  computed: {
    formulaData() {
      try {
        const { formulas } = require('../data/formulas.js')
        return formulas[this.calculatorKey] || null
      } catch (e) {
        console.error('Error loading formulas:', e)
        return null
      }
    }
  },
  watch: {
    formulaData: {
      handler() {
        this.$nextTick(() => {
          this.renderFormula()
        })
      },
      immediate: true
    }
  },
  mounted() {
    this.renderFormula()
  },
  methods: {
    renderFormula() {
      if (!this.formulaData) return

      // Render main formula
      if (this.$refs.formulaElement && this.formulaData.formulaLaTeX) {
        try {
          render(this.formulaData.formulaLaTeX, this.$refs.formulaElement, {
            throwOnError: false,
            displayMode: true,
            strict: false
          })
        } catch (e) {
          console.error('Error rendering formula:', e)
          this.$refs.formulaElement.textContent = this.formulaData.formula
        }
      }

      // Render formula detail if exists
      if (this.$refs.formulaDetailElement && this.formulaData.formulaDetailLaTeX) {
        try {
          render(this.formulaData.formulaDetailLaTeX, this.$refs.formulaDetailElement, {
            throwOnError: false,
            displayMode: true,
            strict: false
          })
        } catch (e) {
          console.error('Error rendering formula detail:', e)
          if (this.formulaData.formulaDetail) {
            this.$refs.formulaDetailElement.textContent = this.formulaData.formulaDetail
          }
        }
      } else if (this.$refs.formulaDetailElement && this.formulaData.formulaDetail && !this.formulaData.formulaDetailLaTeX) {
        this.$refs.formulaDetailElement.textContent = this.formulaData.formulaDetail
      }
    }
  }
}
</script>

<style scoped>
.formula-display {
  margin-top: 30px;
  padding: 25px;
  background: #f8f9fa;
  border-radius: 12px;
  border-left: 4px solid #007BFF;
}

.formula-header {
  margin-bottom: 20px;
}

.formula-header h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #007BFF;
  margin: 0;
}

.formula-box {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 25px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.formula-equation {
  text-align: center;
}

.formula-text {
  font-size: 1.4rem;
  color: #2c3e50;
  background: transparent;
  padding: 15px;
  display: block;
  margin: 10px 0;
  line-height: 1.8;
  text-align: center;
  overflow-x: auto;
}

.formula-text :deep(.katex) {
  font-size: 1.4rem;
}

.formula-text :deep(.katex-display) {
  margin: 0;
}

.formula-detail {
  margin-top: 15px;
  font-size: 0.95rem;
  color: #6c757d;
  font-style: italic;
  line-height: 1.6;
}

.variables-section {
  margin-top: 25px;
}

.variables-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #495057;
  margin-bottom: 15px;
}

.variables-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.variable-item {
  background: white;
  padding: 15px;
  border-radius: 8px;
  border-left: 3px solid #007BFF;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.variable-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.variable-symbol {
  font-size: 1.3rem;
  font-weight: bold;
  color: #007BFF;
  font-family: 'Courier New', monospace;
  min-width: 40px;
  text-align: center;
  background: #e7f3ff;
  padding: 5px 10px;
  border-radius: 5px;
}

.variable-name {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
}

.variable-description {
  margin: 0;
  font-size: 0.9rem;
  color: #6c757d;
  line-height: 1.6;
  padding-left: 52px;
}

.dark-theme .formula-display {
  background: #2d2d2d;
  border-left-color: #4dabf7;
}

.dark-theme .formula-box,
.dark-theme .variable-item {
  background: #3d3d3d;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.dark-theme .formula-text {
  color: #ffffff;
}

.dark-theme .variables-title {
  color: #b0b0b0;
}

.dark-theme .variable-name {
  color: #ffffff;
}

.dark-theme .variable-description {
  color: #b0b0b0;
}

.dark-theme .variable-symbol {
  background: #1a4d7a;
  color: #4dabf7;
}

@media (max-width: 768px) {
  .formula-display {
    padding: 15px;
    margin-top: 20px;
  }

  .formula-text {
    font-size: 1.1rem;
    overflow-x: auto;
    display: block;
  }

  .variable-description {
    padding-left: 0;
    margin-top: 8px;
  }

  .variable-header {
    flex-wrap: wrap;
  }
}
</style>

