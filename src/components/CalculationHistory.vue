<template>
  <div class="calculation-history">
    <div class="history-header">
      <h3>📚 Calculation History</h3>
      <button @click="clearHistory" class="clear-button" v-if="history.length > 0">
        🗑️ Clear All
      </button>
    </div>
    
    <div v-if="history.length === 0" class="empty-state">
      <p>No calculations saved yet. Your recent calculations will appear here.</p>
    </div>
    
    <div v-else class="history-list">
      <div 
        v-for="(item, index) in history" 
        :key="index"
        class="history-item"
        @click="loadCalculation(item)">
        <div class="history-item-header">
          <span class="calculator-name">{{ item.calculatorName }}</span>
          <span class="timestamp">{{ formatDate(item.timestamp) }}</span>
        </div>
        <div class="history-item-result">
          <strong>Result:</strong> {{ item.result }}
        </div>
        <div class="history-item-inputs">
          <span v-for="(value, key) in item.inputs" :key="key" class="input-summary">
            {{ key }}: {{ value }}
          </span>
        </div>
        <button @click.stop="deleteCalculation(index)" class="delete-item">
          ✕
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'CalculationHistory',
  emits: ['load-calculation'],
  setup(props, { emit }) {
    const history = ref([])
    
    const loadHistory = () => {
      const saved = localStorage.getItem('calculationHistory')
      if (saved) {
        history.value = JSON.parse(saved)
      }
    }
    
    const saveHistory = () => {
      localStorage.setItem('calculationHistory', JSON.stringify(history.value))
    }
    
    const addCalculation = (calculatorName, inputs, result) => {
      const newItem = {
        id: Date.now(),
        calculatorName,
        inputs: { ...inputs },
        result,
        timestamp: new Date().toISOString()
      }
      
      history.value.unshift(newItem)
      
      // Keep only last 20 calculations
      if (history.value.length > 20) {
        history.value = history.value.slice(0, 20)
      }
      
      saveHistory()
    }
    
    const loadCalculation = (item) => {
      emit('load-calculation', item)
    }
    
    const deleteCalculation = (index) => {
      history.value.splice(index, 1)
      saveHistory()
    }
    
    const clearHistory = () => {
      history.value = []
      saveHistory()
    }
    
    const formatDate = (timestamp) => {
      return new Date(timestamp).toLocaleDateString()
    }
    
    onMounted(() => {
      loadHistory()
    })
    
    return {
      history,
      addCalculation,
      loadCalculation,
      deleteCalculation,
      clearHistory,
      formatDate
    }
  }
}
</script>

<style scoped>
.calculation-history {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.history-header h3 {
  margin: 0;
  color: #007BFF;
}

.clear-button {
  background: #ff4757;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.empty-state {
  text-align: center;
  color: #666;
  padding: 40px 20px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  border: 2px solid transparent;
}

.history-item:hover {
  background: #e3f2fd;
  border-color: #007BFF;
  transform: translateY(-2px);
}

.history-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.calculator-name {
  font-weight: 600;
  color: #007BFF;
}

.timestamp {
  font-size: 12px;
  color: #666;
}

.history-item-result {
  margin-bottom: 8px;
  font-size: 14px;
}

.history-item-inputs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.input-summary {
  background: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
}

.delete-item {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-item:hover {
  background: #ff3742;
}
</style>
