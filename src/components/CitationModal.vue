<template>
  <div class="citation-modal-overlay" @click="closeModal" v-if="isOpen">
    <div class="citation-modal" @click.stop>
      <div class="modal-header">
        <h2>📚 How to Cite This Work</h2>
        <button class="close-button" @click="closeModal">✕</button>
      </div>
      
      <div class="modal-content">
        <p class="citation-intro">
          If you use this statistical sample size calculator in your research, please cite it appropriately. 
          Proper citation helps us track the impact of our work and supports continued development.
        </p>
        
        <div class="citation-examples">
          <div class="citation-format">
            <h4>APA Style</h4>
            <div class="citation-text">
              AlJasem, M., & Meysamie, A. (2024). <em>Statistical Sample Size Calculator</em> [Web application]. 
              Retrieved from https://ssc.aljasem.eu.org
            </div>
            <button class="copy-button" @click="copyCitation('apa', $event)">📋 Copy APA</button>
          </div>
          
          <div class="citation-format">
            <h4>Vancouver Style</h4>
            <div class="citation-text">
              AlJasem M, Meysamie A. Statistical Sample Size Calculator [Internet]. 2024 [cited 2024]. 
              Available from: https://ssc.aljasem.eu.org
            </div>
            <button class="copy-button" @click="copyCitation('vancouver', $event)">📋 Copy Vancouver</button>
          </div>
          
          <div class="citation-format">
            <h4>MLA Style</h4>
            <div class="citation-text">
              AlJasem, Mohammad, and Alipasha Meysamie. <em>Statistical Sample Size Calculator</em>. 
              Web application, 2024, ssc.aljasem.eu.org.
            </div>
            <button class="copy-button" @click="copyCitation('mla', $event)">📋 Copy MLA</button>
          </div>
          
          <div class="citation-format">
            <h4>Chicago Style</h4>
            <div class="citation-text">
              AlJasem, Mohammad, and Alipasha Meysamie. <em>Statistical Sample Size Calculator</em>. 
              Web application. 2024. https://ssc.aljasem.eu.org.
            </div>
            <button class="copy-button" @click="copyCitation('chicago', $event)">📋 Copy Chicago</button>
          </div>
        </div>
        
        <div class="citation-note">
          <h4>📝 Citation Guidelines</h4>
          <ul>
            <li>Include the current date when you accessed the tool</li>
            <li>Specify the version or date of the calculation if relevant to your study</li>
            <li>Mention any specific calculators or methods used</li>
            <li>Consider including a brief description of how the tool was used in your methodology</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CitationModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  methods: {
    closeModal() {
      this.$emit('close')
    },
    async copyCitation(style, event) {
      const citations = {
        apa: 'AlJasem, M., & Meysamie, A. (2024). Statistical Sample Size Calculator [Web application]. Retrieved from https://ssc.aljasem.eu.org',
        vancouver: 'AlJasem M, Meysamie A. Statistical Sample Size Calculator [Internet]. 2024 [cited 2024]. Available from: https://ssc.aljasem.eu.org',
        mla: 'AlJasem, Mohammad, and Alipasha Meysamie. Statistical Sample Size Calculator. Web application, 2024, ssc.aljasem.eu.org.',
        chicago: 'AlJasem, Mohammad, and Alipasha Meysamie. Statistical Sample Size Calculator. Web application. 2024. https://ssc.aljasem.eu.org.'
      }
      
      const citationText = citations[style]
      if (!citationText) return
      
      const button = event.target
      const originalText = button.textContent
      
      try {
        // Try modern clipboard API first
        await navigator.clipboard.writeText(citationText)
        this.showCopySuccess(button, originalText)
      } catch (error) {
        // Fallback for older browsers or when clipboard API fails
        try {
          const textArea = document.createElement('textarea')
          textArea.value = citationText
          textArea.style.position = 'fixed'
          textArea.style.left = '-999999px'
          textArea.style.top = '-999999px'
          document.body.appendChild(textArea)
          textArea.focus()
          textArea.select()
          
          const successful = document.execCommand('copy')
          document.body.removeChild(textArea)
          
          if (successful) {
            this.showCopySuccess(button, originalText)
          } else {
            this.showCopyError(button, originalText)
          }
        } catch (fallbackError) {
          console.error('Copy failed:', fallbackError)
          this.showCopyError(button, originalText)
        }
      }
    },
    showCopySuccess(button, originalText) {
      button.textContent = '✅ Copied!'
      button.style.background = '#28a745'
      button.style.color = 'white'
      
      setTimeout(() => {
        button.textContent = originalText
        button.style.background = ''
        button.style.color = ''
      }, 2000)
    },
    showCopyError(button, originalText) {
      button.textContent = '❌ Failed'
      button.style.background = '#dc3545'
      button.style.color = 'white'
      
      setTimeout(() => {
        button.textContent = originalText
        button.style.background = ''
        button.style.color = ''
      }, 2000)
    }
  }
}
</script>

<style scoped>
.citation-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.citation-modal {
  background: white;
  border-radius: 16px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 20px 30px;
  border-radius: 16px 16px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.close-button {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.modal-content {
  padding: 30px;
}

.citation-intro {
  color: #666;
  margin-bottom: 30px;
  line-height: 1.6;
  text-align: center;
  font-size: 1.1rem;
}

.citation-examples {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.citation-format {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  border: 2px solid #e9ecef;
  transition: all 0.2s ease;
}

.citation-format:hover {
  border-color: #007BFF;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
}

.citation-format h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
}

.citation-text {
  background: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  border-left: 4px solid #007BFF;
  border: 1px solid #e9ecef;
}

.copy-button {
  background: #007BFF;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  width: 100%;
}

.copy-button:hover {
  background: #0056b3;
  transform: translateY(-1px);
}

.citation-note {
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  border-radius: 12px;
  padding: 20px;
  border: 2px solid #007BFF;
}

.citation-note h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
}

.citation-note ul {
  margin: 0;
  padding-left: 20px;
}

.citation-note li {
  margin-bottom: 8px;
  line-height: 1.6;
  color: #666;
}

/* Responsive Design */
@media (max-width: 768px) {
  .citation-modal-overlay {
    padding: 10px;
  }
  
  .citation-modal {
    max-height: 95vh;
  }
  
  .modal-header {
    padding: 15px 20px;
  }
  
  .modal-header h2 {
    font-size: 1.3rem;
  }
  
  .modal-content {
    padding: 20px;
  }
  
  .citation-examples {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .citation-format {
    padding: 15px;
  }
}

/* Dark theme support */
@media (prefers-color-scheme: dark) {
  .citation-modal {
    background: #2d3748;
    color: white;
  }
  
  .citation-format {
    background: #4a5568;
    border-color: #718096;
  }
  
  .citation-format h4 {
    color: white;
  }
  
  .citation-text {
    background: #1a202c;
    color: white;
    border-color: #4a5568;
  }
  
  .citation-note {
    background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
    border-color: #718096;
  }
  
  .citation-note h4 {
    color: white;
  }
  
  .citation-note li {
    color: #e2e8f0;
  }
  
  .citation-intro {
    color: #e2e8f0;
  }
}
</style>
