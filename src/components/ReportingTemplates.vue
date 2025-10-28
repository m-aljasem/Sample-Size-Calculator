<template>
  <div class="reporting-templates">
    <div class="templates-header">
      <h3>📄 Professional Reporting Templates</h3>
      <p>Generate comprehensive reports for your statistical analysis</p>
    </div>
    
    <div class="template-categories">
      <div 
        v-for="category in templateCategories" 
        :key="category.id"
        class="category-card"
        @click="selectCategory(category.id)">
        <div class="category-icon">{{ category.icon }}</div>
        <h4>{{ category.name }}</h4>
        <p>{{ category.description }}</p>
        <div class="template-count">{{ category.templates.length }} templates</div>
      </div>
    </div>
    
    <div v-if="selectedCategory" class="template-content">
      <div class="template-nav">
        <button @click="selectedCategory = null" class="back-button">← Back to Categories</button>
        <h4>{{ getCategoryName(selectedCategory) }}</h4>
      </div>
      
      <div class="template-list">
        <div 
          v-for="template in getCategoryTemplates(selectedCategory)" 
          :key="template.id"
          class="template-item"
          @click="selectTemplate(template)">
          <div class="template-icon">{{ template.icon }}</div>
          <div class="template-info">
            <h5>{{ template.title }}</h5>
            <p>{{ template.description }}</p>
            <div class="template-meta">
              <span class="format">{{ template.format }}</span>
              <span class="pages">{{ template.pages }} pages</span>
            </div>
          </div>
          <div class="template-actions">
            <button @click.stop="previewTemplate(template)" class="preview-button">Preview</button>
            <button @click.stop="generateReport(template)" class="generate-button">Generate</button>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="activeTemplate" class="template-builder">
      <div class="builder-header">
        <button @click="closeBuilder" class="close-button">✕</button>
        <h4>{{ activeTemplate.title }}</h4>
        <div class="builder-actions">
          <button @click="previewReport" class="preview-button">👁️ Preview</button>
          <button @click="downloadReport" class="download-button">📥 Download</button>
          <button @click="emailReport" class="email-button">📧 Email</button>
        </div>
      </div>
      
      <div class="builder-content">
        <div class="report-sections">
          <div 
            v-for="(section, index) in reportSections" 
            :key="index"
            class="report-section"
            :class="{ active: activeSection === index }"
            @click="activeSection = index">
            <div class="section-icon">{{ section.icon }}</div>
            <div class="section-info">
              <h6>{{ section.title }}</h6>
              <p>{{ section.description }}</p>
            </div>
            <div class="section-toggle">
              <input 
                type="checkbox" 
                v-model="section.enabled"
                @change="updateReport">
            </div>
          </div>
        </div>
        
        <div class="report-preview">
          <div class="preview-header">
            <h5>Report Preview</h5>
            <div class="preview-controls">
              <select v-model="previewFormat">
                <option value="pdf">PDF</option>
                <option value="html">HTML</option>
                <option value="docx">Word Document</option>
              </select>
            </div>
          </div>
          
          <div class="preview-content" ref="previewContent">
            <!-- Report content will be generated here -->
            <div class="report-page">
              <div class="report-header">
                <h1>{{ reportData.title }}</h1>
                <div class="report-meta">
                  <p><strong>Generated:</strong> {{ new Date().toLocaleDateString() }}</p>
                  <p><strong>Calculator:</strong> {{ reportData.calculator }}</p>
                  <p><strong>Analysis Type:</strong> {{ reportData.analysisType }}</p>
                </div>
              </div>
              
              <div v-if="reportSections[0].enabled" class="report-section-content">
                <h2>📊 Executive Summary</h2>
                <div class="summary-grid">
                  <div class="summary-item">
                    <h4>Required Sample Size</h4>
                    <div class="summary-value">{{ reportData.sampleSize }}</div>
                  </div>
                  <div class="summary-item">
                    <h4>Statistical Power</h4>
                    <div class="summary-value">{{ reportData.power }}%</div>
                  </div>
                  <div class="summary-item">
                    <h4>Effect Size</h4>
                    <div class="summary-value">{{ reportData.effectSize }}</div>
                  </div>
                  <div class="summary-item">
                    <h4>Alpha Level</h4>
                    <div class="summary-value">{{ reportData.alpha }}</div>
                  </div>
                </div>
              </div>
              
              <div v-if="reportSections[1].enabled" class="report-section-content">
                <h2>🔬 Methodology</h2>
                <div class="methodology-content">
                  <h3>Study Design</h3>
                  <p>{{ reportData.methodology.studyDesign }}</p>
                  
                  <h3>Statistical Method</h3>
                  <p>{{ reportData.methodology.statisticalMethod }}</p>
                  
                  <h3>Assumptions</h3>
                  <ul>
                    <li v-for="assumption in reportData.methodology.assumptions" :key="assumption">
                      {{ assumption }}
                    </li>
                  </ul>
                </div>
              </div>
              
              <div v-if="reportSections[2].enabled" class="report-section-content">
                <h2>📈 Results</h2>
                <div class="results-content">
                  <div class="results-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Parameter</th>
                          <th>Value</th>
                          <th>Interpretation</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="result in reportData.results" :key="result.parameter">
                          <td>{{ result.parameter }}</td>
                          <td>{{ result.value }}</td>
                          <td>{{ result.interpretation }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <div v-if="reportSections[3].enabled" class="report-section-content">
                <h2>📊 Visualizations</h2>
                <div class="visualizations-content">
                  <div class="chart-placeholder">
                    <h4>Power Analysis Chart</h4>
                    <p>Interactive power curve visualization</p>
                  </div>
                  <div class="chart-placeholder">
                    <h4>Sample Size vs Effect Size</h4>
                    <p>Relationship between sample size and effect size</p>
                  </div>
                </div>
              </div>
              
              <div v-if="reportSections[4].enabled" class="report-section-content">
                <h2>⚠️ Limitations & Considerations</h2>
                <div class="limitations-content">
                  <h3>Statistical Limitations</h3>
                  <ul>
                    <li v-for="limitation in reportData.limitations.statistical" :key="limitation">
                      {{ limitation }}
                    </li>
                  </ul>
                  
                  <h3>Practical Considerations</h3>
                  <ul>
                    <li v-for="consideration in reportData.limitations.practical" :key="consideration">
                      {{ consideration }}
                    </li>
                  </ul>
                </div>
              </div>
              
              <div v-if="reportSections[5].enabled" class="report-section-content">
                <h2>📚 References</h2>
                <div class="references-content">
                  <ol>
                    <li v-for="reference in reportData.references" :key="reference">
                      {{ reference }}
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'ReportingTemplates',
  props: {
    activeCalculator: String,
    inputs: Object,
    result: Object
  },
  setup(props) {
    const selectedCategory = ref(null)
    const activeTemplate = ref(null)
    const activeSection = ref(0)
    const previewFormat = ref('pdf')
    
    const templateCategories = ref([
      {
        id: 'academic',
        name: 'Academic Reports',
        icon: '🎓',
        description: 'Formal reports for academic journals and research publications',
        templates: [
          {
            id: 'journal-article',
            title: 'Journal Article Report',
            description: 'Comprehensive report suitable for academic journal submission',
            icon: '📝',
            format: 'PDF',
            pages: 8
          },
          {
            id: 'thesis-chapter',
            title: 'Thesis Chapter',
            description: 'Detailed methodology chapter for thesis or dissertation',
            icon: '📚',
            format: 'PDF',
            pages: 12
          },
          {
            id: 'conference-paper',
            title: 'Conference Paper',
            description: 'Concise report for conference presentations',
            icon: '🎤',
            format: 'PDF',
            pages: 4
          }
        ]
      },
      {
        id: 'clinical',
        name: 'Clinical Reports',
        icon: '🏥',
        description: 'Reports for clinical trials and medical research',
        templates: [
          {
            id: 'protocol-report',
            title: 'Study Protocol',
            description: 'Detailed protocol for clinical trial submission',
            icon: '📋',
            format: 'PDF',
            pages: 15
          },
          {
            id: 'ethics-application',
            title: 'Ethics Application',
            description: 'Statistical justification for ethics committee',
            icon: '⚖️',
            format: 'PDF',
            pages: 6
          },
          {
            id: 'regulatory-submission',
            title: 'Regulatory Submission',
            description: 'Report for regulatory authority submission',
            icon: '🏛️',
            format: 'PDF',
            pages: 10
          }
        ]
      },
      {
        id: 'business',
        name: 'Business Reports',
        icon: '💼',
        description: 'Reports for business and industry applications',
        templates: [
          {
            id: 'market-research',
            title: 'Market Research Report',
            description: 'Statistical analysis for market research studies',
            icon: '📊',
            format: 'PDF',
            pages: 6
          },
          {
            id: 'quality-control',
            title: 'Quality Control Report',
            description: 'Statistical process control and quality assurance',
            icon: '🔍',
            format: 'PDF',
            pages: 8
          },
          {
            id: 'executive-summary',
            title: 'Executive Summary',
            description: 'High-level summary for business stakeholders',
            icon: '👔',
            format: 'PDF',
            pages: 3
          }
        ]
      }
    ])
    
    const reportSections = ref([
      {
        title: 'Executive Summary',
        description: 'High-level overview of the analysis',
        icon: '📊',
        enabled: true
      },
      {
        title: 'Methodology',
        description: 'Detailed description of statistical methods',
        icon: '🔬',
        enabled: true
      },
      {
        title: 'Results',
        description: 'Statistical results and interpretations',
        icon: '📈',
        enabled: true
      },
      {
        title: 'Visualizations',
        description: 'Charts and graphs',
        icon: '📊',
        enabled: true
      },
      {
        title: 'Limitations',
        description: 'Study limitations and considerations',
        icon: '⚠️',
        enabled: true
      },
      {
        title: 'References',
        description: 'Statistical references and citations',
        icon: '📚',
        enabled: true
      }
    ])
    
    const reportData = computed(() => {
      return {
        title: 'Sample Size Calculation Report',
        calculator: props.activeCalculator || 'Sample Size Calculator',
        analysisType: 'Statistical Power Analysis',
        sampleSize: props.result?.value || 'N/A',
        power: '80',
        effectSize: props.inputs?.[props.activeCalculator]?.effectSize || '0.5',
        alpha: props.inputs?.[props.activeCalculator]?.alpha || '0.05',
        methodology: {
          studyDesign: 'This analysis uses standard statistical methods for sample size calculation.',
          statisticalMethod: 'Power analysis based on effect size, alpha level, and desired power.',
          assumptions: [
            'Normal distribution of the outcome variable',
            'Independent observations',
            'Homogeneity of variance',
            'No missing data'
          ]
        },
        results: [
          {
            parameter: 'Required Sample Size',
            value: props.result?.value || 'N/A',
            interpretation: 'Number of participants needed to achieve desired power'
          },
          {
            parameter: 'Statistical Power',
            value: '80%',
            interpretation: 'Probability of detecting a true effect'
          },
          {
            parameter: 'Effect Size',
            value: props.inputs?.[props.activeCalculator]?.effectSize || '0.5',
            interpretation: 'Magnitude of the expected difference'
          }
        ],
        limitations: {
          statistical: [
            'Results assume normal distribution',
            'Power calculations are approximations',
            'Effect size estimates may be uncertain'
          ],
          practical: [
            'Consider feasibility of recruitment',
            'Account for potential dropouts',
            'Budget constraints may limit sample size'
          ]
        },
        references: [
          'Cohen, J. (1988). Statistical Power Analysis for the Behavioral Sciences. Lawrence Erlbaum Associates.',
          'Kraemer, H. C., & Thiemann, S. (1987). How Many Subjects? Statistical Power Analysis in Research. Sage Publications.',
          'Chow, S. C., Shao, J., & Wang, H. (2008). Sample Size Calculations in Clinical Research. CRC Press.'
        ]
      }
    })
    
    const getCategoryName = (categoryId) => {
      const category = templateCategories.value.find(c => c.id === categoryId)
      return category ? category.name : ''
    }
    
    const getCategoryTemplates = (categoryId) => {
      const category = templateCategories.value.find(c => c.id === categoryId)
      return category ? category.templates : []
    }
    
    const selectCategory = (categoryId) => {
      selectedCategory.value = categoryId
    }
    
    const selectTemplate = (template) => {
      activeTemplate.value = template
      activeSection.value = 0
    }
    
    const previewTemplate = (template) => {
      alert(`Previewing ${template.title}`)
    }
    
    const generateReport = (template) => {
      selectTemplate(template)
    }
    
    const closeBuilder = () => {
      activeTemplate.value = null
      activeSection.value = 0
    }
    
    const updateReport = () => {
      // Update report based on enabled sections
      console.log('Updating report with sections:', reportSections.value.filter(s => s.enabled))
    }
    
    const previewReport = () => {
      alert('Generating preview...')
    }
    
    const downloadReport = () => {
      // Generate and download report
      const reportContent = generateReportContent()
      const blob = new Blob([reportContent], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${activeTemplate.value.title}.html`
      a.click()
      URL.revokeObjectURL(url)
    }
    
    const emailReport = () => {
      alert('Email functionality would be implemented here')
    }
    
    const generateReportContent = () => {
      // Generate HTML content for the report
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${reportData.value.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #007BFF; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>${reportData.value.title}</h1>
          <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Calculator:</strong> ${reportData.value.calculator}</p>
          <!-- Report content would be generated here -->
        </body>
        </html>
      `
    }
    
    return {
      selectedCategory,
      activeTemplate,
      activeSection,
      previewFormat,
      templateCategories,
      reportSections,
      reportData,
      getCategoryName,
      getCategoryTemplates,
      selectCategory,
      selectTemplate,
      previewTemplate,
      generateReport,
      closeBuilder,
      updateReport,
      previewReport,
      downloadReport,
      emailReport
    }
  }
}
</script>

<style scoped>
.reporting-templates {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
}

.templates-header h3 {
  color: #007BFF;
  margin: 0 0 8px 0;
  font-size: 24px;
}

.templates-header p {
  color: #666;
  margin: 0 0 30px 0;
}

.template-categories {
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

.template-count {
  background: #007BFF;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
}

.template-content {
  margin-top: 30px;
}

.template-nav {
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

.template-nav h4 {
  color: #333;
  margin: 0;
}

.template-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.template-item {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.template-item:hover {
  background: #e3f2fd;
  transform: translateX(4px);
}

.template-icon {
  font-size: 32px;
  width: 48px;
  text-align: center;
}

.template-info {
  flex: 1;
}

.template-info h5 {
  color: #333;
  margin: 0 0 8px 0;
  font-size: 18px;
}

.template-info p {
  color: #666;
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.template-meta {
  display: flex;
  gap: 16px;
}

.format {
  background: #28a745;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.pages {
  color: #666;
  font-size: 14px;
}

.template-actions {
  display: flex;
  gap: 8px;
}

.preview-button,
.generate-button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.preview-button {
  background: #6c757d;
  color: white;
}

.generate-button {
  background: #007BFF;
  color: white;
}

.preview-button:hover {
  background: #5a6268;
}

.generate-button:hover {
  background: #0056b3;
}

.template-builder {
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

.builder-header {
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

.builder-header h4 {
  margin: 0;
  flex: 1;
}

.builder-actions {
  display: flex;
  gap: 12px;
}

.preview-button,
.download-button,
.email-button {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}

.preview-button:hover,
.download-button:hover,
.email-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.builder-content {
  flex: 1;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  padding: 20px;
  overflow: hidden;
}

.report-sections {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  overflow-y: auto;
}

.report-section {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 8px;
}

.report-section:hover {
  background: white;
}

.report-section.active {
  background: #e3f2fd;
  border: 2px solid #007BFF;
}

.section-icon {
  font-size: 20px;
  width: 32px;
  text-align: center;
}

.section-info {
  flex: 1;
}

.section-info h6 {
  margin: 0 0 4px 0;
  color: #333;
  font-size: 14px;
}

.section-info p {
  margin: 0;
  color: #666;
  font-size: 12px;
}

.section-toggle input {
  width: 18px;
  height: 18px;
}

.report-preview {
  background: white;
  border-radius: 8px;
  border: 1px solid #e1e5e9;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.preview-header {
  background: #f8f9fa;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e1e5e9;
}

.preview-header h5 {
  margin: 0;
  color: #333;
}

.preview-controls select {
  padding: 6px 12px;
  border: 1px solid #e1e5e9;
  border-radius: 4px;
  font-size: 14px;
}

.preview-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.report-page {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 40px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.report-header h1 {
  color: #007BFF;
  margin: 0 0 20px 0;
  font-size: 28px;
}

.report-meta {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 30px;
}

.report-meta p {
  margin: 4px 0;
  color: #666;
}

.report-section-content {
  margin-bottom: 30px;
}

.report-section-content h2 {
  color: #333;
  margin: 0 0 20px 0;
  font-size: 22px;
  border-bottom: 2px solid #007BFF;
  padding-bottom: 8px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.summary-item {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 6px;
  text-align: center;
  border-left: 4px solid #007BFF;
}

.summary-item h4 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 14px;
}

.summary-value {
  font-size: 24px;
  font-weight: bold;
  color: #007BFF;
}

.methodology-content h3,
.limitations-content h3 {
  color: #333;
  margin: 20px 0 12px 0;
  font-size: 18px;
}

.methodology-content p,
.limitations-content p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 16px;
}

.methodology-content ul,
.limitations-content ul {
  color: #666;
  padding-left: 20px;
}

.methodology-content li,
.limitations-content li {
  margin-bottom: 8px;
  line-height: 1.5;
}

.results-table {
  overflow-x: auto;
}

.results-table table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 6px;
  overflow: hidden;
}

.results-table th,
.results-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e1e5e9;
}

.results-table th {
  background: #007BFF;
  color: white;
  font-weight: 600;
}

.results-table tr:hover {
  background: #f8f9fa;
}

.visualizations-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.chart-placeholder {
  background: #f8f9fa;
  border: 2px dashed #007BFF;
  border-radius: 6px;
  padding: 20px;
  text-align: center;
}

.chart-placeholder h4 {
  color: #007BFF;
  margin: 0 0 8px 0;
}

.chart-placeholder p {
  color: #666;
  margin: 0;
  font-size: 14px;
}

.references-content ol {
  color: #666;
  padding-left: 20px;
}

.references-content li {
  margin-bottom: 8px;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .template-categories {
    grid-template-columns: 1fr;
  }
  
  .template-item {
    flex-direction: column;
    text-align: center;
  }
  
  .template-actions {
    justify-content: center;
  }
  
  .builder-content {
    grid-template-columns: 1fr;
  }
  
  .report-sections {
    order: 2;
  }
  
  .summary-grid {
    grid-template-columns: 1fr;
  }
  
  .visualizations-content {
    grid-template-columns: 1fr;
  }
}
</style>
